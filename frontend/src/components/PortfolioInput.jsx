import { useState } from 'react';

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Portfolio Configuration</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Holdings</h3>
          <div className="space-y-2">
            {holdings.map((holding, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ticker (e.g., SPY)"
                  value={holding.ticker}
                  onChange={(e) => updateHolding(index, 'ticker', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <input
                  type="number"
                  placeholder="Weight %"
                  value={holding.weight}
                  onChange={(e) => updateHolding(index, 'weight', e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => removeHolding(index)}
                  disabled={holdings.length === 1 || loading}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={addHolding}
              disabled={holdings.length >= 10 || loading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Holding
            </button>
            <span className={`text-sm font-semibold ${Math.abs(totalWeight - 100) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
              Total: {totalWeight.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Calculating...' : 'Calculate Risk Metrics'}
        </button>
      </form>
    </div>
  );
};

export default PortfolioInput;
