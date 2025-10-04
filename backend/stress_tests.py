import numpy as np
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define historical crisis periods
CRISIS_PERIODS = {
    'covid_crash': {
        'name': 'COVID-19 Market Crash',
        'start_date': '2020-02-20',
        'end_date': '2020-03-23',
        'description': 'Market crash during COVID-19 pandemic onset'
    },
    '2022_downturn': {
        'name': '2022 Market Downturn',
        'start_date': '2022-01-01',
        'end_date': '2022-10-12',
        'description': 'Market decline due to inflation and rate hikes'
    }
}


def calculate_portfolio_value(prices_df, weights):
    """
    Calculate portfolio value over time normalized to start at 100.

    Args:
        prices_df (pd.DataFrame): DataFrame with asset prices
        weights (list): Portfolio weights (sum to 100)

    Returns:
        pd.Series: Portfolio value over time
    """
    # Convert weights from percentage to decimal
    weights_decimal = np.array(weights) / 100.0

    # Normalize each asset to start at 100
    normalized_prices = prices_df / prices_df.iloc[0] * 100

    # Calculate weighted portfolio value
    portfolio_value = (normalized_prices * weights_decimal).sum(axis=1)

    return portfolio_value


def calculate_stress_period_metrics(prices_df, weights, start_date, end_date, period_name):
    """
    Calculate portfolio performance during a specific stress period.

    Args:
        prices_df (pd.DataFrame): Full DataFrame with asset prices
        weights (list): Portfolio weights
        start_date (str): Start date of stress period
        end_date (str): End date of stress period
        period_name (str): Name of the stress period

    Returns:
        dict: Stress test metrics for the period
    """
    try:
        # Filter data for the stress period
        stress_data = prices_df[(prices_df.index >= start_date) & (prices_df.index <= end_date)]

        if stress_data.empty:
            logger.warning(f"No data available for {period_name} ({start_date} to {end_date})")
            return None

        # Calculate portfolio value over the period
        portfolio_value = calculate_portfolio_value(stress_data, weights)

        # Calculate daily returns
        daily_returns = portfolio_value.pct_change().dropna()

        # Get start and end values
        start_value = portfolio_value.iloc[0]
        end_value = portfolio_value.iloc[-1]

        # Calculate total return
        total_return = (end_value - start_value) / start_value

        # Find worst single-day loss
        worst_day_return = daily_returns.min()
        worst_day_date = daily_returns.idxmin()

        # Calculate maximum drawdown during period
        running_max = portfolio_value.expanding().max()
        drawdown = (portfolio_value - running_max) / running_max
        max_drawdown = abs(drawdown.min())

        metrics = {
            'period_name': period_name,
            'start_date': start_date,
            'end_date': end_date,
            'start_value': start_value,
            'end_value': end_value,
            'total_return': total_return,
            'total_return_pct': total_return * 100,
            'worst_day_return': worst_day_return,
            'worst_day_return_pct': worst_day_return * 100,
            'worst_day_date': worst_day_date.strftime('%Y-%m-%d'),
            'max_drawdown': max_drawdown,
            'max_drawdown_pct': max_drawdown * 100,
            'trading_days': len(stress_data)
        }

        logger.info(f"Calculated stress metrics for {period_name}: {total_return*100:.2f}% return")
        return metrics

    except Exception as e:
        logger.error(f"Error calculating stress metrics for {period_name}: {str(e)}")
        return None


def find_worst_day_overall(prices_df, weights):
    """
    Find the worst single-day loss in the entire dataset.

    Args:
        prices_df (pd.DataFrame): Full DataFrame with asset prices
        weights (list): Portfolio weights

    Returns:
        dict: Information about the worst day
    """
    # Calculate portfolio value
    portfolio_value = calculate_portfolio_value(prices_df, weights)

    # Calculate daily returns
    daily_returns = portfolio_value.pct_change().dropna()

    # Find worst day
    worst_day_return = daily_returns.min()
    worst_day_date = daily_returns.idxmin()

    return {
        'worst_day_return': worst_day_return,
        'worst_day_return_pct': worst_day_return * 100,
        'worst_day_date': worst_day_date.strftime('%Y-%m-%d'),
        'portfolio_value_before': portfolio_value.loc[worst_day_date - pd.Timedelta(days=1)] if worst_day_date - pd.Timedelta(days=1) in portfolio_value.index else None,
        'portfolio_value_after': portfolio_value.loc[worst_day_date]
    }


def run_all_stress_tests(prices_df, weights):
    """
    Run stress tests for all defined crisis periods and find worst day overall.

    Args:
        prices_df (pd.DataFrame): Full DataFrame with asset prices
        weights (list): Portfolio weights

    Returns:
        dict: All stress test results
    """
    logger.info("Running stress tests...")

    stress_results = {}

    # Test each crisis period
    for crisis_id, crisis_info in CRISIS_PERIODS.items():
        metrics = calculate_stress_period_metrics(
            prices_df,
            weights,
            crisis_info['start_date'],
            crisis_info['end_date'],
            crisis_info['name']
        )

        if metrics:
            stress_results[crisis_id] = {
                **crisis_info,
                **metrics
            }

    # Find worst day overall in the entire dataset
    worst_day = find_worst_day_overall(prices_df, weights)
    stress_results['worst_day_overall'] = worst_day

    logger.info(f"Stress tests completed. Tested {len(stress_results)-1} crisis periods")
    return stress_results
