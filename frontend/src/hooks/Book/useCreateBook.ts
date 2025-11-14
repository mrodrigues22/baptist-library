import { useState } from 'react';
import { authenticatedPost } from '../../shared/apiUtils';
import { API_ENDPOINTS } from '../../shared/api/config';

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

      const createdBook = await authenticatedPost(API_ENDPOINTS.BOOKS, payload);
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
