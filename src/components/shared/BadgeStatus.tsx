
import React from 'react';

interface Props {
  status: string;
}

export const BadgeStatus: React.FC<Props> = ({ status }) => {
  const base = 'text-xs font-semibold px-2 py-1 rounded';
  const map: Record<string, string> = {
    Pendente: 'bg-yellow-200 text-yellow-800',
    Atrasado: 'bg-red-200 text-red-800',
    Pago: 'bg-green-200 text-green-800',
    Realizada: 'bg-green-200 text-green-800',
    Cancelada: 'bg-gray-200 text-gray-700',
  };

  return <span className={base + ' ' + (map[status] || 'bg-gray-100 text-gray-600')}>{status}</span>;
};
