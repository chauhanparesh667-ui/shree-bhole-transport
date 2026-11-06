import React, { useState } from 'react';
import { Truck, Shield, User, Lock, KeyRound, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  operators: UserProfile[];
  onLogin: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ operators, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'operator'>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [selectedOperatorId, setSelectedOperatorId] = useState(operators.filter(o => o.role === 'operator')[0]?.username || 'operator1');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'admin') {
      if (username === 'admin' && (password === 'admin123' || password === '123456' || password === 'admin')) {
        const adminUser = operators.find(o => o.role === 'admin') || {
          uid: 'admin-1',
          username: 'admin',
          fullName: 'શ્રી ભોળે એડમિન (માલિક)',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString()
        };
        onLogin(adminUser);
      } else {
        setError('ખોટો યુઝરનેમ અથવા પાસવર્ડ! (ડિફોલ્ટ: admin / admin123)');
      }
    } else {
      const op = operators.find(o => o.username === selectedOperatorId);
      if (op) {
        onLogin(op);
      } else {
        setError('કૃપા કરીને માન્ય ઓપરેટર પસંદ કરો.');
      }
    }
  };

  const handleDemoLogin = (role: 'admin' | 'operator1' | 'operator2') => {
    if (role === 'admin') {
      const adminUser = operators.find(o => o.role === 'admin') || operators[0];
      onLogin(adminUser);
    } else if (role === 'operator1') {
      const op = operators.find(o => o.username === 'operator1') || operators[1];
      onLogin(op);
    } else {
      const op = operators.find(o => o.username === 'operator2') || operators[2];
      onLogin(op);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 text-center text-white relative">
          <div className="absolute top-4 right-4 bg-white/25 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            ગુજરાતી વર્ઝન 1.0
          </div>
          <div className="w-16 h-16 bg-white text-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-3">
            <Truck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">શ્રી ભોળે ટ્રાન્સપોર્ટ</h1>
          <p className="text-amber-100 text-sm mt-1">પ્રોફેશનલ ટ્રાન્સપોર્ટ બિઝનેસ અકાઉન્ટિંગ સિસ્ટમ</p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'admin'
                ? 'bg-slate-900 text-orange-400 border-b-2 border-orange-500 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" /> એડમિન લૉગિન (માલિક)
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('operator')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'operator'
                ? 'bg-slate-900 text-amber-400 border-b-2 border-amber-500 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> ઓપરેટર લૉગિન
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {selectedRole === 'admin' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">એડમિન યુઝરનેમ</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500 text-sm"
                    placeholder="યુઝરનેમ દાખલ કરો"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">પાસવર્ડ</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-orange-500 text-sm"
                    placeholder="પાસવર્ડ દાખલ કરો"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">ઓપરેટર પસંદ કરો</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </span>
                <select
                  value={selectedOperatorId}
                  onChange={(e) => setSelectedOperatorId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
                >
                  {operators
                    .filter((o) => o.role === 'operator')
                    .map((op) => (
                      <option key={op.username} value={op.username}>
                        {op.fullName} ({op.username})
                      </option>
                    ))}
                </select>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                * ઓપરેટર માત્ર નવી ટ્રિપ એન્ટ્રી અને પોતાના ફોટા અપલોડ કરી શકે છે.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            <Sparkles className="w-4 h-4" /> લૉગિન કરો (Login)
          </button>

          {/* Quick Demo Login Buttons */}
          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400 text-center mb-2">ઝડપી ટેસ્ટ લૉગિન (Quick Demo):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs rounded-lg font-medium border border-slate-700 text-center transition-colors"
              >
                એડમિન લૉગિન
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('operator1')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs rounded-lg font-medium border border-slate-700 text-center transition-colors"
              >
                રાકેશભાઈ (Op 1)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('operator2')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs rounded-lg font-medium border border-slate-700 text-center transition-colors"
              >
                જયેશભાઈ (Op 2)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
