import React from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

// Public pages
import Home from "@/pages/Home";
import Resources from "@/pages/Resources";
import Documents from "@/pages/Documents";
import Administration from "@/pages/Administration";
import Formateurs from "@/pages/Formateurs";
import Visionnaire from "@/pages/Visionnaire";
import History from "@/pages/History";
import Formation from "@/pages/Formation";
import Events from "@/pages/Events";
import Contact from "@/pages/Contact";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import AttenteValidation from "@/pages/AttenteValidation";

// Protected pages
import StudentDashboard from "@/pages/StudentDashboard";
import CoursPlayer from "@/pages/CoursPlayer";
import ProfDashboard from "@/pages/ProfDashboard";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";

// Pages that hide Navigation/Footer
const CLEAN_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/attente-validation",
  "/etudiant/dashboard",
  "/cours/",
  "/prof/dashboard",
  "/admin",
];

const isCleanRoute = (path) => CLEAN_ROUTES.some((r) => path.startsWith(r));

function AppContent() {
  const path = window.location.pathname;
  const clean = isCleanRoute(path);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!clean && <Navigation />}
      <main className="flex-grow">
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<Home />} />
          <Route path="/ressources" element={<Resources />} />
          <Route path="/ressources/documents" element={<Documents />} />
          <Route path="/administration" element={<Administration />} />
          <Route path="/formateurs" element={<Formateurs />} />
          <Route path="/visionnaire" element={<Visionnaire />} />
          <Route path="/histoire" element={<History />} />
          <Route path="/formation" element={<Formation />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/contact" element={<Contact />} />

          {/* ── Auth ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/attente-validation" element={<AttenteValidation />} />

          {/* ── Student (any validated user) ── */}
          <Route
            path="/etudiant/dashboard"
            element={
              <ProtectedRoute requiredRole="etudiant" requireValidated>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cours/:id"
            element={
              <ProtectedRoute requiredRole="etudiant" requireValidated>
                <CoursPlayer />
              </ProtectedRoute>
            }
          />

          {/* ── Professeur ── */}
          <Route
            path="/prof/dashboard"
            element={
              <ProtectedRoute requiredRole="professeur" requireValidated>
                <ProfDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Super Admin ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="super_admin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!clean && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <>
      <Helmet>
        <title>
          École Tyrannus — Formation Biblique et Théologique d'Excellence
        </title>
        <meta
          name="description"
          content="École Tyrannus offre une formation biblique et théologique de qualité. Rejoignez nos étudiants dans leur parcours spirituel et académique."
        />
      </Helmet>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
