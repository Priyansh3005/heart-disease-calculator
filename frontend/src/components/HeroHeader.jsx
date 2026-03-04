import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function HeroHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 relative"
        >
            <div className="flex justify-center mb-6">
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-medical-400 blur-xl opacity-20 rounded-full"></div>
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-medical-50 relative z-10">
                        <HeartPulse className="w-10 h-10 text-medical-600" strokeWidth={1.5} />
                    </div>
                </motion.div>
            </div>

            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                CardioRisk <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-medical-400">AI</span>
            </h1>

            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Next-generation health assessment powered by XGBoost. Enter your clinical metrics below for an instant, explainable heart disease risk analysis.
            </p>

            <div className="flex items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full border border-slate-200 backdrop-blur-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Private & Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 px-4 py-2 rounded-full border border-slate-200 backdrop-blur-sm">
                    <Activity className="w-4 h-4 text-medical-500" />
                    <span>83.3% Precision Recall</span>
                </div>
            </div>
        </motion.div>
    );
}
