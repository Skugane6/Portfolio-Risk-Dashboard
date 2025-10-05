import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, AlertCircle, Calendar, TrendingUp } from 'lucide-react';

const PortfolioInput = ({ onSubmit, loading }) => {
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);

    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();

  const [holdings, setHoldings] = useState([
    { ticker: 'SPY', weight: 40 },
    { ticker: 'QQQ', weight: 30 },
    { ticker: 'GLD', weight: 20 },
    { ticker: 'TLT', weight: 10 }
  ]);
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [error, setError] = useState('');

  const addHolding = () => {
    if (holdings.length < 10) {
      setHoldings([...holdings, { ticker: '', weight: 0 }]);
    }
  };

  const removeHolding = (index) => {
    if (holdings.length > 1) {
      setHoldings(holdings.filter((_, i) => i !== index));
    }
  };

  const updateHolding = (index, field, value) => {
    const updated = [...holdings];
    updated[index][field] = value;
    setHoldings(updated);
  };

  const validateForm = () => {
    setError('');

    const filledHoldings = holdings.filter(h => h.ticker.trim() !== '');

    if (filledHoldings.length === 0) {
      setError('Please add at least one stock');
      return false;
    }

    const totalWeight = filledHoldings.reduce((sum, h) => sum + parseFloat(h.weight || 0), 0);

    if (Math.abs(totalWeight - 100) > 0.1) {
      setError(`Weights must sum to 100%. Current total: ${totalWeight.toFixed(1)}%`);
      return false;
    }

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return false;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('Start date must be before end date');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const filledHoldings = holdings.filter(h => h.ticker.trim() !== '');
    const tickers = filledHoldings.map(h => h.ticker.toUpperCase());
    const weights = filledHoldings.map(h => parseFloat(h.weight));

    onSubmit({ tickers, weights, startDate, endDate });
  };

  const totalWeight = holdings.reduce((sum, h) => sum + parseFloat(h.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 0.1;

  return (
    <div className="glass-strong rounded-2xl overflow-hidden max-h-[calc(100vh-8rem)] flex flex-col w-full">
      <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden flex-1">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">Portfolio Setup</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Holdings Section */}
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">Holdings</label>
              <motion.span
                animate={{
                  scale: isWeightValid ? [1, 1.1, 1] : 1,
                }}
                className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full flex-shrink-0 ${
                  isWeightValid
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {totalWeight.toFixed(1)}%
              </motion.span>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="space-y-2 sm:space-y-3">
                {holdings.map((holding, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="TICKER"
                      value={holding.ticker}
                      onChange={(e) => updateHolding(index, 'ticker', e.target.value.toUpperCase())}
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 uppercase font-semibold text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                      disabled={loading}
                    />
                    <input
                      type="number"
                      placeholder="%"
                      value={holding.weight}
                      onChange={(e) => updateHolding(index, 'weight', e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 font-semibold text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                      disabled={loading}
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeHolding(index)}
                      disabled={holdings.length === 1 || loading}
                      className="p-2 sm:p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addHolding}
              disabled={holdings.length >= 10 || loading}
              className="mt-3 sm:mt-4 w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/20 hover:to-purple-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              Add Holding
            </motion.button>
          </div>

          {/* Date Range */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <label className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">Analysis Period</label>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1 sm:mb-2 font-medium">Start</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[11px] sm:text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 sm:mb-2 font-medium">End</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-[11px] sm:text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-red-300 break-words">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="relative w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden group"
          >
            <span className="relative z-10">{loading ? 'Calculating...' : 'Calculate Risk Metrics'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default PortfolioInput;
