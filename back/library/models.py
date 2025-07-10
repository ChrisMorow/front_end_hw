from django.db import models
from django.contrib.auth.models import User

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    publication_year = models.IntegerField()
    isbn10 = models.CharField(max_length=10, blank=True, null=True)
    isbn13 = models.CharField(max_length=13, blank=True, null=True)
    cover_image = models.URLField(blank=True, null=True)
    synopsis = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class Review(models.Model):
    book = models.ForeignKey(Book, related_name='reviews', on_delete=models.CASCADE)
    user = models.CharField(max_length=100)  # Just storing username as string
    rating = models.IntegerField()
    comment = models.TextField()

    def __str__(self):
        return f"Review by {self.user} for {self.book.title}"

class LibraryUser(models.Model):
    user_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class Rental(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(LibraryUser, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    returned = models.BooleanField(default=False)
    extended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.book.title} rented by {self.user.name}"
