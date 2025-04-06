import { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [sideBar, setSideBar] = useState(true);
  const [userRole, setUserRole] = useState(() => {
    const storedRole = localStorage.getItem('userRole');
    return storedRole ? storedRole : null;
  });
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

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
    handleLogout,sideBar, setSideBar
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext; 