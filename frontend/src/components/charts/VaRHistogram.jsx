import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend
} from 'recharts';

const VaRHistogram = ({ returnDistribution, var95, var99, loading }) => {
  if (!returnDistribution || returnDistribution.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-1">
            Range: {formatPercent(payload[0].payload.binStart)} to {formatPercent(payload[0].payload.binEnd)}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Return Distribution & VaR</h2>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={returnDistribution}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="binMid"
                tickFormatter={formatPercent}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
                label={{ value: 'Daily Returns', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#9ca3af"
                label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
              />

              {/* VaR reference lines */}
              <ReferenceLine
                x={var95}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `95% VaR: ${formatPercent(var95)}`,
                  position: 'top',
                  fill: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 'bold'
                }}
              />
              <ReferenceLine
                x={var99}
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `99% VaR: ${formatPercent(var99)}`,
                  position: 'top',
                  fill: '#dc2626',
                  fontSize: 11,
                  fontWeight: 'bold'
                }}
              />

              <Bar dataKey="count" name="Frequency">
                {returnDistribution.map((entry, index) => {
                  const color = entry.binMid >= 0 ? '#10b981' : '#ef4444';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500"></div>
                <span>Positive Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500"></div>
                <span>Negative Returns</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-amber-500"></div>
                <span>95% VaR</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-red-600"></div>
                <span>99% VaR</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaRHistogram;
