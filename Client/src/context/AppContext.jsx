import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [sideBar, setSideBar] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userRole, setUserRole] = useState(() => {
    const storedRole = localStorage.getItem('userRole');
    return storedRole ? storedRole : null;
  });
  const checkDevice = () => {
    if (window.innerWidth < 768) {
      setSideBar(false);
    }
  };
  useEffect(() => {
    checkDevice();
  }, []);
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  // Function to trigger data refresh across components
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Set up interval refresh (every 60 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000); // 60 seconds
    return () => clearInterval(intervalId);
  }, [refreshData]);

  const handleRoleSelect = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const value = {
    userRole,
    setUserRole,
    handleRoleSelect,
    handleLogout,
    sideBar, 
    setSideBar,
    refreshTrigger,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext; 