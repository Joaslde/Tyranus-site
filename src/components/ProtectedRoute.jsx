import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
/**
 * ProtectedRoute
 * @param requiredRole - 'etudiant' | 'professeur' | 'super_admin' | null (any logged-in user)
 * @param requireValidated - if true, student must have statut='valide'
 */
const ProtectedRoute = ({ children, requiredRole = null, requireValidated = false }) => {
  const { user, profile, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1A237E] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#1A237E] font-medium">Chargement...</p>
        </div>
      </div>
    );
  }
  // Not logged in
  if (!user) return <Navigate to="/login" replace />;
  // Profile not yet created (edge case)
  if (!profile) return <Navigate to="/login" replace />;
  // Role check
  if (requiredRole && profile.role !== requiredRole) {
    // Redirect to appropriate dashboard
    if (profile.role === 'super_admin') return <Navigate to="/admin" replace />;
    if (profile.role === 'professeur') return <Navigate to="/prof/dashboard" replace />;
    return <Navigate to="/etudiant/dashboard" replace />;
  }
  // Validation check (for students)
  if (requireValidated && profile.statut !== 'valide') {
    return <Navigate to="/attente-validation" replace />;
  }
  return children;
};
export default ProtectedRoute;