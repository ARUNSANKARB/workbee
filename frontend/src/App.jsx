import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Toast from './components/common/Toast';
import useNotification from './hooks/useNotification';

import WorkerProfile from './pages/WorkerProfile';
import BookingCreate from './pages/BookingCreate';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import WorkerDashboard from './pages/dashboards/WorkerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import BecomeWorker from './pages/BecomeWorker';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuthStore();
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/login" />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" />;

  return children;
};

function App() {
  const { notification } = useNotification();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/become-worker" element={<BecomeWorker />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route path="/worker/:id" element={<WorkerProfile />} />
          <Route path="/booking/create/:id" element={<ProtectedRoute requiredRole="customer"><BookingCreate /></ProtectedRoute>} />

          <Route path="/customer-dashboard" element={<ProtectedRoute requiredRole="customer"><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/worker-dashboard" element={<ProtectedRoute requiredRole="worker"><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Global Toast */}
        {notification && <Toast notification={notification} />}
      </div>
    </Router>
  );
}

export default App;
