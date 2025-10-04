import React from 'react';

const CorrelationHeatmap = ({ correlationMatrix, tickers, loading }) => {
  if (!correlationMatrix || !tickers || tickers.length === 0) {
    return null;
  }

  // Get color based on correlation value
  const getColor = (value) => {
    if (value > 0) {
      // Positive correlation: white to green
      const intensity = Math.floor(value * 255);
      return `rgb(${255 - intensity}, 255, ${255 - intensity})`;
    } else {
      // Negative correlation: white to red
      const intensity = Math.floor(Math.abs(value) * 255);
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    }
  };

  const getCellTextColor = (value) => {
    return Math.abs(value) > 0.5 ? 'text-white' : 'text-gray-800';
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Asset Correlation Matrix</h2>

      {loading ? (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-gray-300 bg-gray-50"></th>
                  {tickers.map((ticker) => (
                    <th
                      key={ticker}
                      className="p-2 border border-gray-300 bg-gray-50 font-semibold text-sm text-gray-700"
                    >
                      {ticker}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickers.map((rowTicker) => (
                  <tr key={rowTicker}>
                    <td className="p-2 border border-gray-300 bg-gray-50 font-semibold text-sm text-gray-700">
                      {rowTicker}
                    </td>
                    {tickers.map((colTicker) => {
                      const value = correlationMatrix[rowTicker]?.[colTicker] || 0;
                      return (
                        <td
                          key={colTicker}
                          className={`p-3 border border-gray-300 text-center font-semibold text-sm ${getCellTextColor(value)}`}
                          style={{ backgroundColor: getColor(value) }}
                        >
                          {value.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border border-gray-300" style={{ backgroundColor: 'rgb(255, 100, 100)' }}></div>
              <span>Negative</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border border-gray-300" style={{ backgroundColor: 'rgb(255, 255, 255)' }}></div>
              <span>Zero</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border border-gray-300" style={{ backgroundColor: 'rgb(100, 255, 100)' }}></div>
              <span>Positive</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;
