import React, { useState } from 'react';
import { X, Plus, Trash2, Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { TripEntry, Vehicle, Party, UserProfile, RateRule } from '../types';

interface TripEntryModalProps {
  currentUser: UserProfile;
  vehicles: Vehicle[];
  parties: Party[];
  rateRules: RateRule[];
  existingTripsCount: number;
  onSave: (tripData: Omit<TripEntry, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const TripEntryModal: React.FC<TripEntryModalProps> = ({
  currentUser,
  vehicles,
  parties,
  rateRules,
  existingTripsCount,
  onSave,
  onClose,
}) => {
  const nextSlipNumber = `SBT-${String(existingTripsCount + 1).padStart(5, '0')}`;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const initialVeh = vehicles[0];
  const [vehicleId, setVehicleId] = useState(initialVeh?.id || '');
  const [partyId, setPartyId] = useState(parties[0]?.id || '');
  const [driverName, setDriverName] = useState(initialVeh?.driverName || '');
  const [grossWeightKg, setGrossWeightKg] = useState<number>(0);
  const [photos, setPhotos] = useState<string[]>([]);

  const selectedVeh = vehicles.find(v => v.id === vehicleId);
  const selectedParty = parties.find(p => p.id === partyId);

  const savedTareWeightKg = selectedVeh?.tareWeightKg || ((selectedVeh?.emptyWeightTons || 0) * 1000);
  const netWeightKg = Math.max(0, grossWeightKg - savedTareWeightKg);
  const totalTons = Number((netWeightKg / 1000).toFixed(3));

  // Automatic Rate Lookup
  const matchedRateRule = rateRules.find(
    r => selectedVeh && selectedParty && r.vehicleNumber === selectedVeh.vehicleNumber && r.partyName === selectedParty.name
  );
  const ratePerTon = matchedRateRule ? matchedRateRule.ratePerTon : 0;

  // Auto Calculations
  const totalAmount = Number(((totalTons || 0) * (ratePerTon || 0)).toFixed(2));

  const handleVehicleChange = (vId: string) => {
    setVehicleId(vId);
    const v = vehicles.find(item => item.id === vId);
    if (v) {
      setDriverName(v.driverName);
    }
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const url = URL.createObjectURL(files[0]);
      setPhotos([...photos, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVeh || !selectedParty) {
      alert('કૃપા કરીને માન્ય ગાડી અને પાર્ટી પસંદ કરો.');
      return;
    }

    if (!savedTareWeightKg || savedTareWeightKg <= 0) {
      alert('આ ગાડીનું ખાલી વજન સેવ નથી. કૃપા કરીને વ્હીકલ મેનેજમેન્ટમાં ખાલી વજન સેટ કરો.');
      return;
    }

    if (grossWeightKg <= savedTareWeightKg) {
      alert('ભરેલું વજન (Gross Weight) ખાલી વજન (Tare Weight) કરતા વધારે હોવું જોઈએ.');
      return;
    }

    if (!matchedRateRule) {
      alert('આ ગાડી અને પાર્ટી માટે રેટ સેટ કરેલો નથી. કૃપા કરીને એડમિન પેનલમાંથી રેટ સેટ કરો.');
      return;
    }

    onSave({
      slipNumber: nextSlipNumber,
      date,
      time,
      vehicleId: selectedVeh.id,
      vehicleNumber: selectedVeh.vehicleNumber,
      partyId: selectedParty.id,
      partyName: selectedParty.name,
      driverName: driverName || selectedVeh.driverName,
      totalTons,
      grossWeightKg,
      tareWeightKg: savedTareWeightKg,
      netWeightKg,
      ratePerTon,
      totalAmount,
      photos,
      operatorUsername: currentUser.username,
      status: 'પૂર્ણ',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-4 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-wide flex items-center gap-2">
              🚛 નવી ટ્રિપ એન્ટ્રી ફોર્મ
            </h2>
            <p className="text-amber-100 text-sm mt-1 font-semibold">સ્લિપ નંબર: <span className="font-mono font-bold">{nextSlipNumber}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-black/20 hover:bg-black/40 rounded-2xl transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Rate Warning Banner if not configured */}
          {!matchedRateRule && (
            <div className="bg-rose-500/15 border-2 border-rose-500/40 text-rose-300 p-4 rounded-2xl flex items-center gap-3 text-base font-bold">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <span>આ ગાડી અને પાર્ટી માટે રેટ સેટ કરેલો નથી.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-lg font-bold text-slate-200 mb-2">તારીખ (Date)</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-16 px-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-slate-100 text-xl font-bold focus:outline-none focus:border-orange-500 shadow-inner"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-lg font-bold text-slate-200 mb-2">સમય (Time)</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-16 px-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-slate-100 text-xl font-bold focus:outline-none focus:border-orange-500 shadow-inner"
                required
              />
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-lg font-bold text-slate-200 mb-2">ગાડી નંબર (Vehicle)</label>
              <select
                value={vehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full h-16 px-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-slate-100 text-xl font-bold focus:outline-none focus:border-orange-500 shadow-inner"
                required
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="text-lg font-bold py-2">
                    {v.vehicleNumber} ({v.vehicleType})
                  </option>
                ))}
              </select>
            </div>

            {/* Party Selection */}
            <div>
              <label className="block text-lg font-bold text-slate-200 mb-2">પાર્ટીનું નામ (Party)</label>
              <select
                value={partyId}
                onChange={(e) => setPartyId(e.target.value)}
                className="w-full h-16 px-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-slate-100 text-xl font-bold focus:outline-none focus:border-orange-500 shadow-inner"
                required
              >
                {parties.map((p) => (
                  <option key={p.id} value={p.id} className="text-lg font-bold py-2">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Driver Name */}
            <div>
              <label className="block text-lg font-bold text-slate-200 mb-2">ડ્રાઇવરનું નામ</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full h-16 px-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-slate-100 text-xl font-bold focus:outline-none focus:border-orange-500 shadow-inner"
                placeholder="ડ્રાઇવરનું નામ"
                required
              />
            </div>

            {/* Weighbridge Calculation Box */}
            <div className="sm:col-span-2 bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-orange-400 flex items-center gap-2">
                  ⚖️ વેબ્રિજ / ધર્મકાંટો વજન ગણતરી (KG)
                </h3>
                {(!savedTareWeightKg || savedTareWeightKg <= 0) && (
                  <span className="text-xs px-2.5 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg font-semibold animate-pulse">
                    ⚠️ આ ગાડીનું ખાલી વજન સેવ નથી.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">ભરેલું વજન (Gross Wt KG)</label>
                  <input
                    type="number"
                    step="1"
                    value={grossWeightKg || ''}
                    onChange={(e) => setGrossWeightKg(parseFloat(e.target.value) || 0)}
                    placeholder="દા.ત. 45000"
                    className="w-full h-14 px-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-lg font-bold focus:outline-none focus:border-orange-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">ખાલી વજન (Tare Wt KG - ઓટો)</label>
                  <input
                    type="number"
                    value={savedTareWeightKg || 0}
                    readOnly
                    className="w-full h-14 px-3 bg-slate-900 border border-slate-800 rounded-xl text-amber-400 text-lg font-mono font-bold focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-400 mb-1">ચોખ્ખું વજન = કુલ ટન (Net Wt)</label>
                  <div className="w-full h-14 px-3 bg-emerald-950/40 border-2 border-emerald-500/50 rounded-xl flex items-center justify-between text-emerald-400 font-black text-lg">
                    <span>{netWeightKg.toLocaleString('en-IN')} KG</span>
                    <span className="text-sm bg-emerald-500/20 px-2 py-1 rounded-lg">({totalTons} ટન)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rate Per Ton (Automatic & Readonly for operator) */}
            <div className="sm:col-span-2">
              <label className="block text-lg font-bold text-slate-200 mb-2">
                પ્રતિ ટન ભાવ (Automatic Rate per Ton)
              </label>
              <input
                type="number"
                value={ratePerTon}
                readOnly
                className="w-full h-16 px-4 bg-slate-950 border-2 border-slate-800 rounded-2xl text-amber-400 font-black text-2xl focus:outline-none cursor-not-allowed shadow-inner"
              />
              <p className="text-xs text-slate-400 mt-1.5 font-semibold">* ભાવ એડમિન રેટ સેટિંગ્સમાંથી આપમેળે આવે છે.</p>
            </div>
          </div>

          {/* Automatic Calculation Summary Box */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-center">
            <p className="text-base font-bold text-slate-400">કુલ ટ્રિપ રકમ (Total Amount)</p>
            <p className="text-3xl font-black text-emerald-400 mt-2">₹ {totalAmount.toLocaleString('en-IN')}</p>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-3 pt-2">
            <label className="block text-lg font-bold text-slate-200">ફોટા અપલોડ કરો (વેજન કાંટો, બિલ વગેરે)</label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUploadMock}
                className="block w-full text-sm text-slate-300 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-sm file:font-bold file:bg-slate-800 file:text-orange-400 hover:file:bg-slate-700 cursor-pointer border-2 border-slate-700 rounded-2xl p-2 bg-slate-950"
              />
            </div>

            {/* Photos Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden border-2 border-slate-700 h-24 bg-slate-800">
                    <img src={p} alt="Upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-90 hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-base font-bold transition-colors"
            >
              રદ કરો
            </button>
            <button
              type="submit"
              disabled={!matchedRateRule}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-lg font-black shadow-2xl transition-all flex items-center justify-center gap-3 ${
                matchedRateRule
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white cursor-pointer shadow-orange-600/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-6 h-6" /> ટ્રિપ સેવ કરો (Save Trip)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
