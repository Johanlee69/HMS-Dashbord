import { useNavigate } from 'react-router-dom';
import { FaUserInjured, FaUserMd, FaUserCog } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';

const DashboardSelection = () => {
  const navigate = useNavigate();
  const { handleRoleSelect } = useAppContext();

  const dashboardOptions = [
    {
      id: 'patient',
      name: 'Patient Dashboard',
      description: 'View and manage patient records, appointments, and admissions',
      icon: <FaUserInjured size={32} />,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      id: 'doctor',
      name: 'Doctor Dashboard',
      description: 'Manage staff, departments, and attendance',
      icon: <FaUserMd size={32} />,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-500'
    },
    {
      id: 'admin',
      name: 'Admin Dashboard',
      description: 'Oversee finances, billing, and insurance claims',
      icon: <FaUserCog size={32} />,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-500'
    }
  ];

  const handleDashboardSelect = (dashboardId) => {
    handleRoleSelect(dashboardId);
    navigate(`/dashboard/${dashboardId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <nav className='flex justify-between items-center bg-blue-500/20 p-[10px] rounded-md mb-[10px]'>
        <div></div>
        <div className='flex items-center gap-2'>
        <p>logged in as Admin</p>
        <div className='bg-blue-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer'>A</div>

        </div>
      </nav>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">Hospital Management System</h1>
          <p className="mt-3 text-xl text-gray-500">Select a dashboard to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleDashboardSelect(option.id)}
              className={`p-6 cursor-pointer rounded-lg border-2 transition-all ${option.color} flex flex-col items-center text-center h-full`}
            >
              <div className={`p-3 rounded-full ${option.iconColor} bg-white mb-4`}>
                {option.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{option.name}</h2>
              <p className="text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSelection; 