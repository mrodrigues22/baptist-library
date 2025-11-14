import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/Category/useCategories';
import SearchableSelect from '../../components/SearchableSelect/SearchableSelect';
import Spinner from '../../components/layout/Spinner';

const HomePage = () => {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        params.set('category', category.name);
      }
    }
    
    navigate(`/books?${params.toString()}`);
  };

  const handleCategoryChange = (value: string | number) => {
    setCategoryId(value === '' ? undefined : Number(value));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(/hero-image.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl w-full">
        <div className="mb-8 flex justify-center">
          <img src="/logo-white.svg" alt="Biblioteca Batista" className="h-16 md:h-20 drop-shadow-2xl" />
        </div>
        
        <div className="bg-white rounded-lg shadow-2xl p-3">
          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por título, autor, categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-2.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {categoriesLoading ? (
                <div className="flex items-center px-4">
                  <Spinner size={24} />
                </div>
              ) : (
                <div className="w-56">
                  <SearchableSelect
                    id="category-home"
                    value={categoryId || ''}
                    onChange={handleCategoryChange}
                    options={[
                      { value: '', label: 'Categorias' },
                      ...categories.map(cat => ({
                        value: cat.id,
                        label: cat.description || cat.name
                      }))
                    ]}
                    placeholder="Selecione uma categoria"
                    className="w-full"
                  />
                </div>
              )}

              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white font-medium py-2.5 px-6 rounded-md transition-colors duration-200 whitespace-nowrap"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Quick Links */}
        <div className="mt-2 flex justify-center gap-6 text-white">
          <button
            onClick={() => navigate('/books')}
            className="hover:underline text-lg drop-shadow"
          >
            Ver todos os livros
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
