const MetricCard = ({ label, value, tooltip, type, loading }) => {
  const getColorClass = () => {
    if (type === 'risk') return 'border-red-200 bg-red-50';
    if (type === 'return') return 'border-green-200 bg-green-50';
    return 'border-gray-200 bg-gray-50';
  };

  const getTextColor = () => {
    if (type === 'risk') return 'text-red-700';
    if (type === 'return') return 'text-green-700';
    return 'text-gray-700';
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getColorClass()} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <div className="group relative">
          <svg
            className="w-4 h-4 text-gray-400 cursor-help"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
            {tooltip}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <p className={`text-2xl font-bold ${getTextColor()}`}>
          {value}
        </p>
      )}
    </div>
  );
};

const MetricsCards = ({ metrics, loading }) => {
  const metricsConfig = [
    {
      label: 'Portfolio Volatility',
      value: metrics?.annual_volatility ? `${(metrics.annual_volatility * 100).toFixed(2)}%` : 'N/A',
      tooltip: 'Annualized standard deviation of portfolio returns. Higher values indicate greater price fluctuations.',
      type: 'risk'
    },
    {
      label: 'Sharpe Ratio',
      value: metrics?.sharpe_ratio ? metrics.sharpe_ratio.toFixed(2) : 'N/A',
      tooltip: 'Risk-adjusted return metric. Higher values indicate better return per unit of risk. Above 1.0 is good, above 2.0 is excellent.',
      type: 'return'
    },
    {
      label: '95% VaR (Daily)',
      value: metrics?.var?.daily?.historical_95 ? `${(metrics.var.daily.historical_95 * 100).toFixed(2)}%` : 'N/A',
      tooltip: 'Value at Risk at 95% confidence. Expected maximum loss on 95% of trading days.',
      type: 'risk'
    },
    {
      label: '95% VaR (Annual)',
      value: metrics?.var?.annual?.historical_95 ? `${(metrics.var.annual.historical_95 * 100).toFixed(2)}%` : 'N/A',
      tooltip: 'Annualized Value at Risk at 95% confidence. Expected maximum loss over a year with 95% confidence.',
      type: 'risk'
    },
    {
      label: '99% VaR (Daily)',
      value: metrics?.var?.daily?.historical_99 ? `${(metrics.var.daily.historical_99 * 100).toFixed(2)}%` : 'N/A',
      tooltip: 'Value at Risk at 99% confidence. Expected maximum loss on 99% of trading days (more conservative).',
      type: 'risk'
    },
    {
      label: '99% VaR (Annual)',
      value: metrics?.var?.annual?.historical_99 ? `${(metrics.var.annual.historical_99 * 100).toFixed(2)}%` : 'N/A',
      tooltip: 'Annualized Value at Risk at 99% confidence. Expected maximum loss over a year with 99% confidence.',
      type: 'risk'
    },
    {
      label: 'Maximum Drawdown',
      value: metrics?.max_drawdown ? `${(metrics.max_drawdown * 100).toFixed(2)}%` : 'N/A',
      tooltip: 'Largest peak-to-trough decline in portfolio value. Indicates worst historical loss period.',
      type: 'risk'
    },
    {
      label: 'Beta (vs S&P 500)',
      value: metrics?.beta !== null && metrics?.beta !== undefined ? metrics.beta.toFixed(2) : 'N/A',
      tooltip: 'Measure of portfolio volatility relative to the S&P 500. Beta of 1.0 means same volatility as market, >1.0 is more volatile, <1.0 is less volatile.',
      type: 'risk'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Risk Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsConfig.map((metric, index) => (
          <MetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            tooltip={metric.tooltip}
            type={metric.type}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsCards;
