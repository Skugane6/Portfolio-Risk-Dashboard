# Portfolio Risk Dashboard - Project Plan

## 1. Project Structure

```
portfolio-risk-dashboard/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── config.py
│   ├── models/
│   │   └── portfolio.py
│   ├── services/
│   │   ├── data_service.py
│   │   ├── risk_calculator.py
│   │   └── stress_test.py
│   └── utils/
│       └── validators.py
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── PortfolioInput.jsx
│   │   │   ├── RiskMetricsPanel.jsx
│   │   │   ├── PortfolioValueChart.jsx
│   │   │   ├── DrawdownChart.jsx
│   │   │   ├── CorrelationHeatmap.jsx
│   │   │   ├── VaRHistogram.jsx
│   │   │   ├── RollingVolatilityChart.jsx
│   │   │   └── StressTestPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── formatters.js
│   └── public/
└── README.md
```

## 2. Implementation Phases

### Phase 1: Backend Foundation
- [ ] Set up Flask application structure
- [ ] Install dependencies (Flask, yfinance, pandas, numpy, scipy)
- [ ] Create configuration management
- [ ] Implement data fetching service using yfinance
- [ ] Build portfolio validation logic

### Phase 2: Risk Calculation Engine
- [ ] Implement portfolio returns calculation
- [ ] Build VaR calculator (95% and 99% confidence levels)
- [ ] Calculate Sharpe Ratio
- [ ] Compute Maximum Drawdown
- [ ] Calculate Beta (vs S&P 500)
- [ ] Compute Portfolio Volatility
- [ ] Implement correlation matrix calculation

### Phase 3: Advanced Analytics
- [ ] Build rolling volatility calculator
- [ ] Implement stress testing for COVID crash (Feb-Mar 2020)
- [ ] Implement stress testing for 2022 downturn
- [ ] Create portfolio value time series generator
- [ ] Build drawdown time series

### Phase 4: API Development
- [ ] Create portfolio analysis endpoint
- [ ] Create historical data endpoint
- [ ] Create stress test endpoint
- [ ] Implement error handling and validation
- [ ] Add CORS support for frontend

### Phase 5: Frontend Setup
- [ ] Initialize React application
- [ ] Configure Tailwind CSS
- [ ] Set up API service layer
- [ ] Create base layout and routing

### Phase 6: UI Components
- [ ] Build portfolio input form with validation
- [ ] Create risk metrics display panel
- [ ] Implement portfolio value chart (line chart)
- [ ] Build drawdown chart
- [ ] Create correlation heatmap
- [ ] Implement VaR histogram
- [ ] Build rolling volatility chart
- [ ] Create stress test results panel

### Phase 7: Integration & Polish
- [ ] Connect all components to backend API
- [ ] Implement loading states
- [ ] Add error handling and user feedback
- [ ] Optimize performance
- [ ] Responsive design testing
- [ ] Cross-browser testing

### Phase 8: Testing & Documentation
- [ ] Test with sample portfolios
- [ ] Validate calculations against known benchmarks
- [ ] Create user documentation
- [ ] Code cleanup and optimization

## 3. Key Formulas and Calculations

### Portfolio Return
```
R_p = Σ(w_i × R_i)
where w_i = weight of asset i, R_i = return of asset i
```

### Portfolio Volatility
```
σ_p = √(w^T × Σ × w)
where w = weight vector, Σ = covariance matrix
```

### Value at Risk (VaR) - Historical Method
```
VaR_α = -Percentile(returns, 1-α)
95% VaR: α = 0.95
99% VaR: α = 0.99
```

### Sharpe Ratio
```
Sharpe = (R_p - R_f) / σ_p
where R_p = portfolio return, R_f = risk-free rate (assume 2% annual), σ_p = portfolio volatility
```

### Maximum Drawdown
```
DD_t = (V_t - V_peak) / V_peak
MDD = min(DD_t) for all t
where V_t = portfolio value at time t, V_peak = maximum portfolio value up to time t
```

### Beta
```
β = Cov(R_p, R_m) / Var(R_m)
where R_p = portfolio returns, R_m = market returns (S&P 500)
```

### Rolling Volatility (30-day)
```
σ_rolling(t) = std(returns[t-30:t]) × √252
Annualized using 252 trading days
```

## 4. API Endpoints

### POST /api/analyze
**Request:**
```json
{
  "portfolio": [
    {"ticker": "AAPL", "weight": 30},
    {"ticker": "MSFT", "weight": 25},
    {"ticker": "GOOGL", "weight": 20},
    {"ticker": "AMZN", "weight": 15},
    {"ticker": "NVDA", "weight": 10}
  ],
  "start_date": "2020-01-01",
  "end_date": "2024-12-31"
}
```

**Response:**
```json
{
  "risk_metrics": {
    "var_95": 2.34,
    "var_99": 3.87,
    "sharpe_ratio": 1.52,
    "max_drawdown": -28.45,
    "beta": 1.12,
    "portfolio_volatility": 18.23
  },
  "portfolio_value": [
    {"date": "2020-01-01", "value": 100000},
    {"date": "2020-01-02", "value": 100234}
  ],
  "drawdown_series": [
    {"date": "2020-01-01", "drawdown": 0},
    {"date": "2020-01-02", "drawdown": -1.2}
  ],
  "rolling_volatility": [
    {"date": "2020-02-01", "volatility": 15.3},
    {"date": "2020-02-02", "volatility": 15.8}
  ],
  "correlation_matrix": {
    "tickers": ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA"],
    "matrix": [[1.0, 0.85, 0.78, 0.72, 0.68], [...]]
  },
  "returns_distribution": {
    "returns": [-0.05, -0.03, 0.01, 0.02, 0.04],
    "var_95_line": -2.34,
    "var_99_line": -3.87
  }
}
```

