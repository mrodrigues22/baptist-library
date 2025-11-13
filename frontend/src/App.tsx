import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import BooksPage from './Pages/BooksPage';
import LoansPage from './Pages/LoansPage';
import UsersPage from './Pages/UsersPage';
import SettingsPage from './Pages/SettingsPage';
import MyAccountPage from './Pages/MyAccountPage';
import { useEffect, useState } from 'react';

const API_BASE = (process.env.REACT_APP_API_BASE || (window as any).__API_BASE__).replace(/\/+$/, '');

interface Book {
  id: number;
  title: string;
  author: string;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`${API_BASE}/books`, { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => setBooks(data))
      .catch(err => {
        if (err.name !== 'AbortError') setLoadError(err.message || 'Failed to load books');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="pt-24">
          {loading && <div>Loading books...</div>}
          {loadError && <div className="text-red-600">Error: {loadError}</div>}
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