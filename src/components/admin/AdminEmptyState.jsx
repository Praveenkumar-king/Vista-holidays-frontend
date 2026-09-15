import React from 'react';
import { Compass } from 'lucide-react';

export const AdminEmptyState = ({
  icon: Icon = Compass,
  title = 'No records found',
  description = 'There are no records matching your current criteria.',
  action = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#0c1222]/80 border border-slate-800/80 my-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default AdminEmptyState;
