import { useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface CreateBookFormData {
  title: string;
  edition: number;
  publicationYear: number | '';
  volume: number | '';
  publisherName: string;
  quantityAvailable: number;
  isbn: string;
  cdd: string;
  libraryLocation: string;
  origin: string;
  authorNames: string[];
  tagWords: string[];
  categories: string[];
}

interface UseCreateBookResult {
  createBook: (formData: CreateBookFormData) => Promise<any>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateBook(): UseCreateBookResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createBook = async (formData: CreateBookFormData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar autenticado para criar um livro.');
      }

      // Filter out empty author names
      const filteredAuthors = formData.authorNames.filter(name => name.trim() !== '');
      if (filteredAuthors.length === 0) {
        throw new Error('Pelo menos um autor é obrigatório.');
      }

      const payload = {
        title: formData.title,
        edition: formData.edition,
        publicationYear: formData.publicationYear || null,
        volume: formData.volume || null,
        publisherName: formData.publisherName,
        quantityAvailable: formData.quantityAvailable,
        isbn: formData.isbn || null,
        cdd: formData.cdd || null,
        libraryLocation: formData.libraryLocation || null,
        origin: formData.origin || null,
        authorNames: filteredAuthors,
        tagWords: formData.tagWords,
        categories: formData.categories
      };

      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erro HTTP ${response.status}`);
      }

      const createdBook = await response.json();
      setSuccess(true);
      return createdBook;

    } catch (err: any) {
      setError(err.message || 'Erro ao criar o livro.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBook, loading, error, success };
}
