import numpy as np
import pandas as pd
from scipy import stats
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def calculate_portfolio_returns(prices_df, weights):
    """
    Calculate portfolio daily returns from individual asset prices and weights.

    Formula: R_p = Σ(w_i * R_i) where w_i is weight and R_i is asset return

    Args:
        prices_df (pd.DataFrame): DataFrame with asset prices (columns = tickers)
        weights (list): Portfolio weights (must sum to 100)

    Returns:
        pd.Series: Daily portfolio returns
    """
    # Convert weights from percentage to decimal
    weights_decimal = np.array(weights) / 100.0

    # Calculate daily returns for each asset: (P_t - P_t-1) / P_t-1
    asset_returns = prices_df.pct_change()

    # Drop first row (NaN values from pct_change)
    asset_returns = asset_returns.dropna()

    # Calculate weighted portfolio returns
    portfolio_returns = (asset_returns * weights_decimal).sum(axis=1)

    return portfolio_returns


def calculate_volatility(returns, annualize=True):
    """
    Calculate portfolio volatility (standard deviation of returns).

    Formula: σ = sqrt(Var(R))
    Annualized: σ_annual = σ_daily * sqrt(252)

    Args:
        returns (pd.Series): Daily returns
        annualize (bool): If True, annualize the volatility (default: True)

    Returns:
        float: Volatility (annualized if annualize=True)
    """
    daily_volatility = returns.std()

    if annualize:
        # Annualize using 252 trading days
        return daily_volatility * np.sqrt(252)

    return daily_volatility


def calculate_historical_var(returns, confidence_level=0.95):
    """
    Calculate Historical Value at Risk (VaR) using empirical distribution.

    VaR represents the maximum expected loss at a given confidence level.
    For 95% confidence, VaR is the 5th percentile of the return distribution.

    Args:
        returns (pd.Series): Daily returns
        confidence_level (float): Confidence level (0.95 or 0.99)

    Returns:
        float: VaR as a positive number (loss)
    """
    # Calculate the percentile (lower tail)
    alpha = 1 - confidence_level
    var = -np.percentile(returns, alpha * 100)

    return var


def calculate_parametric_var(returns, confidence_level=0.95):
    """
    Calculate Parametric VaR using variance-covariance method.

    Assumes returns are normally distributed.
    Formula: VaR = -μ + σ * Z_α
    where Z_α is the z-score for the confidence level

    Args:
        returns (pd.Series): Daily returns
        confidence_level (float): Confidence level (0.95 or 0.99)

    Returns:
        float: VaR as a positive number (loss)
    """
    # Calculate mean and standard deviation
    mu = returns.mean()
    sigma = returns.std()

    # Get z-score for confidence level (e.g., 1.645 for 95%, 2.326 for 99%)
    z_score = stats.norm.ppf(1 - confidence_level)

    # Calculate VaR: negative because we want loss as positive
    var = -(mu + sigma * z_score)

    return var


def calculate_sharpe_ratio(returns, risk_free_rate=0.04):
    """
    Calculate Sharpe Ratio - risk-adjusted return metric.

    Formula: Sharpe = (R_p - R_f) / σ_p
    where R_p is portfolio return, R_f is risk-free rate, σ_p is volatility

    Args:
        returns (pd.Series): Daily returns
        risk_free_rate (float): Annual risk-free rate (default: 4% = 0.04)

    Returns:
        float: Annualized Sharpe Ratio
    """
    # Annualize returns
    annual_return = returns.mean() * 252

    # Annualize volatility
    annual_volatility = calculate_volatility(returns, annualize=True)

    # Calculate Sharpe Ratio
    sharpe = (annual_return - risk_free_rate) / annual_volatility

    return sharpe


