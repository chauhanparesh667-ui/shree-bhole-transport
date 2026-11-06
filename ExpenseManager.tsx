import React, { useState } from 'react';
import { Fuel, Plus, X, Trash2, Calendar, DollarSign, Tag } from 'lucide-react';
import { Expense, Vehicle, UserProfile } from '../types';

interface ExpenseManagerProps {
  expenses: Expense[];
  vehicles: Vehicle[];
  currentUser: UserProfile;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  expenses,
  vehicles,
  currentUser,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Expense['category']>('મેન્ટેનન્સ');
  const [amount, setAmount] = useState<number>(1000);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const selectedVeh = vehicles.find(v => v.id === vehicleId);

    onAddExpense({
      date,
      category,
      amount,
      vehicleId: selectedVeh?.id,
      vehicleNumber: selectedVeh?.vehicleNumber,
      description,
      addedBy: currentUser.username,
    });

    setAmount(1000);
    setDescription('');
    setShowModal(false);
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            💸 ખર્ચ મેનેજમેન્ટ (Expense Management)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">ડીઝલ, ટોલ, મેન્ટેનન્સ, ડ્રાઇવર પગાર અને મશીનરી ખર્ચ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">કુલ ખર્ચ: </span>
            <span className="text-sm font-bold text-rose-400">₹ {totalExpense.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> નવો ખર્ચ ઉમેરો
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <th className="py-3 px-4">તારીખ</th>
                <th className="py-3 px-4">કેટેગરી</th>
                <th className="py-3 px-4">ગાડી નંબર</th>
                <th className="py-3 px-4">વિગત / નોંધ</th>
                <th className="py-3 px-4">એડ કરનાર</th>
                <th className="py-3 px-4 text-right">રકમ</th>
                <th className="py-3 px-4 text-center">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    કોઈ ખર્ચ નોંધાયેલ નથી.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-slate-300">{exp.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{exp.vehicleNumber || 'સામાન્ય ખર્ચ'}</td>
                    <td className="py-3 px-4 text-slate-300">{exp.description || '-'}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{exp.addedBy}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400">₹ {exp.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('શું તમે આ ખર્ચ ડિલીટ કરવા માંગો છો?')) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">નવો ખર્ચ ઉમેરો</h3>
              <button onClick={() => setShowModal(false)} className="p-1 bg-black/20 hover:bg-black/40 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">તારીખ</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">ખર્ચની કેટેગરી</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="ડીઝલ">ડીઝલ (Diesel)</option>
                  <option value="ટોલ">ટોલ (Toll)</option>
                  <option value="મેન્ટેનન્સ">મેન્ટેનન્સ (Maintenance)</option>
                  <option value="ડ્રાઇવર પગાર">ડ્રાઇવર પગાર (Driver Salary)</option>
                  <option value="JCB ખર્ચ">JCB ખર્ચ</option>
                  <option value="HITACHI ખર્ચ">HITACHI ખર્ચ</option>
                  <option value="SANY HITACHI ખર્ચ">SANY HITACHI ખર્ચ</option>
                  <option value="અન્ય ખર્ચ">અન્ય ખર્ચ (Other)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">સંબંધિત ગાડી (વૈકલ્પિક)</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="">કોઈ નહીં (સામાન્ય ખર્ચ)</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.vehicleType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">રકમ (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">વિગત / નોંધ (Description)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ખર્ચ વિશે માહિતી"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold shadow"
                >
                  સેવ કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
