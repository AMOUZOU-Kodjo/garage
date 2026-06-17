import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import DashboardReceptionniste from './pages/receptionniste/Dashboard';
import DashboardMecanicien from './pages/mecanicien/Dashboard';
import DashboardDirecteur from './pages/directeur/Dashboard';
import ClientsPage from './pages/receptionniste/ClientsPage';
import VehiclesPage from './pages/receptionniste/VehiclesPage';
import ReservationsPage from './pages/receptionniste/ReservationsPage';
import OffersPage from './pages/receptionniste/OffersPage';
import MesRepairs from './pages/mecanicien/MesRepairs';
import MesVehicules from './pages/mecanicien/MesVehicules';
import GestionMecaniciens from './pages/directeur/GestionMecaniciens';
import Finances from './pages/directeur/Finances';
import Statistiques from './pages/directeur/Statistiques';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<RoleRedirect />} />
            <Route path="receptionniste">
              <Route index element={<DashboardReceptionniste />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="vehicules" element={<VehiclesPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="offres" element={<OffersPage />} />
            </Route>
            <Route path="mecanicien">
              <Route index element={<DashboardMecanicien />} />
              <Route path="vehicules" element={<MesVehicules />} />
              <Route path="reparations" element={<MesRepairs />} />
            </Route>
            <Route path="directeur">
              <Route index element={<DashboardDirecteur />} />
              <Route path="mecaniciens" element={<GestionMecaniciens />} />
              <Route path="finances" element={<Finances />} />
              <Route path="statistiques" element={<Statistiques />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const routes = { receptionniste: '/receptionniste', mecanicien: '/mecanicien', directeur: '/directeur' };
  return <Navigate to={routes[user.role] || '/login'} replace />;
}
