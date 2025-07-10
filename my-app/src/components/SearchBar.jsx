import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.books.getAll();
        setBooks(response.data.results || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching books for categories:', err);
        setError('Failed to load categories. Using default filters.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Extract unique categories and languages from books
  const categories = [...new Set(books.map(book => book.category))];
  const languages = [...new Set(books.map(book => book.language))];

  // Combine categories and languages for the filter dropdown
  const filterOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map(category => ({ value: category, label: category })),
    { value: '', label: '---' },
    ...languages.map(language => ({ value: language, label: `Idioma: ${language}` }))
  ];

  useEffect(() => {
    // Trigger search when either term or category changes
    onSearch(searchTerm, searchCategory);
  }, [searchTerm, searchCategory, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, searchCategory);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Buscar por título, autor, ISBN o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="category-select"
            disabled={loading}
          >
            {loading ? (
              <option>Cargando categorías...</option>
            ) : error ? (
              <option>Error al cargar categorías</option>
            ) : (
              filterOptions.map((option, index) => 
                option.value === '' && option.label === '---' ? (
                  <option key={index} disabled>──────────</option>
                ) : (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                )
              )
            )}
          </select>

          <button type="submit" className="search-button">
            Buscar
          </button>
        </div>
        {error && <p className="search-error">{error}</p>}
      </form>
    </div>
  );
};

export default SearchBar;
