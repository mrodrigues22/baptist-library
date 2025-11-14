import { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__)?.replace(/\/+$/, '') || '';

export interface BookDetail {
  id: number;
  title: string;
  edition: number;
  publisher: string;
  publicationYear?: number;
  volume?: number;
  isbn: string;
  cdd: string;
  libraryLocation: string;
  quantity: number;
  availableCopies: number;
  origin: string;
  authors: string[];
  categories: string[];
  tags: string[];
  createdByUser?: string;
  createdDate: string;
  modifiedByUser?: string;
  modifiedDate?: string;
  borrowedByCurrentUser: boolean;
}

interface BookDetailApiRaw {
  Id?: number;
  Title?: string;
  Edition?: number;
  Publisher?: string;
  PublicationYear?: number;
  Volume?: number;
  Isbn?: string;
  Cdd?: string;
  LibraryLocation?: string;
  Quantity?: number;
  AvailableCopies?: number;
  Origin?: string;
  Authors?: string[];
  Categories?: string[];
  Tags?: string[];
  CreatedByUser?: string;
  CreatedDate?: string;
  ModifiedByUser?: string;
  ModifiedDate?: string;
  BorrowedByCurrentUser?: boolean;
  id?: number;
  title?: string;
  edition?: number;
  publisher?: string;
  publicationYear?: number;
  volume?: number;
  isbn?: string;
  cdd?: string;
  libraryLocation?: string;
  quantity?: number;
  availableCopies?: number;
  origin?: string;
  authors?: string[];
  categories?: string[];
  tags?: string[];
  createdByUser?: string;
  createdDate?: string;
  modifiedByUser?: string;
  modifiedDate?: string;
  borrowedByCurrentUser?: boolean;
}

interface UseBookDetailResult {
  book: BookDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function normalizeBookDetail(raw: BookDetailApiRaw): BookDetail {
  return {
    id: raw.id ?? raw.Id ?? 0,
    title: raw.title ?? raw.Title ?? '',
    edition: raw.edition ?? raw.Edition ?? 1,
    publisher: raw.publisher ?? raw.Publisher ?? '',
    publicationYear: raw.publicationYear ?? raw.PublicationYear,
    volume: raw.volume ?? raw.Volume,
    isbn: raw.isbn ?? raw.Isbn ?? '',
    cdd: raw.cdd ?? raw.Cdd ?? '',
    libraryLocation: raw.libraryLocation ?? raw.LibraryLocation ?? '',
    quantity: raw.quantity ?? raw.Quantity ?? 0,
    availableCopies: raw.availableCopies ?? raw.AvailableCopies ?? 0,
    origin: raw.origin ?? raw.Origin ?? '',
    authors: raw.authors ?? raw.Authors ?? [],
    categories: raw.categories ?? raw.Categories ?? [],
    tags: raw.tags ?? raw.Tags ?? [],
    createdByUser: raw.createdByUser ?? raw.CreatedByUser,
    createdDate: raw.createdDate ?? raw.CreatedDate ?? '',
    modifiedByUser: raw.modifiedByUser ?? raw.ModifiedByUser,
    modifiedDate: raw.modifiedDate ?? raw.ModifiedDate,
    borrowedByCurrentUser: raw.borrowedByCurrentUser ?? raw.BorrowedByCurrentUser ?? false
  };
}

export function useBookDetail(bookId: number | string): UseBookDetailResult {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const url = `${API_BASE}/books/${bookId}`;
    
    // Get auth headers if user is authenticated
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader()
    };

    fetch(url, { 
      signal: controller.signal,
      headers 
    })
      .then(r => {
        if (!r.ok) {
          if (r.status === 404) {
            throw new Error('Livro não encontrado');
          }
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data: BookDetailApiRaw) => {
        setBook(normalizeBookDetail(data));
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Falha ao carregar detalhes do livro');
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [bookId, trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { book, loading, error, refetch };
}
