
type LogAcesso = {
  data: string;
  usuario: string;
  acao: string;
  alvo: string;
  descricao: string;
};

export const registrarLog = (usuario: string, acao: string, alvo: string, descricao: string) => {
  const log: LogAcesso = {
    data: new Date().toISOString(),
    usuario,
    acao,
    alvo,
    descricao,
  };
  console.log('[LOG]', log);
  // Futuro: salvar log no Supabase ou enviar para um webhook
};
