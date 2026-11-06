export type UserRole = 'admin' | 'operator';

export interface UserProfile {
  uid: string;
  username: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;       // e.g. GJ-01-BY-5432
  vehicleType: string;         // e.g. ડમ્પર (Dumper), હાઇવા (Hiwa), ટ્રક (Truck)
  driverName: string;
  driverPhone: string;
  ownership: 'સ્વયં' | 'ભાડે' | 'ફાઇનાન્સ'; // Self / Rented / Finance
  capacityTons: number;
  emptyWeightTons?: number;    // ખાલી વજન (Tare Weight in tons)
  tareWeightKg?: number;       // ખાલી વજન (Tare Weight in KG)
  isActive: boolean;
  createdAt: string;
}

export interface Party {
  id: string;
  name: string;                // e.g. શ્રી ગણેશ કન્સ્ટ્રક્શન
  contactPerson: string;
  phone: string;
  address: string;
  openingBalance: number;      // +ve means receivable (ઉધાર), -ve means advance (જમા)
  currentBalance: number;
  createdAt: string;
}

export interface RateRule {
  id: string;
  vehicleNumber: string;
  partyName: string;
  ratePerTon: number;
  createdAt: string;
}

export interface TripEntry {
  id: string;
  slipNumber: string;          // e.g. SBT-00001
  date: string;                // YYYY-MM-DD
  time: string;                // HH:MM
  vehicleId: string;
  vehicleNumber: string;
  partyId: string;
  partyName: string;
  driverName: string;
  totalTons: number;           // કુલ ટન
  grossWeightKg?: number;      // ભરેલું વજન (KG)
  tareWeightKg?: number;       // ખાલી વજન (KG)
  netWeightKg?: number;        // ચોખ્ખું વજન (KG)
  ratePerTon: number;          // પ્રતિ ટન ભાવ
  totalAmount: number;         // કુલ રકમ = કુલ ટન × પ્રતિ ટન ભાવ
  photos: string[];            // ફોટાઓની યાદી (Base64 અથવા URLs)
  pdfBillUrl?: string;         // PDF બિલ
  operatorUsername: string;    // કયા ઓપરેટરે એન્ટ્રી કરી
  status: 'સક્રિય' | 'રદ કરેલ' | 'પૂર્ણ';
  createdAt: string;
}

export interface DieselExpenseEntry {
  id: string;
  date: string;
  vehicleId: string;
  vehicleNumber: string;
  liters: number;
  ratePerLiter: number;
  totalAmount: number;
  description: string;
  billPhoto?: string;
  operatorUsername: string;
  createdAt: string;
}

export interface OtherExpenseEntry {
  id: string;
  date: string;
  vehicleId?: string;
  vehicleNumber?: string;
  expenseName: string;
  amount: number;
  description: string;
  billPhoto?: string;
  operatorUsername: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'ડીઝલ' | 'મેન્ટેનન્સ' | 'ડ્રાઇવર પગાર' | 'JCB ખર્ચ' | 'HITACHI ખર્ચ' | 'SANY HITACHI ખર્ચ' | 'અન્ય ખર્ચ';
  amount: number;
  vehicleId?: string;
  vehicleNumber?: string;
  description: string;
  addedBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: 'ઉમેરો' | 'સુધારો' | 'ડિલીટ' | 'લોગિન';
  module: string;              // મોડ્યુલનું નામ (ટ્રિપ, ગાડી, પાર્ટી, વગેરે)
  description: string;         // વિગતવાર માહિતી
  username: string;
  timestamp: string;
}

export interface LedgerTransaction {
  id: string;
  partyId: string;
  partyName: string;
  date: string;
  type: 'જમા (Payment Received)' | 'ઉધાર (Trip Invoice)' | 'ચૂકવણી (Payment Given)';
  amount: number;
  referenceSlip?: string;
  notes: string;
  createdAt: string;
}
