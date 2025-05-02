const tokensValidos = [
  'seu-token-fixo',
  'admin123456789token',
  'apitoken-rdmoto'
];

export const validarToken = (req: Request): boolean => {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  return tokensValidos.includes(token);
};