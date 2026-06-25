const DashboardHeader = ({ title, subtitle, userName }) => {
  return (
    <div className="hero-section text-white mb-4 rounded-3 p-4">
      <div className="container">
        <h1 className="display-6 fw-bold">{title}</h1>
        {userName && (
          <p className="lead mt-2 mb-1">Welcome, {userName}</p>
        )}
        <p className="opacity-75 mb-0">{subtitle}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
