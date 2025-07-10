from rest_framework import serializers
from .models import Book, Review, LibraryUser, Rental

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment']

class BookSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_year', 'isbn10', 'isbn13', 
                 'cover_image', 'synopsis', 'category', 'language', 'available', 'reviews']

class LibraryUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryUser
        fields = ['user_id', 'name', 'email']

class RentalSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.title')
    user_name = serializers.ReadOnlyField(source='user.name')
    
    class Meta:
        model = Rental
        fields = ['id', 'book', 'book_title', 'user', 'user_name', 'start_date', 'end_date', 'returned', 'extended']