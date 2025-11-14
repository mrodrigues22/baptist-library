import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './Pages/Home/HomePage';
import BooksPage from './Pages/Books/BooksPage';
import BookDetailPage from './Pages/Books/BookDetailPage';
import CreateBookPage from './Pages/Books/CreateBookPage';
import EditBookPage from './Pages/Books/EditBookPage';
import LoansPage from './Pages/Loans/LoansPage';
import LoanDetailPage from './Pages/Loans/LoanDetailPage';
import UsersPage from './Pages/Users/UsersPage';
import PendingUsersPage from './Pages/Users/PendingUsersPage';
import CreateUserPage from './Pages/Users/CreateUserPage';
import UserDetailPage from './Pages/Users/UserDetailPage';
import SettingsPage from './Pages/Settings/SettingsPage';
import MyAccountPage from './Pages/MyAccount/MyAccountPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="app flex flex-col min-h-screen">
      <Navbar />
      {isHomePage ? (
        <div className="flex-grow">{children}</div>
      ) : (
        <main className="pt-20 pb-20 mx-auto w-5/6 flex-grow">
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
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
                path="/users/pending" 
                element={
                  <ProtectedRoute requiredRoles={['Administrador', 'Desenvolvedor', 'Bibliotecário']}>
                    <PendingUsersPage />
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
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;