import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Tooltip } from 'recharts';
import { InfoTooltip } from '../Tooltip';

const RollingVolatilityChart = ({ volatilityData, loading }) => {
  if (!volatilityData || volatilityData.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const avgVolatility = volatilityData.reduce((sum, point) => sum + point.volatility, 0) / volatilityData.length;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-strong rounded-2xl p-6 border border-white/10 overflow-visible"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-400" />
          30-Day Rolling Volatility
        </div>
        <InfoTooltip content="Standard deviation of returns calculated over rolling 30-day windows. Higher values indicate more price volatility and risk." />
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={volatilityData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatPercent}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => [formatPercent(value), 'Volatility']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          />
          <ReferenceLine
            y={avgVolatility}
            stroke="#9ca3af"
            strokeDasharray="3 3"
            label={{ value: 'Avg', position: 'right', fill: '#9ca3af', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="volatility"
            stroke="#a78bfa"
            strokeWidth={3}
            dot={false}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass rounded-xl p-3 border border-purple-500/30"
        >
          <p className="text-xs text-gray-400 mb-1">Average</p>
          <p className="text-lg font-bold text-purple-400">
            {formatPercent(avgVolatility)}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass rounded-xl p-3 border border-white/10"
        >
          <p className="text-xs text-gray-400 mb-1">Current</p>
          <p className="text-lg font-bold text-gray-200">
            {formatPercent(volatilityData[volatilityData.length - 1]?.volatility || 0)}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RollingVolatilityChart;
