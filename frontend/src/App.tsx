import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BooksPage from './Pages/Books/BooksPage';
import BookDetailPage from './Pages/Books/BookDetailPage';
import CreateBookPage from './Pages/Books/CreateBookPage';
import EditBookPage from './Pages/Books/EditBookPage';
import LoansPage from './Pages/Loans/LoansPage';
import LoanDetailPage from './Pages/Loans/LoanDetailPage';
import UsersPage from './Pages/Users/UsersPage';
import CreateUserPage from './Pages/Users/CreateUserPage';
import UserDetailPage from './Pages/Users/UserDetailPage';
import SettingsPage from './Pages/MyAccount/SettingsPage';
import MyAccountPage from './Pages/MyAccount/MyAccountPage';
import LoginPage from './Pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="pt-20 pb-20 mx-auto w-5/6">
            <Routes>
              <Route path="/" element={<Navigate to="/books" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route 
                path="/books/create" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor', 'Bibliotecário']}>
                    <CreateBookPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/books/:id/edit" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor', 'Bibliotecário']}>
                    <EditBookPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route 
                path="/loans" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LoansPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/loans/:id" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <LoanDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor', 'Bibliotecário']}>
                    <UsersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users/create" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor', 'Bibliotecário']}>
                    <CreateUserPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users/:id" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor', 'Bibliotecário']}>
                    <UserDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor']}>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-account" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <MyAccountPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;