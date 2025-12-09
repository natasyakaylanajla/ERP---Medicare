import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { forecastInventoryDemand } from '../services/geminiService';
import { BrainCircuit, Loader2, AlertTriangle, CheckCircle, TrendingUp, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockInventory: InventoryItem[] = [
  { id: 'INV-001', name: 'Amoxicillin 500mg', category: 'Pharmaceuticals', currentStock: 120, reorderPoint: 100, unit: 'Box', monthlyUsage: [80, 90, 85, 95, 110, 130] },
  { id: 'INV-002', name: 'Surgical Masks (N95)', category: 'Consumables', currentStock: 4500, reorderPoint: 2000, unit: 'Pcs', monthlyUsage: [2000, 2100, 2050, 2200, 4000, 4200] },
  { id: 'INV-003', name: 'IV Saline 500ml', category: 'Consumables', currentStock: 50, reorderPoint: 60, unit: 'Bag', monthlyUsage: [40, 45, 42, 50, 55, 65] },
];

const Inventory: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ quantity: number; reasoning: string; risk: string } | null>(null);

  const handleForecast = async (item: InventoryItem) => {
    setSelectedItem(item);
    setLoading(true);
    setAiResult(null);
    try {
      const result = await forecastInventoryDemand(item);
      setAiResult(result);
    } catch (error) {
      alert("Failed to generate AI forecast. Please check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Smart Inventory Management</h2>
          <p className="text-slate-500">AI-driven demand forecasting and automated procurement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Current Stock Levels</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 font-medium">Item Name</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Reorder Pt.</th>
                  <th className="p-4 font-medium">Trend</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                      {item.name}
                      <span className="block text-xs text-slate-400 font-normal">{item.category}</span>
                    </td>
                    <td className={`p-4 font-semibold ${item.currentStock <= item.reorderPoint ? 'text-red-600' : 'text-slate-700'}`}>
                      {item.currentStock} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                    </td>
                    <td className="p-4 text-slate-600">{item.reorderPoint}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-500">
                         {/* Simple visual sparkline logic */}
                         {item.monthlyUsage[item.monthlyUsage.length -1] > item.monthlyUsage[0] ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                         ) : (
                            <TrendingUp className="w-4 h-4 text-slate-400 rotate-180" />
                         )}
                         <span className="text-xs">Last 6m</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleForecast(item)}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium border border-indigo-200"
                      >
                        <BrainCircuit className="w-3.5 h-3.5 mr-1.5" />
                        AI Forecast
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
           <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-600" />
              Demand Intelligence
            </h3>
          </div>
          
          <div className="p-6 flex-1">
            {!selectedItem ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <Package className="w-12 h-12 mb-3 opacity-50" />
                <p>Select an item to run AI prediction.</p>
              </div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center text-indigo-600">
                <Loader2 className="w-8 h-8 animate-spin mb-3" />
                <p className="text-sm font-medium">Analyzing historical patterns...</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis For</span>
                    <p className="text-lg font-bold text-slate-800">{selectedItem.name}</p>
                </div>

                <div className={`p-3 rounded-lg border flex items-start gap-3 ${getRiskColor(aiResult.risk)}`}>
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase">Risk of Stockout</p>
                    <p className="font-bold">{aiResult.risk}</p>
                  </div>
                </div>

                <div>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommendation</span>
                   <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <p className="text-slate-800">
                        Order <span className="font-bold text-emerald-700 text-xl">{aiResult.quantity}</span> units immediately.
                      </p>
                   </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Reasoning</span>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {aiResult.reasoning}
                  </p>
                </div>

                {/* Mini Chart for Visualization */}
                <div className="h-32 w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedItem.monthlyUsage.map((val, idx) => ({ month: idx, usage: val }))}>
                            <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                        </AreaChart>
                     </ResponsiveContainer>
                </div>
              </div>
            ) : (
                <div className="text-red-500 text-sm">Error generating analysis.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;