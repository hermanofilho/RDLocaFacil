
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { initializeMockData } from "@/services/mockDataService";
import { useEffect } from "react";

// Layout
import { AppLayout } from "@/components/AppLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import ClientsPage from "@/pages/ClientsPage";
import MotorcyclesPage from "@/pages/MotorcyclesPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import NotFound from "@/pages/NotFound";

// Components
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<DashboardPage />} />
                
                {/* Admin only routes */}
                <Route path="/users" element={
                  <ProtectedRoute adminOnly>
                    <UsersPage />
                  </ProtectedRoute>
                } />
                
                {/* Client routes */}
                <Route path="/clients" element={<ClientsPage />} />
                
                {/* Motorcycle routes */}
                <Route path="/motorcycles" element={<MotorcyclesPage />} />
                
                {/* Rental routes */}
                <Route path="/rentals" element={
                  <ComingSoonPage 
                    title="Locações" 
                    description="Registro e controle de locações" 
                  />
                } />
                
                {/* Payment routes */}
                <Route path="/payments" element={
                  <ComingSoonPage 
                    title="Pagamentos" 
                    description="Gerenciamento de pagamentos" 
                  />
                } />
                
                {/* Contract routes */}
                <Route path="/contracts" element={
                  <ComingSoonPage 
                    title="Contratos" 
                    description="Emissão e controle de contratos" 
                  />
                } />
                
                {/* Report routes - Admin only */}
                <Route path="/reports" element={
                  <ProtectedRoute adminOnly>
                    <ComingSoonPage 
                      title="Relatórios" 
                      description="Geração de relatórios e análises" 
                    />
                  </ProtectedRoute>
                } />
                
                {/* Settings routes - Admin only */}
                <Route path="/settings" element={
                  <ProtectedRoute adminOnly>
                    <ComingSoonPage 
                      title="Configurações" 
                      description="Configurações do sistema" 
                    />
                  </ProtectedRoute>
                } />
                
                {/* Unauthorized access page */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
              </Route>
              
              {/* Not found - catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
