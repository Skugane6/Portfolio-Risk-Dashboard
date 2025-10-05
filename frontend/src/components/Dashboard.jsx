import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Loader2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-lg opacity-75"></div>
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Portfolio Risk Dashboard</h1>
              <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                <Sparkles className="w-3 h-3" />
                Advanced Analytics with Modern Portfolio Theory
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6">
              <PortfolioInput onSubmit={handleCalculate} loading={loading} />
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-strong rounded-2xl p-16 text-center glow-cyan"
                >
                  <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Analyzing Portfolio</h3>
                    <p className="text-gray-400">Calculating risk metrics and visualizations...</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-strong rounded-2xl p-6 border border-red-500/30"
                >
                  <h3 className="text-red-400 font-semibold mb-2 text-lg">Error</h3>
                  <p className="text-gray-300">{error}</p>
                </motion.div>
              )}

              {results && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Portfolio Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative glass-strong rounded-2xl p-6 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {results.tickers.join(' • ')}
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Analysis Period: {results.start_date} — {results.end_date}
                      </p>
                    </div>
                  </motion.div>

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
                </motion.div>
              )}

              {!results && !loading && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-strong rounded-2xl p-20 text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-8"
                  >
                    <BarChart3 className="w-24 h-24 mx-auto text-cyan-400/50" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">Ready to Begin</h3>
                  <p className="text-gray-400 text-lg">Configure your portfolio to unlock powerful insights</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
