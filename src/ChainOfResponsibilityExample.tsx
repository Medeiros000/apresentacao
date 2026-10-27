import { useState } from 'react';
import {
  GitMerge,
  Play,
  Package,
  CreditCard,
  ShieldCheck,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { CodeSnippetViewer } from './CodeSnippetViewer';

// ==========================================
// 1. ESTRUTURA DO CHAIN OF RESPONSIBILITY
// ==========================================

export interface OrderCheckoutRequest {
  hasStock: boolean;
  cardValid: boolean;
  isFraud: boolean;
  coupon: boolean;
  discountApplied?: boolean;
}

export interface PipelineResult {
  success: boolean;
  step?: string;
  message: string;
}

export class Handler {
  protected nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: OrderCheckoutRequest): PipelineResult {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return { success: true, message: 'Pedido Aprovado com Sucesso!' };
  }
}

export class StockValidationHandler extends Handler {
  override handle(request: OrderCheckoutRequest): PipelineResult {
    if (request.hasStock === false) {
      return { success: false, step: 'Estoque', message: 'Falha: Produto fora de estoque.' };
    }
    return super.handle(request);
  }
}

export class CreditCardValidationHandler extends Handler {
  override handle(request: OrderCheckoutRequest): PipelineResult {
    if (request.cardValid === false) {
      return { success: false, step: 'Cartão de Crédito', message: 'Falha: Cartão recusado ou sem limite.' };
    }
    return super.handle(request);
  }
}

export class FraudCheckHandler extends Handler {
  override handle(request: OrderCheckoutRequest): PipelineResult {
    if (request.isFraud === true) {
      return { success: false, step: 'Antifraude', message: 'Bloqueado: Suspeita de fraude detectada!' };
    }
    return super.handle(request);
  }
}

export class DiscountApplyHandler extends Handler {
  override handle(request: OrderCheckoutRequest): PipelineResult {
    if (request.coupon) {
      request.discountApplied = true;
    }
    return super.handle(request);
  }
}

