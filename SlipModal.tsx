import React from 'react';
import { X, Printer, Truck, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { TripEntry } from '../types';

interface SlipModalProps {
  trip: TripEntry;
  onClose: () => void;
}

export const SlipModal: React.FC<SlipModalProps> = ({ trip, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8 print:my-0 print:shadow-none print:w-full">
        {/* Modal Toolbar (Hidden on print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <h3 className="text-base font-bold flex items-center gap-2">
            🖨️ ટ્રિપ સ્લિપ / બિલ ప్రింట్
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> પ્રિન્ટ કરો
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-8 space-y-6 print:p-6 bg-white">
          {/* Header */}
          <div className="text-center border-b-2 border-orange-600 pb-4">
            <h1 className="text-2xl font-black text-slate-900 tracking-wide">શ્રી ભોળે ટ્રાન્સપોર્ટ</h1>
            <p className="text-xs text-slate-600 mt-1">ઓલ ટ્રાન્સપોર્ટ એન્ડ મશીનરી સર્વિસ, હેવી વ્હીકલ ઓપરેટર</p>
            <p className="text-xs font-semibold text-orange-600 mt-1">મોબાઈલ: 9825012345, 9879112233</p>
          </div>

          {/* Slip Info */}
          <div className="flex justify-between items-center bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-semibold text-slate-500">સ્લિપ નંબર: </span>
              <span className="font-mono font-bold text-orange-600 text-sm">{trip.slipNumber}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">તારીખ: </span>
              <span className="font-medium text-slate-800">{trip.date} ({trip.time})</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p><span className="text-slate-500 font-medium">ગાડી નંબર:</span> <span className="font-bold text-slate-900">{trip.vehicleNumber}</span></p>
              <p><span className="text-slate-500 font-medium">ડ્રાઇવર:</span> <span className="text-slate-800">{trip.driverName}</span></p>
              <p><span className="text-slate-500 font-medium">પાર્ટીનું નામ:</span> <span className="font-bold text-slate-900">{trip.partyName}</span></p>
            </div>
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p><span className="text-slate-500 font-medium">સર્વિસ:</span> <span className="font-bold text-slate-900">ટ્રાન્સપોર્ટ સર્વિસ</span></p>
            </div>
          </div>

          {/* Tonnage & Rate Calculation */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                  <th className="py-2.5 px-3">વિવરણ (Description)</th>
                  <th className="py-2.5 px-3 text-right">ટન / જથ્થો</th>
                  <th className="py-2.5 px-3 text-right">ભાવ (Rate)</th>
                  <th className="py-2.5 px-3 text-right">કુલ રકમ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3 px-3 font-medium text-slate-800">ટ્રાન્સપોર્ટેશન ભાડું</td>
                  <td className="py-3 px-3 text-right">{trip.totalTons} ટન</td>
                  <td className="py-3 px-3 text-right">₹ {trip.ratePerTon}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">₹ {trip.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Expenses */}
          <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-200 text-sm">
            <div>
              <p className="text-xs text-orange-800 font-medium">ઓપરેટર: @{trip.operatorUsername}</p>
              <p className="text-xs text-orange-800 font-medium mt-0.5">સ્ટેટસ: {trip.status}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600">કુલ બિલ રકમ</p>
              <p className="text-xl font-black text-orange-600">₹ {trip.totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Photos if any */}
          {trip.photos && trip.photos.length > 0 && (
            <div className="space-y-2 print:hidden">
              <p className="text-xs font-semibold text-slate-600">સંબંધિત ફોટાઓ:</p>
              <div className="flex gap-2 overflow-x-auto">
                {trip.photos.map((p, idx) => (
                  <img key={idx} src={p} alt="Trip Photo" className="w-20 h-20 object-cover rounded-xl border border-slate-300" />
                ))}
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end text-xs text-slate-600">
            <div className="text-center">
              <div className="h-10 border-b border-slate-400 w-36 mb-1" />
              <p className="font-medium">ડ્રાઇવરની સહી</p>
            </div>
            <div className="text-center">
              <div className="h-10 border-b border-slate-400 w-36 mb-1" />
              <p className="font-medium">શ્રી ભોળે ટ્રાન્સપોર્ટ સહી</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
