// All site copy lives here. Facts come from the resume and the project repos;
// keep them in sync when either changes.

export const site = {
  name: 'Madhan Jothimani',
  email: 'madhan.jothimani@bc.edu',
  linkedin: 'https://www.linkedin.com/in/madhanjothimani',
  github: 'https://github.com/MadhanJ05',
  location: 'Boston, MA',
  status: 'Incoming MSF · Quantitative Finance · Boston College · Jan 2027',
  description:
    'Quantitative finance and machine learning: derivatives pricing, overfitting-aware backtesting, and ML early-warning systems for trading platforms. Incoming M.S. in Finance (Quantitative Finance Track), Boston College.',
};

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'lab', label: 'Lab' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'background', label: 'Background' },
  { id: 'contact', label: 'Contact' },
];

export const heroStats = [
  { value: '#1', label: 'Worldwide on the K4 Ramsey multiplicity leaderboard' },
  { value: '1,385×', label: 'Monte Carlo variance cut on Asian options' },
  { value: '0.29', label: 'Deflated Sharpe: the honest test my best backtest failed' },
  { value: '3', label: '2026 wins: PayPal, Sundai Club at MIT, Dell × NVIDIA' },
];

// [symbol, value, note, direction]
export const ticker = [
  ['SPY 30D ATM IV', '12.05%', 'vs VIX 14.84', 'flat'],
  ['VRP', '+3.58 vol pts', '83% of months', 'up'],
  ['BACKTEST SR', '0.80', 'DSR 0.29', 'down'],
  ['WALK-FWD SR', '0.21', 'SPY 0.92', 'down'],
  ['PBO', '0.25', '12,870 CSCV splits', 'flat'],
  ['ASIAN MC', '1,385×', 'variance cut', 'up'],
  ['HEDGED P&L', '+0.39%', 'of spot / month', 'up'],
  ['VOLTEX F1', '0.79', '+0.18 vs baseline', 'up'],
  ['K4 RAMSEY', '#1', 'worldwide', 'up'],
  ['TEST SUITE', '310', 'passing', 'up'],
];

export const work = [
  {
    slug: 'options-engine',
    num: '01',
    category: 'Derivatives · Volatility',
    period: 'Fall 2026',
    title: 'Quant Options Engine',
    fullTitle: 'Quant Options Engine: Pricing, Implied Volatility & Variance Risk Premium',
    summary:
      'Black-Scholes, binomial and Monte Carlo pricers that agree within two standard errors, the SPY volatility smile from 1,991 cleaned quotes, and a 228-month study of what delta-hedged option sellers actually earn.',
    figures: [
      { value: '1,385×', label: 'Asian-option variance cut' },
      { value: '+3.6', label: 'VIX over realized vol, avg. pts' },
      { value: '310', label: 'Tests in the suite' },
    ],
    tags: ['Python', 'Black-Scholes', 'CRR tree', 'Monte Carlo', 'Implied vol', 'Delta hedging'],
    github: 'https://github.com/MadhanJ05/options-lab',
  },
  {
    slug: 'strategy-search',
    num: '02',
    category: 'Systematic strategies · Research integrity',
    period: 'Fall 2026',
    title: 'Quant Strategy Search',
    fullTitle: 'Quant Strategy Search: Overfitting-Aware Backtesting',
    summary:
      'A vectorized engine that searched 240 momentum and mean-reversion strategies across 15 ETFs (2007–2025), then showed the best backtest, a Sharpe of 0.80, was most likely luck.',
    figures: [
      { value: '240', label: 'Strategies searched' },
      { value: '0.29', label: 'Deflated Sharpe of the top pick' },
      { value: '12,870', label: 'CSCV splits for PBO' },
    ],
    tags: ['Python', 'Backtesting', 'Deflated Sharpe', 'PBO / CSCV', 'Block bootstrap', 'Walk-forward'],
    github: 'https://github.com/MadhanJ05/strategy-search',
  },
  {
    slug: 'voltex',
    num: '03',
    category: 'Machine learning · Market stress',
    period: 'Spring 2026',
    title: 'VOLTEX',
    fullTitle: 'VOLTEX: Volatility-Triggered Early-Warning System',
    badge: 'Best Project · selected by PayPal',
    summary:
      'An early-warning system that reads equity-market stress (505 S&P 500 tickers, VIX, FOMC/CPI/NFP events) and alerts the on-call site reliability engineer before a trading platform buckles.',
    figures: [
      { value: '0.79', label: 'Macro-F1 vs. 0.61 rule baseline' },
      { value: '53→22%', label: 'False-positive rate' },
      { value: '6 / 6', label: 'Historical crises flagged' },
    ],
    tags: ['XGBoost', 'Prophet', 'ARIMA', 'Isolation Forest', 'SHAP', 'Gemini', 'ChromaDB'],
    github: 'https://github.com/MadhanJ05/Voltex',
  },
];

