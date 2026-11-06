import React, { useState } from 'react';
import { Users, Plus, X, Shield, User, CheckCircle, Ban, Trash2 } from 'lucide-react';
import { UserProfile } from '../types';

interface OperatorManagerProps {
  operators: UserProfile[];
  onAddOperator: (operator: Omit<UserProfile, 'uid' | 'createdAt'>) => void;
  onToggleStatus: (username: string) => void;
  onDeleteOperator: (username: string) => void;
}

export const OperatorManager: React.FC<OperatorManagerProps> = ({
  operators,
  onAddOperator,
  onToggleStatus,
  onDeleteOperator,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !fullName.trim()) return;

    onAddOperator({
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      role: 'operator',
      phone,
      isActive: true,
    });

    setUsername('');
    setFullName('');
    setPhone('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🧑‍💼 ઓપરેટર મેનેજમેન્ટ (Operator Management)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">ઓપરેટર યુઝરનેમ બનાવો અને પરવાનગી નિયંત્રિત કરો</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> નવો ઓપરેટર ઉમેરો
        </button>
      </div>

      {/* Operators List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {operators.map((op) => (
          <div key={op.username} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    op.role === 'admin' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {op.role === 'admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{op.fullName}</h3>
                    <p className="text-xs font-mono text-slate-400">@{op.username}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                  op.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {op.isActive ? 'સક્રિય' : 'બ્લોક કરેલ'}
                </span>
              </div>

              <div className="space-y-1.5 py-3 border-y border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ભૂમિકા (Role):</span>
                  <span className="font-semibold text-white">{op.role === 'admin' ? 'એડમિન (માલિક)' : 'ઓપરેટર'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">મોબાઈલ નંબર:</span>
                  <span className="font-mono text-slate-200">{op.phone || '-'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              {op.role !== 'admin' ? (
                <>
                  <button
                    onClick={() => onToggleStatus(op.username)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      op.isActive ? 'bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white' : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    {op.isActive ? 'બ્લોક કરો' : 'ચાલુ કરો'}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`શું તમે ઓપરેટર ${op.username} ને દૂર કરવા માંગો છો?`)) {
                        onDeleteOperator(op.username);
                      }
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <span className="text-[11px] text-slate-500 italic">મુખ્ય એડમિન અદલાબદલી થઈ શકે નહીં</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Operator Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">નવો ઓપરેટર ઉમેરો</h3>
              <button onClick={() => setShowModal(false)} className="p-1 bg-black/20 hover:bg-black/40 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">યુઝરનેમ (Username)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="દા.ત. ramesh_op"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">પૂરું નામ (Full Name)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ઓપરેટરનું પૂરું નામ"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-orange-500"
                  required
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
