import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';
import { ClientForm } from '@/components/clients/ClientForm';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { ptBR } from 'date-fns/locale';
import { registrarLog } from '@/utils/log';

export const ClientsPage: React.FC = () => {
  const { userRole } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('fullname', { ascending: true });

      if (error) throw error;

      const formattedClients = (data || []).map(client => ({
        id: client.id,
        fullName: client.fullname,
        cpf: client.cpf,
        phone: client.phone,
        address: client.address,
        birthDate: client.birthdate,
        licenseNumber: client.licensenumber || '',
        licenseCategory: client.licensecategory || '',
        licenseValidity: client.licensevalidity || '',
        observations: client.observations || '',
        licenseImageFront: client.licenseimagefront || '',
        licenseImageBack: client.licenseimageback || '',
        photo: client.photo || '',
        proofOfAddress: client.proofofaddress || '',
        signedTerms: client.signedterms || '',
        createdAt: client.createdat,
        updatedAt: client.updatedat
      }));

      setClients(formattedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso",
      });
      registrarLog('', 'Exclusão', 'Cliente', `Removeu cliente com id ${id}`);
      fetchClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter(client =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpf.includes(searchTerm)
  );

  const handleFormClose = (refreshData: boolean = false) => {
    setIsFormOpen(false);
    setEditingClient(null);
    if (refreshData) {
      fetchClients();
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Clientes" description="Gerencie o cadastro de clientes" />

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 w-1/2">
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Data de Nascimento</TableHead>
                <TableHead>Histórico</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.fullName}</TableCell>
                    <TableCell>{formatCPF(client.cpf)}</TableCell>
                    <TableCell>{formatPhone(client.phone)}</TableCell>
                    <TableCell>
                      {client.birthDate ? format(new Date(client.birthDate), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                    </TableCell>
                    <TableCell>
                      <Link to={`/cliente/${client.id}`} className="text-blue-600 text-sm underline">Ver histórico</Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                          {userRole === 'admin' && (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {isFormOpen && (
        <ClientForm client={editingClient} onClose={handleFormClose} />
      )}
    </div>
  );
};

export default ClientsPage;
