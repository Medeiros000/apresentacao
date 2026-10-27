import { useState } from 'react';
import {
  UserCheck,
  Building2,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { CodeSnippetViewer } from './CodeSnippetViewer';

// ==========================================
// 1. CONTRATOS E INTERFACES SEGREGADAS (ISP)
// ==========================================

export interface IRemuneravel {
  getRemuneracao(): number;
}

export interface IBeneficiavel {
  getVA(): number;
  getVR(): number;
  getPlanoSaude(): string;
  getTotalBeneficios(): number;
}

export interface NotaFiscal {
  numeroNF: string;
  cnpj: string;
  valor: number;
  impostosRetidos: number;
}

export interface IEmissorNotaFiscal {
  gerarNotaFiscal(): NotaFiscal;
}

// ==========================================
// 2. APLICAÇÃO VISUAL DEMONSTRATIVA
// ==========================================
export default function SegregacaoExample() {
  const [selectedRole, setSelectedRole] = useState<'CLT' | 'PJ'>('CLT');
  const [baseSalary, setBaseSalary] = useState(5000);
  const [nfGenerated, setNfGenerated] = useState(false);

  // Modelos conceituais aderentes ao ISP:
  const cltEmployee = {
    nome: 'Antonio José',
    tipo: 'CLT',
    salario: baseSalary,
    getSalarioBase: () => baseSalary,
    getVA: () => baseSalary * 0.08,
    getVR: () => baseSalary * 0.12,
    getPlanoSaude: () => 'Plano SulAmérica Executivo (100% Coberto)',
    getTotalBeneficios: () => baseSalary * 0.08 + baseSalary * 0.12
  };

  const pjContractor = {
    nome: 'Tech Solutions LTDA (Mariana)',
    tipo: 'PJ',
    honorarios: baseSalary,
    getHonorarios: () => baseSalary,
    gerarNotaFiscal: (): NotaFiscal => ({
      numeroNF: `NF-${Math.floor(100000 + Math.random() * 900000)}`,
      cnpj: '12.345.678/0001-90',
      valor: baseSalary,
      impostosRetidos: baseSalary * 0.06
    })
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      <div className="lg:col-span-7 space-y-6">
        {/* Type Selector */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-3">
            Selecione a Modalidade do Contrato
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('CLT');
                setNfGenerated(false);
              }}
              className={`p-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'CLT'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
              }`}
            >
              <UserCheck size={20} /> Contratado CLT
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('PJ');
                setNfGenerated(false);
              }}
              className={`p-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'PJ'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
              }`}
            >
              <Building2 size={20} /> Prestador PJ
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
            <label className="text-xs font-semibold text-slate-600">Valor Base da Remuneração:</label>
            <input
              type="range"
              min="2000"
              max="15000"
              step="500"
              value={baseSalary}
              onChange={(e) => setBaseSalary(Number(e.target.value))}
              className="flex-1 accent-indigo-600 cursor-pointer"
            />
            <span className="font-bold text-indigo-600 text-sm min-w-[90px] text-right">
              R$ {baseSalary.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Dynamic Contract Visualizer */}
        {selectedRole === 'CLT' ? (
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded-full font-semibold">
                  Implementa: IRemuneravel + IBeneficiavel
                </span>
                <h3 className="text-xl font-bold mt-2">{cltEmployee.nome}</h3>
                <p className="text-xs text-indigo-200">Contrato de Trabalho registrado (CLT)</p>
              </div>
              <UserCheck className="text-indigo-400" size={32} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl border border-white/10">
                <span className="text-[11px] text-indigo-200 block">Salário Base</span>
                <span className="text-lg font-bold">R$ {cltEmployee.getSalarioBase().toLocaleString('pt-BR')}</span>
              </div>
              <div className="bg-emerald-500/20 backdrop-blur p-3.5 rounded-xl border border-emerald-500/30">
                <span className="text-[11px] text-emerald-300 block">Total de Benefícios</span>
                <span className="text-lg font-bold text-emerald-300">
                  + R$ {cltEmployee.getTotalBeneficios().toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs">
              <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> Benefícios Ativos (IBeneficiavel):
              </p>
              <ul className="space-y-1 text-slate-400 pl-5 list-disc">
                <li>Vale Alimentação (VA): R$ {cltEmployee.getVA().toFixed(2)}</li>
                <li>Vale Refeição (VR): R$ {cltEmployee.getVR().toFixed(2)}</li>
                <li>{cltEmployee.getPlanoSaude()}</li>
              </ul>
            </div>

            <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-800/50 text-[11px] text-indigo-300">
              💡 <strong>Segregação Limpa:</strong> O CLT possui apenas métodos de salário e benefícios. Não é forçado a
              implementar métodos de Emissão de Nota Fiscal.
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs bg-blue-500/30 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-full font-semibold">
                  Implementa: IRemuneravel + IEmissorNotaFiscal
                </span>
                <h3 className="text-xl font-bold mt-2">{pjContractor.nome}</h3>
                <p className="text-xs text-blue-200">Contrato de Prestação de Serviços (PJ)</p>
              </div>
              <Building2 className="text-blue-400" size={32} />
            </div>

            <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl border border-white/10">
              <span className="text-[11px] text-blue-200 block">Honorários Mensais (IRemuneravel)</span>
              <span className="text-xl font-bold">R$ {pjContractor.getHonorarios().toLocaleString('pt-BR')}</span>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-slate-300 text-xs flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-400" /> Faturamento (IEmissorNotaFiscal)
                </p>
                <button
                  type="button"
                  onClick={() => setNfGenerated(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  Gerar Nota Fiscal
                </button>
              </div>

              {nfGenerated ? (
                <div className="bg-slate-900 p-3 rounded-lg border border-blue-500/30 text-xs font-mono text-slate-300 space-y-1">
                  <p className="text-emerald-400 font-bold">✓ NF Emitida com Sucesso!</p>
                  <p>Número: {pjContractor.gerarNotaFiscal().numeroNF}</p>
                  <p>CNPJ Emissor: {pjContractor.gerarNotaFiscal().cnpj}</p>
                  <p>Valor Bruto: R$ {pjContractor.gerarNotaFiscal().valor.toFixed(2)}</p>
                  <p>Impostos Estimados (6%): R$ {pjContractor.gerarNotaFiscal().impostosRetidos.toFixed(2)}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Clique acima para simular a emissão da Nota Fiscal pelo PJ.
                </p>
              )}
            </div>

            <div className="p-3 bg-blue-950/80 rounded-xl border border-blue-800/50 text-[11px] text-blue-300">
              💡 <strong>Segregação Limpa:</strong> O prestador PJ não possui métodos de Benefícios (VA/VR). Ele não foi
              forçado a implementar métodos inúteis que lançariam exceções.
            </div>
          </div>
        )}
      </div>

      {/* Code comparison section */}
      <div className="lg:col-span-5 space-y-4">
        <CodeSnippetViewer
          fileName="InterfacesSegregadas.ts"
          tag="ISP Principle"
          code={`// Interfaces pequenas e bem definidas
interface IRemuneravel {
  getRemuneracao(): number;
}

interface IBeneficiavel {
  getVA(): number;
  getVR(): number;
}

interface IEmissorNF {
  gerarNotaFiscal(): NotaFiscal;
}

// CLT usa apenas o que precisa
class EmpregadoCLT implements 
  IRemuneravel, IBeneficiavel {
  getRemuneracao() { return 5000; }
  getVA() { return 400; }
  getVR() { return 600; }
}

// PJ não é forçado a ter benefícios!
class ContratadoPJ implements 
  IRemuneravel, IEmissorNF {
  getRemuneracao() { return 8000; }
  gerarNotaFiscal() { /* ... */ }
}`}
        />

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h4 className="font-bold text-slate-800 mb-2 text-sm">O que é Segregação de Interfaces (ISP)?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uma classe não deve ser forçada a depender de interfaces e métodos que ela não utiliza. É melhor criar
            interfaces específicas e pequenas do que uma única interface genérica e gigante.
          </p>
        </div>
      </div>
    </div>
  );
}
