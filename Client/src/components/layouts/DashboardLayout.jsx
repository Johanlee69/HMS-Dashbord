import Sidebar from './Sidebar';
import { GiHamburgerMenu } from "react-icons/gi";
import { useAppContext } from '../../context/AppContext';
const DashboardLayout = ({ children, dashboardType }) => {
  const { sideBar, setSideBar } = useAppContext();
  return (
    <div className="flex min-h-[100%] bg-gray-50">
      <Sidebar dashboardType={dashboardType} />
        {!sideBar && <GiHamburgerMenu className='text-black absolute size-7 md:left-10 md:top-6  top-6 right-5 cursor-pointer' onClick={() => setSideBar(!sideBar)} />}
      <main className="flex-1 p-6 w-[100vw]">
        <div className="max-w-7xl mx-auto  ">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 