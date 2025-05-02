import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserRole } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  role: z.enum(['admin', 'employee'] as const),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

const UsersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      role: 'employee',
    },
  });

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        username: selectedUser.username,
        role: selectedUser.role,
      });
    } else {
      form.reset({
        name: '', email: '', username: '', password: '', role: 'employee'
      });
    }
  }, [selectedUser, form]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data as UserData[]);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os usuários", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: UserFormValues) => {
    const isEditing = !!values.id;
    const payload: any = {
      name: values.name,
      email: values.email,
      username: values.username,
      role: values.role,
    };
    if (!isEditing && values.password) payload['password'] = values.password;

    const { error } = isEditing
      ? await supabase.from('users').update(payload).eq('id', values.id)
      : await supabase.from('users').insert([payload]);

    if (error) {
      toast({ title: 'Erro', description: 'Erro ao salvar usuário', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso', description: 'Usuário salvo com sucesso' });
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      fetchUsers();
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const { error } = await supabase.from('users').delete().eq('id', selectedUser.id);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível remover o usuário", variant: "destructive" });
    } else {
      toast({ title: "Usuário removido", description: "Usuário removido com sucesso" });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Acesso não autorizado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conteúdo da UI como formulários, tabelas, e diálogos */}
    </div>
  );
};

export default UsersPage;
