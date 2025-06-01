# Nail Salon Frontend

### Customer Features
- Browse available services with category filtering
- View staff members and their profiles
- Book appointments with real-time availability checking
- Manage appointments (view, cancel)
- Update profile information
- Secure authentication with JWT tokens

### Staff Features
- Dashboard with daily statistics
- View and manage appointment schedule
- Mark appointments as completed
- Track revenue and performance
- Weekly calendar view

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Forms**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Available Scripts
- `npm install` - Install dependencies
- `npm run dev` - Run development server

## API Integration

The frontend integrates with the backend API for:
- User authentication (login, register, token refresh)
- Service management
- Appointment booking and management
- User profile management
- Staff schedule management

## Authentication

The app uses JWT tokens for authentication with:
- Automatic token refresh
- Protected routes using Next.js middleware
- Role-based access control (Customer/Staff)

## Backend Repository

Backend API: [https://github.com/GoranSuvacarev/nail-salon-backend](https://github.com/GoranSuvacarev/nail-salon-backend)

