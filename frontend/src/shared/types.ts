// ============================================================================
// ENUMS
// ============================================================================

export enum SelectedPage {
  Acervo = 'acervo',
  Emprestimos = 'emprestimos',
  Usuarios = 'usuarios',
  Configuracoes = 'configuracoes',
  MinhaConta = 'minha-conta'
}

// ============================================================================
// BOOK TYPES
// ============================================================================

export interface Book {
  id: number;
  title: string;
  authors: string[];
  publisher: string;
  publicationYear?: number;
  edition?: number;
  quantity: number;
  availableCopies: number;
  borrowedByCurrentUser: boolean;
}

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
  loans: BookLoan[];
}

export interface BookLoan {
  id: number;
  reader: string;
  checkoutDate?: string;
  status: string;
}

export interface BooksFilters {
  searchTerm?: string;
  categoryId?: number;
  sortBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateBookFormData {
  title: string;
  authors: string[];
  publisher: string;
  publicationYear?: number;
  edition?: number;
  volume?: number;
  isbn: string;
  cdd: string;
  libraryLocation: string;
  quantity: number;
  origin: string;
  categories: number[];
  tags: string[];
}

export interface EditBookFormData {
  title: string;
  authors: string[];
  publisher: string;
  publicationYear?: number;
  edition?: number;
  volume?: number;
  isbn: string;
  cdd: string;
  libraryLocation: string;
  quantity: number;
  origin: string;
  categories: number[];
  tags: string[];
}

// ============================================================================
// LOAN TYPES
// ============================================================================

export interface Loan {
  id: number;
  book: string;
  reader: string;
  requestDate: string;
  returnDate?: string;
  expectedReturnDate?: string;
  status: string;
}

export interface LoanDetail {
  id: number;
  bookId: number;
  bookTitle: string;
  requesterUserId: string;
  requester: string;
  statusId: number;
  statusName: string;
  requestDate: string;
  checkoutDate?: string;
  returnDate?: string;
  expectedReturnDate?: string;
  checkedOutBy?: string;
  receivedBy?: string;
}

export interface CurrentUserLoan {
  id: number;
  bookId: number;
  book: string;
  status: string;
  requestDate: string;
  expectedReturnDate?: string;
}

export interface UserLoan {
  id: number;
  book: string;
  requestDate: string;
  returnDate?: string;
  expectedReturnDate?: string;
  status: string;
}

export interface LoansFilters {
  searchTerm?: string;
  status?: number;
  userId?: number;
  sortBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateLoanData {
  bookId: number;
  requesterUserId: string;
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  active: boolean;
}

export interface UserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles: string[];
  active: boolean;
  totalLoans: number;
  activeLoans: number;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles: string[];
  active: boolean;
  totalLoans: number;
  activeLoans: number;
}

export interface UsersFilters {
  filter?: string;
  sortBy?: string;
  descending?: boolean;
  pageNumber?: number;
  pageSize?: number;
  roleFilter?: string;
}

export interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  roles: string[];
}

export interface UpdateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles: string[];
  active: boolean;
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// ============================================================================
// SETTING TYPES
// ============================================================================

export interface Setting {
  id: number;
  setting: string;
  value: number;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// ============================================================================
// API RESPONSE TYPES (for normalization from PascalCase)
// ============================================================================

export interface PaginatedResponse<T> {
  items?: T[];
  totalCount?: number;
  totalTitles?: number;
  totalCopies?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface UsersApiResponse {
  users?: any[];
  hasPendingUsers?: boolean;
}