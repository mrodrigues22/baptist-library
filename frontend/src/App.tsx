import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BooksPage from './Pages/BooksPage';
import LoansPage from './Pages/LoansPage';
import UsersPage from './Pages/UsersPage';
import SettingsPage from './Pages/SettingsPage';
import MyAccountPage from './Pages/MyAccountPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="pt-20 pb-20 mx-auto w-5/6">
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/my-account" element={<MyAccountPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;