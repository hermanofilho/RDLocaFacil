import React, { useState, useEffect } from 'react';
import { registrarLog } from '@/utils/log';
import { PageHeader } from '@/components/PageHeader';
import { Link } from 'react-router-dom';
import { registrarLog } from '@/utils/log';
import { Button } from '@/components/ui/button';
import { registrarLog } from '@/utils/log';
import { UserPlus, Search, Edit, Trash2 } from 'lucide-react';
import { registrarLog } from '@/utils/log';
import { Input } from '@/components/ui/input';
import { registrarLog } from '@/utils/log';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { registrarLog } from '@/utils/log';
import { supabase } from '@/integrations/supabase/client';
import { registrarLog } from '@/utils/log';
import { Client } from '@/types';
import { registrarLog } from '@/utils/log';
import { ClientForm } from '@/components/clients/ClientForm';
import { registrarLog } from '@/utils/log';
import { useToast } from '@/hooks/use-toast';
import { registrarLog } from '@/utils/log';
import { format } from 'date-fns';
import { registrarLog } from '@/utils/log';
import { useAuth } from '@/contexts/AuthContext';
import { registrarLog } from '@/utils/log';
import { ptBR } from 'date-fns/locale';

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
      // Correção: usar "fullname" em vez de "fullName" para corresponder à coluna real no banco
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('fullname', { ascending: true });

      if (error) {
    registrarLog(user?.email || '', 'Exclusão', 'Cliente', `Removeu cliente com id ${id}`);
        console.error('Error details:', error);
        throw error;
      }

      // Map the data to match our Client type
      const clientsData = data as any[] || [];
      const formattedClients = clientsData.map(client => ({
        id: client.id,
        fullName: client.fullname, // Mapeando de fullname para fullName em nosso tipo
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

  const handleDeleteClient = async (id: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmDelete) return;

    const { error } = await supabase.from('clients').delete().eq('id', id);

    if (error) {
    registrarLog(user?.email || '', 'Exclusão', 'Cliente', `Removeu cliente com id ${id}`);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso",
      });
      fetchClients(); // Atualiza a lista
    }
  };

    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Cliente excluído",
          description: "Cliente removido com sucesso",
        });
        
        fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o cliente",
          variant: "destructive",
        });
      }
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
    if (!cpf) return '';
    // Format as XXX.XXX.XXX-XX
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    // Format as (XX) XXXXX-XXXX
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Clientes" 
        description="Gerencie o cadastro de clientes" 
      />
      
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
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
            <TableHead>Ações</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              <TableCell><Link to={`/cliente/${client.id}`} className="text-blue-600 text-sm underline">Ver histórico</Link></TableCell>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                            {userRole === 'admin' && (<Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {isFormOpen && (
        <ClientForm 
          client={editingClient} 
          onClose={handleFormClose} 
        />
      )}
    </div>
  );
};

export default ClientsPage;
