import React from 'react';
import SearchBar from './SearchBar';
import BookList from './BookList';
import '../styles/HomePage.css';

const HomePage = ({ 
  searchTerm, 
  searchCategory, 
  onSearch, 
  onBookSelect 
}) => {
  return (
    <div className="home-page">
      <div className="home-header">
        <h2>Biblioteca Digital</h2>
        <p>Explora nuestra colección de libros y encuentra tu próxima lectura</p>
      </div>
      
      <SearchBar onSearch={onSearch} />
      
      <BookList 
        onBookSelect={onBookSelect} 
        searchTerm={searchTerm} 
        searchCategory={searchCategory} 
      />
    </div>
  );
};

export default HomePage;