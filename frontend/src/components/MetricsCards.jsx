const MetricsCards = ({ metrics }) => {
  if (!metrics) return null;

  const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;
  const formatNumber = (value, decimals = 2) => value.toFixed(decimals);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Annual Return</h3>
          <p className="text-3xl font-bold text-green-600">{formatPercent(metrics.annual_return)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Volatility</h3>
          <p className="text-3xl font-bold text-blue-600">{formatPercent(metrics.annual_volatility)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Sharpe Ratio</h3>
          <p className="text-3xl font-bold text-purple-600">{formatNumber(metrics.sharpe_ratio)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Max Drawdown</h3>
          <p className="text-3xl font-bold text-red-600">{formatPercent(metrics.max_drawdown)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Value at Risk (VaR)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Daily VaR</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Historical 95%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.daily.historical_95)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Historical 99%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.daily.historical_99)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parametric 95%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.daily.parametric_95)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parametric 99%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.daily.parametric_99)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Annual VaR</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Historical 95%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.annual.historical_95)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Historical 99%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.annual.historical_99)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parametric 95%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.annual.parametric_95)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parametric 99%:</span>
                <span className="font-semibold">{formatPercent(metrics.var.annual.parametric_99)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {metrics.beta !== null && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">Portfolio Beta</h3>
          <p className="text-2xl font-semibold text-indigo-600">{formatNumber(metrics.beta, 3)}</p>
          <p className="text-sm text-gray-600 mt-1">Relative to S&P 500 (SPY)</p>
        </div>
      )}
    </div>
  );
};

export default MetricsCards;
