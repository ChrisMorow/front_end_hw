from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book, Review, LibraryUser, Rental
from .serializers import BookSerializer, ReviewSerializer, LibraryUserSerializer, RentalSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        book = self.get_object()
        data = request.data
        data['book'] = book.id

        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class LibraryUserViewSet(viewsets.ModelViewSet):
    queryset = LibraryUser.objects.all()
    serializer_class = LibraryUserSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        user_name = request.data.get('id')
        if not user_name:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = LibraryUser.objects.filter(user_id=user_name).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LibraryUserSerializer(user)
        return Response(serializer.data)

class RentalViewSet(viewsets.ModelViewSet):
    queryset = Rental.objects.all()
    serializer_class = RentalSerializer

    def perform_create(self, serializer):
        book = get_object_or_404(Book, id=self.request.data.get('book'))
        if not book.available:
            return Response({'error': 'Book is not available'}, status=status.HTTP_400_BAD_REQUEST)

        book.available = False
        book.save()
        serializer.save()

    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        rental = self.get_object()
        if rental.returned:
            return Response({'error': 'Book already returned'}, status=status.HTTP_400_BAD_REQUEST)

        rental.returned = True
        rental.save()

        book = rental.book
        book.available = True
        book.save()

        serializer = RentalSerializer(rental)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def extend_rental(self, request, pk=None):
        rental = self.get_object()
        if rental.returned:
            return Response({'error': 'Cannot extend a returned rental'}, status=status.HTTP_400_BAD_REQUEST)
        if rental.extended:
            return Response({'error': 'Rental already extended'}, status=status.HTTP_400_BAD_REQUEST)

        new_end_date = request.data.get('end_date')
        if not new_end_date:
            return Response({'error': 'New end date is required'}, status=status.HTTP_400_BAD_REQUEST)

        rental.end_date = new_end_date
        rental.extended = True
        rental.save()

        serializer = RentalSerializer(rental)
        return Response(serializer.data)
