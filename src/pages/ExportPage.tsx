
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { supabase } from '@/integrations/supabase/client';

export const ExportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const exportToCSV = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rentals')
      .select(\`
        id,
        start_date,
        end_date,
        price,
        status,
        clients ( fullname ),
        motorcycles ( model )
      \`);

    if (error || !data) {
      alert("Erro ao exportar dados");
      setLoading(false);
      return;
    }

    const csvRows = [
      ["Cliente", "Moto", "Início", "Término", "Valor", "Status"],
      ...data.map(rental => [
        rental.clients?.fullname || "",
        rental.motorcycles?.model || "",
        rental.start_date || "",
        rental.end_date || "",
        rental.price || "",
        rental.status || "",
      ]),
    ];

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "locacoes.csv";
    a.click();

    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <PageHeader title="Exportar Locações" description="Exporte os dados de locações em CSV." />
      <Button onClick={exportToCSV} disabled={loading}>
        {loading ? "Exportando..." : "Exportar CSV"}
      </Button>
    </div>
  );
};
