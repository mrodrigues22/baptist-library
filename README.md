# Baptist Library Management System

A modern, full-stack library management system designed for baptist churches to efficiently manage their book collections, member loans, and library operations.

![.NET 8.0](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.0-4169E1?logo=postgresql)

## 📚 Features

### Book Management
- **Comprehensive Book Catalog**: Add, edit, and remove books with detailed information
- **Multi-Author Support**: Associate multiple authors with each book
- **Category Organization**: Organize books by categories and tags
- **Publisher Information**: Track publisher details for each book
- **Advanced Search**: Search books by title, author, category, ISBN, and more

### Loan Management
- **Member Loans**: Track book loans for library members
- **Loan Status Tracking**: Monitor active, overdue, and returned loans
- **Self-Service Loans**: Members can request loans for themselves
- **Loan History**: View complete loan history for books and members
- **Due Date Management**: Set and track loan due dates

### User Management
- **Role-Based Access Control**: Admin and regular user roles
- **User Authentication**: Secure JWT-based authentication
- **Member Profiles**: Manage library member information
- **Account Management**: User registration and profile management

### System Features
- **Rate Limiting**: API rate limiting to prevent abuse
- **Settings Management**: Configurable system settings
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **RESTful API**: Well-structured API with Swagger documentation

## 🏗️ Technology Stack

### Backend (API)
- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: ASP.NET Core Identity + JWT Bearer tokens
- **Documentation**: Swagger/OpenAPI
- **Rate Limiting**: AspNetCoreRateLimit
- **ORM**: Entity Framework Core 8.0

### Frontend
- **Framework**: React 18.2 with TypeScript
- **Routing**: React Router DOM 7.2
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Heroicons
- **Tables**: TanStack React Table
- **Notifications**: React Toastify
- **Testing**: Jest + React Testing Library

## 🚀 Getting Started

### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v12 or higher)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrodrigues22/baptist-library.git
   cd baptist-library
   ```

2. **Configure the database**
   - Update `api/appsettings.json` with your PostgreSQL connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=baptist_library;Username=your_user;Password=your_password"
     }
   }
   ```

3. **Configure JWT settings**
   - Update the JWT settings in `api/appsettings.json`:
   ```json
   {
     "JWT": {
       "Issuer": "http://localhost:5246",
       "Audience": "http://localhost:5246",
       "SigningKey": "your-very-secure-signing-key-at-least-32-characters-long"
     }
   }
   ```

4. **Run database migrations**
   ```bash
   cd api
   dotnet ef database update
   ```

5. **Start the API**
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:5246`
   Swagger documentation: `http://localhost:5246/swagger`

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   - Update the API base URL in the frontend configuration if different from default

4. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

## 📖 API Documentation

Once the backend is running, access the Swagger documentation at:
```
http://localhost:5246/swagger
```

### Main API Endpoints

#### Authentication
- `POST /api/account/register` - Register new user
- `POST /api/account/login` - User login

#### Books
- `GET /api/books` - Get all books (paginated)
- `GET /api/books/{id}` - Get book details
- `POST /api/books` - Create new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

#### Loans
- `GET /api/loan` - Get all loans
- `GET /api/loan/{id}` - Get loan details
- `POST /api/loan` - Create new loan
- `POST /api/loan/self` - Create loan for self
- `PUT /api/loan/{id}` - Update loan
- `DELETE /api/loan/{id}` - Delete loan

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user

## 🗄️ Database Schema

The system uses the following main entities:
- **Book** - Book information
- **Author** - Author details
- **BookAuthor** - Many-to-many relationship
- **Category** - Book categories
- **BookCategory** - Many-to-many relationship
- **Publisher** - Publisher information
- **TagWord** - Book tags
- **BookTag** - Many-to-many relationship
- **Loan** - Loan records
- **ApplicationUser** - User accounts
- **Setting** - System settings

## 🧪 Testing

### Backend Tests
```bash
cd api
dotnet test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🔒 Security Features

- JWT-based authentication
- Role-based authorization
- API rate limiting (100 requests per minute)
- Password hashing with ASP.NET Core Identity
- CORS configuration
- SQL injection protection via EF Core

## 📦 Deployment

See `frontend/DEPLOYMENT-CHECKLIST.md` for detailed deployment instructions.

### Quick Deployment Notes

**Frontend**: Ready for deployment on Vercel (configuration included)
**Backend**: Can be deployed to Azure, AWS, or any hosting service supporting .NET 8.0

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **mrodrigues22** - [GitHub](https://github.com/mrodrigues22)

## 🙏 Acknowledgments

- Built for Baptist churches to better serve their communities
- Special thanks to all contributors and users

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Made with ❤️ for the Baptist Church community**