### POST /api/stress-test
**Request:**
```json
{
  "portfolio": [
    {"ticker": "AAPL", "weight": 30},
    {"ticker": "MSFT", "weight": 25}
  ],
  "scenario": "covid_crash"
}
```

**Response:**
```json
{
  "scenario": "COVID Crash (Feb-Mar 2020)",
  "period": {
    "start": "2020-02-19",
    "end": "2020-03-23"
  },
  "portfolio_return": -32.5,
  "market_return": -33.9,
  "max_drawdown": -35.2,
  "daily_values": [
    {"date": "2020-02-19", "value": 100000},
    {"date": "2020-02-20", "value": 98500}
  ]
}
```

### GET /api/validate-tickers
**Query:** `?tickers=AAPL,MSFT,GOOGL`

**Response:**
```json
{
  "valid": ["AAPL", "MSFT", "GOOGL"],
  "invalid": []
}
```

## 5. Frontend Component Breakdown

### PortfolioInput.jsx
- Input fields for ticker symbols and weights
- Add/remove position functionality
- Weight validation (must sum to 100%)
- Date range selector
- Submit button to trigger analysis

### RiskMetricsPanel.jsx
- Display cards for each metric:
  - VaR 95% (red/green color coding)
  - VaR 99% (red/green color coding)
  - Sharpe Ratio (with interpretation)
  - Maximum Drawdown (percentage)
  - Beta (vs S&P 500)
  - Portfolio Volatility (annualized %)

### PortfolioValueChart.jsx
- Line chart showing portfolio value over time
- X-axis: Date
- Y-axis: Portfolio value ($)
- Tooltip on hover
- Library: Recharts or Chart.js

### DrawdownChart.jsx
- Area chart showing drawdown over time
- X-axis: Date
- Y-axis: Drawdown (%)
- Highlight maximum drawdown point
- Red fill color

### CorrelationHeatmap.jsx
- Heatmap visualization
- Color scale: -1 (red) to +1 (green)
- Display correlation coefficients in cells
- Library: react-heatmap-grid or custom D3

### VaRHistogram.jsx
- Histogram of daily returns
- Vertical lines marking VaR 95% and VaR 99%
- Color code bins beyond VaR thresholds
- X-axis: Daily returns (%)
- Y-axis: Frequency

### RollingVolatilityChart.jsx
- Line chart showing 30-day rolling volatility
- X-axis: Date
- Y-axis: Annualized volatility (%)
- Highlight periods of high volatility

### StressTestPanel.jsx
- Tabs or buttons for different scenarios:
  - COVID Crash (Feb-Mar 2020)
  - 2022 Downturn
- Display scenario-specific metrics
- Mini chart showing portfolio performance during period
- Comparison with market (S&P 500)

## 6. Sample Test Portfolios

### Portfolio 1: Tech-Heavy
```json
{
  "name": "Tech Giants",
  "positions": [
    {"ticker": "AAPL", "weight": 25},
    {"ticker": "MSFT", "weight": 25},
    {"ticker": "GOOGL", "weight": 20},
    {"ticker": "AMZN", "weight": 15},
    {"ticker": "NVDA", "weight": 15}
  ]
}
```

### Portfolio 2: Diversified
```json
{
  "name": "Balanced Portfolio",
  "positions": [
    {"ticker": "SPY", "weight": 40},
    {"ticker": "AGG", "weight": 30},
    {"ticker": "GLD", "weight": 15},
    {"ticker": "VNQ", "weight": 15}
  ]
}
```

### Portfolio 3: High Beta
```json
{
  "name": "Aggressive Growth",
  "positions": [
    {"ticker": "TSLA", "weight": 30},
    {"ticker": "NVDA", "weight": 25},
    {"ticker": "AMD", "weight": 20},
    {"ticker": "SQ", "weight": 15},
    {"ticker": "ARKK", "weight": 10}
  ]
}
```

### Portfolio 4: Defensive
```json
{
  "name": "Low Volatility",
  "positions": [
    {"ticker": "JNJ", "weight": 25},
    {"ticker": "PG", "weight": 25},
    {"ticker": "KO", "weight": 20},
    {"ticker": "WMT", "weight": 20},
    {"ticker": "VZ", "weight": 10}
  ]
}
```

## 7. Technical Dependencies

### Backend (requirements.txt)
```
Flask==3.0.0
flask-cors==4.0.0
yfinance==0.2.32
pandas==2.1.3
numpy==1.26.2
scipy==1.11.4
python-dateutil==2.8.2
```

### Frontend (package.json key dependencies)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "recharts": "^2.10.0",
  "axios": "^1.6.0",
  "tailwindcss": "^3.3.0"
}
```

## 8. Development Timeline Estimate

- **Phase 1-2:** 2-3 days (Backend foundation + risk calculations)
- **Phase 3-4:** 2-3 days (Advanced analytics + API)
- **Phase 5-6:** 3-4 days (Frontend setup + components)
- **Phase 7-8:** 2-3 days (Integration + testing)

**Total:** 9-13 days for MVP

## 9. Future Enhancements

- Portfolio optimization (Efficient Frontier)
- Monte Carlo simulation
- Factor analysis (Fama-French)
- Multi-period analysis
- Export to PDF/Excel
- Save/load portfolios
- Real-time data updates
- User authentication
- Portfolio comparison
- Sector allocation analysis
- ESG metrics integration
