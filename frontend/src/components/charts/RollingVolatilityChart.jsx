import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';

const RollingVolatilityChart = ({ volatilityData, loading }) => {
  if (!volatilityData || volatilityData.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Calculate average volatility
  const avgVolatility = volatilityData.reduce((sum, point) => sum + point.volatility, 0) / volatilityData.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-1">{formatDate(payload[0].payload.date)}</p>
          <p className="text-lg font-semibold text-purple-600">
            {formatPercent(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">30-Day Rolling Volatility</h2>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={volatilityData}
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
                tickFormatter={formatPercent}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <ReferenceLine
                y={avgVolatility}
                stroke="#6b7280"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: ${formatPercent(avgVolatility)}`,
                  position: 'right',
                  fill: '#6b7280',
                  fontSize: 12
                }}
              />
              <Line
                type="monotone"
                dataKey="volatility"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
                name="Rolling Volatility (30d)"
                activeDot={{ r: 6, fill: '#7c3aed' }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold">Average Volatility:</span>{' '}
              <span className="text-purple-600 font-bold">
                {formatPercent(avgVolatility)}
              </span>
            </div>
            <div>
              <span className="font-semibold">Current:</span>{' '}
              {formatPercent(volatilityData[volatilityData.length - 1]?.volatility || 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RollingVolatilityChart;
