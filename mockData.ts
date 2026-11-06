import { Vehicle, Party, TripEntry, Expense, UserProfile, ActivityLog, LedgerTransaction } from '../types';

export const INITIAL_OPERATORS: UserProfile[] = [
  {
    uid: 'admin-1',
    username: 'admin',
    fullName: 'શ્રી ભોળે એડમિન (માલિક)',
    role: 'admin',
    phone: '9876543210',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'op-1',
    username: 'operator1',
    fullName: 'રાકેશભાઈ પટેલ (ઓપરેટર 1)',
    role: 'operator',
    phone: '9825012345',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'op-2',
    username: 'operator2',
    fullName: 'જયેશભાઈ ઠાકોર (ઓપરેટર 2)',
    role: 'operator',
    phone: '9726098765',
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [];

export const INITIAL_PARTIES: Party[] = [];

export const INITIAL_TRIPS: TripEntry[] = [];

export const INITIAL_EXPENSES: Expense[] = [];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    action: 'ઉમેરો',
    module: 'સિસ્ટમ',
    description: 'શ્રી ભોળે ટ્રાન્સપોર્ટ સિસ્ટમ શરૂ કરવામાં આવી.',
    username: 'admin',
    timestamp: new Date().toISOString(),
  }
];

export const INITIAL_LEDGER: LedgerTransaction[] = [];
