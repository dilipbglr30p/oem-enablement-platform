import { Routes, Route } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import { lazy, Suspense } from "react";
import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import Certifications from "../pages/Certifications";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

// Lazy load portal pages for better performance
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const Compliance = lazy(() => import("../pages/Compliance"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Settings = lazy(() => import("../pages/Settings"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const RouterWrapper = () => {
  usePageTracking();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/certifications" element={<Certifications />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      
      {/* Portal Routes - Lazy Loaded */}
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        }
      />
      <Route
        path="/orders"
        element={
          <Suspense fallback={<PageLoader />}>
            <Orders />
          </Suspense>
        }
      />
      <Route
        path="/compliance"
        element={
          <Suspense fallback={<PageLoader />}>
            <Compliance />
          </Suspense>
        }
      />
      <Route
        path="/analytics"
        element={
          <Suspense fallback={<PageLoader />}>
            <Analytics />
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        }
      />
      
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouterWrapper;
