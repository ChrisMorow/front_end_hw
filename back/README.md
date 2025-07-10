# Library API

This is a Django REST API backend for a library application. It provides endpoints for managing books, users, rentals, and reviews.

## Requirements

- Python 3.8+
- Django 5.2+
- Django REST Framework
- django-cors-headers

## Installation

1. Clone the repository
2. Install the required packages:
   ```
   pip install django djangorestframework django-cors-headers
   ```
3. Run the setup script to create the database and load initial data:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```
## Create Admin User
```
python manage.py createsuperuser

```

## Running the server

```
python manage.py runserver
```

The API will be available at http://localhost:8000/api/

## API Endpoints

### Books

- `GET /api/books/` - List all books
- `GET /api/books/{id}/` - Get a specific book
- `POST /api/books/` - Create a new book
- `PUT /api/books/{id}/` - Update a book
- `DELETE /api/books/{id}/` - Delete a book
- `POST /api/books/{id}/add_review/` - Add a review to a book

### Reviews

- `GET /api/reviews/` - List all reviews
- `GET /api/reviews/{id}/` - Get a specific review
- `POST /api/reviews/` - Create a new review
- `PUT /api/reviews/{id}/` - Update a review
- `DELETE /api/reviews/{id}/` - Delete a review

### Users

- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get a specific user
- `POST /api/users/` - Create a new user
- `PUT /api/users/{id}/` - Update a user
- `DELETE /api/users/{id}/` - Delete a user
- `POST /api/users/login/` - Login with user ID

### Rentals

- `GET /api/rentals/` - List all rentals
- `GET /api/rentals/{id}/` - Get a specific rental
- `POST /api/rentals/` - Create a new rental
- `PUT /api/rentals/{id}/` - Update a rental
- `DELETE /api/rentals/{id}/` - Delete a rental
- `POST /api/rentals/{id}/return_book/` - Mark a rental as returned
- `POST /api/rentals/{id}/extend_rental/` - Extend a rental period

## Documentation

API documentation is available at http://localhost:8000/docs/