// ==========================================
// 2. APLICAÇÃO VISUAL DEMONSTRATIVA
// ==========================================
export default function ChainOfResponsibilityExample() {
  const [flags, setFlags] = useState<OrderCheckoutRequest>({
    hasStock: true,
    cardValid: true,
    isFraud: false,
    coupon: true
  });

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const runPipeline = () => {
    setIsProcessing(true);
    setActiveStep(1);
    setResult(null);

    // Constrói a cadeia de handlers
    const stock = new StockValidationHandler();
    const card = new CreditCardValidationHandler();
    const fraud = new FraudCheckHandler();
    const discount = new DiscountApplyHandler();

    stock.setNext(card).setNext(fraud).setNext(discount);

    const request = { ...flags };

    // Simulação visual de passagem pelos nós
    setTimeout(() => {
      if (!flags.hasStock) {
        setResult(stock.handle(request));
        setIsProcessing(false);
        return;
      }
      setActiveStep(2);

      setTimeout(() => {
        if (!flags.cardValid) {
          setResult(card.handle(request));
          setIsProcessing(false);
          return;
        }
        setActiveStep(3);

        setTimeout(() => {
          if (flags.isFraud) {
            setResult(fraud.handle(request));
            setIsProcessing(false);
            return;
          }
          setActiveStep(4);

          setTimeout(() => {
            const finalRes = stock.handle(request);
            setResult(finalRes);
            setIsProcessing(false);
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      <div className="lg:col-span-7 space-y-6">
        {/* Toggle Flags Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <GitMerge className="text-violet-600" size={18} /> Simular Parâmetros do Pedido
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <label
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                flags.hasStock
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <span className="font-semibold">Estoque Disponível</span>
              <input
                type="checkbox"
                checked={flags.hasStock}
                onChange={(e) => setFlags({ ...flags, hasStock: e.target.checked })}
                className="accent-emerald-600 h-4 w-4"
              />
            </label>

            <label
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                flags.cardValid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <span className="font-semibold">Cartão Válido</span>
              <input
                type="checkbox"
                checked={flags.cardValid}
                onChange={(e) => setFlags({ ...flags, cardValid: e.target.checked })}
                className="accent-emerald-600 h-4 w-4"
              />
            </label>

            <label
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                !flags.isFraud
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <span className="font-semibold">Suspeita de Fraude</span>
              <input
                type="checkbox"
                checked={flags.isFraud}
                onChange={(e) => setFlags({ ...flags, isFraud: e.target.checked })}
                className="accent-rose-600 h-4 w-4"
              />
            </label>

            <label className="p-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-800 flex items-center justify-between cursor-pointer">
              <span className="font-semibold">Cupom Desconto</span>
              <input
                type="checkbox"
                checked={flags.coupon}
                onChange={(e) => setFlags({ ...flags, coupon: e.target.checked })}
                className="accent-violet-600 h-4 w-4"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={runPipeline}
            disabled={isProcessing}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />} Processar Checkout na
            Corrente
          </button>
        </div>

        {/* Visual Pipeline Handler Nodes */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-6">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Pipeline de Validação (Chain of Handlers)
          </h4>

          <div className="space-y-3">
            {[
              { id: 1, title: '1. Validador de Estoque', icon: Package },
              { id: 2, title: '2. Autenticação de Cartão', icon: CreditCard },
              { id: 3, title: '3. Verificação Antifraude', icon: ShieldCheck },
              { id: 4, title: '4. Aplicador de Cupons', icon: DollarSign }
            ].map((node) => {
              const Icon = node.icon;
              const isActive = activeStep === node.id;
              const isPassed = (activeStep !== null && activeStep > node.id) || (Boolean(result?.success) && activeStep === 4);
              const isFailed = result && !result.success && activeStep === node.id;

              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                    isFailed
                      ? 'bg-rose-950/80 border-rose-500/80 text-rose-200 scale-[1.02]'
                      : isActive
                      ? 'bg-violet-900/80 border-violet-400 text-white shadow-lg shadow-violet-500/20 scale-[1.02]'
                      : isPassed
                      ? 'bg-slate-800/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? 'text-violet-300 animate-pulse'
                          : isPassed
                          ? 'text-emerald-400'
                          : isFailed
                          ? 'text-rose-400'
                          : 'text-slate-500'
                      }
                    />
                    <span className="font-semibold text-sm">{node.title}</span>
                  </div>

                  <div>
                    {isFailed && (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                        <XCircle size={16} /> Interrompido
                      </span>
                    )}
                    {isPassed && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 size={16} /> Aprovado
                      </span>
                    )}
                    {isActive && !isFailed && !isPassed && (
                      <span className="text-xs text-violet-300 font-mono animate-pulse">Processando...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Banner */}
          {result && (
            <div
              className={`p-4 rounded-xl border text-sm flex items-center gap-3 ${
                result.success
                  ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={24} />
              ) : (
                <AlertTriangle className="text-rose-400 flex-shrink-0" size={24} />
              )}
              <div>
                <p className="font-bold">{result.success ? 'Sucesso!' : `Bloqueado no nó: ${result.step}`}</p>
                <p className="text-xs opacity-90">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code & Explanation */}
      <div className="lg:col-span-5 space-y-4">
        <CodeSnippetViewer
          fileName="ChainOfResponsibility.ts"
          tag="Design Pattern"
          code={`abstract class Handler {
  private next?: Handler;

  public setNext(h: Handler): Handler {
    this.next = h;
    return h;
  }

  public handle(req: Order): boolean {
    if (this.next) return this.next.handle(req);
    return true; // Fim da corrente
  }
}

class StockHandler extends Handler {
  handle(req: Order) {
    if (!req.hasStock) return false; // Para aqui
    return super.handle(req); // Passa adiante
  }
}

// Encadeamento flexível:
stock.setNext(card).setNext(fraud);
stock.handle(order);`}
        />

        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
          <h4 className="font-bold text-violet-900 mb-2 text-sm">O que é Chain of Responsibility?</h4>
          <p className="text-xs text-violet-950 leading-relaxed">
            Permite passar solicitações ao longo de uma corrente de manipuladores (handlers). Ao receber a solicitação, cada
            manipulador decide se a processa ou a passa para o próximo nó da corrente.
          </p>
        </div>
      </div>
    </div>
  );
}
