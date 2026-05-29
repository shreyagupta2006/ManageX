import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Login from './components/Auth/login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import Toast from './components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const { user, email, loginUser } = useContext(AppContext);

  // Authenticate wrapper passed to the Login component
  const handleLogin = (loginEmail, password) => {
    loginUser(loginEmail, password);
  };

  return (
    <div className="relative min-h-screen w-screen bg-background text-foreground overflow-x-hidden antialiased">
      {/* Page transitions wrapper */}
      <AnimatePresence mode="wait">
        {/* Case 1: Unauthenticated -> Login workspace */}
        {!user && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            <Login handleLogin={handleLogin} />
          </motion.div>
        )}

        {/* Case 2: Administrator logged in */}
        {user === 'admin' && (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <AdminDashboard />
          </motion.div>
        )}

        {/* Case 3: Employee logged in */}
        {user === 'employee' && (
          <motion.div
            key="employee-dashboard"
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <EmployeeDashboard email={email} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global floating notification toasts alert stacked queue */}
      <Toast />
    </div>
  );
};

export default App;