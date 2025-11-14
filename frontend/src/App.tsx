import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BooksPage from './Pages/BooksPage';
import BookDetailPage from './Pages/BookDetailPage';
import LoansPage from './Pages/LoansPage';
import UsersPage from './Pages/UsersPage';
import SettingsPage from './Pages/SettingsPage';
import MyAccountPage from './Pages/MyAccountPage';
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
                path="/users" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor', 'Bibliotecário']}>
                    <UsersPage />
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