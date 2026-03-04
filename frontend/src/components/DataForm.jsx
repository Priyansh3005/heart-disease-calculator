import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Info } from 'lucide-react';

const formSteps = [
    { id: 1, title: 'Demographics', desc: 'Basic patient information' },
    { id: 2, title: 'Vitals', desc: 'Heart rate and blood pressure' },
    { id: 3, title: 'Lab Results', desc: 'Cholesterol and sugar levels' }
];

export default function DataForm({ setPredictionResult, setIsLoading, isLoading, setError }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        age: '', sex: '', cp: '', trestbps: '', chol: '', fbs: '',
        restecg: '', thalach: '', exang: '', oldpeak: '', slope: '', ca: '', thal: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Convert string inputs to correct types (int/float) based on API spec
        const payload = {
            age: parseInt(formData.age),
            sex: parseInt(formData.sex),
            cp: parseInt(formData.cp),
            trestbps: parseInt(formData.trestbps),
            chol: parseInt(formData.chol),
            fbs: parseInt(formData.fbs),
            restecg: parseInt(formData.restecg),
            thalach: parseInt(formData.thalach),
            exang: parseInt(formData.exang),
            oldpeak: parseFloat(formData.oldpeak),
            slope: parseInt(formData.slope),
            ca: parseInt(formData.ca),
            thal: parseInt(formData.thal)
        };

        try {
            const response = await axios.post('http://localhost:8000/predict', payload);
            setPredictionResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to reach the AI server.");
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel rounded-3xl p-8 premium-shadow relative overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-medical-600 animate-spin mb-4" />
                    <p className="text-lg font-semibold text-slate-700 animate-pulse">AI is analyzing metrics...</p>
                </div>
            )}

            {/* Progress Tracker */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200">
                {formSteps.map((s, idx) => (
                    <div key={s.id} className="flex items-center">
                        <div className={`
              flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300
              ${step === s.id ? 'bg-medical-500 text-white shadow-lg shadow-medical-500/30' :
                                step > s.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}
            `}>
                            {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.id}
                        </div>
                        {idx < formSteps.length - 1 && (
                            <div className={`h-1 w-12 sm:w-24 mx-2 rounded-full transition-all duration-500 ${step > s.id ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">{formSteps[step - 1].title}</h2>
                <p className="text-slate-500 mt-1">{formSteps[step - 1].desc}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >

                            {/* --- STEP 1: DEMOGRAPHICS --- */}
                            {step === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                                        <input type="number" required name="age" value={formData.age} onChange={handleChange} min="1" max="120"
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700 placeholder-slate-400" placeholder="e.g. 45" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Biological Sex</label>
                                        <select required name="sex" value={formData.sex} onChange={handleChange}
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700">
                                            <option value="">Select...</option>
                                            <option value="1">Male</option>
                                            <option value="0">Female</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Chest Pain Type</label>
                                        <select required name="cp" value={formData.cp} onChange={handleChange}
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700">
                                            <option value="">Select type...</option>
                                            <option value="1">Typical Angina (1)</option>
                                            <option value="2">Atypical Angina (2)</option>
                                            <option value="3">Non-anginal Pain (3)</option>
                                            <option value="4">Asymptomatic (4)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 2: VITALS --- */}
                            {step === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Resting Blood Pressure</label>
                                        <div className="relative">
                                            <input type="number" required name="trestbps" value={formData.trestbps} onChange={handleChange} min="50" max="250"
                                                className="w-full glass-input pl-4 pr-12 py-3 rounded-xl shadow-sm outline-none" placeholder="120" />
                                            <span className="absolute right-4 top-3 text-slate-400 text-sm">mmHg</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Max Heart Rate</label>
                                        <div className="relative">
                                            <input type="number" required name="thalach" value={formData.thalach} onChange={handleChange} min="50" max="250"
                                                className="w-full glass-input pl-4 pr-12 py-3 rounded-xl shadow-sm outline-none" placeholder="150" />
                                            <span className="absolute right-4 top-3 text-slate-400 text-sm">bpm</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Exercise Induced Angina</label>
                                        <select required name="exang" value={formData.exang} onChange={handleChange}
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700">
                                            <option value="">Select...</option>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                            Resting ECG <span title="Resting electrocardiographic results" className="cursor-help"><Info className="w-4 h-4 text-slate-400" /></span>
                                        </label>
                                        <select required name="restecg" value={formData.restecg} onChange={handleChange}
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700">
                                            <option value="">Select...</option>
                                            <option value="0">Normal (0)</option>
                                            <option value="1">ST-T wave abnormality (1)</option>
                                            <option value="2">Left ventricular hypertrophy (2)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 3: LABS --- */}
                            {step === 3 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Serum Cholesterol</label>
                                        <div className="relative">
                                            <input type="number" required name="chol" value={formData.chol} onChange={handleChange} min="100" max="600"
                                                className="w-full glass-input pl-4 pr-14 py-3 rounded-xl shadow-sm outline-none" placeholder="200" />
                                            <span className="absolute right-4 top-3 text-slate-400 text-sm">mg/dl</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Fasting Blood Sugar {'>'} 120 mg/dl</label>
                                        <select required name="fbs" value={formData.fbs} onChange={handleChange}
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700">
                                            <option value="">Select...</option>
                                            <option value="1">True (Yes)</option>
                                            <option value="0">False (No)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">ST Depression (Oldpeak)</label>
                                        <input type="number" required step="0.1" name="oldpeak" value={formData.oldpeak} onChange={handleChange} min="0" max="10"
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none" placeholder="e.g. 1.5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Slope of Peak ST</label>
                                        <select required name="slope" value={formData.slope} onChange={handleChange}
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700">
                                            <option value="">Select...</option>
                                            <option value="1">Upsloping (1)</option>
                                            <option value="2">Flat (2)</option>
                                            <option value="3">Downsloping (3)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Major Vessels (0-3)</label>
                                        <input type="number" required name="ca" value={formData.ca} onChange={handleChange} min="0" max="4"
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none" placeholder="e.g. 0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Thalassemia</label>
                                        <select required name="thal" value={formData.thal} onChange={handleChange}
                                            className="w-full glass-input px-4 py-3 rounded-xl shadow-sm outline-none text-slate-700">
                                            <option value="">Select...</option>
                                            <option value="3">Normal (3)</option>
                                            <option value="6">Fixed Defect (6)</option>
                                            <option value="7">Reversable Defect (7)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Form Controls */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                    <button type="button" onClick={prevStep} disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>

                    {step < 3 ? (
                        <button type="button" onClick={nextStep}
                            className="flex items-center gap-2 px-8 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg">
                            Next <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button type="submit" disabled={isLoading}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-medical-600 to-medical-500 hover:from-medical-700 hover:to-medical-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-medical-500/50">
                            Calculate Risk
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
