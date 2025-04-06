const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <div className={`card border-l-4 ${color} hover:shadow-lg transition-shadow cursor-pointer bg-blue-300/40 rounded-md p-2`}>
      <div className="flex justify-between ml-[3%]">
        <div>
          <h3 className="text-lg font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`text-2xl ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 