
import React, { useState } from 'react';
import { formatarMoeda } from '@/utils/format';
import { BadgeStatus } from '@/components/shared/BadgeStatus';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { format } from 'date-fns';
import { salvarMulta, uploadArquivo } from '@/integrations/firebase/firebaseService';

export 

  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const multasFiltradas = multas.filter((item) => {
    const statusOk = !statusFiltro || item.status === statusFiltro;
    const dataItem = new Date(item.data);
    const inicioOk = !dataInicio || dataItem >= new Date(dataInicio);
    const fimOk = !dataFim || dataItem <= new Date(dataFim);
    return statusOk && inicioOk && fimOk;
  });

  const [filtro, setFiltro] = useState('');
  const multasFiltradas = multas.filter(multa => (multa.cliente + multa.tipo + multa.moto).toLowerCase().includes(filtro.toLowerCase()));

  const formatarStatus = (status: string) => {
  const base = "text-xs font-semibold px-2 py-1 rounded";
  if (status === "Pendente") return <span className={base + " bg-yellow-200 text-yellow-800"}>Pendente</span>;
  if (status === "Atrasado") return <span className={base + " bg-red-200 text-red-800"}>Atrasado</span>;
  if (status === "Pago") return <span className={base + " bg-green-200 text-green-800"}>Pago</span>;
  if (status === "Realizada") return <span className={base + " bg-green-200 text-green-800"}>Realizada</span>;
  if (status === "Cancelada") return <span className={base + " bg-gray-200 text-gray-700"}>Cancelada</span>;
  return <span className={base + " bg-gray-100 text-gray-600"}>{status}</span>;
};


const MultasPage: React.FC = () => {
  
  
  const [arquivo, setArquivo] = useState<File | null>(null);

  const [form, setForm] = useState({
    cliente: '',
    moto: '',
    tipo: '',
    valor: '',
    data: '',
    status: 'Pendente',
  });
  const [showForm, setShowForm] = useState(false);

  
  const handleNovaMulta = async () => {
    if (!form.cliente || !form.moto || !form.tipo || !form.valor || !form.data) {
      alert("Preencha todos os campos!");
      return;
    }

    let documento_url = '';
    if (arquivo) {
      const path = `multas/${Date.now()}-${arquivo.name}`;
      const { error: uploadError } = await uploadArquivo('multas', path, arquivo)(path, arquivo, {
        cacheControl: '3600',
        upsert: true,
      });
      if (uploadError) {
        alert("Erro ao enviar o arquivo.");
        return;
      }
      const { data: urlData } = // URL já retornada pelo uploadArquivo;
      documento_url = urlData?.publicUrl || '';
    }

    const { error } = await salvarMulta([{
      cliente: form.cliente,
      moto: form.moto,
      tipo: form.tipo,
      valor: parseFloat(form.valor),
      data: form.data,
      status: form.status,
      documento_url,
    }]);

    if (error) {
      alert("Erro ao salvar multa.");
    } else {
      alert("Multa salva com sucesso.");
      setForm({ cliente: '', moto: '', tipo: '', valor: '', data: '', status: 'Pendente' });
      setArquivo(null);
      setShowForm(false);
    }
  };

    if (!form.cliente || !form.moto || !form.tipo || !form.valor || !form.data) {
      alert("Preencha todos os campos!");
      return;
    }
    const nova = {
      id: multas.length + 1,
      ...form,
      valor: parseFloat(form.valor),
    };
    setMultas((prev) => [...prev, nova]);
    setForm({ cliente: '', moto: '', tipo: '', valor: '', data: '', status: 'Pendente' });
    setShowForm(false);
  };


  const [multas, setMultas] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      moto: 'CG 160',
      tipo: 'Avanço de sinal',
      data: '2025-05-01',
      valor: 195.23,
      status: 'Pendente',
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      moto: 'Yamaha Factor',
      tipo: 'Estacionamento irregular',
      data: '2025-04-25',
      valor: 88.50,
      status: 'Paga',
    },
  ]);

  const marcarComoPaga = (id: number) => {
    setMultas((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Paga' } : m))
    );
  };

  return (
    <div className="p-6">
      <PageHeader title="Multas e Ocorrências" description="Gerencie multas relacionadas a veículos e clientes." />
      
      <div className="mb-4">
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancelar" : "Adicionar Multa"}</Button>
      </div>

      {showForm && (
        <div className="bg-white border rounded p-4 mb-6 space-y-3">
          <div class="flex flex-col gap-1 mb-3"><label htmlFor="cliente" class="text-sm font-medium">Cliente:</label><input id="status" id="data" id="documentoopcional" id="valor" id="tipo" id="moto" id="cliente" class="border p-2 rounded" type="text" value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} className="border rounded p-1 w-full" /></div>
          <div class="flex flex-col gap-1 mb-3"><label htmlFor="moto" class="text-sm font-medium">Moto:</label><input class="border p-2 rounded" type="text" value={form.moto} onChange={e => setForm({ ...form, moto: e.target.value })} className="border rounded p-1 w-full" /></div>
          <div class="flex flex-col gap-1 mb-3"><label htmlFor="tipo" class="text-sm font-medium">Tipo:</label><input class="border p-2 rounded" type="text" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="border rounded p-1 w-full" /></div>
          <div class="flex flex-col gap-1 mb-3"><label htmlFor="valor" class="text-sm font-medium">Valor:</label><input class="border p-2 rounded" type="number" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} className="border rounded p-1 w-full" /></div>
          <div class="flex flex-col gap-1 mb-3"><label htmlFor="documentoopcional" class="text-sm font-medium">Documento (opcional):</label><input class="border p-2 rounded" type="file" onChange={e => setArquivo(e.target.files?.[0] || null)} className="border rounded p-1 w-full" /></div>
          <div class="flex flex-col gap-1 mb-3"><label htmlFor="data" class="text-sm font-medium">Data:</label><input class="border p-2 rounded" type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} className="border rounded p-1 w-full" /></div>
          <div class="flex flex-col gap-1 mb-3"><label htmlFor="status" class="text-sm font-medium">Status:</label>
            <select id="status" id="data" id="documentoopcional" id="valor" id="tipo" id="moto" id="cliente" class="border p-2 rounded" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border rounded p-1 w-full">
              <option value="Pendente">Pendente</option>
              <option value="Paga">Paga</option>
            </select>
          </div>
          <Button onClick={handleNovaMulta}>Salvar Multa</Button>
        </div>
      )}

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
            <TableHead>Tipo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {multasFiltradas.map((multa) => (
            <TableRow key={multa.id}>
              <TableCell>{multa.cliente}</TableCell>
              <TableCell>{multa.moto}</TableCell>
              <TableCell>{multa.tipo}</TableCell>
              <TableCell>{format(new Date(multa.data), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(multa.valor)}</TableCell>
              <TableCell><BadgeStatus status={multa.status} /></TableCell>
              <TableCell>
                {"documento_url" in multa ? (
                  <a href={multa.documento_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                    Ver Documento
                  </a>
                ) : "-"}
              </TableCell>
              <TableCell>
                {multa.status === 'Pendente' && (
                  <Button size="sm" onClick={() => marcarComoPaga(multa.id)}>Marcar como paga</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
