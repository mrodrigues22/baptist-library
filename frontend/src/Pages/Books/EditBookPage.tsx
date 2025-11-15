import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookDetail } from '../../hooks/Book/useBookDetail';
import { useEditBook, EditBookFormData } from '../../hooks/Book/useEditBook';
import Spinner from '../../components/layout/Spinner';

const EditBookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { book, loading: loadingBook, error: loadError } = useBookDetail(id || '');
  const { updateBook, loading, error, success } = useEditBook();

  const [formData, setFormData] = useState<EditBookFormData>({
    title: '',
    edition: 1,
    publicationYear: '',
    volume: '',
    publisherName: '',
    quantityAvailable: 1,
    isbn: '',
    cdd: '',
    libraryLocation: '',
    origin: '',
    authorNames: [''],
    tagWords: [],
    categories: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');

  // Populate form when book data is loaded
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        edition: book.edition || 1,
        publicationYear: book.publicationYear || '',
        volume: book.volume || '',
        publisherName: book.publisher || '',
        quantityAvailable: book.quantity || 1,
        isbn: book.isbn || '',
        cdd: book.cdd || '',
        libraryLocation: book.libraryLocation || '',
        origin: book.origin || '',
        authorNames: book.authors && book.authors.length > 0 ? book.authors : [''],
        tagWords: book.tags || [],
        categories: book.categories || []
      });
    }
  }, [book]);

  const handleInputChange = (field: keyof EditBookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...formData.authorNames];
    newAuthors[index] = value;
    setFormData(prev => ({ ...prev, authorNames: newAuthors }));
  };

  const addAuthor = () => {
    setFormData(prev => ({ ...prev, authorNames: [...prev.authorNames, ''] }));
  };

  const removeAuthor = (index: number) => {
    if (formData.authorNames.length > 1) {
      const newAuthors = formData.authorNames.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, authorNames: newAuthors }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tagWords.includes(currentTag.trim())) {
      setFormData(prev => ({ ...prev, tagWords: [...prev.tagWords, currentTag.trim()] }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tagWords: prev.tagWords.filter(t => t !== tag) }));
  };

  const addCategory = () => {
    if (currentCategory.trim() && !formData.categories.includes(currentCategory.trim())) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, currentCategory.trim()] }));
      setCurrentCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBook(id || '', formData);

      // Navigate back to the book's detail page after a short delay
      setTimeout(() => {
        navigate(`/books/${id}`);
      }, 1500);
    } catch (err: any) {
      // Error is handled by the hook
    }
  };

  if (loadingBook) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size={60} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="pt-20 px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Erro: {loadError}
        </div>
        <button
          onClick={() => navigate('/books')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para o acervo
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="pt-20 px-6">
        <div className="text-gray-600 mb-4">Livro não encontrado.</div>
        <button
          onClick={() => navigate('/books')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Voltar para o acervo
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(`/books/${id}`)}
        className="text-blue-600 hover:text-secondary font-medium mb-6 flex items-center"
      >
        ← Voltar para o livro
      </button>

      {/* Main card */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Editar Livro</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Livro atualizado com sucesso! Redirecionando...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              minLength={5}
              maxLength={255}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Publisher */}
          <div>
            <label htmlFor="publisherName" className="block text-sm font-medium text-gray-700 mb-1">
              Editora <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="publisherName"
              required
              minLength={5}
              maxLength={255}
              value={formData.publisherName}
              onChange={(e) => handleInputChange('publisherName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Autores <span className="text-red-500">*</span>
            </label>
            {formData.authorNames.map((author, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={author}
                  onChange={(e) => handleAuthorChange(index, e.target.value)}
                  placeholder={`Autor ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={loading}
                />
                {formData.authorNames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    disabled={loading}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAuthor}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              + Adicionar Autor
            </button>
          </div>

          {/* Edition, Publication Year, Volume */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="edition" className="block text-sm font-medium text-gray-700 mb-1">
                Edição <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="edition"
                required
                min={1}
                value={formData.edition}
                onChange={(e) => handleInputChange('edition', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-1">
                Ano de Publicação
              </label>
              <input
                type="number"
                id="publicationYear"
                min={1}
                value={formData.publicationYear}
                onChange={(e) => handleInputChange('publicationYear', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                Volume
              </label>
              <input
                type="number"
                id="volume"
                min={1}
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantityAvailable" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade Disponível <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantityAvailable"
              required
              min={0}
              value={formData.quantityAvailable}
              onChange={(e) => handleInputChange('quantityAvailable', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* ISBN */}
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN (10 ou 13 dígitos)
            </label>
            <input
              type="text"
              id="isbn"
              pattern="^\d{10}$|^\d{13}$"
              value={formData.isbn}
              onChange={(e) => handleInputChange('isbn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* CDD and Library Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cdd" className="block text-sm font-medium text-gray-700 mb-1">
                CDD
              </label>
              <input
                type="text"
                id="cdd"
                minLength={3}
                maxLength={50}
                value={formData.cdd}
                onChange={(e) => handleInputChange('cdd', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="libraryLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Localização na Biblioteca
              </label>
              <input
                type="text"
                id="libraryLocation"
                minLength={2}
                maxLength={255}
                value={formData.libraryLocation}
                onChange={(e) => handleInputChange('libraryLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Origin */}
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              Origem
            </label>
            <input
              type="text"
              id="origin"
              maxLength={255}
              value={formData.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Digite uma tag e pressione Enter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tagWords.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorias
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                placeholder="Digite uma categoria e pressione Enter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                Adicionar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="text-green-600 hover:text-green-800"
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-secondary text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Spinner size={20} />
                  <span className="ml-2">Salvando...</span>
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/books/${id}`)}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPage;
