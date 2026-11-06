import React, { useState, useEffect } from 'react';
import { UserProfile, Vehicle, Party, TripEntry, Expense, ActivityLog, LedgerTransaction, RateRule, DieselExpenseEntry, OtherExpenseEntry } from './types';
import { INITIAL_OPERATORS, INITIAL_VEHICLES, INITIAL_PARTIES, INITIAL_TRIPS, INITIAL_EXPENSES, INITIAL_ACTIVITIES, INITIAL_LEDGER } from './data/mockData';
import { LoginModal } from './components/LoginModal';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { TripList } from './components/TripList';
import { TripEntryModal } from './components/TripEntryModal';
import { VehicleManager } from './components/VehicleManager';
import { PartyLedger } from './components/PartyLedger';
import { ExpenseManager } from './components/ExpenseManager';
import { OperatorManager } from './components/OperatorManager';
import { ReportsView } from './components/ReportsView';
import { ActivityLogView } from './components/ActivityLogView';
import { SlipModal } from './components/SlipModal';
import { RateManager } from './components/RateManager';
import { DieselExpenseManager } from './components/DieselExpenseManager';
import { OtherExpenseManager } from './components/OtherExpenseManager';
import { Truck, Plus, FileText, Sparkles } from 'lucide-react';
import { fetchCollection, saveToFirestore, removeFromFirestore, batchSaveToFirestore } from './services/firestoreSync';
import { playSuccessBeep } from './utils/audio';

