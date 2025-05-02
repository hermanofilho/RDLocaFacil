import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type Evento = {
  tipo: 'Locação' | 'Vistoria' | 'Renovação';
  data: string;
  descricao: string;
};

export const CalendarioPage: React.FC = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const eventos: Evento[] = [
    { tipo: 'Locação', data: '2025-05-06', descricao: 'Devolução da moto de João' },
    { tipo: 'Vistoria', data: '2025-05-07', descricao: 'Vistoria da moto CG 160' },
    { tipo: 'Renovação', data: '2025-05-10', descricao: 'Renovação automática - Maria' },
  ];

  const eventosDoDia = eventos.filter(e =>
    new Date(e.data).toDateString() === dataSelecionada.toDateString()
  );

  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Calendário de Obrigações" description="Veja locações, vistorias e renovações em um só lugar." />
      <Calendar value={dataSelecionada} onChange={setDataSelecionada} />
      <div className="mt-4">
        <h3 className="font-semibold text-lg">Eventos do dia {dataSelecionada.toLocaleDateString('pt-BR')}:</h3>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          {eventosDoDia.length === 0 && <li>Nenhum evento.</li>}
          {eventosDoDia.map((e, i) => (
            <li key={i}>
              <span className="font-semibold">{e.tipo}:</span> {e.descricao}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};