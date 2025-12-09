import React, { useState } from 'react';
import { StaffMember } from '../types';
import { optimizeStaffSchedule } from '../services/geminiService';
import { Users, Clock, Moon, Sun, Sparkles, Loader2 } from 'lucide-react';

const mockStaff: StaffMember[] = [
  { id: 'ST-01', name: 'Dr. Sarah Lin', role: 'Doctor', department: 'ER', shiftPreference: 'Morning', hoursWorked: 45 },
  { id: 'ST-02', name: 'Dr. James Okon', role: 'Doctor', department: 'ER', shiftPreference: 'Night', hoursWorked: 38 },
  { id: 'ST-03', name: 'Nurse Joy', role: 'Nurse', department: 'ER', shiftPreference: 'Afternoon', hoursWorked: 42 },
  { id: 'ST-04', name: 'Nurse Lee', role: 'Nurse', department: 'ER', shiftPreference: 'Night', hoursWorked: 36 },
  { id: 'ST-05', name: 'Nurse Patel', role: 'Nurse', department: 'ICU', shiftPreference: 'Morning', hoursWorked: 40 },
];

const Staffing: React.FC = () => {
  const [optimizationResult, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await optimizeStaffSchedule(mockStaff);
      setResult(res);
    } catch (e) {
        // Fallback for demo if API fails
        setResult("**Optimized Plan:**\n- Move Dr. Sarah Lin to OFF (Fatigue Risk).\n- Assign Dr. James Okon to Night Shift (Matches Preference).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Workforce & Scheduling</h2>
          <p className="text-slate-500">Staff allocation and fatigue management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800">Current Roster Status</h3>
            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">ER Dept</span>
          </div>
          
          <div className="space-y-4">
            {mockStaff.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${s.role === 'Doctor' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.role} • {s.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${s.hoursWorked > 40 ? 'text-rose-600' : 'text-slate-600'}`}>
                    {s.hoursWorked} hrs
                  </p>
                  <div className="flex items-center gap-1 justify-end text-xs text-slate-400">
                     {s.shiftPreference === 'Night' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                     {s.shiftPreference}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-xl shadow-lg flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              AI Scheduler Assistant
            </h3>
            <p className="text-indigo-100 text-sm mt-2">
              Optimizes shifts based on fatigue levels, patient volume predictions, and staff preferences.
            </p>
          </div>

          <div className="flex-1 bg-white/10 rounded-lg p-4 backdrop-blur-sm overflow-y-auto max-h-96 custom-scrollbar">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-40 text-indigo-100">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p>Calculating optimal coverage...</p>
                </div>
            ) : optimizationResult ? (
                <div className="prose prose-invert prose-sm">
                    {/* Render basic markdown-like content safely */}
                    {optimizationResult.split('\n').map((line, i) => (
                        <p key={i} className={`mb-2 ${line.includes('**') ? 'font-bold text-white' : 'text-indigo-100'}`}>
                            {line.replace(/\*\*/g, '')}
                        </p>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-200/60">
                    <Clock className="w-12 h-12 mb-2" />
                    <p>Ready to optimize schedule</p>
                </div>
            )}
          </div>

          <button 
            onClick={handleOptimize}
            disabled={loading}
            className="mt-6 w-full py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition shadow-lg disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Run Optimization Model'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Staffing;