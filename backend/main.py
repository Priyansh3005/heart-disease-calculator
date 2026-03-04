from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, conint, confloat
import joblib
import pandas as pd
import numpy as np
import shap
import os

# 1. Initialize FastAPI Application
app = FastAPI(
    title="Disease Risk Calculator API",
    description="API for predicting heart disease risk using XGBoost",
    version="1.0.0"
)

# Enable CORS so our React frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, change to the Vercel frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for our ML components
model = None
scaler = None
explainer = None
feature_names = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

# 2. Define Pydantic Model for Input Validation (The "Bouncer")
class PatientData(BaseModel):
    # These match the 13 columns our XGBoost model was trained on
    age: conint(ge=1, le=120)  # ge=greater than or equal to, le=less than or equal to
    sex: conint(ge=0, le=1)    # 0 = female, 1 = male
    cp: conint(ge=1, le=4)     # chest pain type (1-4)
    trestbps: conint(ge=50, le=250) # resting blood pressure
    chol: conint(ge=100, le=600)    # serum cholesterol
    fbs: conint(ge=0, le=1)    # fasting blood sugar > 120 mg/dl (1 = true; 0 = false)
    restecg: conint(ge=0, le=2) # resting electrocardiographic results (0-2)
    thalach: conint(ge=50, le=250) # maximum heart rate achieved
    exang: conint(ge=0, le=1)  # exercise induced angina (1 = yes; 0 = no)
    oldpeak: confloat(ge=0.0, le=10.0) # ST depression induced by exercise relative to rest
    slope: conint(ge=1, le=3)  # the slope of the peak exercise ST segment (1-3)
    ca: conint(ge=0, le=4)     # number of major vessels (0-3) colored by flourosopy
    thal: conint(ge=1, le=7)   # 3 = normal; 6 = fixed defect; 7 = reversable defect

# Memory Optimization: Lazy Loading
# We will NOT load models globally on startup. We will load them inside the endpoint and delete them after use.
model = None
scaler = None
explainer = None
@app.get("/")
async def root():
    return {"status": "online", "message": "Disease Risk API is running."}

# 4. The Prediction Endpoint (Memory Optimized)
@app.post("/predict")
async def predict_risk(data: PatientData):
    try:
        model_dir = "models"
        
        # Load models ONLY when a request comes in
        model = joblib.load(os.path.join(model_dir, "xgboost_model.pkl"))
        scaler = joblib.load(os.path.join(model_dir, "scaler.pkl"))
        explainer = joblib.load(os.path.join(model_dir, "shap_explainer.pkl"))

        # Convert Pydantic object to Pandas DataFrame
        input_data = pd.DataFrame([data.dict()])
        
        # Step A: Scale the data
        scaled_data = scaler.transform(input_data)
        scaled_df = pd.DataFrame(scaled_data, columns=feature_names)
        
        # Step B: Run the Prediction
        probability_array = model.predict_proba(scaled_df)
        disease_probability = float(probability_array[0][1])
        risk_level = "High Risk" if disease_probability >= 0.50 else "Low Risk"

        # Step C: Get SHAP Explanations
        shap_values = explainer(scaled_df)
        contributions = shap_values.values[0]
        
        feature_impacts = list(zip(feature_names, contributions))
        feature_impacts.sort(key=lambda x: x[1], reverse=True)
        
        top_factors = [
            {"feature": impact[0], "contribution": round(float(impact[1]), 3)} 
            for impact in feature_impacts[:3] if impact[1] > 0
        ]
        
        # VERY IMPORTANT: Free up memory manually
        del model
        del explainer
        del scaler
        import gc
        gc.collect() # Force garbage collection

        # Step D: Return the JSON to React
        return {
            "risk_level": risk_level,
            "probability": round(disease_probability * 100, 2),
            "key_factors": top_factors
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing prediction: {str(e)}")

# Run locally if executed directly (e.g., `python main.py`)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
