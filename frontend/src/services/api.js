import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchPortfolioData = async (tickers, weights, startDate, endDate) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetch-data`, {
      tickers,
      weights,
      start_date: startDate,
      end_date: endDate
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch portfolio data');
  }
};

export const calculateMetrics = async (tickers, weights, startDate, endDate) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calculate-metrics`, {
      tickers,
      weights,
      start_date: startDate,
      end_date: endDate
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to calculate metrics');
  }
};

export const runStressTest = async (tickers, weights, startDate, endDate) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stress-test`, {
      tickers,
      weights,
      start_date: startDate,
      end_date: endDate
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to run stress test');
  }
};
