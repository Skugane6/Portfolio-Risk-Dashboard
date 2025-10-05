import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const StressTestResults = ({ stressTests, loading }) => {
  if (!stressTests || stressTests.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getReturnColor = (value) => {
    if (value === null || value === undefined) return 'text-gray-400';
    return value >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-strong rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-orange-400" />
        Stress Test Results
      </h3>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left font-bold text-gray-300">Period</th>
              <th className="px-4 py-3 text-left font-bold text-gray-300">Start Date</th>
              <th className="px-4 py-3 text-left font-bold text-gray-300">End Date</th>
              <th className="px-4 py-3 text-right font-bold text-gray-300">Portfolio Return</th>
              <th className="px-4 py-3 text-right font-bold text-gray-300">Worst Day Loss</th>
            </tr>
          </thead>
          <tbody>
            {stressTests.map((test, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                className="border-b border-white/5 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-white">
                  {test.period_name || test.name}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {formatDate(test.start_date)}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {formatDate(test.end_date)}
                </td>
                <td className={`px-4 py-3 text-right ${getReturnColor(test.portfolio_return)}`}>
                  {formatPercent(test.portfolio_return)}
                </td>
                <td className="px-4 py-3 text-right text-red-400 font-bold">
                  {formatPercent(test.worst_day_loss)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {stressTests.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No stress test results available
        </div>
      )}
    </motion.div>
  );
};

export default StressTestResults;
