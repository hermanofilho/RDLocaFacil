
import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const FinanceiroPage: React.FC = () => {
  const { userRole } = useAuth();
  const [dadosFinanceiros, setDadosFinanceiros] = useState<any[]>([]);

  useEffect(() => {
    carregarFinanceiro();
  }, []);

  const carregarFinanceiro = async () => {
    const { data: rentals } = await supabase.from('rentals').select('price, end_date, status, payment_status');
    const agrupado = {};

    (rentals || []).forEach((r) => {
      const data = new Date(r.end_date);
      const mesAno = data.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      const status = r.status;
      const isAtrasado = status === 'Ativa' && new Date(r.end_date) < new Date();

      if (!agrupado[mesAno]) {
        agrupado[mesAno] = { mes: mesAno, recebidos: 0, locacoes: 0, atrasos: 0 };
      }

      agrupado[mesAno].locacoes++;
      if (status === 'Pago') agrupado[mesAno].recebidos += r.price;
      if (isAtrasado) agrupado[mesAno].atrasos++;
    });

    setDadosFinanceiros(Object.values(agrupado));
  };
    { mes: 'Jan/2025', recebidos: 2430, locacoes: 9, atrasos: 1 },
    { mes: 'Fev/2025', recebidos: 3510, locacoes: 13, atrasos: 2 },
    { mes: 'Mar/2025', recebidos: 2970, locacoes: 11, atrasos: 0 },
    { mes: 'Abr/2025', recebidos: 3780, locacoes: 14, atrasos: 1 },
  ]);

  
  const exportarCSV = () => {
    const linhas = [
      ["Mês", "Recebido (R$)", "Locações", "Atrasos"],
      ...dadosFinanceiros.map((d) => [d.mes, d.recebidos.toFixed(2), d.locacoes, d.atrasos]),
    ];
    const csv = linhas.map((l) => l.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-financeiro.csv";
    a.click();
  };

  const exportarPDF = async () => {
    const conteudo = dadosFinanceiros.map((d) =>
      `${d.mes} | R$ ${d.recebidos.toFixed(2)} | Locações: ${d.locacoes} | Atrasos: ${d.atrasos}`
    ).join("\n");

    const pdfBlob = new Blob([conteudo], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-financeiro.pdf";
    a.click();
  };


  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Relatório Financeiro" description="Visão mensal das receitas e atrasos." />
      
      {userRole === 'admin' && (<div className="flex gap-4 mb-4">
        <Button onClick={exportarCSV}>Exportar CSV</Button>
        <Button onClick={exportarPDF}>Exportar PDF</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dadosFinanceiros.map((d) => (
          <Card key={d.mes}>
            <CardContent className="p-4">
              <CardTitle>{d.mes}</CardTitle>
              <p>Total Recebido: <strong>R$ {d.recebidos.toFixed(2)}</strong></p>
              <p>Locações: {d.locacoes}</p>
              <p>Atrasos: {d.atrasos}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Gráfico de Faturamento</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosFinanceiros}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="recebidos" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-2">Resumo em Tabela</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mês</TableHead>
              <TableHead>Recebido (R$)</TableHead>
              <TableHead>Locações</TableHead>
              <TableHead>Atrasos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dadosFinanceiros.map((d) => (
              <TableRow key={d.mes}>
                <TableCell>{d.mes}</TableCell>
                <TableCell>R$ {d.recebidos.toFixed(2)}</TableCell>
                <TableCell>{d.locacoes}</TableCell>
                <TableCell>{d.atrasos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
