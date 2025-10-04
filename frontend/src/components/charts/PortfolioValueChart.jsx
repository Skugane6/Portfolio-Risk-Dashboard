import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const PortfolioValueChart = ({ portfolioValues, loading }) => {
  if (!portfolioValues || portfolioValues.length === 0) {
    return null;
  }

  const formatCurrency = (value) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-1">{formatDate(payload[0].payload.date)}</p>
          <p className="text-lg font-semibold text-blue-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Value Over Time</h2>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={portfolioValues}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Portfolio Value"
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold">Starting Value:</span>{' '}
              {formatCurrency(portfolioValues[0]?.value || 100000)}
            </div>
            <div>
              <span className="font-semibold">Final Value:</span>{' '}
              {formatCurrency(portfolioValues[portfolioValues.length - 1]?.value || 100000)}
            </div>
            <div>
              <span className="font-semibold">Total Return:</span>{' '}
              <span className={
                ((portfolioValues[portfolioValues.length - 1]?.value - portfolioValues[0]?.value) / portfolioValues[0]?.value * 100) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }>
                {((portfolioValues[portfolioValues.length - 1]?.value - portfolioValues[0]?.value) / portfolioValues[0]?.value * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioValueChart;
