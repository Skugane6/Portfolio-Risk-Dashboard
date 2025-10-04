from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import logging
from data_fetcher import fetch_multiple_tickers, validate_weights
from risk_metrics import calculate_all_metrics

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Test endpoint to verify the server is running"""
    return jsonify({
        'status': 'healthy',
        'message': 'Portfolio Risk Dashboard API is running'
    })

@app.route('/api/test', methods=['GET'])
def test():
    """Basic test endpoint"""
    return jsonify({
        'message': 'API test successful',
        'version': '1.0.0'
    })

@app.route('/api/fetch-data', methods=['POST'])
def fetch_data():
    """
    Fetch historical stock data for a portfolio.

    Expected JSON body:
    {
        "tickers": ["SPY", "QQQ", "GLD"],
        "weights": [40, 30, 30],
        "start_date": "2023-01-01",
        "end_date": "2024-01-01"
    }
    """
    try:
        # Get request data
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract parameters
        tickers = data.get('tickers')
        weights = data.get('weights')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        # Validate required fields
        if not tickers:
            return jsonify({'error': 'Tickers are required'}), 400
        if not weights:
            return jsonify({'error': 'Weights are required'}), 400
        if not start_date:
            return jsonify({'error': 'Start date is required'}), 400
        if not end_date:
            return jsonify({'error': 'End date is required'}), 400

        # Validate tickers and weights length match
        if len(tickers) != len(weights):
            return jsonify({'error': 'Number of tickers and weights must match'}), 400

        # Validate weights
        try:
            validate_weights(weights)
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

        # Validate date format
        try:
            datetime.strptime(start_date, '%Y-%m-%d')
            datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Dates must be in YYYY-MM-DD format'}), 400

        # Fetch data
        try:
            prices_df = fetch_multiple_tickers(tickers, start_date, end_date)

            # Convert DataFrame to JSON format
            result = {
                'tickers': tickers,
                'weights': weights,
                'start_date': start_date,
                'end_date': end_date,
                'data': {
                    'dates': prices_df.index.strftime('%Y-%m-%d').tolist(),
                    'prices': {ticker: prices_df[ticker].tolist() for ticker in tickers}
                },
                'data_points': len(prices_df)
            }

            logger.info(f"Successfully fetched data for {len(tickers)} tickers")
            return jsonify(result), 200

        except ValueError as e:
            logger.error(f"Error fetching data: {str(e)}")
            return jsonify({'error': str(e)}), 400

    except Exception as e:
        logger.error(f"Unexpected error in fetch_data: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500


@app.route('/api/calculate-metrics', methods=['POST'])
def calculate_metrics():
    """
    Calculate risk metrics for a portfolio.

    Expected JSON body:
    {
        "tickers": ["SPY", "QQQ", "GLD"],
        "weights": [40, 30, 30],
        "start_date": "2023-01-01",
        "end_date": "2024-01-01"
    }
    """
    try:
        # Get request data
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract parameters
        tickers = data.get('tickers')
        weights = data.get('weights')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        # Validate required fields
        if not tickers:
            return jsonify({'error': 'Tickers are required'}), 400
        if not weights:
            return jsonify({'error': 'Weights are required'}), 400
        if not start_date:
            return jsonify({'error': 'Start date is required'}), 400
        if not end_date:
            return jsonify({'error': 'End date is required'}), 400

        # Validate tickers and weights length match
        if len(tickers) != len(weights):
            return jsonify({'error': 'Number of tickers and weights must match'}), 400

        # Validate weights
        try:
            validate_weights(weights)
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

        # Validate date format
        try:
            datetime.strptime(start_date, '%Y-%m-%d')
            datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Dates must be in YYYY-MM-DD format'}), 400

        # Fetch data
        try:
            prices_df = fetch_multiple_tickers(tickers, start_date, end_date)

            # Check if SPY is in the portfolio for beta calculation
            benchmark_prices = None
            if 'SPY' in tickers:
                benchmark_prices = prices_df['SPY']
            else:
                # Fetch SPY separately for beta calculation
                try:
                    spy_df = fetch_multiple_tickers(['SPY'], start_date, end_date)
                    benchmark_prices = spy_df['SPY']
                except:
                    logger.warning("Could not fetch SPY for beta calculation")

            # Calculate all metrics
            metrics = calculate_all_metrics(prices_df, weights, benchmark_prices)

            # Prepare response
            result = {
                'tickers': tickers,
                'weights': weights,
                'start_date': start_date,
                'end_date': end_date,
                'metrics': metrics
            }

            logger.info(f"Successfully calculated metrics for {len(tickers)} tickers")
            return jsonify(result), 200

        except ValueError as e:
            logger.error(f"Error calculating metrics: {str(e)}")
            return jsonify({'error': str(e)}), 400

    except Exception as e:
        logger.error(f"Unexpected error in calculate_metrics: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
