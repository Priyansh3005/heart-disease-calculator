import pandas as pd
import urllib.request
import os

url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
columns = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"
]

print("Downloading dataset...")
response = urllib.request.urlopen(url)
lines = response.read().decode('utf-8').strip().split('\n')

data = []
for line in lines:
    row = line.split(',')
    # handle missing values indicated by '?'
    row = [None if val == '?' else float(val) for val in row]
    # The target in UCI dataset is 0 (no disease) or 1-4 (disease). Let's convert to binary 0/1.
    target_val = row[-1]
    row[-1] = 0 if target_val == 0 else 1
    data.append(row)

df = pd.DataFrame(data, columns=columns)
df.dropna(inplace=True) # drop the few rows with missing values for pristine dataset
df.to_csv("data/heart_disease.csv", index=False)
print("Dataset downloaded and saved to data/heart_disease.csv!")
