import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Wallet, Package, Users, Settings, Activity, ClipboardPlus } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.FINANCE, label: 'Finance & Claims', icon: Wallet },
    { id: ViewState.INVENTORY, label: 'Logistics & Pharmacy', icon: Package },
    { id: ViewState.STAFFING, label: 'Staffing & HR', icon: Users },
  ];

  const addOns = [
      { id: ViewState.CLINICAL, label: 'Clinical Assistant', icon: ClipboardPlus },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex-shrink-0 flex flex-col fixed left-0 top-0 border-r border-slate-800 z-10 hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">MediCore <span className="text-teal-400">ERP</span></h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Core Modules</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Installed Add-ons</p>
            {addOns.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
                <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.label}</span>
                </button>
            );
            })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
        </button>
        <div className="px-4 py-2 mt-2">
            <div className="text-xs text-slate-600 bg-slate-950 p-2 rounded border border-slate-800">
                Ver: 2.5-Flash Build
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;