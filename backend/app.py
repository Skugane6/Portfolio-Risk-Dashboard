from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
