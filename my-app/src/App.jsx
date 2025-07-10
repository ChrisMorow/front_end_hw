import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BookDetail from './components/BookDetail';
import RentalManagement from './components/RentalManagement';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';
import api from './services/api';
import './styles/App.css';

function App() {
  // State
  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books and rentals on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksResponse, rentalsResponse] = await Promise.all([
          api.books.getAll(),
          api.rentals.getAll()
        ]);

        setBooks(booksResponse.data.results || booksResponse.data);
        setRentals(rentalsResponse.data.results || rentalsResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search
  const handleSearch = useCallback((term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
  }, []);

  // Handle book selection
  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  // Close book detail
  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  // Handle login
  const handleLogin = async (userId) => {
    try {
      const response = await api.users.login(userId);
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Failed to log in. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handle book rental
  const handleRent = async (bookId, days, isExtension = false) => {
    if (!currentUser) return;

    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + days);

      if (isExtension) {
        // Find the rental to extend
        const rental = rentals.find(r => 
          r.book === bookId && r.user === currentUser.user_id && !r.returned
        );

        if (rental) {
          // Extend existing rental via API
          const response = await api.rentals.extendRental(rental.id, days);

          // Update rentals state with the updated rental
          setRentals(prevRentals => 
            prevRentals.map(r => 
              r.id === rental.id ? response.data : r
            )
          );
        }
      } else {
        // Create new rental via API
        const rentalData = {
          book: bookId,
          user: currentUser.user_id	,
          start_date: today.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          returned: false,
          extended: false
        };

        const response = await api.rentals.create(rentalData);

        // Add the new rental to state
        setRentals(prevRentals => [...prevRentals, response.data]);

        // Update book availability via API
        const book = books.find(b => b.id === bookId);
        if (book) {
          const updatedBook = { ...book, available: false };
          await api.books.update(bookId, updatedBook);

          // Update books state
          setBooks(prevBooks => 
            prevBooks.map(b => 
              b.id === bookId ? { ...b, available: false } : b
            )
          );
        }
      }

      // Close the book detail
      setSelectedBook(null);
    } catch (err) {
      console.error('Error handling rental:', err);
      setError('Failed to process rental. Please try again.');
    }
  };

  // Handle book return
  const handleReturn = async (rentalId) => {
    try {
      // Find the rental
      const rental = rentals.find(r => r.id === rentalId);
      if (!rental) return;

      // Call API to return the book
      const response = await api.rentals.returnBook(rentalId);

      // Update rentals state
      setRentals(prevRentals => 
        prevRentals.map(r => 
          r.id === rentalId ? response.data : r
        )
      );

      // Update book availability
      const bookId = rental.book;
      const book = books.find(b => b.id === bookId);

      if (book) {
        // Get updated book from API or update it
        try {
          const bookResponse = await api.books.getById(bookId);
          setBooks(prevBooks => 
            prevBooks.map(b => 
              b.id === bookId ? bookResponse.data : b
            )
          );
        } catch (bookErr) {
          console.error('Error fetching updated book:', bookErr);
          // Fallback to local update if API call fails
          setBooks(prevBooks => 
            prevBooks.map(b => 
              b.id === bookId ? { ...b, available: true } : b
            )
          );
        }
      }
    } catch (err) {
      console.error('Error returning book:', err);
      setError('Failed to return book. Please try again.');
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar 
          currentUser={currentUser} 
          onLogout={handleLogout} 
        />

        <main className="app-main">
          <div className="app-content">
            <Routes>
              <Route path="/" element={
                <HomePage 
                  searchTerm={searchTerm}
                  searchCategory={searchCategory}
                  onSearch={handleSearch}
                  onBookSelect={handleBookSelect}
                />
              } />
              <Route path="/profile" element={
                <Profile currentUser={currentUser} />
              } />
              <Route path="/login" element={
                <LoginPage 
                  onLogin={handleLogin} 
                  currentUser={currentUser} 
                />
              } />
            </Routes>
          </div>

          <aside className="app-sidebar">
            <RentalManagement 
              currentUser={currentUser} 
              onReturn={handleReturn} 
              onBookSelect={handleBookSelect} 
            />
          </aside>
        </main>

        {selectedBook && (
          <BookDetail 
            book={selectedBook} 
            onClose={handleCloseDetail} 
            onRent={handleRent} 
            currentUser={currentUser} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;
