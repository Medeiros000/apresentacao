import { useState } from 'react';
import {
  ShieldCheck,
  Users,
  GitMerge,
  Terminal,
  Sparkles,
  ChevronRight,
  Code
} from 'lucide-react';
import EncapsulamentoExample from './EncapsulamentoExample';
import SegregacaoExample from './SegregacaoExample';
import ChainOfResponsibilityExample from './ChainOfResponsibilityExample';
import CommandExample from './CommandExample';

export default function App() {
  const [activeTab, setActiveTab] = useState<'encapsulation' | 'segregation' | 'chain' | 'command'>('encapsulation');

  const tabs = [
    {
      id: 'encapsulation' as const,
      label: '1. Encapsulamento',
      icon: ShieldCheck,
      desc: 'Estado privado (#private) & Métodos seguros'
    },
    {
      id: 'segregation' as const,
      label: '2. Segregação de Interfaces',
      icon: Users,
      desc: 'Interfaces coesas CLT vs PJ (ISP)'
    },
    {
      id: 'chain' as const,
      label: '3. Chain of Responsibility',
      icon: GitMerge,
      desc: 'Pipeline de validação checkout'
    },
    {
      id: 'command' as const,
      label: '4. Command Pattern',
      icon: Terminal,
      desc: 'Automação Smart Home & Undo/Redo'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <header className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={16} /> Programação Orientada a Objetos & Arquitetura
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Design Patterns & Princípios POO
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Demonstração interativa e prática para aprendizado visual em TypeScript/React
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <Code size={16} /> Exemplos Isolados em Módulos
          </div>
        </header>

        {/* Tab Navigation Grid */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-[1.01]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isActive ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <ChevronRight size={16} className={isActive ? 'text-slate-400' : 'text-slate-300'} />
                </div>
                <div>
                  <p className="font-bold text-sm mb-0.5">{tab.label}</p>
                  <p className={`text-[11px] ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Interactive Demo Display */}
        <main className="transition-all duration-300">
          {activeTab === 'encapsulation' && <EncapsulamentoExample />}
          {activeTab === 'segregation' && <SegregacaoExample />}
          {activeTab === 'chain' && <ChainOfResponsibilityExample />}
          {activeTab === 'command' && <CommandExample />}
        </main>
      </div>
    </div>
  );
}