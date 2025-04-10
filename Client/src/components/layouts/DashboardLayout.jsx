import Sidebar from './Sidebar';
import { GiHamburgerMenu } from "react-icons/gi";
import { useAppContext } from '../../context/AppContext';

const DashboardLayout = ({ children, dashboardType }) => {
  const { sideBar, setSideBar } = useAppContext();
  
  return (
    <div className="flex min-h-[100%] bg-gray-50">
      <Sidebar dashboardType={dashboardType} />
      {/* Hamburger menu with improved animation */}
      <div className={`fixed z-20 top-6 md:left-10 right-5 transform transition-all duration-300 ease-in-out ${sideBar ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
        <GiHamburgerMenu 
          className="text-black size-8 cursor-pointer p-1 bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors" 
          onClick={() => setSideBar(!sideBar)} 
        />
      </div>
      <main className={`flex-1 p-6 w-full  transition-all duration-300 ease-in-out md:blur-none ${sideBar ? 'pl-72 blur-sm' : 'pl-6'} z-0`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 