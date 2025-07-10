import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/RentalManagement.css';

const RentalManagement = ({ currentUser, onReturn, onBookSelect }) => {
  const [rentals, setRentals] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalsWithBooks, setRentalsWithBooks] = useState([]);

  // Fetch rentals and books when component mounts or currentUser changes
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [rentalsResponse, booksResponse] = await Promise.all([
          api.rentals.getAll(),
          api.books.getAll()
        ]);

        const rentalsData = rentalsResponse.data.results || rentalsResponse.data;
        const booksData = booksResponse.data.results || booksResponse.data;

        setRentals(rentalsData);
        setBooks(booksData);
        setError(null);
      } catch (err) {
        console.error('Error fetching rental data:', err);
        setError('Failed to load rental data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Process rentals with books when rentals or books change
  useEffect(() => {
    if (!currentUser || !rentals.length || !books.length) return;

    // Get user's active rentals
    const userRentals = rentals.filter(
      rental => rental.user === currentUser.user_id && !rental.returned
    );

    // Get book details for each rental
    const rentalsWithBooksData = userRentals.map(rental => {
      const book = books.find(book => book.id === rental.book);
      return { ...rental, book };
    });

    setRentalsWithBooks(rentalsWithBooksData);
  }, [currentUser, rentals, books]);

  if (!currentUser) {
    return (
      <div className="rental-management">
        <h2>Mis Alquileres</h2>
        <p>Inicia sesión para ver tus alquileres.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rental-management">
        <h2>Mis Alquileres</h2>
        <p className="loading-message">Cargando alquileres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rental-management">
        <h2>Mis Alquileres</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Calculate days remaining for each rental
  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="rental-management">
      <h2>Mis Alquileres</h2>

      {rentalsWithBooks.length === 0 ? (
        <p>No tienes libros alquilados actualmente.</p>
      ) : (
        <div className="rentals-list">
          {rentalsWithBooks.map(rental => {
            const daysRemaining = calculateDaysRemaining(rental.end_date || rental.endDate);

            return (
              <div key={rental.id} className="rental-item">
                <div className="rental-book-info" onClick={() => onBookSelect(rental.book)}>
                  <img 
                    src={rental.book.cover_image || rental.book.coverImage} 
                    alt={`Portada de ${rental.book.title}`} 
                    className="rental-book-cover"
                  />
                  <div>
                    <h3>{rental.book.title}</h3>
                    <p>por {rental.book.author}</p>
                  </div>
                </div>

                <div className="rental-details">
                  <p>Fecha de inicio: {rental.start_date || rental.startDate}</p>
                  <p>Fecha de devolución: {rental.end_date || rental.endDate}</p>
                  <p className={`days-remaining ${daysRemaining < 3 ? 'urgent' : ''}`}>
                    {daysRemaining > 0 
                      ? `${daysRemaining} días restantes` 
                      : 'Plazo vencido'}
                  </p>

                  <button 
                    className="return-button"
                    onClick={() => onReturn(rental.id)}
                  >
                    Devolver libro
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RentalManagement;
