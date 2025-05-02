import { validarToken } from './auth';

export const GET = async (req: Request) => {
  if (!validarToken(req)) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
  }

  const clientes = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Maria Oliveira' },
  ];

  return new Response(JSON.stringify(clientes), { status: 200 });
};