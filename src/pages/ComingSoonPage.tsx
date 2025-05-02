
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title, description }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            Funcionalidade em Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="text-6xl animate-pulse">🚧</div>
            <h2 className="text-xl font-semibold">Em construção</h2>
            <p className="text-center text-muted-foreground max-w-md">
              Esta funcionalidade está sendo desenvolvida e estará disponível em breve. 
              Estamos trabalhando para entregar a melhor experiência possível!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonPage;
