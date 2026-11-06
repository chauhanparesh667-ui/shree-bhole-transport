import React from 'react';
import { Truck, Shield, User, LogOut, Download, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onBackup: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onBackup,
  activeTab,
  setActiveTab,
}) => {
  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                શ્રી ભોળે ટ્રાન્સપોર્ટ
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {isAdmin ? 'એડમિન પોર્ટલ' : 'ઓપરેટર પોર્ટલ'}
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">બિઝનેસ અકાઉન્ટિંગ & ટ્રિપ મેનેજમેન્ટ</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ડેશબોર્ડ
                </button>
                <button
                  onClick={() => setActiveTab('trips')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'trips'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ટ્રિપ એન્ટ્રી
                </button>
                <button
                  onClick={() => setActiveTab('vehicles')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'vehicles'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ગાડીઓ
                </button>
                <button
                  onClick={() => setActiveTab('parties')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'parties'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  પાર્ટી લેજર
                </button>
                <button
                  onClick={() => setActiveTab('rates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'rates'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ભાવ સેટિંગ્સ
                </button>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'expenses'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ખર્ચ
                </button>
                <button
                  onClick={() => setActiveTab('diesel-expenses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'diesel-expenses'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ડીઝલ ખર્ચ
                </button>
                <button
                  onClick={() => setActiveTab('other-expenses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'other-expenses'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  અન્ય ખર્ચ
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'reports'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  રિપોર્ટ્સ
                </button>
                <button
                  onClick={() => setActiveTab('operators')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'operators'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ઓપરેટર્સ
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'activity'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  લોગ્સ
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('operator-portal')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'operator-portal'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ટ્રિપ એન્ટ્રી પોર્ટલ
                </button>
                <button
                  onClick={() => setActiveTab('trips')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'trips'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  મારી ટ્રિપ્સ
                </button>
                <button
                  onClick={() => setActiveTab('diesel-expenses')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'diesel-expenses'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ડીઝલ ખર્ચ
                </button>
                <button
                  onClick={() => setActiveTab('other-expenses')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'other-expenses'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  અન્ય ખર્ચ
                </button>
              </>
            )}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              {isAdmin ? <Shield className="w-4 h-4 text-orange-400" /> : <User className="w-4 h-4 text-amber-400" />}
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-400">@{currentUser.username}</p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={onBackup}
                title="ડેટા બેકઅપ ડાઉનલોડ કરો"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center gap-1 text-xs font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">બેકઅપ</span>
              </button>
            )}

            <button
              onClick={onLogout}
              title="લૉગ આઉટ કરો"
              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl border border-red-500/30 transition-all flex items-center gap-1 text-xs font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">બહાર નીકળો</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex overflow-x-auto bg-slate-950 px-3 py-2 border-t border-slate-800 gap-1.5 no-scrollbar">
        {isAdmin ? (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              ડેશબોર્ડ
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'trips' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              ટ્રિપ
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'vehicles' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              ગાડીઓ
            </button>
            <button
              onClick={() => setActiveTab('parties')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'parties' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              પાર્ટી
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'rates' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              ભાવ
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'expenses' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              ખર્ચ
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'reports' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              રિપોર્ટ
            </button>
            <button
              onClick={() => setActiveTab('operators')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'operators' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              ઓપરેટર
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'activity' ? 'bg-orange-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              લોગ્સ
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('operator-portal')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'operator-portal' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              નવી ટ્રિપ એન્ટ્રી
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === 'trips' ? 'bg-amber-600 text-white' : 'text-slate-300 bg-slate-900'
              }`}
            >
              મારી ટ્રિપ્સ
            </button>
          </>
        )}
      </div>
    </header>
  );
};
