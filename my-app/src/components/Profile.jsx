import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Profile.css';

const Profile = ({ currentUser }) => {
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
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Process rentals with books when rentals or books change
  useEffect(() => {
    if (!currentUser || !rentals.length || !books.length) return;

    // Get user's rentals (both active and returned)
    const userRentals = rentals.filter(
      rental => rental.user === currentUser.user_id
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
      <div className="profile-container">
        <h2>Mi Perfil</h2>
        <p className="login-message">Por favor inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <h2>Mi Perfil</h2>
        <p className="loading-message">Cargando datos del perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <h2>Mi Perfil</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Separate active and returned rentals
  const activeRentals = rentalsWithBooks.filter(rental => !rental.returned);
  const returnedRentals = rentalsWithBooks.filter(rental => rental.returned);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        <div className="user-info">
          <div className="user-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3>{currentUser.name}</h3>
            <p>{currentUser.email}</p>
            <p>ID de usuario: {currentUser.user_id}</p>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <span className="stat-number">{activeRentals.length}</span>
          <span className="stat-label">Libros activos</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{returnedRentals.length}</span>
          <span className="stat-label">Libros devueltos</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{activeRentals.length + returnedRentals.length}</span>
          <span className="stat-label">Total alquileres</span>
        </div>
      </div>

      <div className="rental-history">
        <h3>Historial de Alquileres</h3>

        {rentalsWithBooks.length === 0 ? (
          <p>No tienes historial de alquileres.</p>
        ) : (
          <div className="rental-list">
            {rentalsWithBooks.map(rental => (
              <div key={rental.id} className={`rental-item ${rental.returned ? 'returned' : 'active'}`}>
                <img 
                  src={rental.book.cover_image || rental.book.coverImage} 
                  alt={`Portada de ${rental.book.title}`} 
                  className="rental-book-cover"
                />
                <div className="rental-details">
                  <h4>{rental.book.title}</h4>
                  <p className="book-author">por {rental.book.author}</p>
                  <div className="rental-dates">
                    <p>Alquilado: {rental.start_date || rental.startDate}</p>
                    <p>Devolución: {rental.end_date || rental.endDate}</p>
                    {rental.returned ? (
                      <span className="status-returned">Devuelto</span>
                    ) : (
                      <span className="status-active">Activo</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
