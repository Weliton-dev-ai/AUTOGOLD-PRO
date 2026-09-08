import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  FileText, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut, 
  Trash2, 
  CheckCircle, 
  Calendar,
  Wrench
} from 'lucide-react';

// Tipos de dados
interface WorkshopConfig {
  name: string;
  phone: string;
  address: string;
  hourlyRate: number;
}

interface BudgetItem {
  id: string;
  description: string;
  category: 'paint' | 'labor' | 'part' | 'other';
  cost: number;
}

interface Budget {
  id: string;
  clientName: string;
  carModel: string;
  licensePlate: string;
  date: string;
  status: 'draft' | 'approved' | 'completed' | 'cancelled';
  items: BudgetItem[];
  total: number;
}

interface CashEntry {
  id: string;
  description: string;
  amount: number;
  type: 'in' | 'out';
  date: string;
  category: string;
}

const DEFAULT_CONFIG: WorkshopConfig = {
  name: 'AutoGold Pro Oficina',
  phone: '(11) 99999-9999',
  address: 'Av. Principal, 1000',
  hourlyRate: 120
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'budgets' | 'cash' | 'new' | 'settings'>('budgets');
  const [config, setConfig] = useState<WorkshopConfig>(DEFAULT_CONFIG);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [cashEntries, setCashEntries] = useState<CashEntry[]>([]);

  // Novo Orçamento State
  const [clientName, setClientName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [itemDesc, setItemDesc] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [itemCategory, setItemCategory] = useState<'paint' | 'labor' | 'part' | 'other'>('paint');

  // Carregar dados salvos
  useEffect(() => {
    const savedConfig = localStorage.getItem('autogold_config');
    const savedBudgets = localStorage.getItem('autogold_budgets');
    const savedCash = localStorage.getItem('autogold_cash');

    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    if (savedCash) setCashEntries(JSON.parse(savedCash));
  }, []);

  // Salvar alterações
  const saveBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem('autogold_budgets', JSON.stringify(newBudgets));
  };

  const saveCash = (newCash: CashEntry[]) => {
    setCashEntries(newCash);
    localStorage.setItem('autogold_cash', JSON.stringify(newCash));
  };

  // Adicionar Item ao Orçamento Atual
  const handleAddItem = () => {
    if (!itemDesc || !itemCost) return;
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: itemDesc,
      category: itemCategory,
      cost: parseFloat(itemCost) || 0
    };
    setItems([...items, newItem]);
    setItemDesc('');
    setItemCost('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Finalizar e Salvar Orçamento
  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || items.length === 0) return;

    const total = items.reduce((sum, item) => sum + item.cost, 0);
    const newBudget: Budget = {
      id: Date.now().toString(),
      clientName,
      carModel,
      licensePlate,
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'draft',
      items,
      total
    };

    saveBudgets([newBudget, ...budgets]);
    
    // Limpar form
    setClientName('');
    setCarModel('');
    setLicensePlate('');
    setItems([]);
    setActiveTab('budgets');
  };

  // Atualizar Status do Orçamento
  const handleStatusChange = (id: string, status: Budget['status']) => {
    const updated = budgets.map(b => {
      if (b.id === id) {
        // Se for marcado como concluído, entra no caixa automático
        if (status === 'completed' && b.status !== 'completed') {
          const entry: CashEntry = {
            id: Date.now().toString(),
            description: `Orçamento #${b.id} - ${b.clientName}`,
            amount: b.total,
            type: 'in',
            date: new Date().toLocaleDateString('pt-BR'),
            category: 'Serviço'
          };
          saveCash([entry, ...cashEntries]);
        }
        return { ...b, status };
      }
      return b;
    });
    saveBudgets(updated);
  };

  const totalCalculated = items.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Topbar / Header */}
      <header className="bg-slate-900 border-b border-amber-500/30 p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-amber-600 to-amber-400 p-2 rounded-xl text-slate-950 font-bold shadow-amber-500/20 shadow-lg">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                AutoGold Pro
              </h1>
              <p className="text-xs text-amber-400/70">{config.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-6">
        {/* TAB: LISTA DE ORÇAMENTOS */}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-amber-400">Orçamentos</h2>
                <p className="text-slate-400 text-sm">Gerencie os orçamentos de pintura e oficina</p>
              </div>
              <button
                onClick={() => setActiveTab('new')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-amber-500/10 transition"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Novo Orçamento</span>
              </button>
            </div>

            {budgets.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
                <p className="text-lg font-medium text-slate-300">Nenhum orçamento cadastrado</p>
                <p className="text-sm">Clique em "Novo Orçamento" para começar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map((b) => (
                  <div key={b.id} className="bg-slate-900 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-100">{b.clientName}</h3>
                        <p className="text-xs text-amber-400">{b.carModel} • {b.licensePlate}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        b.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {b.status === 'completed' ? 'Concluído' : b.status === 'approved' ? 'Aprovado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="border-t border-b border-slate-800 py-3 my-3 space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Data:</span>
                        <span>{b.date}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Itens:</span>
                        <span>{b.items.length} item(ns)</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="text-xs text-slate-400">Valor Total</p>
                        <p className="text-xl font-bold text-amber-400">R$ {b.total.toFixed(2)}</p>
                      </div>

                      <div className="flex space-x-1">
                        {b.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(b.id, 'completed')}
                            className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition"
                            title="Marcar como Concluído"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: NOVO ORÇAMENTO */}
        {activeTab === 'new' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center space-x-2">
              <Calculator className="w-6 h-6" />
              <span>Novo Orçamento</span>
            </h2>

            <form onSubmit={handleCreateBudget} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nome do Cliente</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Modelo do Veículo</label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="Ex: Civic Black"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Placa</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="ABC-1234"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Adicionar Itens */}
              <div className="border-t border-slate-800 pt-4">
                <h3 className="text-sm font-semibold text-amber-400 mb-3">Serviços / Tintas / Peças</h3>
                
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    placeholder="Descrição do item/serviço"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                  <select
                    value={itemCategory}
                    onChange={(e: any) => setItemCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="paint">Pintura/Tinta</option>
                    <option value="labor">Mão de Obra</option>
                    <option value="part">Peça/Material</option>
                    <option value="other">Outro</option>
                  </select>
                  <input
                    type="number"
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                    placeholder="Valor (R$)"
                    className="w-28 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition"
                  >
                    +
                  </button>
                </div>

                {/* Lista de Itens Inseridos */}
                {items.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-4 p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                    {items.map((it) => (
                      <div key={it.id} className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg">
                        <div>
                          <span className="text-sm font-medium">{it.description}</span>
                          <span className="text-xs text-amber-500 ml-2">({it.category})</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-bold text-amber-400">R$ {it.cost.toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totalizador */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Total Estimado</span>
                  <p className="text-2xl font-bold text-amber-400">R$ {totalCalculated.toFixed(2)}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('budgets')}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-amber-500/10 transition"
                  >
                    Salvar Orçamento
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB: FLUXO DE CAIXA */}
        {activeTab === 'cash' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-amber-400">Fluxo de Caixa</h2>
                <p className="text-slate-400 text-sm">Entradas e saídas financeiras da oficina</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <p className="text-xs text-slate-400">Entradas Concluídas</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  R$ {cashEntries.filter(c => c.type === 'in').reduce((s, c) => s + c.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <p className="text-xs text-slate-400">Registros no Caixa</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">{cashEntries.length} lançamento(s)</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 font-bold text-amber-400">
                Histórico de Lançamentos
              </div>
              {cashEntries.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Nenhum lançamento registrado no caixa ainda.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {cashEntries.map((c) => (
                    <div key={c.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-200">{c.description}</p>
                        <p className="text-xs text-slate-500">{c.date} • {c.category}</p>
                      </div>
                      <span className="font-bold text-emerald-400">+ R$ {c.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CONFIGURAÇÕES */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-4">Configurações da Oficina</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome da Oficina</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={config.phone}
                  onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Endereço</label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => setConfig({ ...config, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <button
                onClick={() => {
                  localStorage.setItem('autogold_config', JSON.stringify(config));
                  setActiveTab('budgets');
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg transition mt-4"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (Mobile / Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-amber-500/20 p-2 z-50">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition ${
              activeTab === 'budgets' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5 mb-1" />
            <span>Orçamentos</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className="flex flex-col items-center -mt-5 bg-amber-500 text-slate-950 p-3 rounded-full shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition"
          >
            <PlusCircle className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('cash')}
            className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition ${
              activeTab === 'cash' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5 mb-1" />
            <span>Caixa</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
