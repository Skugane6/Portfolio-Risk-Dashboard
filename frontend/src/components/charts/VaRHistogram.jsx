import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Cell, Tooltip } from 'recharts';
import { InfoTooltip } from '../Tooltip';

const VaRHistogram = ({ returnDistribution, var95, var99, loading }) => {
  if (!returnDistribution || returnDistribution.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-strong rounded-2xl p-6 border border-white/10 overflow-visible"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          Return Distribution & VaR
        </div>
        <InfoTooltip content="Histogram showing frequency of daily returns. VaR lines indicate loss thresholds at 95% and 99% confidence levels." />
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={returnDistribution} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="binMid"
            tickFormatter={formatPercent}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
            label={{ value: 'Daily Returns', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
            axisLine={false}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value, name, props) => [value, 'Frequency']}
            labelFormatter={(label) => `Return: ${formatPercent(label)}`}
          />
          <ReferenceLine
            x={var95}
            stroke="#fbbf24"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{ value: '95% VaR', position: 'top', fill: '#fbbf24', fontSize: 10, fontWeight: 'bold' }}
          />
          <ReferenceLine
            x={var99}
            stroke="#f87171"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{ value: '99% VaR', position: 'top', fill: '#f87171', fontSize: 10, fontWeight: 'bold' }}
          />

          <Bar dataKey="count" animationDuration={1500}>
            {returnDistribution.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.binMid >= 0 ? '#34d399' : '#f87171'}
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 flex justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded"></div>
            <span className="text-gray-400">Positive Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-gray-400">Negative Returns</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-amber-400"></div>
            <span className="text-gray-400">95% VaR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-400"></div>
            <span className="text-gray-400">99% VaR</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VaRHistogram;
