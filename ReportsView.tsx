import React, { useState } from 'react';
import { FileText, Printer, Download, Calendar, Truck, Users, TrendingUp } from 'lucide-react';
import { TripEntry, Vehicle, Party, Expense, DieselExpenseEntry, OtherExpenseEntry } from '../types';

interface ReportsViewProps {
  trips: TripEntry[];
  vehicles: Vehicle[];
  parties: Party[];
  expenses: Expense[];
  dieselExpenses: DieselExpenseEntry[];
  otherExpenses: OtherExpenseEntry[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  trips,
  vehicles,
  parties,
  expenses,
  dieselExpenses,
  otherExpenses,
}) => {
  const [reportType, setReportType] = useState<'all' | 'vehicle' | 'party' | 'profit-loss'>('all');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Filtered trips
  const filteredTrips = trips.filter((t) => {
    if (t.status === 'રદ કરેલ') return false;
    if (selectedVehicle && t.vehicleNumber !== selectedVehicle) return false;
    if (selectedParty && t.partyName !== selectedParty) return false;
    if (t.date < startDate || t.date > endDate) return false;
    return true;
  });

  const totalIncome = filteredTrips.reduce((sum, t) => sum + t.totalAmount, 0);

  // Filtered expenses
  const filteredDiesel = dieselExpenses.filter(d => d.date >= startDate && d.date <= endDate && (selectedVehicle ? d.vehicleNumber === selectedVehicle : true));
  const filteredOther = otherExpenses.filter(o => o.date >= startDate && o.date <= endDate && (selectedVehicle ? o.vehicleNumber === selectedVehicle : true));
  const filteredGeneral = expenses.filter(e => e.date >= startDate && e.date <= endDate && (selectedVehicle ? e.vehicleNumber === selectedVehicle : true));

  const totalDiesel = filteredDiesel.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalOther = filteredOther.reduce((sum, o) => sum + o.amount, 0) + filteredGeneral.reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = totalDiesel + totalOther;
  const netProfit = totalIncome - totalExpense;
  const totalTons = filteredTrips.reduce((sum, t) => sum + t.totalTons, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['SlipNumber', 'Date', 'Vehicle', 'Party', 'Driver', 'Tons', 'Rate', 'Amount'];
    const rows = filteredTrips.map(t => [
      t.slipNumber,
      t.date,
      t.vehicleNumber,
      `"${t.partyName}"`,
      `"${t.driverName}"`,
      t.totalTons,
      t.ratePerTon,
      t.totalAmount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Shree_Bhole_Transport_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg print:hidden">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📊 બિઝનેસ રિપોર્ટ્સ (Reports & Analytics)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">ટ્રિપ આવક, ડીઝલ ખર્ચ, અન્ય ખર્ચ અને ચોખ્ખો નફો અલગથી જુઓ</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Excel (CSV)
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold transition-all shadow flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> પ્રિન્ટ (A4 Print)
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-4 gap-4 print:hidden">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">શરૂઆતની તારીખ</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">અંતિમ તારીખ</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">ગાડી મુજબ ફિલ્ટર</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="">બધી ગાડીઓ</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.vehicleNumber}>{v.vehicleNumber}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">પાર્ટી મુજબ ફિલ્ટર</label>
          <select
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
          >
            <option value="">બધી પાર્ટીઓ</option>
            {parties.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">કુલ ટ્રિપ આવક (Trip Income)</p>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">₹ {totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">કુલ ડીઝલ ખર્ચ (Diesel Exp)</p>
          <p className="text-xl font-bold text-rose-400 mt-0.5">₹ {totalDiesel.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">કુલ અન્ય ખર્ચ (Other Exp)</p>
          <p className="text-xl font-bold text-orange-400 mt-0.5">₹ {totalOther.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs text-slate-400">ચોખ્ખો નફો (Net Profit)</p>
          <p className={`text-xl font-bold mt-0.5 ${netProfit >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            ₹ {netProfit.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden print:bg-white print:text-black">
        <div className="p-5 border-b border-slate-800 hidden print:block text-center">
          <h2 className="text-2xl font-bold">શ્રી ભોળે ટ્રાન્સપોર્ટ - નફા-નુકસાન અને ટ્રિપ રિપોર્ટ</h2>
          <p className="text-sm text-gray-600">તારીખ: {startDate} થી {endDate}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 print:bg-gray-100 text-slate-400 print:text-black uppercase font-semibold border-b border-slate-800 print:border-gray-300">
                <th className="py-3 px-4">સ્લિપ નં.</th>
                <th className="py-3 px-4">તારીખ</th>
                <th className="py-3 px-4">ગાડી નંબર</th>
                <th className="py-3 px-4">પાર્ટીનું નામ</th>
                <th className="py-3 px-4">ડ્રાઇવર</th>
                <th className="py-3 px-4 text-right">ટન</th>
                <th className="py-3 px-4 text-right">આવક</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-200">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    આ સમયગાળા દરમિયાન કોઈ ડેટા ઉપલબ્ધ નથી.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono font-bold text-orange-400 print:text-black">{trip.slipNumber}</td>
                    <td className="py-3 px-4 text-slate-300 print:text-gray-800">{trip.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200 print:text-black">{trip.vehicleNumber}</td>
                    <td className="py-3 px-4 text-slate-300 print:text-gray-800">{trip.partyName}</td>
                    <td className="py-3 px-4 text-slate-300 print:text-gray-800">{trip.driverName}</td>
                    <td className="py-3 px-4 text-right text-slate-300 print:text-black">{trip.totalTons} ટન</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 print:text-black">₹ {trip.totalAmount.toLocaleString('en-IN')}</td>
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
