import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatarMoeda } from '@/utils/format';

type Pagamento = {
  id: string;
  locacao_id: string;
  valor: number;
  data: string;
  forma: string;
  observacao?: string;
};

export const PagamentosPage: React.FC = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([
    {
      id: '1',
      locacao_id: 'LOC123',
      valor: 270,
      data: '2025-05-01',
      forma: 'PIX',
      observacao: '1ª parcela semanal'
    },
    {
      id: '2',
      locacao_id: 'LOC124',
      valor: 540,
      data: '2025-05-03',
      forma: 'Cartão',
      observacao: '2 semanas pagas adiantado'
    },
  ]);

  return (
    <div className="p-6">
      <PageHeader title="Pagamentos Recebidos" description="Controle de entradas por locação." />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Locação</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Forma</TableHead>
            <TableHead>Observação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.locacao_id}</TableCell>
              <TableCell>{formatarMoeda(p.valor)}</TableCell>
              <TableCell>{new Date(p.data).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{p.forma}</TableCell>
              <TableCell>{p.observacao || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};