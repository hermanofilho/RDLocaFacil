
import React, { useEffect, useState } from 'react';
import { registrarLog } from '@/utils/log';
import { BadgeStatus } from '@/components/shared/BadgeStatus';
import { registrarLog } from '@/utils/log';
import { PageHeader } from '@/components/PageHeader';
import { registrarLog } from '@/utils/log';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { registrarLog } from '@/utils/log';
import { supabase } from '@/integrations/supabase/client';
import { registrarLog } from '@/utils/log';
import { format } from 'date-fns';
import { registrarLog } from '@/utils/log';
import { ptBR } from 'date-fns/locale';

export 
const [filtro, setFiltro] = useState('');
  const rentalsFiltrados = rentals.filter(rental => (rental.clients?.fullname + rental.motorcycles?.model).toLowerCase().includes(filtro.toLowerCase()));

  const formatarStatus = (status: string) => {
  const base = "text-xs font-semibold px-2 py-1 rounded";
  if (status === "Pendente") return <span className={base + " bg-yellow-200 text-yellow-800"}>Pendente</span>;
  if (status === "Atrasado") return <span className={base + " bg-red-200 text-red-800"}>Atrasado</span>;
  if (status === "Pago") return <span className={base + " bg-green-200 text-green-800"}>Pago</span>;
  if (status === "Realizada") return <span className={base + " bg-green-200 text-green-800"}>Realizada</span>;
  if (status === "Cancelada") return <span className={base + " bg-gray-200 text-gray-700"}>Cancelada</span>;
  return <span className={base + " bg-gray-100 text-gray-600"}>{status}</span>;
};


const RentalsListPage: React.FC = () => {

  const marcarComoPago = (id: string) => {
    setPagamentos((prev) => ({ ...prev, [id]: 'Pago' }));
  };


  const handleRenovar = async (locacao) => {
    const novaDataInicio = new Date();
    const novaDataFim = new Date(novaDataInicio);
    novaDataFim.setDate(novaDataInicio.getDate() + 7); // renova por 7 dias

    const novaLocacao = {
      locacao_original_id: locacao.id,
      client_id: locacao.clients?.id || locacao.client_id,
      motorcycle_id: locacao.motorcycles?.id || locacao.motorcycle_id,
      start_date: novaDataInicio.toISOString().split('T')[0],
      end_date: novaDataFim.toISOString().split('T')[0],
      price: locacao.price,
      status: 'Ativa',
    };

    const { error } = await supabase.from('rentals').insert([novaLocacao]);

    if (error) {
    registrarLog('', 'Renovação', 'Locação', `Renovou locação de cliente ${locacao.clients?.fullname}`);
      alert("Erro ao renovar locação.");
    } else {
      alert("Locação renovada com sucesso!");
      fetchRentals();
    }
  };

  
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const rentalsFiltrados = rentals.filter((r) => {
    const statusOk = !statusFiltro || pagamentos[r.id] === statusFiltro;
    const dataLoc = new Date(r.start_date);
    const inicioOk = !dataInicio || dataLoc >= new Date(dataInicio);
    const fimOk = !dataFim || dataLoc <= new Date(dataFim);
    return statusOk && inicioOk && fimOk;
  });


  const [rentals, setRentals] = useState<any[]>([]);
  const [pagamentos, setPagamentos] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        id,
        start_date,
        end_date,
        price,
        status,
        clients ( fullname ),
        motorcycles ( model )
      `)
      .order('start_date', { ascending: false });

    if (!error) {
      registrarLog('', 'Pagamento', 'Locação', `Marcou locação ${id} como paga`); {
      setRentals(data || []);
      const mapPagamentos = {};
      (data || []).forEach(r => {
        const vencida = r.status === 'Ativa' && new Date(r.end_date) < new Date();
        mapPagamentos[r.id] = vencida ? 'Atrasado' : 'Pendente';
      });
      setPagamentos(mapPagamentos);
    } else {
      console.error('Erro ao carregar locações:', error.message);
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Histórico de Locações" description="Veja todas as locações cadastradas." />
      <div className="mb-4 max-w-sm">
        <input type="text" placeholder="Buscar..." value={filtro} onChange={e => setFiltro(e.target.value)} className="border p-2 w-full rounded" />
      </div>

      
      <div className="flex flex-wrap gap-4 mb-4">
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border p-2 rounded" />
        <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} className="border p-2 rounded">
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Atrasado">Atrasado</option>
          <option value="Pago">Pago</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Moto</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Término</TableHead>
            <TableHead>Valor (R$)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentalsFiltrados.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell>{rental.clients?.fullname || '-'}</TableCell>
              <TableCell>{rental.motorcycles?.model || '-'}</TableCell>
              <TableCell>{rental.start_date ? format(new Date(rental.start_date), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
              <TableCell>{rental.end_date ? format(new Date(rental.end_date), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
              <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rental.price)}</TableCell>
              <TableCell><BadgeStatus status={rental.status} /></TableCell>
              <TableCell>
                {<BadgeStatus status={pagamentos[rental.id]} /> ?? (
                  <button onClick={() => marcarComoPago(rental.id)} className="text-blue-600 text-sm underline">
                    {pagamentos[rental.id] || 'Pendente'} (Marcar como pago)
                  </button>
                )}
              </TableCell>
              <TableCell>
                {rental.status === 'Ativa' && (
                  <button
                    onClick={() => handleRenovar(rental)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Renovar
                  </button>
                )}
</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
