import React, { useState } from 'react';
import { Fuel, Plus, X, Trash2, Calendar, Camera } from 'lucide-react';
import { DieselExpenseEntry, Vehicle, UserProfile } from '../types';

interface DieselExpenseManagerProps {
  dieselExpenses: DieselExpenseEntry[];
  vehicles: Vehicle[];
  currentUser: UserProfile;
  onAddDiesel: (entry: Omit<DieselExpenseEntry, 'id' | 'createdAt'>) => void;
  onDeleteDiesel: (id: string) => void;
}

export const DieselExpenseManager: React.FC<DieselExpenseManagerProps> = ({
  dieselExpenses,
  vehicles,
  currentUser,
  onAddDiesel,
  onDeleteDiesel,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [liters, setLiters] = useState<number>(0);
  const [ratePerLiter, setRatePerLiter] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [billPhoto, setBillPhoto] = useState('');

  const selectedVeh = vehicles.find(v => v.id === vehicleId);
  const totalAmount = (liters || 0) * (ratePerLiter || 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setBillPhoto(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVeh) return;

    onAddDiesel({
      date,
      vehicleId: selectedVeh.id,
      vehicleNumber: selectedVeh.vehicleNumber,
      liters,
      ratePerLiter,
      totalAmount,
      description,
      billPhoto,
      operatorUsername: currentUser.username,
    });

    setLiters(100);
    setRatePerLiter(95);
    setDescription('');
    setBillPhoto('');
    setShowModal(false);
  };

  const totalDieselSum = dieselExpenses.reduce((sum, d) => sum + d.totalAmount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            ⛽ ડીઝલ ખર્ચ મેનેજમેન્ટ (Diesel Expenses)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">ગાડીઓનું ડીઝલ લિટર, ભાવ અને બિલના ફોટાઓ સાથેનો હિસાબ</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400">કુલ ડીઝલ ખર્ચ: </span>
            <span className="text-sm font-bold text-rose-400">₹ {totalDieselSum.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> નવો ડીઝલ ખર્ચ ઉમેરો
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
                <th className="py-3 px-4 text-right">લિટર</th>
                <th className="py-3 px-4 text-right">ભાવ/લિટર</th>
                <th className="py-3 px-4 text-right">કુલ રકમ</th>
                <th className="py-3 px-4">વિગત</th>
                <th className="py-3 px-4 text-center">ઓપરેટર</th>
                <th className="py-3 px-4 text-center">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {dieselExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    કોઈ ડીઝલ ખર્ચ નોંધાયેલ નથી.
                  </td>
                </tr>
              ) : (
                dieselExpenses.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-slate-300">{d.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{d.vehicleNumber}</td>
                    <td className="py-3 px-4 text-right text-slate-300">{d.liters} લિટર</td>
                    <td className="py-3 px-4 text-right text-slate-400">₹ {d.ratePerLiter}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400">₹ {d.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-slate-300">{d.description || '-'}</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">{d.operatorUsername}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm('શું તમે આ ડીઝલ એન્ટ્રી ડિલીટ કરવા માંગો છો?')) {
                            onDeleteDiesel(d.id);
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

      {/* Add Diesel Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">ડીઝલ ખર્ચ ઉમેરો</h3>
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
                <label className="block font-medium text-slate-300 mb-1">ગાડી નંબર</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.vehicleNumber} ({v.vehicleType})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">ડીઝલ લિટર (Liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={liters}
                    onChange={(e) => setLiters(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">પ્રતિ લિટર ભાવ (Rate)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ratePerLiter}
                    onChange={(e) => setRatePerLiter(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <p className="text-[11px] text-slate-400">કુલ રકમ (Automatic Calculation)</p>
                <p className="text-base font-bold text-rose-400 mt-0.5">₹ {totalAmount.toLocaleString('en-IN')}</p>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">વિગત / પંપનું નામ (Description)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="દા.ત. પેટ્રોલપમ્પ નામ"
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
