import React, { useState } from 'react';
import { FinancialTransaction } from '../types';
import { analyzeFinancialAnomaly } from '../services/geminiService';
import { FileText, Search, AlertCircle, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';

const mockTransactions: FinancialTransaction[] = [
  { id: 'TXN-992', date: '2023-10-25', description: 'Surgical Supplies Bulk', amount: 15400, category: 'Medical Supplies', status: 'cleared', accountID: 'ACC-MED-SUP' },
  { id: 'TXN-993', date: '2023-10-26', description: 'Emergency Generator Fuel', amount: 2200, category: 'Utilities', status: 'cleared', accountID: 'ACC-UTIL' },
  { id: 'TXN-994', date: '2023-10-27', description: 'MRI Maintenance Contract', amount: 45000, category: 'Maintenance', status: 'flagged', accountID: 'ACC-MAINT' },
  { id: 'TXN-995', date: '2023-10-28', description: 'Cafeteria Vendor Payment', amount: 3500, category: 'Ops', status: 'cleared', accountID: 'ACC-OPS' },
];

const Finance: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      // Simulate specifically analyzing the flagged large transaction
      const result = await analyzeFinancialAnomaly(mockTransactions, 'ACC-MAINT', '25%');
      setAnalysisResult(result);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Control</h2>
          <p className="text-slate-500">Ledger monitoring and anomaly detection.</p>
        </div>
        <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-sm disabled:opacity-50"
        >
            {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            Scan for Anomalies
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-semibold text-slate-800">Recent General Ledger Entries</h3>
           </div>
           <table className="w-full text-left text-sm">
             <thead className="bg-slate-50 text-slate-500">
               <tr>
                 <th className="p-4">Date</th>
                 <th className="p-4">Description</th>
                 <th className="p-4">Category</th>
                 <th className="p-4 text-right">Amount</th>
                 <th className="p-4 text-center">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {mockTransactions.map(t => (
                 <tr key={t.id} className={t.status === 'flagged' ? 'bg-rose-50/50' : ''}>
                   <td className="p-4 text-slate-600">{t.date}</td>
                   <td className="p-4 font-medium text-slate-900">{t.description}</td>
                   <td className="p-4 text-slate-500">
                     <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium">{t.category}</span>
                   </td>
                   <td className="p-4 text-right font-mono font-medium">${t.amount.toLocaleString()}</td>
                   <td className="p-4 text-center">
                     {t.status === 'flagged' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                            <AlertCircle className="w-3 h-3 mr-1" /> Flagged
                        </span>
                     ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Cleared
                        </span>
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        <div className="bg-slate-900 text-slate-100 rounded-xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <FileText className="w-32 h-32" />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                AI Audit Log
            </h3>
            
            {!analysisResult ? (
                <div className="text-slate-400 text-sm mt-10">
                    <p>System is monitoring transactions in real-time.</p>
                    <p className="mt-4">Click "Scan for Anomalies" to trigger deep analysis on flagged items.</p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-right duration-700">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4">
                        <span className="text-xs font-bold text-rose-400 uppercase">Alert: Cost Spike Detected</span>
                        <div className="flex items-center gap-2 mt-1">
                            <h4 className="text-2xl font-bold">Maintenance</h4>
                            <span className="flex items-center text-rose-400 text-sm font-bold bg-rose-900/30 px-2 py-0.5 rounded">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                320% vs Aug
                            </span>
                        </div>
                    </div>
                    
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-300">
                            {analysisResult}
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <button className="w-full py-2 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-white transition">
                            View Supporting Documents
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Finance;