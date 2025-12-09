import React, { useState } from 'react';
import { generateClinicalDocumentation } from '../services/geminiService';
import { ClipboardPlus, FileText, ArrowRight, Loader2, Stethoscope, ShieldCheck } from 'lucide-react';

const Clinical: React.FC = () => {
  const [rawNotes, setRawNotes] = useState('');
  const [docType, setDocType] = useState<'SOAP' | 'DISCHARGE_SUMMARY'>('SOAP');
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!rawNotes.trim()) return;
    setLoading(true);
    setGeneratedDoc(null);
    try {
      const result = await generateClinicalDocumentation(rawNotes, docType);
      setGeneratedDoc(result);
    } catch (error) {
      setGeneratedDoc("An error occurred while communicating with the AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-600" />
            Clinical Assistant <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded border border-teal-200">ADD-ON</span>
          </h2>
          <p className="text-slate-500">AI-powered medical documentation and summarization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ClipboardPlus className="w-4 h-4" /> Raw Clinical Notes
            </h3>
            <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setDocType('SOAP')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  docType === 'SOAP' ? 'bg-teal-500 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                SOAP Note
              </button>
              <button
                onClick={() => setDocType('DISCHARGE_SUMMARY')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  docType === 'DISCHARGE_SUMMARY' ? 'bg-teal-500 text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Discharge Summary
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 flex flex-col">
            <textarea
              className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm leading-relaxed"
              placeholder="e.g., Patient John Doe presented with severe headache (VAS 8/10) for 2 days. BP 140/90. No fever. History of migraines. Prescribed Sumatriptan 50mg..."
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>HIPAA/GDPR Compliance: Ensure PII is redacted.</span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading || !rawNotes}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" /> Generate Structure
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-50 rounded-xl shadow-inner border border-slate-200 flex flex-col h-full overflow-hidden relative">
          <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Generated Documentation
            </h3>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {!generatedDoc ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="w-8 h-8 text-slate-400" />
                </div>
                <p>AI Output will appear here</p>
              </div>
            ) : (
              <div className="prose prose-slate prose-sm max-w-none animate-in fade-in slide-in-from-bottom-4">
                {generatedDoc.split('\n').map((line, i) => (
                    <p key={i} className={`mb-1 ${line.startsWith('#') ? 'font-bold text-slate-900 mt-4 text-base' : ''} ${line.startsWith('-') ? 'ml-4' : ''}`}>
                        {line.replace(/#/g, '')}
                    </p>
                ))}
              </div>
            )}
          </div>
          
          {generatedDoc && (
             <div className="absolute bottom-4 right-4">
                 <button className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                     Copy to EHR Clipboard
                 </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clinical;