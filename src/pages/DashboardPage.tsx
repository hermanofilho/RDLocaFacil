import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState({
    totalClients: 0,
    totalMotorcycles: 0,
    totalRentals: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [vencimentos, setVencimentos] = useState([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const { count: clientCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
    const { count: motorcycleCount } = await supabase.from('motorcycles').select('*', { count: 'exact', head: true });
    const { data: rentalsDataFull } = await supabase.from('rentals').select('*');
    const { data: rentalsData } = await supabase.from('rentals').select('start_date');

    const allRentals = rentalsDataFull || [];
    const rentalCount = rentalsData?.length || 0;

    const grouped = (rentalsData || []).reduce((acc, r) => {
      const month = new Date(r.start_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const chart = Object.entries(grouped).map(([month, count]) => ({ month, count }));

    setSummary({
      totalClients: clientCount || 0,
      totalMotorcycles: motorcycleCount || 0,
      totalRentals: rentalCount,
    });

    setChartData(chart);

    const { data: clientsData } = await supabase.from('clients').select('id, fullname');
    const { data: motorcyclesData } = await supabase.from('motorcycles').select('id, model');

    const clientesMap = Object.fromEntries((clientsData || []).map(c => [c.id, c.fullname]));
    const motosMap = Object.fromEntries((motorcyclesData || []).map(m => [m.id, m.model]));

    verificarVencimentos(allRentals, clientesMap, motosMap);
  };

  const verificarVencimentos = async (dados, clientesMap, motosMap) => {
    const agora = new Date();
    const em24h = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

    const vencendo = dados.filter((r) => {
      const fim = new Date(r.end_date);
      return r.status === 'Ativa' && fim >= agora && fim <= em24h;
    });

    setVencimentos(vencendo);

    for (const v of vencendo) {
      const email = clientesMap[v.client_id] || "sem-email@dominio.com";
      const nome = clientesMap[v.client_id] || "Cliente";
      const moto = motosMap[v.motorcycle_id] || "Moto";
      const data = new Date(v.end_date).toLocaleDateString('pt-BR');

      await supabase.functions.invoke('vencimento-email', {
        body: { email, nome, moto, data }
      });

      await supabase.functions.invoke('whatsapp-notify', {
        body: {
          numero: '+5583999999999',
          mensagem: `Olá ${nome}! Sua locação da moto ${moto} vence em ${data}. Por favor, prepare-se para devolução.`
        }
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Painel de Controle" description="Resumo geral do sistema." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <CardTitle>Total de Clientes</CardTitle>
            <p className="text-2xl font-bold">{summary.totalClients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <CardTitle>Total de Motos</CardTitle>
            <p className="text-2xl font-bold">{summary.totalMotorcycles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <CardTitle>Total de Locações</CardTitle>
            <p className="text-2xl font-bold">{summary.totalRentals}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Locações por Mês</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>

        {vencimentos.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg mt-4">
            <p className="font-semibold">⚠️ Locações vencendo nas próximas 24h:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {vencimentos.map((v) => (
                <li key={v.id}>
                  Cliente: <strong>{v.client_id}</strong> — Moto: <strong>{v.motorcycle_id}</strong> — Entrega: <strong>{new Date(v.end_date).toLocaleDateString('pt-BR')}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
