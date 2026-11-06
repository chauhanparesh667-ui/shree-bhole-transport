import React from 'react';
import { Shield, Clock, FileText, User } from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityLogViewProps {
  logs: ActivityLog[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🛡️ એક્ટિવિટી લોગ અને સુરક્ષા ઑડિટ (Activity History)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">યુઝર્સ દ્વારા કરવામાં આવેલી તમામ પ્રવૃત્તિઓનો રેકોર્ડ</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <th className="py-3 px-4">સમય</th>
                <th className="py-3 px-4">યુઝર</th>
                <th className="py-3 px-4">ક્રિયા</th>
                <th className="py-3 px-4">મોડ્યુલ</th>
                <th className="py-3 px-4">વિગત</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    કોઈ લોગ રેકોર્ડ ઉપલબ્ધ નથી.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">@{log.username}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{log.module}</td>
                    <td className="py-3 px-4 text-slate-300">{log.description}</td>
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
