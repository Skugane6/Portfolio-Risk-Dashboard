import yfinance as yf
import pandas as pd
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_stock_data(ticker, start_date, end_date):
    """
    Fetch historical stock data for a single ticker.

    Args:
        ticker (str): Stock ticker symbol
        start_date (str): Start date in YYYY-MM-DD format
        end_date (str): End date in YYYY-MM-DD format

    Returns:
        pd.Series: Adjusted close prices

    Raises:
        ValueError: If ticker is invalid or data cannot be fetched
    """
    try:
        logger.info(f"Fetching data for {ticker} from {start_date} to {end_date}")
        stock = yf.Ticker(ticker)
        data = stock.history(start=start_date, end=end_date)

        if data.empty:
            raise ValueError(f"No data found for ticker {ticker}")

        return data['Close']

    except Exception as e:
        logger.error(f"Error fetching data for {ticker}: {str(e)}")
        raise ValueError(f"Failed to fetch data for {ticker}: {str(e)}")


def fetch_multiple_tickers(tickers, start_date, end_date):
    """
    Fetch historical stock data for multiple tickers.

    Args:
        tickers (list): List of stock ticker symbols
        start_date (str): Start date in YYYY-MM-DD format
        end_date (str): End date in YYYY-MM-DD format

    Returns:
        pd.DataFrame: DataFrame with adjusted close prices for all tickers

    Raises:
        ValueError: If any ticker is invalid or data cannot be fetched
    """
    try:
        logger.info(f"Fetching data for {len(tickers)} tickers")

        # Validate tickers
        if not tickers or not isinstance(tickers, list):
            raise ValueError("Tickers must be a non-empty list")

        # Fetch data for all tickers at once
        data = yf.download(tickers, start=start_date, end=end_date, progress=False)

        if data.empty:
            raise ValueError("No data found for the provided tickers")

        # Extract adjusted close prices
        if len(tickers) == 1:
            # For single ticker, yfinance returns a different structure
            # Create a DataFrame with the single ticker column
            prices = pd.DataFrame(data['Close'])
            prices.columns = [tickers[0]]
        else:
            prices = data['Close']

        # Check for missing data
        missing_tickers = []
        for ticker in tickers:
            if ticker not in prices.columns or prices[ticker].isna().all():
                missing_tickers.append(ticker)

        if missing_tickers:
            raise ValueError(f"Invalid or missing data for tickers: {', '.join(missing_tickers)}")

        logger.info(f"Successfully fetched {len(prices)} data points for {len(tickers)} tickers")
        return prices

    except Exception as e:
        logger.error(f"Error fetching multiple tickers: {str(e)}")
        raise ValueError(f"Failed to fetch ticker data: {str(e)}")


def validate_weights(weights):
    """
    Validate that portfolio weights sum to 100% (or 1.0).

    Args:
        weights (list): List of portfolio weights

    Returns:
        bool: True if valid

    Raises:
        ValueError: If weights are invalid
    """
    if not weights or not isinstance(weights, list):
        raise ValueError("Weights must be a non-empty list")

    if len(weights) == 0:
        raise ValueError("Weights list cannot be empty")

    # Check if all weights are numbers
    try:
        weights_float = [float(w) for w in weights]
    except (ValueError, TypeError):
        raise ValueError("All weights must be numeric values")

    # Check for negative weights
    if any(w < 0 for w in weights_float):
        raise ValueError("Weights cannot be negative")

    # Check if weights sum to 100 (with some tolerance for floating point errors)
    total = sum(weights_float)
    if not (99.9 <= total <= 100.1):
        raise ValueError(f"Weights must sum to 100%, currently sum to {total}%")

    return True
