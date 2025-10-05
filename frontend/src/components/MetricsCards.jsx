import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { InfoTooltip } from './Tooltip';

const MetricCard = ({ label, value, type, index, tooltip }) => {
  const getStyles = () => {
    if (type === 'risk') return {
      bg: 'from-red-500/10 to-orange-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      glow: 'hover:shadow-red-500/20'
    };
    if (type === 'return') return {
      bg: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      glow: 'hover:shadow-green-500/20'
    };
    return {
      bg: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      glow: 'hover:shadow-blue-500/20'
    };
  };

  const getIcon = () => {
    if (type === 'risk') return <TrendingDown className="w-4 h-4" />;
    if (type === 'return') return <TrendingUp className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative glass rounded-xl p-5 border ${styles.border} ${styles.glow} transition-all duration-300 overflow-visible group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} opacity-50 rounded-xl`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`${styles.text}`}>{getIcon()}</div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</h3>
          </div>
          {tooltip && <InfoTooltip content={tooltip} />}
        </div>

        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: index * 0.05 + 0.2 }}
          className={`text-3xl font-bold ${styles.text}`}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
};

const MetricsCards = ({ metrics }) => {
  const metricsConfig = [
    {
      label: 'Portfolio Volatility',
      value: metrics?.annual_volatility ? `${(metrics.annual_volatility * 100).toFixed(2)}%` : 'N/A',
      type: 'risk',
      tooltip: 'Annualized standard deviation of portfolio returns. Higher values indicate greater price fluctuations and risk.'
    },
    {
      label: 'Sharpe Ratio',
      value: metrics?.sharpe_ratio ? metrics.sharpe_ratio.toFixed(2) : 'N/A',
      type: 'return',
      tooltip: 'Risk-adjusted return measure. Higher values indicate better return per unit of risk. Above 1 is good, above 2 is excellent.'
    },
    {
      label: '95% VaR (Daily)',
      value: metrics?.var?.daily?.historical_95 ? `${(metrics.var.daily.historical_95 * 100).toFixed(2)}%` : 'N/A',
      type: 'risk',
      tooltip: 'Value at Risk: Maximum expected loss on 95% of days. There\'s a 5% chance of losing more than this amount daily.'
    },
    {
      label: '95% VaR (Annual)',
      value: metrics?.var?.annual?.historical_95 ? `${(metrics.var.annual.historical_95 * 100).toFixed(2)}%` : 'N/A',
      type: 'risk',
      tooltip: 'Value at Risk: Maximum expected annual loss with 95% confidence. There\'s a 5% chance of losing more than this amount in a year.'
    },
    {
      label: '99% VaR (Daily)',
      value: metrics?.var?.daily?.historical_99 ? `${(metrics.var.daily.historical_99 * 100).toFixed(2)}%` : 'N/A',
      type: 'risk',
      tooltip: 'Value at Risk: Maximum expected loss on 99% of days. There\'s only a 1% chance of losing more than this amount daily.'
    },
    {
      label: '99% VaR (Annual)',
      value: metrics?.var?.annual?.historical_99 ? `${(metrics.var.annual.historical_99 * 100).toFixed(2)}%` : 'N/A',
      type: 'risk',
      tooltip: 'Value at Risk: Maximum expected annual loss with 99% confidence. There\'s only a 1% chance of losing more than this amount in a year.'
    },
    {
      label: 'Maximum Drawdown',
      value: metrics?.max_drawdown ? `${(metrics.max_drawdown * 100).toFixed(2)}%` : 'N/A',
      type: 'risk',
      tooltip: 'Largest peak-to-trough decline in portfolio value. Shows the worst loss experienced from a historical high point.'
    },
    {
      label: 'Beta (vs S&P 500)',
      value: metrics?.beta !== null && metrics?.beta !== undefined ? metrics.beta.toFixed(2) : 'N/A',
      type: 'risk',
      tooltip: 'Measures portfolio sensitivity to S&P 500 movements. Beta of 1 moves with market, >1 more volatile, <1 less volatile.'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-cyan-400" />
        Key Risk Metrics
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsConfig.map((metric, index) => (
          <MetricCard
            key={index}
            index={index}
            label={metric.label}
            value={metric.value}
            type={metric.type}
            tooltip={metric.tooltip}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricsCards;