def calculate_max_drawdown(returns):
    """
    Calculate Maximum Drawdown - largest peak-to-trough decline.

    Drawdown = (Trough Value - Peak Value) / Peak Value

    Args:
        returns (pd.Series): Daily returns

    Returns:
        dict: {
            'max_drawdown': float (as positive number),
            'drawdown_series': pd.Series (drawdown over time)
        }
    """
    # Calculate cumulative returns to get portfolio value over time
    cumulative_returns = (1 + returns).cumprod()

    # Calculate running maximum (peak)
    running_max = cumulative_returns.expanding().max()

    # Calculate drawdown series: (current - peak) / peak
    drawdown_series = (cumulative_returns - running_max) / running_max

    # Maximum drawdown is the minimum value (most negative)
    max_drawdown = abs(drawdown_series.min())

    return {
        'max_drawdown': max_drawdown,
        'drawdown_series': drawdown_series
    }


def calculate_beta(portfolio_returns, benchmark_returns):
    """
    Calculate portfolio Beta relative to benchmark (market sensitivity).

    Formula: β = Cov(R_p, R_m) / Var(R_m)
    where R_p is portfolio returns, R_m is market returns

    Args:
        portfolio_returns (pd.Series): Portfolio daily returns
        benchmark_returns (pd.Series): Benchmark (SPY) daily returns

    Returns:
        float: Beta value
    """
    # Align the two series (in case of different dates)
    aligned_data = pd.DataFrame({
        'portfolio': portfolio_returns,
        'benchmark': benchmark_returns
    }).dropna()

    # Calculate covariance and variance
    covariance = aligned_data['portfolio'].cov(aligned_data['benchmark'])
    benchmark_variance = aligned_data['benchmark'].var()

    # Calculate beta
    beta = covariance / benchmark_variance

    return beta


def calculate_correlation_matrix(prices_df):
    """
    Calculate correlation matrix between all assets.

    Correlation measures how assets move together (-1 to +1).

    Args:
        prices_df (pd.DataFrame): DataFrame with asset prices

    Returns:
        pd.DataFrame: Correlation matrix
    """
    # Calculate returns
    returns = prices_df.pct_change().dropna()

    # Calculate correlation matrix
    correlation_matrix = returns.corr()

    return correlation_matrix


def calculate_portfolio_values(portfolio_returns, initial_value=100000):
    """
    Calculate portfolio value over time from returns.

    Args:
        portfolio_returns (pd.Series): Daily portfolio returns
        initial_value (float): Starting portfolio value (default: $100,000)

    Returns:
        pd.Series: Portfolio values over time
    """
    # Calculate cumulative returns: (1 + r1) * (1 + r2) * ... - 1
    cumulative_returns = (1 + portfolio_returns).cumprod()

    # Calculate portfolio values
    portfolio_values = initial_value * cumulative_returns

    return portfolio_values


def calculate_rolling_volatility(portfolio_returns, window=30):
    """
    Calculate rolling volatility over time.

    Args:
        portfolio_returns (pd.Series): Daily portfolio returns
        window (int): Rolling window size in days (default: 30)

    Returns:
        pd.Series: Annualized rolling volatility
    """
    # Calculate rolling standard deviation
    rolling_std = portfolio_returns.rolling(window=window).std()

    # Annualize: multiply by sqrt(252)
    rolling_volatility = rolling_std * np.sqrt(252)

    return rolling_volatility


