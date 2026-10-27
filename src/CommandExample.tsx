import { useState } from 'react';
import {
  Lightbulb,
  Thermometer,
  Tv,
  Terminal,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import { CodeSnippetViewer } from './CodeSnippetViewer';

// ==========================================
// 1. RECEIVER DEVICES & INTERFACE COMMAND
// ==========================================

export class SmartLight {
  isOn = false;
  toggle() {
    this.isOn = !this.isOn;
  }
}

export class AirConditioner {
  temp = 22;
  setTemp(t: number) {
    this.temp = t;
  }
}

export class SmartTV {
  channel = 1;
  setChannel(c: number) {
    this.channel = c;
  }
}

export interface ICommandItem {
  name: string;
  execute: () => void;
  undo: () => void;
}

// ==========================================
// 2. APLICAÇÃO VISUAL DEMONSTRATIVA
// ==========================================
export default function CommandExample() {
  // Dispositivos Receptores (Receivers)
  const [light] = useState(() => new SmartLight());
  const [ac] = useState(() => new AirConditioner());
  const [tv] = useState(() => new SmartTV());

  // Pilhas de Histórico para Undo/Redo (Invoker)
  const [history, setHistory] = useState<ICommandItem[]>([]);
  const [redoStack, setRedoStack] = useState<ICommandItem[]>([]);
  const [, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  // Execução de comando
  const executeCommand = (command: ICommandItem) => {
    command.execute();
    setHistory((prev) => [command, ...prev]);
    setRedoStack([]); // Limpa redo em novas ações
    refresh();
  };

  const undo = () => {
    if (history.length === 0) return;
    const [lastCommand, ...rest] = history;
    lastCommand.undo();
    setHistory(rest);
    setRedoStack((prev) => [lastCommand, ...prev]);
    refresh();
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const [nextCommand, ...rest] = redoStack;
    nextCommand.execute();
    setRedoStack(rest);
    setHistory((prev) => [nextCommand, ...prev]);
    refresh();
  };

  // Comandos Concretos
  const toggleLightCommand: ICommandItem = {
    name: light.isOn ? 'Apagar Luz' : 'Ligar Luz',
    execute: () => light.toggle(),
    undo: () => light.toggle()
  };

  const changeAcTempCommand = (delta: number): ICommandItem => {
    const prevTemp = ac.temp;
    const newTemp = ac.temp + delta;
    return {
      name: `Ar-Condicionado: ${newTemp}°C`,
      execute: () => ac.setTemp(newTemp),
      undo: () => ac.setTemp(prevTemp)
    };
  };

  const changeTvChannelCommand = (ch: number): ICommandItem => {
    const prevCh = tv.channel;
    return {
      name: `TV: Canal ${ch}`,
      execute: () => tv.setChannel(ch),
      undo: () => tv.setChannel(prevCh)
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      <div className="lg:col-span-7 space-y-6">
        {/* Receivers Visual Devices */}
        <div className="grid grid-cols-3 gap-3">
          {/* Light Receiver */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              light.isOn
                ? 'bg-amber-500/10 border-amber-400 text-amber-900 shadow-lg shadow-amber-500/10'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <Lightbulb size={24} className={light.isOn ? 'text-amber-500 animate-pulse' : 'text-slate-400'} />
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  light.isOn ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {light.isOn ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="font-bold text-xs text-slate-800">Luz da Sala</p>
            <p className="text-[11px] text-slate-500">{light.isOn ? 'Iluminação 100%' : 'Desligada'}</p>
          </div>

          {/* AC Receiver */}
          <div className="p-4 rounded-2xl border bg-sky-500/10 border-sky-300 text-sky-900 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <Thermometer size={24} className="text-sky-600" />
              <span className="text-xs font-bold bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full">
                {ac.temp}°C
              </span>
            </div>
            <p className="font-bold text-xs text-slate-800">Ar Condicionado</p>
            <p className="text-[11px] text-slate-500">Climatizando</p>
          </div>

          {/* TV Receiver */}
          <div className="p-4 rounded-2xl border bg-indigo-500/10 border-indigo-300 text-indigo-900 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <Tv size={24} className="text-indigo-600" />
              <span className="text-xs font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full">
                CH {tv.channel}
              </span>
            </div>
            <p className="font-bold text-xs text-slate-800">Smart TV</p>
            <p className="text-[11px] text-slate-500">Canal Ativo</p>
          </div>
        </div>

        {/* Remote Control Invoker UI */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <h4 className="font-bold text-sm flex items-center gap-2 text-slate-200">
              <Terminal size={18} className="text-amber-400" /> Central de Controle (Invoker)
            </h4>
            {/* Undo / Redo Global Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={undo}
                disabled={history.length === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700 cursor-pointer"
                title="Desfazer Último Comando"
              >
                <RotateCcw size={14} /> Undo ({history.length})
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={redoStack.length === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700 cursor-pointer"
                title="Refazer Comando"
              >
                <RotateCw size={14} /> Redo ({redoStack.length})
              </button>
            </div>
          </div>

          {/* Command Triggers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs font-semibold text-slate-300">Comando Luz:</span>
              <button
                type="button"
                onClick={() => executeCommand(toggleLightCommand)}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
              >
                {light.isOn ? 'Alternar (Apagar)' : 'Alternar (Ligar)'}
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs font-semibold text-slate-300">Comando Temperatura Ar:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => executeCommand(changeAcTempCommand(-1))}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
                >
                  Diminuir (-1°C)
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand(changeAcTempCommand(1))}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
                >
                  Aumentar (+1°C)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs font-semibold text-slate-300">Comando Trocar Canal TV:</span>
              <div className="flex gap-1.5">
                {[1, 4, 7, 12].map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => executeCommand(changeTvChannelCommand(ch))}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer"
                  >
                    CH {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Command Stack Visual History */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
            Pilha de Comandos Executados (History Stack)
          </h4>
          {history.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Nenhum comando executado ainda.</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {history.map((cmd, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="font-mono text-slate-700 font-semibold">{cmd.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    EXECUTE
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Code & Explanation */}
      <div className="lg:col-span-5 space-y-4">
        <CodeSnippetViewer
          fileName="CommandPattern.ts"
          tag="Design Pattern"
          code={`interface Command {
  execute(): void;
  undo(): void;
}

// Encapsula a ação sobre o Receiver
class ChangeTempCommand implements Command {
  constructor(
    private ac: AirConditioner, 
    private newTemp: number,
    private prevTemp = ac.temp
  ) {}

  execute() { this.ac.setTemp(this.newTemp); }
  undo() { this.ac.setTemp(this.prevTemp); }
}

// Invoker gerencia histórico para Undo/Redo
class RemoteControl {
  private history: Command[] = [];

  executeCommand(cmd: Command) {
    cmd.execute();
    this.history.push(cmd);
  }

  undo() {
    const cmd = this.history.pop();
    cmd?.undo();
  }
}`}
        />

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <h4 className="font-bold text-amber-900 mb-2 text-sm">O que é o Command Pattern?</h4>
          <p className="text-xs text-amber-950 leading-relaxed">
            Encapsula uma solicitação como um objeto, permitindo parametrizar clientes com diferentes solicitações,
            enfileirar ou registrar solicitações e suportar operações que podem ser desfeitas (Undo/Redo).
          </p>
        </div>
      </div>
    </div>
  );
}
