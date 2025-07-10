#!/bin/bash

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Load initial data
python manage.py loaddata library/fixtures/initial_data.json

echo "Setup complete!"