import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, ArrowRight, RefreshCcw, Activity } from 'lucide-react';

export default function ResultsDashboard({ result, onReset }) {
    const isHighRisk = result.risk_level === "High Risk";
    const probability = result.probability;

    // Determine colors based on risk
    const themeColor = isHighRisk ? 'text-risk-high' : 'text-risk-low';
    const bgColor = isHighRisk ? 'bg-red-500' : 'bg-emerald-500';
    const gradientFrom = isHighRisk ? 'from-red-500' : 'from-emerald-500';
    const gradientTo = isHighRisk ? 'to-orange-500' : 'to-teal-500';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="glass-panel rounded-3xl p-8 premium-shadow"
        >
            <div className="text-center mb-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-tr ${gradientFrom} ${gradientTo} shadow-lg shadow-${isHighRisk ? 'red' : 'emerald'}-500/30 text-white`}
                >
                    {isHighRisk ? <ShieldAlert className="w-12 h-12" /> : <ShieldCheck className="w-12 h-12" />}
                </motion.div>

                <h2 className={`text-4xl font-extrabold tracking-tight mb-2 ${themeColor}`}>
                    {result.risk_level}
                </h2>
                <p className="text-slate-500 text-lg">AI Confidence Score: {probability}%</p>
            </div>

            {/* Probability Gauge Wrapper */}
            <div className="mb-12">
                <div className="flex justify-between text-sm font-semibold text-slate-500 mb-2 px-1">
                    <span>Low Risk (0%)</span>
                    <span>High Risk (100%)</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${probability}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                        className={`absolute top-0 left-0 h-full ${bgColor}`}
                    />
                </div>
            </div>

            {/* SHAP Explanations (Key Factors) */}
            <div className="bg-white/50 rounded-2xl p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-medical-500" /> Key Risk Factors
                    </h3>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">SHAP Analysis</span>
                </div>

                <div className="space-y-4">
                    {result.key_factors.map((factor, idx) => (
                        <motion.div
                            key={factor.feature}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 + (idx * 0.1) }}
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-medical-200 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-medical-50 flex items-center justify-center text-medical-600 font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <span className="font-semibold text-slate-700 capitalize">
                                    {factor.feature.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">Impact</span>
                                <span className="font-bold text-red-500">+{factor.contribution}</span>
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </motion.div>
                    ))}
                    {result.key_factors.length === 0 && (
                        <p className="text-slate-500 text-center italic py-4">No significant negative drivers found.</p>
                    )}
                </div>
            </div>

            <div className="mt-10 text-center">
                <button
                    onClick={onReset}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                    <RefreshCcw className="w-5 h-5" /> Start New Assessment
                </button>
            </div>
        </motion.div>
    );
}
