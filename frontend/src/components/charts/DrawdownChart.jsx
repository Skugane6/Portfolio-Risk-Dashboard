import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot, Tooltip } from 'recharts';
import { InfoTooltip } from '../Tooltip';

const DrawdownChart = ({ drawdownData, loading }) => {
  if (!drawdownData || drawdownData.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const maxDrawdownPoint = drawdownData.reduce((max, point) => {
    return point.drawdown < max.drawdown ? point : max;
  }, drawdownData[0]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-strong rounded-2xl p-6 border border-white/10 overflow-visible"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-red-400" />
          Portfolio Drawdown
        </div>
        <InfoTooltip content="Shows the percentage decline from peak value over time. Lower (more negative) values indicate larger losses from historical highs." />
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={drawdownData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
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
            tickFormatter={formatPercent}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
            axisLine={false}
            domain={['dataMin', 0]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => [formatPercent(value), 'Drawdown']}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#f87171"
            strokeWidth={2.5}
            fill="url(#colorDrawdown)"
            animationDuration={1500}
          />
          <ReferenceDot
            x={maxDrawdownPoint.date}
            y={maxDrawdownPoint.drawdown}
            r={5}
            fill="#ef4444"
            stroke="#fff"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mt-4 glass rounded-xl p-4 border border-red-500/30"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Maximum Drawdown</p>
            <p className="text-2xl font-bold text-red-400">
              {formatPercent(maxDrawdownPoint.drawdown)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Date</p>
            <p className="text-sm font-semibold text-gray-300">
              {new Date(maxDrawdownPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DrawdownChart;
