import React, { useState, useEffect } from 'react';
import { registrarLog } from '@/utils/log';
import { PageHeader } from '@/components/PageHeader';
import { registrarLog } from '@/utils/log';
import { Button } from '@/components/ui/button';
import { registrarLog } from '@/utils/log';
import { Plus, Search, Edit, Trash2, Car } from 'lucide-react';
import { registrarLog } from '@/utils/log';
import { Input } from '@/components/ui/input';
import { registrarLog } from '@/utils/log';
import { supabase } from '@/integrations/supabase/client';
import { registrarLog } from '@/utils/log';
import { Motorcycle } from '@/types';
import { registrarLog } from '@/utils/log';
import { MotorcycleForm } from '@/components/motorcycles/MotorcycleForm';
import { registrarLog } from '@/utils/log';
import { useToast } from '@/hooks/use-toast';
import { registrarLog } from '@/utils/log';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { registrarLog } from '@/utils/log';
import { Badge } from '@/components/ui/badge';

export const MotorcyclesPage: React.FC = () => {
  const { userRole } = useAuth();
  
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | null>(null);
  const { toast } = useToast();

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('motorcycles')
        .select('*')
        .order('createdat', { ascending: false });

      if (error) {
    registrarLog(user?.email || '', 'Exclusão', 'Moto', `Removeu moto com id ${id}`);
        console.error('Error details:', error);
        throw error;
      }

      // Map the data to match our Motorcycle type
      const motorcyclesData = data as any[] || [];
      const formattedMotorcycles = motorcyclesData.map(motorcycle => ({
        id: motorcycle.id,
        brand: motorcycle.brand,
        model: motorcycle.model,
        licensePlate: motorcycle.licenseplate,
        year: motorcycle.year,
        mileage: motorcycle.mileage,
        status: motorcycle.status,
        weeklyRate: motorcycle.weeklyrate,
        observations: motorcycle.observations || '',
        photo: motorcycle.photo || '',
        createdAt: motorcycle.createdat,
        updatedAt: motorcycle.updatedat
      }));

      setMotorcycles(formattedMotorcycles);
    } catch (error) {
      console.error('Error fetching motorcycles:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as motos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const handleEditMotorcycle = (motorcycle: Motorcycle) => {
    setEditingMotorcycle(motorcycle);
    setIsFormOpen(true);
  };

  const handleDeleteMotorcycle = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta moto?')) {
      try {
        const { error } = await supabase
          .from('motorcycles')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Moto excluída",
          description: "Moto removida com sucesso",
        });
        
        fetchMotorcycles();
      } catch (error) {
        console.error('Error deleting motorcycle:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a moto",
          variant: "destructive",
        });
      }
    }
  };

  const filteredMotorcycles = motorcycles.filter(motorcycle => 
    motorcycle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motorcycle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motorcycle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormClose = (refreshData: boolean = false) => {
    setIsFormOpen(false);
    setEditingMotorcycle(null);
    if (refreshData) {
      fetchMotorcycles();
    }
  };

  // Updated to use proper badge variants
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'rented':
        return 'info';
      case 'maintenance':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'rented':
        return 'Alugada';
      case 'maintenance':
        return 'Em manutenção';
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Motos" 
        description="Gerencie o cadastro de motos" 
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 w-1/2">
          <Input 
            placeholder="Buscar por marca, modelo ou placa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Moto
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : (
        <>
          {filteredMotorcycles.length === 0 ? (
            <div className="text-center py-10">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma moto encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Cadastre uma nova moto para começar.
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Moto
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMotorcycles.map((motorcycle) => (
                <Card key={motorcycle.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                      {motorcycle.photo ? (
                        <img 
                          src={motorcycle.photo} 
                          alt={`${motorcycle.brand} ${motorcycle.model}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Car className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{motorcycle.brand} {motorcycle.model}</h3>
                        <p className="text-sm text-muted-foreground">{motorcycle.year} - {motorcycle.licensePlate}</p>
                      </div>
                      <Badge variant={getStatusBadge(motorcycle.status)}>
                        {getStatusLabel(motorcycle.status)}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Quilometragem</p>
                        <p className="font-medium">{motorcycle.mileage} km</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Semanal</p>
                        <p className="font-medium">{formatCurrency(motorcycle.weeklyRate)}</p>
                      </div>
                    </div>
                    {motorcycle.observations && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Observações</p>
                        <p className="text-sm">{motorcycle.observations}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEditMotorcycle(motorcycle)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => handleDeleteMotorcycle(motorcycle.id)}>
                      {userRole === 'admin' && (<Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {isFormOpen && (
        <MotorcycleForm 
          motorcycle={editingMotorcycle} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
};

export default MotorcyclesPage;
