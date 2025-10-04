import { useState } from 'react';
import PortfolioInput from './PortfolioInput';
import MetricsCards from './MetricsCards';
import StressTestResults from './StressTestResults';
import PortfolioValueChart from './charts/PortfolioValueChart';
import DrawdownChart from './charts/DrawdownChart';
import RollingVolatilityChart from './charts/RollingVolatilityChart';
import CorrelationHeatmap from './charts/CorrelationHeatmap';
import VaRHistogram from './charts/VaRHistogram';
import { calculateMetrics } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleCalculate = async ({ tickers, weights, startDate, endDate }) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await calculateMetrics(tickers, weights, startDate, endDate);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Portfolio Risk Dashboard</h1>
          <p className="text-gray-600 mt-2">Analyze your portfolio risk metrics using Modern Portfolio Theory</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PortfolioInput onSubmit={handleCalculate} loading={loading} />
          </div>

          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Calculating risk metrics...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-400 rounded-lg p-6">
                <h3 className="text-red-800 font-semibold mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {results && !loading && (
              <div>
                <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Portfolio: {results.tickers.join(', ')}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Period: {results.start_date} to {results.end_date}
                  </p>
                </div>

                <MetricsCards metrics={results.metrics} loading={loading} />

                <PortfolioValueChart
                  portfolioValues={results.metrics?.portfolio_values}
                  loading={loading}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DrawdownChart
                    drawdownData={results.metrics?.drawdown_data}
                    loading={loading}
                  />
                  <RollingVolatilityChart
                    volatilityData={results.metrics?.rolling_volatility}
                    loading={loading}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CorrelationHeatmap
                    correlationMatrix={results.metrics?.correlation_matrix}
                    tickers={results.tickers}
                    loading={loading}
                  />
                  <VaRHistogram
                    returnDistribution={results.metrics?.return_distribution}
                    var95={results.metrics?.var?.daily?.historical_95}
                    var99={results.metrics?.var?.daily?.historical_99}
                    loading={loading}
                  />
                </div>

                <StressTestResults
                  stressTests={results.stress_test_periods}
                  loading={loading}
                />
              </div>
            )}

            {!results && !loading && !error && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600">Configure your portfolio and click "Calculate Risk Metrics" to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
