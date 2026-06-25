import React, { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";

// Components

import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";
import NavigationSetter from "./components/NavigationSetter";
import PrivateRoute from "./components/PrivateRoute";

// Lazy load route components
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));

// Events
const Events = lazy(() => import('./pages/Events.jsx'));
const Donate = lazy(() => import("./pages/Donations.jsx"));

// Dashboards & Onboarding
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard.jsx'));
const VolunteerOnboarding = lazy(() => import("./pages/VolunteerOnBoarding.jsx"));
const NGODashboard = lazy(() => import("./pages/NGODashboard.jsx"));
const NGOOnboarding = lazy(() => import("./pages/NGOOnBoarding.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));

// Utility Pages
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function App() {
  return (
    <ErrorBoundary>
      <div className="d-flex flex-column min-vh-100">

        
        <div className="flex-grow-1 d-flex flex-column">
          <Suspense fallback={<LoadingFallback />}>
            <NavigationSetter />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<Events />} />
              <Route path="/donate" element={<Donate />} />
              
              {/* Volunteer Routes */}
              <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
              <Route path="/volunteer-onboarding" element={<VolunteerOnboarding />} />
              
              {/* NGO Routes */}
              <Route path="/ngo-dashboard" element={<NGODashboard />} />
              <Route path="/ngo-onboarding" element={<NGOOnboarding />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
