import React from 'react';

const StressTestResults = ({ stressTests, loading }) => {
  if (!stressTests || stressTests.length === 0) {
    return null;
  }

  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getReturnColor = (value) => {
    if (value === null || value === undefined) return 'text-gray-700';
    return value >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Stress Test Results</h2>

      {loading ? (
        <div className="flex items-center justify-center h-32 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Portfolio Return
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worst Day Loss
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stressTests.map((test, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {test.period_name || test.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(test.start_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(test.end_date)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${getReturnColor(test.portfolio_return)}`}>
                      {formatPercent(test.portfolio_return)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-semibold">
                      {formatPercent(test.worst_day_loss)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {stressTests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No stress test results available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StressTestResults;
