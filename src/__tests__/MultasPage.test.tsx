import React from 'react';
import { render, screen } from '@testing-library/react';
import { MultasPage } from '../pages/MultasPage';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ userRole: 'admin', user: { email: 'admin@teste.com' } })
}));

jest.mock('@/services/supabaseService', () => ({
  salvarMulta: jest.fn(),
  uploadArquivo: jest.fn()
}));

describe('MultasPage', () => {
  it('renderiza título corretamente', () => {
    render(<MultasPage />);
    expect(screen.getByText('Multas e Ocorrências')).toBeInTheDocument();
  });

  it('exibe botão de adicionar multa', () => {
    render(<MultasPage />);
    expect(screen.getByRole('button', { name: /adicionar multa/i })).toBeInTheDocument();
  });
});