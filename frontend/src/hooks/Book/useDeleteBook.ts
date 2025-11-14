import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

interface UseDeleteBookResult {
  deleteBook: (bookId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useDeleteBook(): UseDeleteBookResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBook = async (bookId: string) => {
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar autenticado para deletar um livro.');
      }

      const response = await fetch(`${API_BASE}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erro HTTP ${response.status}`);
      }

    } catch (err: any) {
      setError(err.message || 'Erro ao deletar o livro.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteBook, loading, error };
}
