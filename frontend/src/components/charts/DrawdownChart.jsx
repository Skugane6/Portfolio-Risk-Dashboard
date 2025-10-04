import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Legend
} from 'recharts';

const DrawdownChart = ({ drawdownData, loading }) => {
  if (!drawdownData || drawdownData.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Find maximum drawdown point
  const maxDrawdownPoint = drawdownData.reduce((max, point) => {
    return point.drawdown < max.drawdown ? point : max;
  }, drawdownData[0]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-1">{formatDate(payload[0].payload.date)}</p>
          <p className="text-lg font-semibold text-red-600">
            {formatPercent(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Drawdown</h2>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={drawdownData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
                domain={['dataMin', 0]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#dc2626"
                strokeWidth={2}
                fill="url(#colorDrawdown)"
                name="Drawdown"
              />
              <ReferenceDot
                x={maxDrawdownPoint.date}
                y={maxDrawdownPoint.drawdown}
                r={6}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold">Maximum Drawdown:</span>{' '}
              <span className="text-red-600 font-bold">
                {formatPercent(maxDrawdownPoint.drawdown)}
              </span>
            </div>
            <div>
              <span className="font-semibold">Date:</span>{' '}
              {formatDate(maxDrawdownPoint.date)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawdownChart;
