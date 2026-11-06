import React, { useState } from 'react';
import { Users, Plus, X, Phone, MapPin, DollarSign, FileText, CheckCircle, Trash2 } from 'lucide-react';
import { Party, TripEntry, LedgerTransaction } from '../types';

interface PartyLedgerProps {
  parties: Party[];
  trips: TripEntry[];
  ledger: LedgerTransaction[];
  onAddParty: (party: Omit<Party, 'id' | 'currentBalance' | 'createdAt'>) => void;
  onAddPayment: (transaction: Omit<LedgerTransaction, 'id' | 'createdAt'>) => void;
  onDeleteParty?: (id: string) => void;
}

export const PartyLedger: React.FC<PartyLedgerProps> = ({
  parties,
  trips,
  ledger,
  onAddParty,
  onAddPayment,
  onDeleteParty,
}) => {
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string>(parties[0]?.id || '');
  
  // New Party Form
  const [partyName, setPartyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openingBalance, setOpeningBalance] = useState(0);

  // Payment Form
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleCreateParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim()) return;

    onAddParty({
      name: partyName.trim(),
      contactPerson,
      phone,
      address,
      openingBalance,
    });

    setPartyName('');
    setContactPerson('');
    setPhone('');
    setAddress('');
    setOpeningBalance(0);
    setShowAddPartyModal(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parties.find(item => item.id === selectedPartyId);
    if (!p) return;

    onAddPayment({
      partyId: p.id,
      partyName: p.name,
      date: paymentDate,
      type: 'જમા (Payment Received)',
      amount: paymentAmount,
      notes: paymentNotes || 'બેંક/રોકડ પેમેન્ટ મળ્યું',
    });

    setPaymentAmount(10000);
    setPaymentNotes('');
    setShowPaymentModal(false);
  };

  const activeParty = parties.find(p => p.id === selectedPartyId) || parties[0];
  const partyTrips = activeParty ? trips.filter(t => t.partyName === activeParty.name && t.status !== 'રદ કરેલ') : [];
  const partyTransactions = activeParty ? ledger.filter(l => l.partyId === activeParty.id) : [];

  // Calculate current balance
  const totalInvoiced = partyTrips.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalReceived = partyTransactions.filter(l => l.type.includes('જમા')).reduce((sum, l) => sum + l.amount, 0);
  const currentBalance = (activeParty?.openingBalance || 0) + totalInvoiced - totalReceived;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            👥 પાર્ટી લેજર અને હિસાબ (Party Ledger)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">પાર્ટીઓનું બિલ, જમા રકમ અને બાકી પેમેન્ટનું સંચાલન</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" /> પેમેન્ટ જમા કરો
          </button>
          <button
            onClick={() => setShowAddPartyModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> નવી પાર્ટી ઉમેરો
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parties List sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
          <h3 className="text-sm font-bold text-slate-200 px-2">પાર્ટીઓની યાદી</h3>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {parties.map((party) => (
              <button
                key={party.id}
                onClick={() => setSelectedPartyId(party.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  selectedPartyId === party.id
                    ? 'bg-orange-600/10 border-orange-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs text-white">{party.name}</div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>{party.contactPerson || party.phone}</span>
                  <span className="font-bold text-emerald-400">₹ {party.currentBalance.toLocaleString('en-IN')} બાકી</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Party Ledger Detail */}
        {activeParty ? (
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-white">{activeParty.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {activeParty.phone || 'નથી'}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeParty.address || 'સરનામું ઉપલબ્ધ નથી'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-right">
                    <p className="text-[11px] text-slate-400">કુલ બાકી રકમ (Balance)</p>
                    <p className="text-xl font-bold text-emerald-400 mt-0.5">₹ {currentBalance.toLocaleString('en-IN')}</p>
                  </div>
                  {onDeleteParty && (
                    <button
                      onClick={() => {
                        if (window.confirm(`શું તમે પાર્ટી "${activeParty.name}" ડિલીટ કરવા માંગો છો?`)) {
                          onDeleteParty(activeParty.id);
                        }
                      }}
                      title="પાર્ટી ડિલીટ કરો"
                      className="p-3 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Transactions & Trips Table */}
              <div className="mt-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ટ્રિપ અને પેમેન્ટ હિસાબ</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                        <th className="py-2.5 px-3">તારીખ</th>
                        <th className="py-2.5 px-3">વિગત / સ્લિપ</th>
                        <th className="py-2.5 px-3">પ્રકાર</th>
                        <th className="py-2.5 px-3 text-right">રકમ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {partyTrips.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 text-slate-300">{t.date}</td>
                          <td className="py-2.5 px-3 font-mono text-orange-400">ટ્રિપ સ્લિપ {t.slipNumber} ({t.vehicleNumber})</td>
                          <td className="py-2.5 px-3 text-slate-300">ઉધાર (બિલ)</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-400">+ ₹ {t.totalAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                      {partyTransactions.map((trx) => (
                        <tr key={trx.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 text-slate-300">{trx.date}</td>
                          <td className="py-2.5 px-3 text-slate-300">{trx.notes}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-semibold">{trx.type}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-blue-400">- ₹ {trx.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            કૃપા કરીને ડાબી બાજુથી કોઈ પાર્ટી પસંદ કરો.
          </div>
        )}
      </div>

      {/* Add Party Modal */}
      {showAddPartyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">નવી પાર્ટી ઉમેરો</h3>
              <button onClick={() => setShowAddPartyModal(false)} className="p-1 bg-black/20 hover:bg-black/40 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateParty} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">પાર્ટી/કંપનીનું નામ</label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="કંપનીનું નામ"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">સંપર્ક વ્યક્તિ (Contact Person)</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="વ્યક્તિનું નામ"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">મોબાઈલ નંબર</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="મોબાઈલ નંબર"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">સરનામું</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="સરનામું"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">શરૂઆતનું બેલેન્સ (Opening Balance)</label>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPartyModal(false)}
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

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">પાર્ટી પાસેથી પેમેન્ટ જમા કરો</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 bg-black/20 hover:bg-black/40 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">પાર્ટી પસંદ કરો</label>
                <select
                  value={selectedPartyId}
                  onChange={(e) => setSelectedPartyId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                >
                  {parties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">તારીખ</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">પેમેન્ટ રકમ (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">નોંધ / ચેક કે યુપીઆઈ નંબર</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="દા.ત. Google Pay / Cheque No."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow"
                >
                  જમા કરો (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
