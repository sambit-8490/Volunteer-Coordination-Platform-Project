const variantConfig = {
  primary: {
    iconBg: '#e0f2f1',
    iconColor: '#0891b2',
  },
  secondary: {
    iconBg: '#fff0eb',
    iconColor: '#f97316',
  },
  success: {
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  warning: {
    iconBg: '#f3f4f6',
    iconColor: '#6b7280',
  },
  default: {
    iconBg: '#f3f4f6',
    iconColor: '#6b7280',
  },
};

const StatsCard = ({ title, value, icon, trend, variant = 'default' }) => {
  const config = variantConfig[variant] || variantConfig.default;

  return (
    <div
      className="card h-100"
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        background: '#fff',
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="mb-2" style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
              {title}
            </p>
            <h3 className="mb-0 fw-bold" style={{ fontSize: '26px', color: '#111827' }}>
              {value}
            </h3>
            {trend && (
              <small className="text-success fw-medium mt-1 d-block">
                <i className="bi bi-arrow-up-short"></i> {trend}
              </small>
            )}
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: config.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i className={`bi ${icon}`} style={{ fontSize: '20px', color: config.iconColor }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
