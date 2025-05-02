
import { supabase } from '@/integrations/supabase/client';

// Clientes
export const getClients = async () => {
  const { data } = await supabase.from('clients').select('id, fullname');
  return data || [];
};

// Motos
export const getMotorcycles = async () => {
  const { data } = await supabase.from('motorcycles').select('id, model');
  return data || [];
};

// Vistorias
export const getVistorias = async () => {
  const { data } = await supabase.from('vistorias').select('*').order('data_vistoria', { ascending: true });
  return data || [];
};

// Alugar moto
export const salvarLocacao = async (payload: any) => {
  return await supabase.from('rentals').insert([payload]);
};

// Multas
export const salvarMulta = async (payload: any) => {
  return await supabase.from('multas').insert([payload]);
};

// Upload de arquivo
export const uploadArquivo = async (bucket: string, path: string, file: File) => {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
};
