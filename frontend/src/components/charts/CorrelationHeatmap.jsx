import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { InfoTooltip } from '../Tooltip';

const CorrelationHeatmap = ({ correlationMatrix, tickers, loading }) => {
  if (!correlationMatrix || !tickers || tickers.length === 0) {
    return null;
  }

  const getColor = (value) => {
    if (value > 0) {
      // Positive correlation - green/cyan gradient
      const intensity = value;
      return `rgba(34, 211, 238, ${0.2 + intensity * 0.5})`; // cyan with variable opacity
    } else {
      // Negative correlation - red/orange gradient
      const intensity = Math.abs(value);
      return `rgba(248, 113, 113, ${0.2 + intensity * 0.5})`; // red with variable opacity
    }
  };

  const getTextColor = (value) => {
    if (Math.abs(value) > 0.7) return 'text-white';
    if (value > 0) return 'text-cyan-200';
    return 'text-red-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-strong rounded-2xl p-6 border border-white/10 overflow-visible"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-pink-400" />
          Asset Correlation Matrix
        </div>
        <InfoTooltip content="Shows how assets move together. 1.0 = perfect positive correlation, 0 = no correlation, -1.0 = perfect negative correlation. Lower correlations provide better diversification." />
      </h3>

      <div className="overflow-auto rounded-xl">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 border border-white/10 bg-white/5 font-semibold text-xs text-gray-400"></th>
              {tickers.map((ticker) => (
                <th
                  key={ticker}
                  className="p-3 border border-white/10 bg-white/5 font-semibold text-xs text-gray-300"
                >
                  {ticker}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickers.map((rowTicker, rowIndex) => (
              <motion.tr
                key={rowTicker}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + rowIndex * 0.05 }}
              >
                <td className="p-3 border border-white/10 bg-white/5 font-semibold text-xs text-gray-300">
                  {rowTicker}
                </td>
                {tickers.map((colTicker) => {
                  const value = correlationMatrix[rowTicker]?.[colTicker] || 0;
                  return (
                    <motion.td
                      key={colTicker}
                      whileHover={{ scale: 1.05 }}
                      className={`p-3 border border-white/10 text-center font-bold ${getTextColor(value)} transition-all cursor-pointer`}
                      style={{ backgroundColor: getColor(value) }}
                    >
                      {value.toFixed(2)}
                    </motion.td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-red-500/30" style={{ backgroundColor: 'rgba(248, 113, 113, 0.7)' }}></div>
          <span className="text-gray-400">Negative</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-white/20 bg-white/5"></div>
          <span className="text-gray-400">Zero</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-cyan-500/30" style={{ backgroundColor: 'rgba(34, 211, 238, 0.7)' }}></div>
          <span className="text-gray-400">Positive</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CorrelationHeatmap;
