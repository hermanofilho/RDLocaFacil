
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-rental-border">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-red-600">
            <ShieldAlert className="mr-2 h-5 w-5" />
            Acesso Negado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="text-6xl">🔒</div>
            <h2 className="text-xl font-semibold">Permissão Insuficiente</h2>
            <p className="text-center text-muted-foreground">
              Você não possui permissão para acessar esta página.
              Entre em contato com o administrador do sistema para solicitar acesso.
            </p>
            <Button asChild className="mt-4">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Voltar para o Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