export default function App() {
  // Load state from localStorage or initial mock data
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sbt_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Check version to clear old demo data once
  useEffect(() => {
    const isClean = localStorage.getItem('sbt_clean_v3');
    if (!isClean) {
      localStorage.removeItem('sbt_vehicles');
      localStorage.removeItem('sbt_parties');
      localStorage.removeItem('sbt_trips');
      localStorage.removeItem('sbt_expenses');
      localStorage.removeItem('sbt_ledger');
      localStorage.setItem('sbt_clean_v3', 'true');
      setVehicles([]);
      setParties([]);
      setTrips([]);
      setExpenses([]);
      setLedger([]);
    }
  }, []);

  const [operators, setOperators] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('sbt_operators');
    return saved ? JSON.parse(saved) : INITIAL_OPERATORS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('sbt_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem('sbt_parties');
    return saved ? JSON.parse(saved) : INITIAL_PARTIES;
  });

  const [trips, setTrips] = useState<TripEntry[]>(() => {
    const saved = localStorage.getItem('sbt_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('sbt_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('sbt_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [ledger, setLedger] = useState<LedgerTransaction[]>(() => {
    const saved = localStorage.getItem('sbt_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER;
  });

  const [rateRules, setRateRules] = useState<RateRule[]>(() => {
    const saved = localStorage.getItem('sbt_rate_rules');
    return saved ? JSON.parse(saved) : [];
  });

  const [dieselExpenses, setDieselExpenses] = useState<DieselExpenseEntry[]>(() => {
    const saved = localStorage.getItem('sbt_diesel_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [otherExpenses, setOtherExpenses] = useState<OtherExpenseEntry[]>(() => {
    const saved = localStorage.getItem('sbt_other_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedTripForSlip, setSelectedTripForSlip] = useState<TripEntry | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sbt_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sbt_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sbt_operators', JSON.stringify(operators));
    localStorage.setItem('sbt_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('sbt_parties', JSON.stringify(parties));
    localStorage.setItem('sbt_trips', JSON.stringify(trips));
    localStorage.setItem('sbt_expenses', JSON.stringify(expenses));
    localStorage.setItem('sbt_logs', JSON.stringify(activityLogs));
    localStorage.setItem('sbt_ledger', JSON.stringify(ledger));
    localStorage.setItem('sbt_rate_rules', JSON.stringify(rateRules));
    localStorage.setItem('sbt_diesel_expenses', JSON.stringify(dieselExpenses));
    localStorage.setItem('sbt_other_expenses', JSON.stringify(otherExpenses));
  }, [operators, vehicles, parties, trips, expenses, activityLogs, ledger, rateRules, dieselExpenses, otherExpenses]);

  // Load data from Firestore cloud database on mount
  useEffect(() => {
    async function loadFromCloud() {
      const cloudOperators = await fetchCollection<UserProfile>('operators');
      const cloudVehicles = await fetchCollection<Vehicle>('vehicles');
      const cloudParties = await fetchCollection<Party>('parties');
      const cloudTrips = await fetchCollection<TripEntry>('trips');
      const cloudExpenses = await fetchCollection<Expense>('expenses');
      const cloudLogs = await fetchCollection<ActivityLog>('activityLogs');
      const cloudLedger = await fetchCollection<LedgerTransaction>('ledger');
      const cloudRateRules = await fetchCollection<RateRule>('rateRules');
      const cloudDiesel = await fetchCollection<DieselExpenseEntry>('dieselExpenses');
      const cloudOther = await fetchCollection<OtherExpenseEntry>('otherExpenses');

      if (cloudOperators && cloudOperators.length > 0) setOperators(cloudOperators);
      else batchSaveToFirestore('operators', operators);

      if (cloudVehicles && cloudVehicles.length > 0) setVehicles(cloudVehicles);
      else batchSaveToFirestore('vehicles', vehicles);

      if (cloudParties && cloudParties.length > 0) setParties(cloudParties);
      else batchSaveToFirestore('parties', parties);

      if (cloudTrips && cloudTrips.length > 0) setTrips(cloudTrips);
      else batchSaveToFirestore('trips', trips);

      if (cloudExpenses && cloudExpenses.length > 0) setExpenses(cloudExpenses);
      else batchSaveToFirestore('expenses', expenses);

      if (cloudLogs && cloudLogs.length > 0) setActivityLogs(cloudLogs);
      else batchSaveToFirestore('activityLogs', activityLogs);

      if (cloudLedger && cloudLedger.length > 0) setLedger(cloudLedger);
      else batchSaveToFirestore('ledger', ledger);

      if (cloudRateRules && cloudRateRules.length > 0) setRateRules(cloudRateRules);
      else batchSaveToFirestore('rateRules', rateRules);

      if (cloudDiesel && cloudDiesel.length > 0) setDieselExpenses(cloudDiesel);
      else batchSaveToFirestore('dieselExpenses', dieselExpenses);

      if (cloudOther && cloudOther.length > 0) setOtherExpenses(cloudOther);
      else batchSaveToFirestore('otherExpenses', otherExpenses);
    }

    loadFromCloud();
  }, []);

  // Log activity helper
  const logActivity = (action: ActivityLog['action'], module: string, description: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      action,
      module,
      description,
      username: currentUser?.username || 'system',
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Handlers
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('operator-portal');
    }
    logActivity('લોગિન', 'સુરક્ષા', `યુઝર ${user.fullName} (@${user.username}) દ્વારા લૉગિન કરવામાં આવ્યું.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleBackup = () => {
    const backupData = {
      operators,
      vehicles,
      parties,
      trips,
      expenses,
      activityLogs,
      ledger,
      rateRules,
      dieselExpenses,
      otherExpenses,
      backupDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Shree_Bhole_Transport_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity('ઉમેરો', 'બેકઅપ', 'સિસ્ટમ બેકઅપ ડાઉનલોડ કરવામાં આવ્યો.');
  };

  // Save Trip Entry
  const handleSaveTrip = (tripData: Omit<TripEntry, 'id' | 'createdAt'>) => {
    const newTrip: TripEntry = {
      ...tripData,
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTrips(prev => [newTrip, ...prev]);
    saveToFirestore('trips', newTrip);

    // Update Party current balance & ledger
    setParties(prev => prev.map(p => {
      if (p.id === tripData.partyId) {
        const updated = { ...p, currentBalance: p.currentBalance + tripData.totalAmount };
        saveToFirestore('parties', updated);
        return updated;
      }
      return p;
    }));

    const newLedgerTrx: LedgerTransaction = {
      id: `led-${Date.now()}`,
      partyId: tripData.partyId,
      partyName: tripData.partyName,
      date: tripData.date,
      type: 'ઉધાર (Trip Invoice)',
      amount: tripData.totalAmount,
      referenceSlip: tripData.slipNumber,
      notes: `ટ્રિપ સ્લિપ ${tripData.slipNumber} (${tripData.vehicleNumber})`,
      createdAt: new Date().toISOString(),
    };
    setLedger(prev => [newLedgerTrx, ...prev]);
    saveToFirestore('ledger', newLedgerTrx);

    logActivity('ઉમેરો', 'ટ્રિપ', `નવી ટ્રિપ એન્ટ્રી ${newTrip.slipNumber} ઉમેરી (₹${newTrip.totalAmount})`);
    playSuccessBeep();
    setShowTripModal(false);
    setSelectedTripForSlip(newTrip);
  };

  const handleDeleteTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    setTrips(prev => prev.filter(t => t.id !== tripId));
    removeFromFirestore('trips', tripId);
    logActivity('ડિલીટ', 'ટ્રિપ', `ટ્રિપ એન્ટ્રી ${trip.slipNumber} ડિલીટ કરવામાં આવી.`);
  };

  // Vehicle Handlers
  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVeh: Vehicle = {
      ...vehicleData,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setVehicles(prev => [...prev, newVeh]);
    saveToFirestore('vehicles', newVeh);
    logActivity('ઉમેરો', 'ગાડી', `નવી ગાડી ${newVeh.vehicleNumber} ઉમેરી.`);
    playSuccessBeep();
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    removeFromFirestore('vehicles', id);
    logActivity('ડિલીટ', 'ગાડી', 'ગાડી રદ કરવામાં આવી.');
  };

  // Party Handlers
  const handleAddParty = (partyData: Omit<Party, 'id' | 'currentBalance' | 'createdAt'>) => {
    const newParty: Party = {
      ...partyData,
      id: `pty-${Date.now()}`,
      currentBalance: partyData.openingBalance,
      createdAt: new Date().toISOString(),
    };
    setParties(prev => [...prev, newParty]);
    saveToFirestore('parties', newParty);
    logActivity('ઉમેરો', 'પાર્ટી', `નવી પાર્ટી ${newParty.name} ઉમેરી.`);
    playSuccessBeep();
  };

  const handleDeleteParty = (id: string) => {
    const partyToDelete = parties.find(p => p.id === id);
    setParties(prev => prev.filter(p => p.id !== id));
    removeFromFirestore('parties', id);
    ledger.filter(l => l.partyId === id).forEach(l => removeFromFirestore('ledger', l.id));
    setLedger(prev => prev.filter(l => l.partyId !== id));
    logActivity('ડિલીટ', 'પાર્ટી', `પાર્ટી ${partyToDelete?.name || id} ડિલીટ કરી.`);
  };

  const handleAddPayment = (trxData: Omit<LedgerTransaction, 'id' | 'createdAt'>) => {
    const newTrx: LedgerTransaction = {
      ...trxData,
      id: `led-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLedger(prev => [newTrx, ...prev]);
    saveToFirestore('ledger', newTrx);

    // Update party balance (subtract payment)
    setParties(prev => prev.map(p => {
      if (p.id === trxData.partyId) {
        const updated = { ...p, currentBalance: p.currentBalance - trxData.amount };
        saveToFirestore('parties', updated);
        return updated;
      }
      return p;
    }));

    logActivity('ઉમેરો', 'લેજર', `પાર્ટી ${trxData.partyName} પાસેથી રૂ. ${trxData.amount} પેમેન્ટ જમા મળ્યું.`);
    playSuccessBeep();
  };

  // Expense Handlers
  const handleAddExpense = (expData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [newExp, ...prev]);
    saveToFirestore('expenses', newExp);
    logActivity('ઉમેરો', 'ખર્ચ', `${newExp.category} ખર્ચ રૂ. ${newExp.amount} ઉમેર્યો.`);
    playSuccessBeep();
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    removeFromFirestore('expenses', id);
    logActivity('ડિલીટ', 'ખર્ચ', 'ખર્ચ ડિલીટ કરવામાં આવ્યો.');
  };

  // Rate Rule Handlers
  const handleAddRateRule = (ruleData: Omit<RateRule, 'id' | 'createdAt'>) => {
    const newRule: RateRule = {
      ...ruleData,
      id: `rate-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRateRules(prev => [...prev, newRule]);
    saveToFirestore('rateRules', newRule);
    logActivity('ઉમેરો', 'ભાવ સેટિંગ', `ગાડી ${newRule.vehicleNumber} અને પાર્ટી ${newRule.partyName} માટે રેટ ₹${newRule.ratePerTon} સેટ કર્યો.`);
    playSuccessBeep();
  };

  const handleDeleteRateRule = (id: string) => {
    setRateRules(prev => prev.filter(r => r.id !== id));
    removeFromFirestore('rateRules', id);
    logActivity('ડિલીટ', 'ભાવ સેટિંગ', 'ભાવ નિયમ ડિલીટ કર્યો.');
  };

  // Diesel Expense Handlers
  const handleAddDiesel = (entryData: Omit<DieselExpenseEntry, 'id' | 'createdAt'>) => {
    const newEntry: DieselExpenseEntry = {
      ...entryData,
      id: `diesel-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDieselExpenses(prev => [newEntry, ...prev]);
    saveToFirestore('dieselExpenses', newEntry);
    logActivity('ઉમેરો', 'ડીઝલ ખર્ચ', `ગાડી ${newEntry.vehicleNumber} માટે રૂ. ${newEntry.totalAmount} ડીઝલ ખર્ચ ઉમેર્યો.`);
    playSuccessBeep();
  };

  const handleDeleteDiesel = (id: string) => {
    setDieselExpenses(prev => prev.filter(d => d.id !== id));
    removeFromFirestore('dieselExpenses', id);
    logActivity('ડિલીટ', 'ડીઝલ ખર્ચ', 'ડીઝલ એન્ટ્રી ડિલીટ કરી.');
  };

  // Other Expense Handlers
  const handleAddOther = (entryData: Omit<OtherExpenseEntry, 'id' | 'createdAt'>) => {
    const newEntry: OtherExpenseEntry = {
      ...entryData,
      id: `other-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOtherExpenses(prev => [newEntry, ...prev]);
    saveToFirestore('otherExpenses', newEntry);
    logActivity('ઉમેરો', 'અન્ય ખર્ચ', `અન્ય ખર્ચ ${newEntry.expenseName} (રૂ. ${newEntry.amount}) ઉમેર્યો.`);
    playSuccessBeep();
  };

  const handleDeleteOther = (id: string) => {
    setOtherExpenses(prev => prev.filter(o => o.id !== id));
    removeFromFirestore('otherExpenses', id);
    logActivity('ડિલીટ', 'અન્ય ખર્ચ', 'અન્ય ખર્ચ એન્ટ્રી ડિલીટ કરી.');
  };

  // Operator Handlers
  const handleAddOperator = (opData: Omit<UserProfile, 'uid' | 'createdAt'>) => {
    const newOp: UserProfile = {
      ...opData,
      uid: `op-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOperators(prev => [...prev, newOp]);
    saveToFirestore('operators', newOp);
    logActivity('ઉમેરો', 'ઓપરેટર', `નવો ઓપરેટર @${newOp.username} ઉમેર્યો.`);
    playSuccessBeep();
  };

  const handleToggleOperatorStatus = (username: string) => {
    setOperators(prev => prev.map(o => {
      if (o.username === username) {
        const updated = { ...o, isActive: !o.isActive };
        saveToFirestore('operators', updated);
        return updated;
      }
      return o;
    }));
  };

  const handleDeleteOperator = (username: string) => {
    setOperators(prev => prev.filter(o => o.username !== username));
    removeFromFirestore('operators', username);
    logActivity('ડિલીટ', 'ઓપરેટર', `ઓપરેટર @${username} દૂર કર્યો.`);
  };

  // If not logged in, show Login Modal
  if (!currentUser) {
    return <LoginModal operators={operators} onLogin={handleLogin} />;
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Noto_Sans_Gujarati',sans-serif]">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackup={handleBackup}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Operator Portal Quick Action Banner */}
        {!isAdmin && activeTab === 'operator-portal' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-6 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">જય સ્વામિનારાયણ, {currentUser.fullName} 🙏</h2>
                <p className="text-amber-100 text-sm mt-1">
                  અહીંથી તમે નવી ટ્રિપ એન્ટ્રી કરી શકો છો અને ફોટા અપલોડ કરી શકો છો.
                </p>
              </div>
              <button
                onClick={() => setShowTripModal(true)}
                className="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm"
              >
                <Plus className="w-5 h-5" /> નવી ટ્રિપ એન્ટ્રી કરો
              </button>
            </div>

            <TripList
              trips={trips}
              currentUser={currentUser}
              onNewTrip={() => setShowTripModal(true)}
              onDeleteTrip={handleDeleteTrip}
              onViewSlip={(trip) => setSelectedTripForSlip(trip)}
            />
          </div>
        )}

        {/* Admin Tabs */}
        {isAdmin && activeTab === 'dashboard' && (
          <AdminDashboard
            trips={trips}
            vehicles={vehicles}
            parties={parties}
            expenses={expenses}
            dieselExpenses={dieselExpenses}
            otherExpenses={otherExpenses}
            onNavigate={(tab) => setActiveTab(tab)}
            onViewSlip={(trip) => setSelectedTripForSlip(trip)}
          />
        )}

        {activeTab === 'trips' && (
          <TripList
            trips={trips}
            currentUser={currentUser}
            onNewTrip={() => setShowTripModal(true)}
            onDeleteTrip={handleDeleteTrip}
            onViewSlip={(trip) => setSelectedTripForSlip(trip)}
          />
        )}

        {isAdmin && activeTab === 'vehicles' && (
          <VehicleManager
            vehicles={vehicles}
            trips={trips}
            expenses={expenses}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )}

        {isAdmin && activeTab === 'parties' && (
          <PartyLedger
            parties={parties}
            trips={trips}
            ledger={ledger}
            onAddParty={handleAddParty}
            onAddPayment={handleAddPayment}
            onDeleteParty={handleDeleteParty}
          />
        )}

        {isAdmin && activeTab === 'rates' && (
          <RateManager
            rateRules={rateRules}
            vehicles={vehicles}
            parties={parties}
            onAddRateRule={handleAddRateRule}
            onDeleteRateRule={handleDeleteRateRule}
          />
        )}

        {activeTab === 'diesel-expenses' && (
          <DieselExpenseManager
            dieselExpenses={dieselExpenses}
            vehicles={vehicles}
            currentUser={currentUser}
            onAddDiesel={handleAddDiesel}
            onDeleteDiesel={handleDeleteDiesel}
          />
        )}

        {activeTab === 'other-expenses' && (
          <OtherExpenseManager
            otherExpenses={otherExpenses}
            vehicles={vehicles}
            currentUser={currentUser}
            onAddOther={handleAddOther}
            onDeleteOther={handleDeleteOther}
          />
        )}

        {isAdmin && activeTab === 'expenses' && (
          <ExpenseManager
            expenses={expenses}
            vehicles={vehicles}
            currentUser={currentUser}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {isAdmin && activeTab === 'reports' && (
          <ReportsView
            trips={trips}
            vehicles={vehicles}
            parties={parties}
            expenses={expenses}
            dieselExpenses={dieselExpenses}
            otherExpenses={otherExpenses}
          />
        )}

        {isAdmin && activeTab === 'operators' && (
          <OperatorManager
            operators={operators}
            onAddOperator={handleAddOperator}
            onToggleStatus={handleToggleOperatorStatus}
            onDeleteOperator={handleDeleteOperator}
          />
        )}

        {isAdmin && activeTab === 'activity' && (
          <ActivityLogView logs={activityLogs} />
        )}
      </main>

      {/* New Trip Entry Modal */}
      {showTripModal && (
        <TripEntryModal
          currentUser={currentUser}
          vehicles={vehicles}
          parties={parties}
          rateRules={rateRules}
          existingTripsCount={trips.length}
          onSave={handleSaveTrip}
          onClose={() => setShowTripModal(false)}
        />
      )}

      {/* Printable Slip Modal */}
      {selectedTripForSlip && (
        <SlipModal
          trip={selectedTripForSlip}
          onClose={() => setSelectedTripForSlip(null)}
        />
      )}
    </div>
  );
}
