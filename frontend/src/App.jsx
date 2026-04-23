import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';
import { LayoutDashboard, CalendarPlus, Settings, LogOut, User as UserIcon, ShieldAlert, Layout } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 font-semibold' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );
};

const MainLayout = ({ children }) => {
  const { user, logout, login } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full z-10">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">SmartHub</span>
        </div>

        <nav className="flex-1 space-y-2">
          {!user ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase px-4 mb-2">Simulate Authentication</p>
              <button 
                onClick={() => login('USER')}
                className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Login as User
              </button>
              <button 
                onClick={() => login('ADMIN')}
                className="w-full text-left px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Login as Admin
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-400 uppercase px-4 mb-2">Main Menu</p>
              <SidebarLink to="/my-bookings" icon={LayoutDashboard}>My Bookings</SidebarLink>
              <SidebarLink to="/new-booking" icon={CalendarPlus}>New Request</SidebarLink>
              
              {user.role === 'ADMIN' && (
                <>
                  <p className="text-xs font-bold text-slate-400 uppercase px-4 mt-8 mb-2">Administration</p>
                  <SidebarLink to="/admin" icon={Settings}>Admin Control</SidebarLink>
                </>
              )}
            </>
          )}
        </nav>

        {user && (
          <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <UserIcon size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-semibold"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};

const Unauthorized = () => (
  <div className="h-full flex flex-col items-center justify-center text-center p-8">
    <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
      <ShieldAlert size={40} />
    </div>
    <h1 className="text-4xl font-black text-slate-800 mb-2">Access Denied</h1>
    <p className="text-slate-500 max-w-md mb-8">You don't have the required administrative permissions to view this secure module.</p>
    <Link to="/" className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all">
      Return to Safety
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/my-bookings" replace />} />
            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/new-booking" 
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminBookings />
                </ProtectedRoute>
              } 
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
