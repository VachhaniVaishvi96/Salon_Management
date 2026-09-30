import React from 'react';

function StatusBadge({ status }) {
  let badgeClasses = "";
  const normalized = (status || '').toLowerCase();

  switch (normalized) {
    case 'confirmed':
      badgeClasses = "bg-emerald-50 text-emerald-700 border border-emerald-200";
      break;
    case 'in progress':
    case 'inprogress':
      badgeClasses = "bg-blue-50 text-blue-700 border border-blue-200";
      break;
    case 'completed':
      badgeClasses = "bg-purple-50 text-purple-700 border border-purple-200";
      break;
    case 'cancelled':
    case 'canceled':
      badgeClasses = "bg-rose-50 text-rose-700 border border-rose-200";
      break;
    case 'pending':
    default:
      badgeClasses = "bg-amber-50 text-amber-700 border border-amber-200";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${badgeClasses}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
