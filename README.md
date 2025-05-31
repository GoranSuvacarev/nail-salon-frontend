# Nail Salon Frontend

A modern web application for nail salon appointment management built with Next.js, TypeScript, and Tailwind CSS.

## Features

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

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   ├── (app)/             # Main application pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── appointments/      # Appointment-related components
│   ├── layout/           # Layout components
│   ├── services/         # Service-related components
│   ├── staff/            # Staff-related components
│   └── ui/               # Generic UI components
├── lib/                   # Utilities and configurations
│   ├── api/              # API service functions
│   ├── auth.tsx          # Authentication context
│   ├── axios.ts          # Axios configuration
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server

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

Backend API: [https://github.com/yourusername/nail-salon-backend](https://github.com/GoranSuvacarev/nail-salon-backend)

