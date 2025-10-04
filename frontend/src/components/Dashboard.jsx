import { useState } from 'react';
import PortfolioInput from './PortfolioInput';
import MetricsCards from './MetricsCards';
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

                <MetricsCards metrics={results.metrics} />

                {results.stress_tests && (
                  <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Stress Test Results</h3>

                    {results.stress_tests.covid_crash && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">
                          {results.stress_tests.covid_crash.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">{results.stress_tests.covid_crash.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Return</p>
                            <p className="text-lg font-semibold text-red-600">
                              {results.stress_tests.covid_crash.total_return_pct.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Max Drawdown</p>
                            <p className="text-lg font-semibold text-red-600">
                              {results.stress_tests.covid_crash.max_drawdown_pct.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Worst Day</p>
                            <p className="text-lg font-semibold text-red-600">
                              {results.stress_tests.covid_crash.worst_day_return_pct.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {results.stress_tests.covid_crash.worst_day_date}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.stress_tests['2022_downturn'] && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">
                          {results.stress_tests['2022_downturn'].name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">{results.stress_tests['2022_downturn'].description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Return</p>
                            <p className="text-lg font-semibold text-red-600">
                              {results.stress_tests['2022_downturn'].total_return_pct.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Max Drawdown</p>
                            <p className="text-lg font-semibold text-red-600">
                              {results.stress_tests['2022_downturn'].max_drawdown_pct.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Worst Day</p>
                            <p className="text-lg font-semibold text-red-600">
                              {results.stress_tests['2022_downturn'].worst_day_return_pct.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {results.stress_tests['2022_downturn'].worst_day_date}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.stress_tests.worst_day_overall && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">Worst Day Overall</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {results.stress_tests.worst_day_overall.worst_day_date}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Loss</p>
                            <p className="text-lg font-semibold text-red-600">
                              {results.stress_tests.worst_day_overall.worst_day_return_pct.toFixed(2)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Portfolio Value Change</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {results.stress_tests.worst_day_overall.portfolio_value_before?.toFixed(2)} → {results.stress_tests.worst_day_overall.portfolio_value_after?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
