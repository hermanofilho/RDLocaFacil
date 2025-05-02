
import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { gerarContratoPdf } from '@/utils/pdfGenerator';

export const RentalPage: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    motorcycleId: '',
    startDate: '',
    endDate: '',
    price: '',
    status: 'Ativa',
  });
  
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  const handleVisualizarContrato = () => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const handleDownloadContrato = () => {
    if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Contrato-Locacao.pdf';
      link.click();
    }
  };


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: clientData } = await supabase.from('clients').select('id, fullname');
    const { data: motorcycleData } = await supabase.from('motorcycles').select('id, model');

    setClients(clientData || []);
    setMotorcycles(motorcycleData || []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    // Mock de locações existentes para teste local
    const existingRentals = [
      {
        motorcycle_id: formData.motorcycleId,
        start_date: '2024-07-01',
        end_date: '2024-07-10',
        status: 'Ativa',
      },
      {
        motorcycle_id: formData.motorcycleId,
        start_date: '2024-08-01',
        end_date: '2024-08-05',
        status: 'Finalizada',
      },
    ];

    const isConflict = existingRentals.some(r => {
      if (r.motorcycle_id !== formData.motorcycleId || r.status !== 'Ativa') return false;
      const newStart = new Date(formData.startDate);
      const newEnd = new Date(formData.endDate);
      const existingStart = new Date(r.start_date);
      const existingEnd = new Date(r.end_date);
      return (
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (isConflict) {
      toast({ title: 'Moto indisponível', description: 'Essa moto já está alugada nesse período.', variant: 'destructive' });
      setLoading(false);
      return;
    }


    
      // Enviar e-mail automático
      await supabase.functions.invoke('send-email', {
        body: {
          clientId: formData.clientId,
          motorcycleId: formData.motorcycleId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          price: formData.price,
        },
      });

    const { error } = await supabase.from('rentals').insert([{
      client_id: formData.clientId,
      motorcycle_id: formData.motorcycleId,
      start_date: formData.startDate,
      end_date: formData.endDate,
      price: parseFloat(formData.price),
      status: formData.status,
    }]);

    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar a locação', variant: 'destructive' });
    } else {
      
      const pdf = await gerarContratoPdf({
        nome: clients.find(c => c.id === formData.clientId)?.fullname || '',
        cpf: '000.000.000-00', // Substituir com CPF real do cliente, se disponível
        moto: motorcycles.find(m => m.id === formData.motorcycleId)?.model || '',
        placa: 'ABC-1234', // Substituir com dados reais da moto, se necessário
        dataInicio: formData.startDate,
        dataFim: formData.endDate,
        valor: formData.price,
      });

      setPdfData(pdf);

      toast({ title: 'Sucesso', description: 'Locação registrada com sucesso' });
      setFormData({ clientId: '', motorcycleId: '', startDate: '', endDate: '', price: '', status: 'Ativa' });
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <PageHeader title="Nova Locação" description="Cadastre uma nova locação de moto." />
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="cliente" class="text-sm font-medium">Cliente</label>
          <select id="status" id="valoracordador" id="datadetrmino" id="datadeincio" id="moto" id="cliente" class="border p-2 rounded" name="clientId" value={formData.clientId} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Selecione</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.fullname}</option>
            ))}
          </select>
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="moto" class="text-sm font-medium">Moto</label>
          <select class="border p-2 rounded" name="motorcycleId" value={formData.motorcycleId} onChange={handleChange} className="w-full border rounded p-2">
            <option value="">Selecione</option>
            {motorcycles.map((moto) => (
              <option key={moto.id} value={moto.id}>{moto.model}</option>
            ))}
          </select>
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="datadeincio" class="text-sm font-medium">Data de Início</label>
          <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="datadetrmino" class="text-sm font-medium">Data de Término</label>
          <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="valoracordador" class="text-sm font-medium">Valor acordado (R$)</label>
          <Input type="number" name="price" value={formData.price} onChange={handleChange} />
        </div>
        <div class="flex flex-col gap-1 mb-3"><label htmlFor="status" class="text-sm font-medium">Status</label>
          <select class="border p-2 rounded" name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-2">
            <option value="Ativa">Ativa</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>Salvar Locação</Button>
      
      {pdfData && (
        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={handleVisualizarContrato}>Visualizar Contrato</Button>
          <Button type="button" onClick={handleDownloadContrato}>Baixar Contrato</Button>
        </div>
      )}

    </form>
    </div>
  );
};