export const moreWork = [
  {
    year: '2025',
    title: 'Real-Time Credit Card Fraud Detection',
    desc: 'Streaming pipeline that computes real-time features on Kafka transactions and flags impossible travel, velocity attacks and spending anomalies on a live dashboard.',
    stack: ['Kafka', 'PySpark', 'MongoDB', 'Redis', 'Streamlit'],
    href: 'https://github.com/MadhanJ05/real-time-credit-card-fraud-detection',
  },
  {
    year: '2026',
    title: 'Marketplace Product Retrieval & Ranking',
    desc: 'B2B product search with LLM query understanding, hybrid BM25 + FAISS retrieval, CrossEncoder reranking and wholesale boost scoring, evaluated on Amazon ESCI across 100K products.',
    stack: ['FAISS', 'Sentence Transformers', 'CrossEncoder', 'Groq LLM', 'Streamlit'],
    href: 'https://github.com/MadhanJ05/marketplace-product-retrieval',
  },
  {
    year: '2026',
    title: 'Talk to Data: AI SQL Chatbot',
    desc: 'Turns natural-language questions into validated SQL with Llama 3.3 70B via Groq, running against a PostgreSQL database of 16K+ rental transactions.',
    stack: ['Llama 3.3 70B', 'Groq', 'PostgreSQL', 'LangChain', 'Streamlit'],
    href: 'https://github.com/MadhanJ05/talk-to-data-sql-chatbot',
  },
  {
    year: '2025',
    title: 'H&M Fashion Data Warehouse',
    desc: 'Warehouse for 15M+ transactions, 1M customers and 105K products, with automated ELT in Airflow, dbt transformations and Streamlit dashboards.',
    stack: ['Airflow', 'dbt', 'PostgreSQL', 'Docker', 'Streamlit'],
    href: 'https://github.com/MadhanJ05/HM-fashion-data-warehouse',
  },
  {
    year: '2025',
    title: 'Customer Purchase Pattern Analysis',
    desc: 'Spark pipeline over 10M+ transactions with engineered RFM features and K-Means segmentation into behavioral groups.',
    stack: ['Spark', 'K-Means', 'RFM', 'Python'],
    href: 'https://github.com/MadhanJ05/Customer_Pattern_Analysis',
  },
  {
    year: '2025',
    title: 'Boston Fire Incident Analytics',
    desc: 'Random Forest to predict high-loss fire incidents (92.3% accuracy) and Logistic Regression with time-series analysis to classify severity.',
    stack: ['Random Forest', 'Logistic Regression', 'Plotly'],
    href: 'https://github.com/MadhanJ05/Boston_Fire_Incident_Analysis',
  },
];

export const awards = [
  {
    year: '2026',
    title: '#1 worldwide, K4 Ramsey Multiplicity Leaderboard',
    org: 'RSI House OpenMath',
    desc: 'Architected a recursive self-improvement optimization loop layer by layer: designed the objective function and constraint set, chose the construction shapes pursued each iteration, and achieved the world’s top score on an open extremal combinatorics problem.',
    lead: true,
  },
  {
    year: '2026',
    title: 'Best Project, selected by PayPal',
    org: 'Sponsor award',
    desc: 'VOLTEX, a trading-platform early-warning system built as project lead of a three-person team.',
  },
  {
    year: '2026',
    title: 'Best Hack, Sundai Hack 142',
    org: 'Sundai Club, MIT',
    desc: 'Selected with my teammate; presented the Ramsey proof at Sundai Club, MIT.',
  },
  {
    year: '2026',
    title: 'Winner, Dell × NVIDIA Local AI Agent Hackathon',
    org: 'Boston · October 2026',
    desc: 'Led the team that built Lifeline, an on-device AI agent for earthquake search and rescue that combines WiFi sensing with satellite damage data, running on a Dell Pro Max GB10.',
  },
  {
    year: '2026',
    title: 'Technical Volunteer, Boston Claude Community',
    org: 'Community · September 2026',
    desc: 'Supported builders at two Claude community events in Boston.',
  },
];

export const education = [
  {
    title: 'M.S. in Finance, Quantitative Finance Track',
    org: 'Boston College · Carroll School of Management',
    when: 'Starts Jan 2027',
    badge: 'Incoming',
    body: 'STEM-designated, 10-course program. Required core: Investments, Corporate Finance, Management of Financial Institutions, and Financial Econometrics.',
  },
  {
    title: 'Master of Professional Studies in Analytics',
    org: 'Northeastern University · Boston',
    when: 'Jul 2024 – Dec 2026',
    body: 'Statistics, Machine Learning, Data Mining, Data Management & Warehousing, Visualization.',
  },
  {
    title: 'B.E., Electronics & Communication Engineering',
    org: 'Anna University · Chennai',
    when: '2016 – 2020',
  },
];

export const experience = [
  {
    title: 'Systems Engineer',
    org: 'Infosys · Chennai & Mysore, India',
    when: 'May 2021 – Sep 2023',
    bullets: [
      'Built and optimized batch and streaming pipelines (Kafka, Airflow) for broadband device telemetry analytics.',
      'Developed and productionized anomaly detection and regression models (Isolation Forest, Random Forest) on device telemetry to surface network performance issues, improving service performance by ~15%.',
      'Automated CI/CD with Docker and Jenkins, cutting deployment time by ~35% and improving release reliability.',
    ],
  },
];

export const toolkit = [
  ['Quantitative methods', ['Derivatives pricing', 'Monte Carlo', 'Backtesting', 'Overfitting tests (DSR, PBO)', 'Time-series forecasting']],
  ['Programming', ['Python', 'SQL', 'R', 'Bash', 'Excel']],
  ['Machine learning', ['XGBoost', 'Random Forest', 'Isolation Forest', 'K-Means', 'SHAP', 'LLM agents', 'RAG']],
  ['Data & infrastructure', ['Spark', 'Kafka', 'Airflow', 'dbt', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Git', 'CI/CD', 'GCP']],
  ['Visualization', ['Tableau', 'Power BI', 'Plotly', 'Matplotlib', 'Streamlit']],
  [
    'Certifications',
    [
      'Bloomberg Finance Fundamentals (2026)',
      'Machine Learning, Stanford Online',
      'Intermediate Machine Learning, Kaggle',
      'K-Means Clustering in Python, University of London',
      'Microsoft SQL Server 2022',
      'Azure Administration Essential Training',
    ],
  ],
];
