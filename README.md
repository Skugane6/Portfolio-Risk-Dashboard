# 📊 Portfolio Risk Dashboard

A modern, interactive portfolio risk analytics platform built with React, Flask, and Modern Portfolio Theory. Get comprehensive risk metrics, visualizations, and stress testing for your investment portfolio.

![Portfolio Risk Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-19.0+-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📈 Risk Metrics
- **Portfolio Volatility**: Annualized standard deviation of returns
- **Sharpe Ratio**: Risk-adjusted return analysis
- **Value at Risk (VaR)**: Historical and parametric VaR at 95% and 99% confidence levels
- **Maximum Drawdown**: Largest peak-to-trough decline analysis
- **Beta Analysis**: Portfolio sensitivity vs. S&P 500

### 📊 Interactive Visualizations
- **Portfolio Value Chart**: Historical performance tracking
- **Drawdown Chart**: Visual representation of portfolio declines
- **Rolling Volatility**: 30-day rolling volatility analysis
- **Correlation Heatmap**: Asset correlation matrix
- **Return Distribution**: VaR visualization with histogram

### 🔬 Stress Testing
- **COVID-19 Market Crash** (2020): Performance during pandemic onset
- **2022 Market Downturn**: Inflation and rate hike impact
- **Worst Day Analysis**: Historical single-day maximum loss

### 🎨 Modern UI/UX
- Beautiful glassmorphic design with dark theme
- Smooth animations powered by Framer Motion
- Responsive layout for all devices
- Interactive tooltips for metric explanations
- Real-time data updates

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/portfolio-risk-dashboard.git
cd portfolio-risk-dashboard
```

2. **Set up the backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Set up the frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```
The API will be available at `http://localhost:5000`

2. **Start the frontend development server**
```bash
cd frontend
npm run dev
```
The application will open at `http://localhost:5173`

## 📚 Usage

### Basic Portfolio Analysis

1. **Enter your portfolio**:
   - Add stock tickers (e.g., SPY, QQQ, AAPL)
   - Set allocation percentages (must sum to 100%)
   - Select date range for analysis

2. **View Results**:
   - Key risk metrics displayed in cards
   - Interactive charts for detailed analysis
   - Stress test results for historical crises

### Example Portfolios

**Conservative Portfolio**:
- 60% VTI (Total US Market)
- 30% BND (Total Bond Market)
- 10% GLD (Gold)

**Growth Portfolio**:
- 40% QQQ (NASDAQ-100)
- 30% SPY (S&P 500)
- 20% VWO (Emerging Markets)
- 10% TLT (Long-term Treasuries)

**Tech-Focused Portfolio**:
- 40% AAPL (Apple)
- 30% MSFT (Microsoft)
- 30% GOOGL (Google)

## 🏗️ Architecture

### Backend (Flask)
```
backend/
├── app.py                 # Main Flask application
├── risk_metrics.py        # Risk calculation functions
├── data_fetcher.py        # Yahoo Finance integration
├── stress_tests.py        # Historical stress testing
└── requirements.txt       # Python dependencies
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── PortfolioInput.jsx      # Input form
│   │   ├── MetricsCards.jsx        # Risk metrics display
│   │   ├── Tooltip.jsx             # Tooltip component
│   │   └── charts/                 # Chart components
│   ├── services/
│   │   └── api.js                  # API integration
│   └── index.css                   # Tailwind styles
└── package.json
```

## 📊 API Endpoints

### Health Check
```http
GET /api/health
```

### Calculate Metrics
```http
POST /api/calculate-metrics
Content-Type: application/json

{
  "tickers": ["SPY", "QQQ", "GLD"],
  "weights": [50, 30, 20],
  "start_date": "2023-01-01",
  "end_date": "2024-01-01"
}
```

## 🧮 Risk Formulas

### Portfolio Returns
```
R_p = Σ(w_i × R_i)
```
Where `w_i` is asset weight and `R_i` is asset return

### Volatility (Annualized)
```
σ_annual = σ_daily × √252
```

### Sharpe Ratio
```
Sharpe = (R_p - R_f) / σ_p
```
Where `R_f` is the risk-free rate (default: 4%)

### Value at Risk (Historical)
```
VaR_α = -Percentile(returns, α)
```
Where `α` is the confidence level (95% or 99%)

### Beta
```
β = Cov(R_p, R_m) / Var(R_m)
```
Where `R_m` is market (S&P 500) returns

### Maximum Drawdown
```
DD = (Trough - Peak) / Peak
```

## 🛠️ Technology Stack

### Backend
- **Flask**: Web framework
- **NumPy**: Numerical computations
- **Pandas**: Data manipulation
- **SciPy**: Statistical functions
- **yfinance**: Market data fetching

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **Axios**: HTTP client

## 📦 Deployment

### Backend (Render/Heroku)

1. Create `Procfile`:
```
web: python app.py
```

2. Update `app.py` for production:
```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

3. Deploy to Render or Heroku

### Frontend (Vercel/Netlify)

1. Build the application:
```bash
npm run build
```

2. Configure environment variables:
```
VITE_API_URL=https://your-backend-url.com
```

3. Deploy to Vercel or Netlify

## 🔒 Environment Variables

### Backend
```env
FLASK_ENV=production
PORT=5000
```

### Frontend
```env
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

### Test Different Portfolio Scenarios

**All Tech Stocks** (High Risk):
```bash
curl -X POST http://localhost:5000/api/calculate-metrics \
  -H "Content-Type: application/json" \
  -d '{
    "tickers": ["AAPL", "MSFT", "GOOGL"],
    "weights": [40, 30, 30],
    "start_date": "2023-01-01",
    "end_date": "2024-01-01"
  }'
```

**Diversified ETFs** (Moderate Risk):
```bash
curl -X POST http://localhost:5000/api/calculate-metrics \
  -H "Content-Type: application/json" \
  -d '{
    "tickers": ["VTI", "VXUS", "BND"],
    "weights": [50, 30, 20],
    "start_date": "2023-01-01",
    "end_date": "2024-01-01"
  }'
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Market data powered by [Yahoo Finance](https://finance.yahoo.com)
- Modern Portfolio Theory concepts
- Risk management principles from CFA curriculum

## 🐛 Known Issues

- Historical data availability limited by Yahoo Finance
- Some ETFs may have limited historical data
- VaR calculations assume normal distribution for parametric method

## 🚧 Future Enhancements

- [ ] Monte Carlo simulations
- [ ] Portfolio optimization (Efficient Frontier)
- [ ] Multiple portfolio comparison
- [ ] Export reports to PDF
- [ ] Real-time market data updates
- [ ] User authentication and portfolio saving
- [ ] Additional asset classes (crypto, commodities)
- [ ] Custom stress test scenarios

## 📧 Contact

For questions or feedback, please open an issue or contact [your-email@example.com](mailto:your-email@example.com)

---

**Built with ❤️ using Modern Portfolio Theory and cutting-edge web technologies**
