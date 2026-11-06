import React, { useState } from 'react';
import { Search, Plus, Printer, Trash2, FileText, Calendar, Truck, User, MapPin } from 'lucide-react';
import { TripEntry, UserProfile } from '../types';

interface TripListProps {
  trips: TripEntry[];
  currentUser: UserProfile;
  onNewTrip: () => void;
  onDeleteTrip: (tripId: string) => void;
  onViewSlip: (trip: TripEntry) => void;
}

export const TripList: React.FC<TripListProps> = ({
  trips,
  currentUser,
  onNewTrip,
  onDeleteTrip,
  onViewSlip,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [partyFilter, setPartyFilter] = useState('');

  const isAdmin = currentUser.role === 'admin';

  // Filter trips
  const filteredTrips = trips.filter((t) => {
    // If operator, show only their trips or all? Operator prompt: "ઓપરેટર માત્ર પોતાની એન્ટ્રી કરી શકે. ઓપરેટર બીજા ઓપરેટરની એન્ટ્રી, નફો, પાર્ટી લેજર અથવા Admin Dashboard જોઈ ન શકે."
    // Let's ensure operator sees only their own trips or all if desired. Let's filter by operatorUsername if operator.
    if (!isAdmin && t.operatorUsername !== currentUser.username) {
      return false;
    }

    const matchesSearch =
      t.slipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.driverName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicle = vehicleFilter ? t.vehicleNumber === vehicleFilter : true;
    const matchesParty = partyFilter ? t.partyName === partyFilter : true;

    return matchesSearch && matchesVehicle && matchesParty;
  });

  const uniqueVehicles = Array.from(new Set(trips.map((t) => t.vehicleNumber)));
  const uniqueParties = Array.from(new Set(trips.map((t) => t.partyName)));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🚚 ટ્રિપ એન્ટ્રી મેનેજમેન્ટ
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isAdmin ? 'તમામ ટ્રિપ એન્ટ્રીઓ, બિલ અને નફાનો હિસાબ' : 'તમારી દ્વારા કરવામાં આવેલી ટ્રિપ એન્ટ્રીઓ'}
          </p>
        </div>
        <button
          onClick={onNewTrip}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> નવી ટ્રિપ એન્ટ્રી ઉમેરો
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="સ્લિપ નંબર, ગાડી કે પાર્ટી શોધો..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="">બધી ગાડીઓ (All Vehicles)</option>
            {uniqueVehicles.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={partyFilter}
            onChange={(e) => setPartyFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="">બધી પાર્ટીઓ (All Parties)</option>
            {uniqueParties.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <th className="py-3 px-4">સ્લિપ નં.</th>
                <th className="py-3 px-4">તારીખ/સમય</th>
                <th className="py-3 px-4">ગાડી નંબર</th>
                <th className="py-3 px-4">પાર્ટીનું નામ</th>
                <th className="py-3 px-4">માલ & લોકેશન</th>
                <th className="py-3 px-4 text-right">ટન / ભાવ</th>
                <th className="py-3 px-4 text-right">કુલ રકમ</th>
                <th className="py-3 px-4 text-center">ઓપરેટર</th>
                <th className="py-3 px-4 text-center">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    કોઈ ટ્રિપ એન્ટ્રી મળી નથી.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-orange-400">{trip.slipNumber}</td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{trip.date}</div>
                      <div className="text-[10px] text-slate-500">{trip.time}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{trip.vehicleNumber}</td>
                    <td className="py-3 px-4 text-slate-300">{trip.partyName}</td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {trip.driverName}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      <div>{trip.totalTons} ટન</div>
                      <div className="text-[10px] text-slate-500">₹{trip.ratePerTon}/ટન</div>
                    </td>

                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {trip.operatorUsername}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onViewSlip(trip)}
                          title="સ્લિપ પ્રિન્ટ / જુઓ"
                          className="p-1.5 bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              if (window.confirm(`શું તમે સ્લિપ નં ${trip.slipNumber} ડિલીટ કરવા માંગો છો?`)) {
                                onDeleteTrip(trip.id);
                              }
                            }}
                            title="ડિલીટ કરો"
                            className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
