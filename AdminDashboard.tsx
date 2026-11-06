import React from 'react';
import { Truck, DollarSign, TrendingUp, TrendingDown, Users, FileText, ArrowUpRight, ArrowDownRight, Clock, MapPin, Fuel } from 'lucide-react';
import { TripEntry, Vehicle, Party, Expense, DieselExpenseEntry, OtherExpenseEntry } from '../types';

interface AdminDashboardProps {
  trips: TripEntry[];
  vehicles: Vehicle[];
  parties: Party[];
  expenses: Expense[];
  dieselExpenses: DieselExpenseEntry[];
  otherExpenses: OtherExpenseEntry[];
  onNavigate: (tab: string) => void;
  onViewSlip: (trip: TripEntry) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  trips,
  vehicles,
  parties,
  expenses,
  dieselExpenses,
  otherExpenses,
  onNavigate,
  onViewSlip,
}) => {
  // Today's Date string (YYYY-MM-DD) or fallback to latest trip date for demo
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Calculate stats
  const totalTripsCount = trips.length;
  const activeVehiclesCount = vehicles.filter(v => v.isActive).length;
  const totalPartiesCount = parties.length;

  // Financial totals
  const totalIncome = trips.reduce((sum, t) => sum + (t.status !== 'રદ કરેલ' ? t.totalAmount : 0), 0);
  const totalDiesel = dieselExpenses.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalOther = otherExpenses.reduce((sum, o) => sum + o.amount, 0);
  const generalExpensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = totalDiesel + totalOther + generalExpensesTotal;
  const netProfit = totalIncome - totalExpense;

  // Total Tonnage
  const totalTons = trips.reduce((sum, t) => sum + (t.status !== 'રદ કરેલ' ? t.totalTons : 0), 0);

  // Pending Payments from parties
  const totalPendingPayments = parties.reduce((sum, p) => sum + p.currentBalance, 0);

  // Recent trips
  const recentTrips = [...trips].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              જય સ્વામિનારાયણ, એડમિન સાહેબ 🙏
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              શ્રી ભોળે ટ્રાન્સપોર્ટ બિઝનેસની આજની સ્થિતિ અને ઓલ-ટાઇમ અકાઉન્ટિંગ સમરી.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('trips')}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl text-xs transition-all shadow-lg shadow-orange-600/25 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> નવી ટ્રિપ એન્ટ્રી જુઓ
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" /> નફા-નુકસાન રિપોર્ટ
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">કુલ આવક (Total Income)</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">₹ {totalIncome.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{totalTripsCount}</span> કુલ ટ્રિપ્સમાંથી કમાણી
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">કુલ ખર્ચ (Total Expenses)</p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">₹ {totalExpense.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-400">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-rose-400 font-semibold">ડીઝલ, ટોલ અને મેન્ટેનન્સ</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">ચોખ્ખો નફો (Net Profit)</p>
              <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                ₹ {netProfit.toLocaleString('en-IN')}
              </h3>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            આવક - ખર્ચ બાદ કર્યા પછી
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">કુલ બાકી પેમેન્ટ (Pending)</p>
              <h3 className="text-2xl font-bold text-blue-400 mt-1">₹ {totalPendingPayments.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
            પાર્ટીઓ પાસેથી લેવાની બાકી રકમ
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">કુલ ટન વહન (Total Tonnage)</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalTons.toLocaleString('en-IN')} ટન</p>
          </div>
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">સક્રિય ગાડીઓ (Active Vehicles)</p>
            <p className="text-xl font-bold text-white mt-0.5">{activeVehiclesCount} / {vehicles.length}</p>
          </div>
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">કુલ નોંધાયેલ પાર્ટીઓ</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalPartiesCount} પાર્ટીઓ</p>
          </div>
          <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">તાજેતરની ટ્રિપ એન્ટ્રીઓ (Recent Trips)</h3>
            <p className="text-xs text-slate-400 mt-0.5">ઓપરેટરો દ્વારા દાખલ કરવામાં આવેલી તાજેતરની ટ્રિપ્સ</p>
          </div>
          <button
            onClick={() => onNavigate('trips')}
            className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
          >
            બધી જુઓ &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <th className="py-3 px-4">સ્લિપ નં.</th>
                <th className="py-3 px-4">તારીખ</th>
                <th className="py-3 px-4">ગાડી નંબર</th>
                <th className="py-3 px-4">પાર્ટીનું નામ</th>
                <th className="py-3 px-4">સ્થળ (થી → સુધી)</th>
                <th className="py-3 px-4 text-right">ટન</th>
                <th className="py-3 px-4 text-right">કુલ રકમ</th>
                <th className="py-3 px-4 text-right">ભાવ/ટન</th>
                <th className="py-3 px-4 text-center">ક્રિયા</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentTrips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    કોઈ ટ્રિપ એન્ટ્રી ઉપલબ્ધ નથી.
                  </td>
                </tr>
              ) : (
                recentTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-orange-400">{trip.slipNumber}</td>
                    <td className="py-3 px-4 text-slate-300">{trip.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{trip.vehicleNumber}</td>
                    <td className="py-3 px-4 text-slate-300">{trip.partyName}</td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {trip.driverName}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-200">{trip.totalTons} ટન</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">₹ {trip.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right text-amber-400">₹ {trip.ratePerTon}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewSlip(trip)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white rounded-lg transition-colors font-medium"
                      >
                        સ્લિપ જુઓ
                      </button>
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
