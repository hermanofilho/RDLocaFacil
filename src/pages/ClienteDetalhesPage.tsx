import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { formatarMoeda } from '@/utils/format';

export const ClienteDetalhesPage: React.FC = () => {
  const cliente = {
    id: 'cli-001',
    nome: 'João Silva',
    cpf: '123.456.789-00',
    telefone: '(83) 99999-0000',
  };

  const locacoes = [
    { id: 'loc-1', status: 'Ativa', inicio: '2025-05-01', fim: '2025-05-08' },
    { id: 'loc-2', status: 'Finalizada', inicio: '2025-04-15', fim: '2025-04-22' },
  ];

  const pagamentos = [
    { id: 'pgt-1', valor: 270, data: '2025-05-01', forma: 'PIX' },
    { id: 'pgt-2', valor: 540, data: '2025-04-15', forma: 'Dinheiro' },
  ];

  const multas = [
    { id: 'm-1', tipo: 'Estacionamento', valor: 88.5, data: '2025-04-20' },
  ];

  const vistorias = [
    { id: 'v-1', data: '2025-05-03', status: 'Realizada' },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader title={`Cliente: ${cliente.nome}`} description={`CPF: ${cliente.cpf} | Telefone: ${cliente.telefone}`} />

      <div>
        <h3 className="font-semibold text-lg mb-2">Locações</h3>
        <ul className="list-disc ml-5 space-y-1">
          {locacoes.map(loc => (
            <li key={loc.id}>{loc.status} — {new Date(loc.inicio).toLocaleDateString('pt-BR')} até {new Date(loc.fim).toLocaleDateString('pt-BR')}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Pagamentos</h3>
        <ul className="list-disc ml-5 space-y-1">
          {pagamentos.map(p => (
            <li key={p.id}>{formatarMoeda(p.valor)} em {new Date(p.data).toLocaleDateString('pt-BR')} via {p.forma}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Multas</h3>
        <ul className="list-disc ml-5 space-y-1">
          {multas.map(m => (
            <li key={m.id}>{m.tipo} — {formatarMoeda(m.valor)} em {new Date(m.data).toLocaleDateString('pt-BR')}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Vistorias</h3>
        <ul className="list-disc ml-5 space-y-1">
          {vistorias.map(v => (
            <li key={v.id}>{new Date(v.data).toLocaleDateString('pt-BR')} — {v.status}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};