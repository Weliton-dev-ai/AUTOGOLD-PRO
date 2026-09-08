import React, { useState, useEffect } from 'react';

// --- INTERFACES & TYPES ---
export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  isLicensed: boolean;
  licenseKey: string;
  activatedAt: string;
}

export interface WorkshopConfig {
  name: string;
  phone: string;
  address: string;
  logoUrl?: string;
  pixKey: string;
}

export interface BudgetEstimate {
  id: string;
  clientName: string;
  clientPhone: string;
  vehicleModel: string;
  vehiclePlate: string;
  totalAmount: number;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
}

export interface CashFlowEntry {
  id: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string;
  amount: number;
  date: string;
  relatedBudgetId?: string;
  paymentMethod?: string;
}

// --- DADOS PADRÃO ---
const DEFAULT_WORKSHOP_CONFIG: WorkshopConfig = {
  name: 'AutoGold Pro Detailing',
  phone: '(11) 99999-9999',
  address: 'Av. Principal, 1000 - Centro',
  pixKey: 'financeiro@autogold.com.br'
};

const SAMPLE_BUDGETS: BudgetEstimate[] = [
  {
    id: 'orc-001',
    clientName: 'Carlos Silva',
    clientPhone: '(11) 98888-7777',
    vehicleModel: 'BMW X5 - Preto',
    vehiclePlate: 'ABC-1234',
    totalAmount: 1850.00,
    status: 'aprovado',
    createdAt: new Date().toISOString().split('T')[0]
  }
];

const SAMPLE_CASH_FLOW: CashFlowEntry[] = [
  {
    id: 'cf-001',
    type: 'entrada',
    category: 'sinal_orcamento',
    description: 'Sinal Orçamento #orc-001 - Carlos Silva',
    amount: 500.00,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'pix'
  }
];

const STORAGE_KEYS = {
  SESSION: 'autogold_session',
  CONFIG: 'autogold_config',
  BUDGETS: 'autogold_budgets',
  CASH_FLOW: 'autogold_cashflow'
};

export default function App() {
  const [session, setSession] = useState<UserSession>(() => ({
    isLoggedIn: true,
    email: 'oficina@autogold.com.br',
    isLicensed: true,
    licenseKey: 'GOLD-2026-VIP',
    activatedAt: 'Vitalício'
  }));

  const [workshopConfig, setWorkshopConfig] = useState<WorkshopConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : DEFAULT_WORKSHOP_CONFIG;
  });

  const [budgets, setBudgets] = useState<BudgetEstimate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : SAMPLE_BUDGETS;
  });

  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASH_FLOW);
    return saved ? JSON.parse(saved) : SAMPLE_CASH_FLOW;
  });

  const [activeTab, setActiveTab] = useState<'orcamentos' | 'novo_orcamento' | 'fluxo_caixa' | 'configuracoes'>('orcamentos');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(workshopConfig));
  }, [workshopConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASH_FLOW, JSON.stringify(cashFlow));
  }, [cashFlow]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col selection:bg-[#D4AF37] selection:text-black">
      {/* Header Premium AutoGold */}
      <header className="border-b border-[#D4AF37]/30 bg-black/80 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF8DC] flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-[#D4AF37]/20">
            AG
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#FFF8DC] to-[#D4AF37] bg-clip-text text-transparent">
              {workshopConfig.name}
            </h1>
            <p className="text-xs text-amber-200/60 uppercase tracking-widest">Painel de Gestão Premium</p>
          </div>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex gap-2 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('orcamentos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'orcamentos'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Orçamentos
          </button>
          <button
            onClick={() => setActiveTab('novo_orcamento')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'novo_orcamento'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            + Novo Orçamento
          </button>
          <button
            onClick={() => setActiveTab('fluxo_caixa')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'fluxo_caixa'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Fluxo de Caixa
          </button>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'orcamentos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-100">Orçamentos Recentes</h2>
              <button
                onClick={() => setActiveTab('novo_orcamento')}
                className="bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold px-4 py-2 rounded-lg transition"
              >
                Criar Orçamento
              </button>
            </div>

            <div className="grid gap-4">
              {budgets.map((b) => (
                <div key={b.id} className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">{b.clientName} - <span className="text-amber-400">{b.vehicleModel}</span></h3>
                    <p className="text-sm text-zinc-400">Placa: {b.vehiclePlate} | Tel: {b.clientPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-[#D4AF37]">R$ {b.totalAmount.toFixed(2)}</p>
                    <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'novo_orcamento' && (
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-100 mb-6">Novo Orçamento Pro</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const newB: BudgetEstimate = {
                id: `orc-${Date.now()}`,
                clientName: (form.elements.namedItem('client') as HTMLInputElement).value,
                clientPhone: (form.elements.namedItem('phone') as HTMLInputElement).value,
                vehicleModel: (form.elements.namedItem('vehicle') as HTMLInputElement).value,
                vehiclePlate: (form.elements.namedItem('plate') as HTMLInputElement).value,
                totalAmount: parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value || '0'),
                status: 'pendente',
                createdAt: new Date().toISOString().split('T')[0]
              };
              setBudgets([newB, ...budgets]);
              setActiveTab('orcamentos');
            }} className="space-y-4">
              <input name="client" placeholder="Nome do Cliente" required className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white" />
              <input name="phone" placeholder="Telefone / WhatsApp" required className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input name="vehicle" placeholder="Veículo (Ex: Civic)" required className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white" />
                <input name="plate" placeholder="Placa" required className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white" />
              </div>
              <input name="amount" type="number" step="0.01" placeholder="Valor Total (R$)" required className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white" />
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setActiveTab('orcamentos')} className="px-4 py-2 text-zinc-400">Cancelar</button>
                <button type="submit" className="bg-[#D4AF37] text-black font-bold px-6 py-2 rounded-lg">Salvar Orçamento</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'fluxo_caixa' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-amber-100">Fluxo de Caixa</h2>
            <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-xl">
              {cashFlow.map((entry) => (
                <div key={entry.id} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0">
                  <div>
                    <p className="font-bold text-white">{entry.description}</p>
                    <p className="text-xs text-zinc-500">{entry.date} - {entry.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-400">+ R$ {entry.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
