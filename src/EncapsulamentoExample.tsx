import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  DollarSign,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { CodeSnippetViewer } from './CodeSnippetViewer';

export interface BankTransaction {
  id: number;
  type: 'INITIAL' | 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  note?: string;
}

// ==========================================
// 1. CLASSE COM ESTADO PRIVADO (#private)
// ==========================================
export class BankAccount {
  #balance: number; // Campo privado real do JavaScript/TypeScript
  #transactionHistory: BankTransaction[];
  #accountHolder: string;

  constructor(holderName: string, initialBalance: number) {
    this.#accountHolder = holderName;
    this.#balance = Math.max(0, initialBalance);
    this.#transactionHistory = [
      {
        id: Date.now(),
        type: 'INITIAL',
        amount: this.#balance,
        timestamp: new Date().toLocaleTimeString(),
        status: 'SUCCESS',
        note: 'Abertura de conta'
      }
    ];
  }

  // Getters Públicos (Acesso de Leitura Controlado)
  getHolder(): string {
    return this.#accountHolder;
  }

  getBalance(): number {
    return this.#balance;
  }

  getStatement(): BankTransaction[] {
    // Retorna uma cópia para evitar mutações externas no array original
    return [...this.#transactionHistory];
  }

  // Métodos de Negócio com Validações Encapsuladas
  deposit(amount: number): { success: boolean; message: string } {
    if (amount <= 0) {
      this.#logTransaction('DEPOSIT', amount, 'FAILED', 'O valor do depósito deve ser maior que zero.');
      return { success: false, message: 'O valor do depósito deve ser maior que zero!' };
    }

    this.#balance += amount;
    this.#logTransaction('DEPOSIT', amount, 'SUCCESS', 'Depósito realizado com sucesso.');
    return { success: true, message: `R$ ${amount.toFixed(2)} depositado com sucesso.` };
  }

  withdraw(amount: number): { success: boolean; message: string } {
    if (amount <= 0) {
      this.#logTransaction('WITHDRAW', amount, 'FAILED', 'O valor do saque deve ser maior que zero.');
      return { success: false, message: 'Valor de saque inválido.' };
    }

    if (amount > this.#balance) {
      this.#logTransaction('WITHDRAW', amount, 'BLOCKED', 'Saldo insuficiente para concluir o saque.');
      return { success: false, message: 'Operação Negada: Saldo insuficiente!' };
    }

    this.#balance -= amount;
    this.#logTransaction('WITHDRAW', amount, 'SUCCESS', 'Saque efetuado com sucesso.');
    return { success: true, message: `Saque de R$ ${amount.toFixed(2)} realizado.` };
  }

  // Método Privado Auxiliar (Não acessível fora da classe)
  #logTransaction(type: 'DEPOSIT' | 'WITHDRAW', amount: number, status: 'SUCCESS' | 'FAILED' | 'BLOCKED', note: string): void {
    this.#transactionHistory.unshift({
      id: Date.now() + Math.random(),
      type,
      amount,
      status,
      note,
      timestamp: new Date().toLocaleTimeString()
    });
  }
}

// ==========================================
// 2. APLICAÇÃO VISUAL DEMONSTRATIVA
// ==========================================
export default function EncapsulamentoExample() {
  const [account] = useState(() => new BankAccount('Ana Silva', 500));
  const [, setTick] = useState(0); // Gatilho para atualizar a UI
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null);

  const refreshUI = () => setTick((t) => t + 1);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val)) return;
    const res = account.deposit(val);
    setMessage(res);
    setAmount('');
    refreshUI();
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val)) return;
    const res = account.withdraw(val);
    setMessage(res);
    setAmount('');
    refreshUI();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      {/* Visual Component */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lock size={160} />
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/50">
                Estado Encapsulado (#private)
              </span>
              <h3 className="text-2xl font-bold mt-2">{account.getHolder()}</h3>
              <p className="text-slate-400 text-sm">Conta Corrente de Proteção Segura</p>
            </div>
            <ShieldCheck className="text-emerald-400" size={36} />
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 mb-6 backdrop-blur">
            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Saldo Protegido (getBalance)</p>
            <p className="text-4xl font-extrabold text-emerald-400">
              R$ {account.getBalance().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Form Actions */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Informe o valor (R$)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
              <button
                type="button"
                onClick={handleDeposit}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 text-sm cursor-pointer"
              >
                Depositar
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-900/20 active:scale-95 text-sm cursor-pointer"
              >
                Sacar
              </button>
            </div>

            {/* Simulated Unauthorized Direct Access Attempt */}
            <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
                Tentativa Externa: <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-200">conta.#balance = 1000000</code>
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono text-[10px]">SyntaxError (Bloqueado)</span>
            </div>
          </div>

          {/* Alert Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
                message.success
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {message.success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {message.message}
            </div>
          )}
        </div>

        {/* Transaction History Log */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
            <FileText size={18} className="text-slate-500" /> Extrato de Auditoria (Visualização Segura)
          </h4>
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {account.getStatement().map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-1.5 rounded-lg ${
                      item.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.type === 'DEPOSIT' ? <DollarSign size={14} /> : <CreditCard size={14} />}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.type === 'DEPOSIT' ? 'Depósito' : item.type === 'WITHDRAW' ? 'Saque' : 'Abertura'}
                      <span className="ml-2 font-normal text-slate-500 text-[10px]">{item.timestamp}</span>
                    </p>
                    <p className="text-slate-500">{item.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${item.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {item.type === 'DEPOSIT' ? '+' : '-'} R$ {item.amount.toFixed(2)}
                  </span>
                  <span
                    className={`block text-[10px] font-semibold ${
                      item.status === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Concept Explanation & Code */}
      <div className="lg:col-span-5 space-y-4">
        <CodeSnippetViewer
          fileName="BankAccount.ts"
          tag="TypeScript"
          code={`class BankAccount {
  // Atributos privados e protegidos (#)
  #saldo: number;
  #extrato: Transaction[] = [];

  constructor(saldoInicial: number) {
    this.#saldo = Math.max(0, saldoInicial);
  }

  // Leitura segura controlada
  public getSaldo(): number {
    return this.#saldo;
  }

  // Regras de negócio encapsuladas
  public sacar(valor: number): boolean {
    if (valor <= 0 || valor > this.#saldo) {
      this.#log('SAQUE_NEGADO');
      return false; // Bloqueado
    }
    this.#saldo -= valor;
    this.#log('SAQUE_SUCESSO');
    return true;
  }

  // Método privado inacessível fora
  #log(tipo: string) { /* ... */ }
}`}
        />

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <h4 className="font-bold text-indigo-900 mb-2 text-sm flex items-center gap-1.5">
            <Sparkles size={16} className="text-indigo-600" /> O que é Encapsulamento?
          </h4>
          <p className="text-xs text-indigo-950 leading-relaxed">
            Encapsular é esconder os detalhes internos e o estado direto de um objeto, expondo apenas uma interface pública
            segura (métodos). Isso impede que regras de negócio sejam violadas por acessos indevidos externos.
          </p>
        </div>
      </div>
    </div>
  );
}
