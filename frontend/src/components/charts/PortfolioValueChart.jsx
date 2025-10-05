import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { InfoTooltip } from '../Tooltip';

const PortfolioValueChart = ({ portfolioValues, loading }) => {
  if (!portfolioValues || portfolioValues.length === 0) {
    return null;
  }

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const totalReturn = portfolioValues.length > 0
    ? ((portfolioValues[portfolioValues.length - 1]?.value - portfolioValues[0]?.value) / portfolioValues[0]?.value * 100)
    : 0;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-2xl p-6 border border-white/10 overflow-visible"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          Portfolio Value
        </div>
        <InfoTooltip content="Historical value of your portfolio over time, showing growth or decline from initial investment." />
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass rounded-xl p-4 border border-cyan-500/20"
        >
          <p className="text-xs text-gray-400 mb-1">Starting Value</p>
          <p className="text-lg font-bold text-cyan-400">
            {formatCurrency(portfolioValues[0]?.value || 100000)}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass rounded-xl p-4 border border-purple-500/20"
        >
          <p className="text-xs text-gray-400 mb-1">Final Value</p>
          <p className="text-lg font-bold text-purple-400">
            {formatCurrency(portfolioValues[portfolioValues.length - 1]?.value || 100000)}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className={`glass rounded-xl p-4 border ${
            totalReturn >= 0 ? 'border-green-500/30' : 'border-red-500/30'
          }`}
        >
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            Total Return
            {totalReturn >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          </p>
          <p className={`text-lg font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
          </p>
        </motion.div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={portfolioValues} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
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
            formatter={(value) => [formatCurrency(value), 'Value']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="url(#colorValue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PortfolioValueChart;
