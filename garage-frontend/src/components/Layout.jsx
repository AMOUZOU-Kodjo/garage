import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Wrench, Car, Calendar, Users, BarChart3, ClipboardList, Gift, Settings, Home, Euro, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const navConfig = {
  receptionniste: [
    { to: '/app/receptionniste', label: 'Dashboard', icon: Home },
    { to: '/app/receptionniste/clients', label: 'Clients', icon: Users },
    { to: '/app/receptionniste/vehicules', label: 'Véhicules', icon: Car },
    { to: '/app/receptionniste/reservations', label: 'Réservations', icon: Calendar },
    { to: '/app/receptionniste/offres', label: 'Offres', icon: Gift },
    { to: '/app/receptionniste/temoignages', label: 'Témoignages', icon: MessageSquare },
  ],
  mecanicien: [
    { to: '/app/mecanicien', label: 'Dashboard', icon: Home },
    { to: '/app/mecanicien/vehicules', label: 'Mes Véhicules', icon: Car },
    { to: '/app/mecanicien/reparations', label: 'Réparations', icon: Wrench },
  ],
  directeur: [
    { to: '/app/directeur', label: 'Dashboard', icon: Home },
    { to: '/app/directeur/mecaniciens', label: 'Mécaniciens', icon: Settings },
    { to: '/app/directeur/finances', label: 'Finances', icon: Euro },
    { to: '/app/directeur/statistiques', label: 'Statistiques', icon: BarChart3 },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  const navItems = navConfig[user.role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6 text-blue-400" />
            GarageAuto
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="h-6 w-6" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{user.prenom} {user.nom}</p>
              <p className="text-gray-400 text-xs capitalize">{user.role}</p>
            </div>
            <button onClick={logout} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <LogOut className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6" /></button>
          <h1 className="text-lg font-semibold">GarageAuto</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
