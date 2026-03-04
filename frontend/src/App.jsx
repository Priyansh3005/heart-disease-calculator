import React, { useState } from 'react';
import HeroHeader from './components/HeroHeader';
import DataForm from './components/DataForm';
import ResultsDashboard from './components/ResultsDashboard';

export default function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = () => {
    setPredictionResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blurs for premium feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-medical-200/40 blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto">
        <HeroHeader />

        <div className="mt-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center shadow-sm">
              <p className="font-medium">Error connecting to AI Server</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!predictionResult ? (
            <DataForm
              setPredictionResult={setPredictionResult}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setError={setError}
            />
          ) : (
            <ResultsDashboard
              result={predictionResult}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Simple elegant footer */}
        <footer className="mt-20 text-center text-sm text-slate-400">
          <p>Powered by XGBoost & FastAPI</p>
          <p className="mt-1 text-xs">For demonstration purposes only. Not medical advice.</p>
        </footer>
      </div>
    </div>
  );
}
