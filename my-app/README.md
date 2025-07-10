# Biblioteca Online

Una aplicación web que permite a los usuarios explorar, buscar y alquilar libros de una biblioteca digital.

## Funcionalidades

- **Catálogo de libros**: Visualización de todos los libros disponibles en la biblioteca
- **Búsqueda avanzada**: Buscar libros por título, autor, ISBN, descripción, categoría o idioma
- **Detalles de libros**: Ver información detallada de cada libro, incluyendo sinopsis, críticas y disponibilidad
- **Sistema de alquiler**: Alquilar libros por diferentes períodos de tiempo (7, 14, 21 o 30 días)
- **Gestión de alquileres**: Ver los libros actualmente alquilados y el tiempo restante
- **Extensión de alquiler**: Ampliar el período de alquiler de un libro
- **Devolución de libros**: Devolver libros alquilados antes de la fecha límite
- **Navegación por rutas**: Sistema de navegación basado en React Router para una experiencia de usuario mejorada
- **Perfil de usuario**: Sección de "Mi Perfil" donde los usuarios pueden ver su información y su historial de alquileres

## Tecnologías utilizadas

- React
- React Router
- Vite
- JavaScript (ES6+)
- CSS3

## Estructura del proyecto

```
src/
├── components/         # Componentes React
│   ├── BookList.jsx    # Lista de libros
│   ├── BookDetail.jsx  # Detalles de un libro
│   ├── SearchBar.jsx   # Barra de búsqueda
│   ├── RentalManagement.jsx  # Gestión de alquileres
│   ├── Login.jsx       # Componente de inicio de sesión (navbar)
│   ├── LoginPage.jsx   # Página de inicio de sesión
│   ├── Profile.jsx     # Página de perfil de usuario
│   ├── HomePage.jsx    # Página principal
│   └── Navbar.jsx      # Barra de navegación
├── styles/             # Archivos CSS
│   ├── App.css
│   ├── BookList.css
│   ├── BookDetail.css
│   ├── SearchBar.css
│   ├── RentalManagement.css
│   ├── Login.css
│   ├── LoginPage.css
│   ├── Profile.css
│   ├── HomePage.css
│   └── Navbar.css
├── data.json           # Base de datos simulada
├── App.jsx             # Componente principal con React Router
└── main.jsx            # Punto de entrada
```

## Cómo ejecutar el proyecto

### Frontend (React)

1. Clona este repositorio
2. Instala las dependencias con `npm install`
3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
4. Inicia el servidor de desarrollo con `npm run dev`
5. Abre tu navegador en `http://localhost:5173`

### Backend (Django)

1. Navega a la carpeta `backend`
2. Sigue las instrucciones en el archivo `README.md` de la carpeta backend para configurar y ejecutar el servidor Django
3. Asegúrate de que el servidor Django esté ejecutándose en `http://localhost:8000` antes de usar la aplicación React

## Uso de la aplicación

1. **Navegación**: Utiliza la barra de navegación para moverte entre las diferentes secciones de la aplicación
2. **Inicio de sesión**: Haz clic en "Iniciar sesión" y usa los IDs de usuario "user123" o "user456"
3. **Búsqueda de libros**: Utiliza la barra de búsqueda en la página principal para encontrar libros
4. **Ver detalles**: Haz clic en cualquier libro para ver sus detalles
5. **Alquilar un libro**: En la vista de detalles, selecciona un período y haz clic en "Alquilar"
6. **Gestionar alquileres**: Consulta tus libros alquilados en el panel lateral
7. **Extender alquiler**: Desde la vista de detalles o el panel de gestión, puedes extender el período
8. **Devolver libro**: Haz clic en "Devolver libro" en el panel de gestión
9. **Ver perfil**: Accede a "Mi Perfil" desde la barra de navegación para ver tu información y tu historial de alquileres

## Datos de prueba

La aplicación incluye datos de muestra con 5 libros y 2 usuarios para probar todas las funcionalidades.
