import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/BookList.css';

const BookList = ({ onBookSelect, searchTerm, searchCategory }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.books.getAll();
        setBooks(response.data.results || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search term and category
  const filteredBooks = books.filter(book => {
    const matchesTerm = searchTerm ? 
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
       book.isbn10.includes(searchTerm) ||
       book.isbn13.includes(searchTerm) ||
       book.synopsis.toLowerCase().includes(searchTerm.toLowerCase())) 
      : true;

    const matchesCategory = searchCategory ? 
      book.category === searchCategory || book.language === searchCategory 
      : true;

    return matchesTerm && matchesCategory;
  });

  return (
    <div className="book-list">
      <h2>Catálogo de Libros</h2>
      {loading ? (
        <p className="loading">Cargando libros...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="books-container">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <div 
                key={book.id} 
                className={`book-card ${!book.available ? 'unavailable' : ''}`}
                onClick={() => onBookSelect(book)}
              >
                <img 
                  src={book.cover_image || book.coverImage} 
                  alt={`Portada de ${book.title}`} 
                  className="book-cover"
                />
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-author">por {book.author}</p>
                  <p className="book-category">{book.category}</p>
                  <p className="book-status">
                    {book.available ? 'Disponible' : 'No disponible'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No se encontraron libros que coincidan con tu búsqueda.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;
