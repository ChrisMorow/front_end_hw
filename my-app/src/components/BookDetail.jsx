import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/BookDetail.css';

const BookDetail = ({ book, onClose, onRent, currentUser }) => {
  const [rentalDays, setRentalDays] = useState(7);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentals = async () => {
      if (!book) return;

      try {
        setLoading(true);
        const response = await api.rentals.getAll();
        setRentals(response.data.results || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('Failed to load rental information.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [book]);

  if (!book) return null;

  const isRented = rentals.some(rental => 
    rental.book === book.id && !rental.returned
  );

  const userRental = rentals.find(rental => 
    rental.book === book.id && 
    rental.user === (currentUser?.id || '') && 
    !rental.returned
  );

  const handleRent = () => {
    if (onRent && book.available) {
      onRent(book.id, rentalDays);
    }
  };

  const handleExtend = (days) => {
    if (onRent && userRental) {
      onRent(book.id, days, true);
    }
  };

  return (
    <div className="book-detail-overlay">
      <div className="book-detail">
        <button className="close-button" onClick={onClose}>×</button>

        <div className="book-detail-content">
          <div className="book-detail-image">
            <img src={book.cover_image} alt={`Portada de ${book.title}`} />
          </div>

          <div className="book-detail-info">
            <h2>{book.title}</h2>
            <p className="book-author">por {book.author}</p>
            <p className="book-year">Año de publicación: {book.publicationYear}</p>
            <p className="book-isbn">ISBN-10: {book.isbn10}</p>
            <p className="book-isbn">ISBN-13: {book.isbn13}</p>
            <p className="book-category">Categoría: {book.category}</p>
            <p className="book-language">Idioma: {book.language}</p>
            <p className="book-status">
              Estado: {book.available ? 'Disponible' : 'No disponible'}
            </p>

            <div className="book-synopsis">
              <h3>Sinopsis</h3>
              <p>{book.synopsis}</p>
            </div>

            {book.reviews && book.reviews.length > 0 && (
              <div className="book-reviews">
                <h3>Críticas</h3>
                {book.reviews.map((review, index) => (
                  <div key={index} className="review">
                    <p className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </p>
                    <p className="review-comment">{review.comment}</p>
                    <p className="review-user">- {review.user}</p>
                  </div>
                ))}
              </div>
            )}

            {currentUser && !userRental && book.available && (
              <div className="rental-section">
                <h3>Alquilar este libro</h3>
                <div className="rental-controls">
                  <label>
                    Días de alquiler:
                    <select 
                      value={rentalDays} 
                      onChange={(e) => setRentalDays(Number(e.target.value))}
                    >
                      <option value={7}>7 días</option>
                      <option value={14}>14 días</option>
                      <option value={21}>21 días</option>
                      <option value={30}>30 días</option>
                    </select>
                  </label>
                  <button 
                    className="rent-button"
                    onClick={handleRent}
                  >
                    Alquilar
                  </button>
                </div>
              </div>
            )}

            {userRental && (
              <div className="rental-section">
                <h3>Tu alquiler</h3>
                <p>Fecha de inicio: {userRental.start_date}</p>
                <p>Fecha de devolución: {userRental.end_date}</p>
                {!userRental.extended && (
                  <div className="extend-controls">
                    <h4>Extender alquiler</h4>
                    <div className="extend-buttons">
                      <button onClick={() => handleExtend(7)}>+7 días</button>
                      <button onClick={() => handleExtend(14)}>+14 días</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
