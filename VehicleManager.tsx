import React, { useState } from 'react';
import { Truck, Plus, X, Phone, User, CheckCircle, Trash2 } from 'lucide-react';
import { Vehicle, TripEntry, Expense } from '../types';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  trips: TripEntry[];
  expenses: Expense[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  onDeleteVehicle: (id: string) => void;
}

export const VehicleManager: React.FC<VehicleManagerProps> = ({
  vehicles,
  trips,
  expenses,
  onAddVehicle,
  onDeleteVehicle,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('હાઇવા ડમ્પર');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [ownership, setOwnership] = useState<'સ્વયં' | 'ભાડે' | 'ફાઇનાન્સ'>('સ્વયં');
  const [capacityTons, setCapacityTons] = useState(30);
  const [tareWeightKg, setTareWeightKg] = useState(12500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) return;

    onAddVehicle({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      vehicleType,
      driverName,
      driverPhone,
      ownership,
      capacityTons,
      tareWeightKg,
      emptyWeightTons: tareWeightKg / 1000,
      isActive: true,
    });

    setVehicleNumber('');
    setDriverName('');
    setDriverPhone('');
    setCapacityTons(30);
    setTareWeightKg(12500);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🚛 ગાડી મેનેજમેન્ટ (Vehicle Management)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">તમામ ગાડીઓની યાદી, ડ્રાઇવર અને ગાડી પ્રમાણે નફાનો હિસાબ</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> નવી ગાડી ઉમેરો
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((veh) => {
          // Calculate vehicle stats from trips and expenses
          const vehTrips = trips.filter((t) => t.vehicleNumber === veh.vehicleNumber && t.status !== 'રદ કરેલ');
          const totalTrips = vehTrips.length;
          const totalTons = vehTrips.reduce((sum, t) => sum + t.totalTons, 0);
          const totalIncome = vehTrips.reduce((sum, t) => sum + t.totalAmount, 0);
          const totalExpense = expenses.filter(e => e.vehicleNumber === veh.vehicleNumber).reduce((sum, e) => sum + e.amount, 0);
          const netProfit = totalIncome - totalExpense;

          return (
            <div key={veh.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">{veh.vehicleNumber}</h3>
                      <p className="text-xs text-slate-400">{veh.vehicleType}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                    veh.ownership === 'સ્વયં' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    veh.ownership === 'ફાઇનાન્સ' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {veh.ownership}
                  </span>
                </div>

                <div className="space-y-1.5 py-3 border-y border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400"><User className="w-3.5 h-3.5" /> ડ્રાઇવર:</span>
                    <span className="font-medium text-white">{veh.driverName || 'નિર્ધારિત નથી'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400"><Phone className="w-3.5 h-3.5" /> ફોન:</span>
                    <span className="font-mono text-slate-300">{veh.driverPhone || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">ક્ષમતા (Capacity):</span>
                    <span className="font-semibold text-slate-200">{veh.capacityTons} ટન</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">ખાલી વજન (Tare Wt):</span>
                    <span className="font-semibold text-amber-400">
                      {veh.tareWeightKg ? `${veh.tareWeightKg.toLocaleString('en-IN')} KG` : `${((veh.emptyWeightTons || 0) * 1000).toLocaleString('en-IN')} KG`}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">ટ્રિપ</p>
                    <p className="text-sm font-bold text-white mt-0.5">{totalTrips}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">કુલ આવક</p>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">₹ {totalIncome.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400">નફો</p>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">₹ {netProfit.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-medium">● સક્રિય (Active)</span>
                <button
                  onClick={() => {
                    if (window.confirm(`શું તમે ગાડી ${veh.vehicleNumber} ડિલીટ કરવા માંગો છો?`)) {
                      onDeleteVehicle(veh.id);
                    }
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">નવી ગાડી ઉમેરો</h3>
              <button onClick={() => setShowModal(false)} className="p-1 bg-black/20 hover:bg-black/40 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">ગાડી નંબર (Vehicle Number)</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="દા.ત. GJ-01-BY-1234"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500 uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">ગાડીનો પ્રકાર (Vehicle Type)</label>
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="દા.ત. હાઇવા ડમ્પર, ટ્રક, JCB"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">ડ્રાઇવરનું નામ</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="ડ્રાઇવરનું નામ"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">ડ્રાઇવરનો મોબાઈલ નંબર</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="મોબાઈલ નંબર"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">માલિકી (Ownership)</label>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="સ્વયં">સ્વયં (Self)</option>
                  <option value="ભાડે">ભાડે (Rented)</option>
                  <option value="ફાઇનાન્સ">ફાઇનાન્સ (Finance)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">ક્ષમતા (Capacity Tons)</label>
                  <input
                    type="number"
                    value={capacityTons}
                    onChange={(e) => setCapacityTons(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">ખાલી વજન (Tare Wt KG)</label>
                  <input
                    type="number"
                    value={tareWeightKg}
                    onChange={(e) => setTareWeightKg(parseFloat(e.target.value) || 0)}
                    placeholder="દા.ત. 12500"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
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
