import React, { useState } from 'react';
import { DollarSign, Plus, X, Trash2, Calendar } from 'lucide-react';
import { OtherExpenseEntry, Vehicle, UserProfile } from '../types';

interface OtherExpenseManagerProps {
  otherExpenses: OtherExpenseEntry[];
  vehicles: Vehicle[];
  currentUser: UserProfile;
  onAddOther: (entry: Omit<OtherExpenseEntry, 'id' | 'createdAt'>) => void;
  onDeleteOther: (id: string) => void;
}

export const OtherExpenseManager: React.FC<OtherExpenseManagerProps> = ({
  otherExpenses,
  vehicles,
  currentUser,
  onAddOther,
  onDeleteOther,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vehicleId, setVehicleId] = useState('');
  const [expenseName, setExpenseName] = useState('મેન્ટેનન્સ / રિપેરિંગ');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [billPhoto, setBillPhoto] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setBillPhoto(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName || !amount) return;

    const selectedVeh = vehicles.find(v => v.id === vehicleId);

    onAddOther({
      date,
      vehicleId: selectedVeh?.id,
      vehicleNumber: selectedVeh?.vehicleNumber || 'સામાન્ય ખર્ચ',
      expenseName,
      amount,
      description,
      billPhoto,
      operatorUsername: currentUser.username,
    });

    setExpenseName('મેન્ટેનન્સ / રિપેરિંગ');
    setAmount(2000);
    setDescription('');
    setBillPhoto('');
    setShowModal(false);
  };

  const totalOtherSum = otherExpenses.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            💸 અન્ય ખર્ચ મેનેજમેન્ટ (Other Expenses)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">મેન્ટેનન્સ, પગાર, પાર્ટ્સ અને અન્ય પરચૂરણ ખર્ચનો હિસાબ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">કુલ અન્ય ખર્ચ: </span>
            <span className="text-sm font-bold text-rose-400">₹ {totalOtherSum.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> નવો અન્ય ખર્ચ ઉમેરો
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <th className="py-3 px-4">તારીખ</th>
                <th className="py-3 px-4">ગાડી નંબર</th>
                <th className="py-3 px-4">ખર્ચનું નામ</th>
                <th className="py-3 px-4 text-right">રકમ</th>
                <th className="py-3 px-4">વિગત</th>
                <th className="py-3 px-4 text-center">ઓપરેટર</th>
                <th className="py-3 px-4 text-center">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {otherExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    કોઈ અન્ય ખર્ચ નોંધાયેલ નથી.
                  </td>
                </tr>
              ) : (
                otherExpenses.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-slate-300">{o.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{o.vehicleNumber}</td>
                    <td className="py-3 px-4 font-medium text-amber-400">{o.expenseName}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400">₹ {o.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-slate-300">{o.description || '-'}</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">{o.operatorUsername}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('શું તમે આ ખર્ચ એન્ટ્રી ડિલીટ કરવા માંગો છો?')) {
                            onDeleteOther(o.id);
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

      {/* Add Other Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">અન્ય ખર્ચ ઉમેરો</h3>
              <button onClick={() => setShowModal(false)} className="p-1 bg-black/20 hover:bg-black/40 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
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
                <label className="block font-medium text-slate-300 mb-1">ખર્ચનું નામ / શીર્ષક (Expense Name)</label>
                <input
                  type="text"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="દા.ત. મેન્ટેનન્સ, ડ્રાઇવર પગાર, પાર્ટ્સ"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
                />
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

              <div>
                <label className="block font-medium text-slate-300 mb-1">બિલનો ફોટો (Bill Photo)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-orange-400"
                />
                {billPhoto && <p className="text-[10px] text-emerald-400 mt-1">✓ ફોટો અપલોડ થયો છે</p>}
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