def calculate_all_metrics(prices_df, weights, benchmark_prices=None):
    """
    Calculate all risk metrics for a portfolio.

    Args:
        prices_df (pd.DataFrame): DataFrame with asset prices
        weights (list): Portfolio weights (sum to 100)
        benchmark_prices (pd.Series, optional): Benchmark prices for beta calculation

    Returns:
        dict: Dictionary containing all calculated metrics
    """
    logger.info("Calculating risk metrics...")

    # Calculate portfolio returns
    portfolio_returns = calculate_portfolio_returns(prices_df, weights)

    # Calculate portfolio values over time
    portfolio_values = calculate_portfolio_values(portfolio_returns)

    # Calculate volatility
    daily_volatility = calculate_volatility(portfolio_returns, annualize=False)
    annual_volatility = calculate_volatility(portfolio_returns, annualize=True)

    # Calculate rolling volatility
    rolling_volatility = calculate_rolling_volatility(portfolio_returns, window=30)

    # Calculate VaR at different confidence levels
    historical_var_95 = calculate_historical_var(portfolio_returns, 0.95)
    historical_var_99 = calculate_historical_var(portfolio_returns, 0.99)
    parametric_var_95 = calculate_parametric_var(portfolio_returns, 0.95)
    parametric_var_99 = calculate_parametric_var(portfolio_returns, 0.99)

    # Annualize VaR (multiply by sqrt(252))
    annual_historical_var_95 = historical_var_95 * np.sqrt(252)
    annual_historical_var_99 = historical_var_99 * np.sqrt(252)
    annual_parametric_var_95 = parametric_var_95 * np.sqrt(252)
    annual_parametric_var_99 = parametric_var_99 * np.sqrt(252)

    # Calculate Sharpe Ratio
    sharpe_ratio = calculate_sharpe_ratio(portfolio_returns)

    # Calculate Maximum Drawdown
    drawdown_data = calculate_max_drawdown(portfolio_returns)

    # Calculate correlation matrix
    correlation_matrix = calculate_correlation_matrix(prices_df)

    # Calculate Beta if benchmark provided
    beta = None
    if benchmark_prices is not None:
        benchmark_returns = benchmark_prices.pct_change().dropna()
        beta = calculate_beta(portfolio_returns, benchmark_returns)

    # Calculate annualized return
    annual_return = portfolio_returns.mean() * 252

    # Prepare portfolio values for chart
    portfolio_values_list = [
        {
            'date': date.strftime('%Y-%m-%d'),
            'value': float(value)
        }
        for date, value in portfolio_values.items()
    ]

    # Prepare drawdown data for chart
    drawdown_list = [
        {
            'date': date.strftime('%Y-%m-%d'),
            'drawdown': float(dd)
        }
        for date, dd in drawdown_data['drawdown_series'].items()
    ]

    # Prepare rolling volatility data for chart
    rolling_volatility_list = [
        {
            'date': date.strftime('%Y-%m-%d'),
            'volatility': float(vol)
        }
        for date, vol in rolling_volatility.dropna().items()
    ]

    # Prepare return distribution for histogram (create bins)
    num_bins = 50
    returns_array = portfolio_returns.values
    hist, bin_edges = np.histogram(returns_array, bins=num_bins)

    return_distribution = [
        {
            'binStart': float(bin_edges[i]),
            'binEnd': float(bin_edges[i + 1]),
            'binMid': float((bin_edges[i] + bin_edges[i + 1]) / 2),
            'count': int(hist[i])
        }
        for i in range(len(hist))
    ]

    metrics = {
        'annual_return': annual_return,
        'daily_volatility': daily_volatility,
        'annual_volatility': annual_volatility,
        'sharpe_ratio': sharpe_ratio,
        'max_drawdown': drawdown_data['max_drawdown'],
        'var': {
            'daily': {
                'historical_95': historical_var_95,
                'historical_99': historical_var_99,
                'parametric_95': parametric_var_95,
                'parametric_99': parametric_var_99
            },
            'annual': {
                'historical_95': annual_historical_var_95,
                'historical_99': annual_historical_var_99,
                'parametric_95': annual_parametric_var_95,
                'parametric_99': annual_parametric_var_99
            }
        },
        'beta': beta,
        'correlation_matrix': correlation_matrix.to_dict(),
        'portfolio_values': portfolio_values_list,
        'drawdown_data': drawdown_list,
        'rolling_volatility': rolling_volatility_list,
        'return_distribution': return_distribution
    }

    logger.info("Risk metrics calculated successfully")
    return metrics
