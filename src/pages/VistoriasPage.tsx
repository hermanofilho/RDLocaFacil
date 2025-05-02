
import React, { useState } from 'react';
import { BadgeStatus } from '@/components/shared/BadgeStatus';
import { PageHeader } from '@/components/PageHeader';
import { useEffect } from 'react';
import { getClients, getMotorcycles, getVistorias, salvarVistoria } from '@/integrations/firebase/firebaseService';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';

export 
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const vistoriasFiltradas = vistorias.filter((item) => {
    const statusOk = !statusFiltro || item.status === statusFiltro;
    const dataItem = new Date(item.data_vistoria);
    const inicioOk = !dataInicio || dataItem >= new Date(dataInicio);
    const fimOk = !dataFim || dataItem <= new Date(dataFim);
    return statusOk && inicioOk && fimOk;
  });

  const [filtro, setFiltro] = useState('');
  const vistoriasFiltradas = vistorias.filter(v => (v.cliente || '').toLowerCase().includes(filtro.toLowerCase()));

  const VistoriasPage: React.FC = () => {
  
  const [clientes, setClientes] = useState<any[]>([]);
  const [motos, setMotos] = useState<any[]>([]);
  const [nova, setNova] = useState({ client_id: '', motorcycle_id: '', data_vistoria: '' });

  useEffect(() => {
    getVistorias();
    carregarClientes();
    carregarMotos();
  }, []);

  const carregarClientes = async () => {
    const { data } = await getClients();
    setClientes(data || []);
  };

  const carregarMotos = async () => {
    const { data } = await getMotorcycles();
    setMotos(data || []);
  };

  const handleAgendarVistoria = async () => {
    if (!nova.client_id || !nova.motorcycle_id || !nova.data_vistoria) {
      alert("Preencha todos os campos!");
      return;
    }
    const { error } = await salvarVistoria({ ...nova, status: 'Pendente' });
    if (!error) {
      setNova({ client_id: '', motorcycle_id: '', data_vistoria: '' });
      getVistorias();
    } else {
      alert("Erro ao salvar vistoria.");
    }
  };

  const [vistorias, setVistorias] = useState<any[]>([]);

  useEffect(() => {
    getVistorias();
  }, []);

  const getVistorias = async () => {
    const { data } = await getVistorias();
    setVistorias(data || []);
  };
    {
      id: 1,
      cliente: 'João da Silva',
      moto: 'Honda CG 160',
      data: '2025-05-10',
      status: 'Pendente',
    },
    {
      id: 2,
      cliente: 'Maria Oliveira',
      moto: 'Yamaha Factor',
      data: '2025-05-08',
      status: 'Realizada',
    },
  ]);

  const marcarRealizada = async (id: string) => {
    await supabase.from('vistorias').update({ status: 'Realizada' }).eq('id', id);
    getVistorias();
  };
    setVistorias((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Realizada' } : v))
    );
  };

  const cancelarVistoria = async (id: string) => {
    await supabase.from('vistorias').update({ status: 'Cancelada' }).eq('id', id);
    getVistorias();
  };
    setVistorias((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Cancelada' } : v))
    );
  };

  return (
    <div className="p-6">
      <PageHeader title="Agenda de Vistorias" description="Controle de vistorias agendadas por cliente e moto." />
      
      <div className="bg-white border rounded p-4 mb-6 space-y-3 max-w-lg">
        <h3 className="font-semibold text-lg">Agendar nova vistoria</h3>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="cliente" class="text-sm font-medium">Cliente:</label>
          <select id="datadavistoria" id="moto" id="cliente" class="border p-2 rounded" value={nova.client_id} onChange={e => setNova({ ...nova, client_id: e.target.value })} className="w-full border p-2 rounded">
            <option value="">Selecione</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.fullname}</option>)}
          </select>
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="moto" class="text-sm font-medium">Moto:</label>
          <select class="border p-2 rounded" value={nova.motorcycle_id} onChange={e => setNova({ ...nova, motorcycle_id: e.target.value })} className="w-full border p-2 rounded">
            <option value="">Selecione</option>
            {motos.map(m => <option key={m.id} value={m.id}>{m.model}</option>)}
          </select>
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="datadavistoria" class="text-sm font-medium">Data da vistoria:</label>
          <input id="datadavistoria" id="moto" id="cliente" class="border p-2 rounded" type="date" value={nova.data_vistoria} onChange={e => setNova({ ...nova, data_vistoria: e.target.value })} className="w-full border p-2 rounded" />
        </div>
        <Button onClick={handleAgendarVistoria}>Agendar</Button>
      </div>

      <div className="mb-4 max-w-sm">
        <input type="text" placeholder="Buscar..." value={filtro} onChange={e => setFiltro(e.target.value)} className="border p-2 w-full rounded" />
      </div>

      
      <div className="flex flex-wrap gap-4 mb-4">
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border p-2 rounded" />
        <select value={statusFiltro} onChange={e => setStatusFiltro(e.target.value)} className="border p-2 rounded">
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Realizada">Realizada</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Pago">Pago</option>
          <option value="Atrasado">Atrasado</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Moto</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vistoriasFiltradas.map((v) => (
            <TableRow key={v.id}>
              <TableCell>{v.cliente}</TableCell>
              <TableCell>{v.moto}</TableCell>
              <TableCell>{format(new Date(v.data), 'dd/MM/yyyy')}</TableCell>
              <TableCell><BadgeStatus status={v.status} /></TableCell>
              <TableCell className="space-x-2">
                {v.status === 'Pendente' && (
                  <>
                    <Button size="sm" onClick={() => marcarRealizada(v.id)}>Marcar Realizada</Button>
                    <Button size="sm" variant="destructive" onClick={() => cancelarVistoria(v.id)}>Cancelar</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
