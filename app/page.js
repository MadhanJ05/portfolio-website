// app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Code, Database, BarChart3, Brain, Award, FileText, Menu, X, Shield, ArrowUpRight, Cloud, Cpu, Settings, Search, Trophy, TrendingUp, Activity, Sigma, Users, MessageSquare } from 'lucide-react';

const navItems = ['Home', 'Projects', 'Awards', 'Experience', 'Skills', 'Contact'];

function SectionHeader({ eyebrow, title, visible }) {
  return (
    <div className={`text-center mb-16 ${visible ? 'animate-slide-up' : 'opacity-0'}`}>
      <p className="text-red-500 text-sm tracking-widest uppercase mb-3 font-semibold">{eyebrow}</p>
      <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">{title}</h2>
      <div className="section-accent mx-auto mt-5" />
    </div>
  );
}

function Stats({ stats, size = 'sm' }) {
  if (!stats || stats.length === 0) return null;
  const valueClass = size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl';
  return (
    <div className={`grid grid-cols-3 gap-3 ${size === 'lg' ? 'gap-4' : ''}`}>
      {stats.map((stat, i) => (
        <div key={i} className="stat-box rounded-xl px-3 py-3">
          <p className={`${valueClass} font-bold text-gray-900 tabular-nums leading-tight`}>{stat.value}</p>
          <p className="text-sm text-gray-500 mt-1 leading-snug">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function TechTags({ tech }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((t, i) => (
        <span key={i} className="tech-tag text-xs px-3 py-1.5 rounded-full">{t}</span>
      ))}
    </div>
  );
}

function ProjectCard({ project, idx, visible }) {
  return (
    <div
      className={`project-card rounded-2xl p-6 flex flex-col ${visible ? 'animate-slide-up' : 'opacity-0'}`}
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="icon-box w-11 h-11 rounded-xl flex items-center justify-center text-red-500 shrink-0">
          {project.icon}
        </div>
        {project.badge && (
          <span className="text-xs text-red-600 px-3 py-1.5 bg-red-50 rounded-full border border-red-100 font-semibold text-right">
            {project.badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 text-gray-900 leading-snug">{project.title}</h3>
      <p className="text-gray-600 mb-5 text-base leading-relaxed">{project.summary}</p>

      {project.stats && <div className="mb-5"><Stats stats={project.stats} /></div>}

      <div className="mb-5"><TechTags tech={project.tech} /></div>

      <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link text-base mt-auto w-fit">
        View Project <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set(['home']));
  const [rotatingTextIndex, setRotatingTextIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const rotatingTexts = [
    "Pricing options, testing strategies, catching overfitting",
    "Early-warning ML for trading platforms, sponsored by PayPal",
    "#1 worldwide on an open math optimization problem"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
      const current = navItems.map(item => item.toLowerCase()).find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setRotatingTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsTextVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const skills = {
    "Quantitative Methods": {
      icon: <TrendingUp className="w-5 h-5 text-red-500" />,
      items: ["Derivatives Pricing", "Monte Carlo", "Backtesting", "Overfitting Tests (DSR, PBO)", "Time-Series Forecasting"]
    },
    "Programming Languages": {
      icon: <Code className="w-5 h-5 text-red-500" />,
      items: ["Python", "SQL", "R", "Bash", "Excel"]
    },
    "Frameworks": {
      icon: <Settings className="w-5 h-5 text-red-500" />,
      items: ["Apache Airflow", "Apache Kafka", "Apache Spark", "dbt", "Streamlit", "Scikit-learn", "Matplotlib", "Plotly"]
    },
    "Cloud & DevOps": {
      icon: <Cloud className="w-5 h-5 text-red-500" />,
      items: ["Git", "Docker", "Jenkins", "CI/CD", "GCP"]
    },
    "Databases": {
      icon: <Database className="w-5 h-5 text-red-500" />,
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"]
    },
    "AI & ML": {
      icon: <Cpu className="w-5 h-5 text-red-500" />,
      items: ["XGBoost", "Random Forest", "Isolation Forest", "Logistic Regression", "K-Means Clustering", "Time Series", "Regression", "SHAP Explainability", "LLM Agents", "RAG"]
    },
    "Visualization": {
      icon: <BarChart3 className="w-5 h-5 text-red-500" />,
      items: ["Tableau", "Power BI"]
    }
  };

  const featuredProject = {
    title: "VOLTEX: Volatility-Triggered Early-Warning System",
    context: "Project Lead · 3-person team · Spring 2026",
    badge: "Best Project · PayPal",
    summary: "Predicts trading-platform stress from equity-market signals and alerts the on-call site reliability engineer before outages happen.",
    details: [
      "Inputs: S&P 500 data across 505 tickers, VIX, and FOMC/CPI/NFP event flags",
      "XGBoost risk-tier classifier with isotonic calibration, Prophet/ARIMA volume forecasts, and Isolation Forest anomaly detection on 12 causal features",
      "Guardrailed RAG agent (Gemini, ChromaDB) turns SHAP drivers into auditable alerts; the LLM never sees raw market data"
    ],
    stats: [
      { value: "0.79", label: "Macro-F1 vs. 0.61 rule baseline" },
      { value: "6 / 6", label: "Historical market crises flagged" },
      { value: "53→22%", label: "False positive rate" }
    ],
    tech: ["XGBoost", "Prophet", "ARIMA", "Isolation Forest", "SHAP", "Gemini", "ChromaDB", "Python"],
    icon: <Activity className="w-6 h-6" />,
    github: "https://github.com/MadhanJ05/Voltex"
  };

  const quantProjects = [
    {
      title: "Quant Strategy Search: Overfitting-Aware Backtesting",
      summary: "Vectorized engine that searches momentum and mean-reversion strategies across 15 ETFs (2007–2025), and shows the best backtest (Sharpe 0.80) was likely luck.",
      stats: [
        { value: "240", label: "Strategies searched" },
        { value: "12,870", label: "CSCV splits for PBO" },
        { value: "0.29", label: "Deflated Sharpe of top pick" }
      ],
      tech: ["Python", "Backtesting", "Deflated Sharpe Ratio", "PBO / CSCV", "Bootstrap"],
      icon: <TrendingUp className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/strategy-search"
    },
    {
      title: "Quant Options Engine: Pricing, IV & Variance Risk Premium",
      summary: "Black-Scholes, binomial and Monte Carlo pricers that agree within 2 standard errors, plus the SPY volatility smile and variance risk premium (VIX above realized vol by 3.6 pts).",
      stats: [
        { value: "1,385×", label: "Asian-option variance cut" },
        { value: "310", label: "Tests in the suite" },
        { value: "0.96", label: "Hedged P&L vs. theory corr." }
      ],
      tech: ["Python", "Black-Scholes", "Monte Carlo", "Binomial Tree", "Implied Volatility"],
      icon: <Sigma className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/options-lab"
    },
    {
      title: "Real-Time Credit Card Fraud Detection System",
      summary: "Streaming pipeline that computes real-time features on Kafka transactions and flags impossible travel, velocity attacks, and spending anomalies on a live dashboard.",
      badge: "Live Monitoring",
      tech: ["Apache Kafka", "PySpark", "MongoDB", "Redis", "Streamlit"],
      icon: <Shield className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/real-time-credit-card-fraud-detection"
    }
  ];

  const dataProjects = [
    {
      title: "Marketplace Product Retrieval and Ranking System",
      summary: "B2B product search combining LLM query understanding (Groq), hybrid BM25 + FAISS retrieval, CrossEncoder reranking, and wholesale boost scoring, evaluated on Amazon ESCI.",
      stats: [
        { value: "100K", label: "Products indexed" },
        { value: "5", label: "Pipeline stages" }
      ],
      tech: ["FAISS", "Sentence Transformers", "CrossEncoder", "Streamlit", "Python", "Groq LLM"],
      icon: <Search className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/wholesale-product-retrieval"
    },
    {
      title: "Talk to Data - AI SQL Chatbot",
      summary: "Turns natural-language questions into validated SQL with Llama 3.3 70B via Groq, running against a PostgreSQL database in a Streamlit UI.",
      stats: [
        { value: "16K+", label: "Rental transactions" },
        { value: "70B", label: "Llama 3.3 parameters" }
      ],
      tech: ["Llama 3.3 70B", "Groq API", "PostgreSQL", "Neon", "Streamlit", "Python", "LangChain"],
      icon: <MessageSquare className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/talk-to-data-sql-chatbot"
    },
    {
      title: "H&M Fashion Data Warehouse",
      summary: "Production-grade warehouse with automated ELT pipelines in Airflow, dbt transformations, and interactive Streamlit dashboards.",
      stats: [
        { value: "15M+", label: "Transactions" },
        { value: "1M", label: "Customers" },
        { value: "105K", label: "Products" }
      ],
      tech: ["Apache Airflow", "Docker", "PostgreSQL", "dbt", "Streamlit", "Python"],
      icon: <Database className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/HM-fashion-data-warehouse"
    },
    {
      title: "Customer Purchase Pattern Analysis",
      summary: "Spark-based pipeline with engineered RFM features and K-Means clustering to segment customers into behavioral groups.",
      stats: [
        { value: "10M+", label: "Transactions processed" }
      ],
      tech: ["Python", "Spark", "K-Means", "RFM Analysis"],
      icon: <BarChart3 className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/Customer_Pattern_Analysis/tree/main"
    },
    {
      title: "Boston Fire Incident Analytics",
      summary: "Random Forest to predict high-loss fire incidents and Logistic Regression with time-series analysis to classify fire severity.",
      stats: [
        { value: "92.3%", label: "Accuracy" }
      ],
      tech: ["Python", "Random Forest", "Logistic Regression", "Plotly"],
      icon: <Brain className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/Boston_Fire_Incident_Analysis"
    }
  ];

  const highlights = [
    { icon: <Trophy className="w-4 h-4" />, title: "#1 Worldwide", detail: "K4 Ramsey leaderboard" },
    { icon: <Award className="w-4 h-4" />, title: "Best Project", detail: "PayPal" },
    { icon: <Award className="w-4 h-4" />, title: "Best Hack", detail: "Sundai Hack 142" },
    { icon: <Trophy className="w-4 h-4" />, title: "Winner", detail: "Dell × NVIDIA Hackathon" }
  ];

  const experience = [
    {
      role: "Systems Engineer",
      company: "Infosys",
      location: "Chennai & Mysore, India",
      period: "May 2021 - Sep 2023",
      achievements: [
        "Built and optimized batch and streaming pipelines (Kafka, Airflow) for broadband device telemetry analytics",
        "Developed and productionized anomaly detection and regression models (Isolation Forest, Random Forest) on device telemetry to surface network performance issues, improving service performance by ~15%",
        "Automated CI/CD with Docker and Jenkins, cutting deployment time by ~35% and improving release reliability"
      ]
    }
  ];

  const awards = [
    {
      title: "#1 Worldwide, K4 Ramsey Multiplicity Leaderboard",
      org: "RSI House OpenMath",
      date: "2026",
      desc: "Architected a recursive self-improvement optimization loop layer by layer: designed the objective function and constraint set, chose the construction shapes pursued each iteration, and achieved the world's top score on an open extremal combinatorics problem.",
      icon: <Trophy className="w-5 h-5" />
    },
    {
      title: "Best Project, Selected by PayPal",
      org: "Sponsor Award",
      date: "2026",
      desc: "VOLTEX trading-platform early-warning system.",
      icon: <Award className="w-5 h-5" />
    },
    {
      title: "Best Hack, Sundai Hack 142",
      org: "Sundai Club, MIT",
      date: "2026",
      desc: "Selected with a teammate; presented the Ramsey proof at Sundai Club, MIT.",
      icon: <Award className="w-5 h-5" />
    },
    {
      title: "Winner, Dell x NVIDIA Local AI Agent Hackathon",
      org: "Boston",
      date: "Oct 2026",
      desc: "Led the team that built Lifeline, an on-device AI agent for earthquake search and rescue that combines WiFi sensing with satellite damage data, running on a Dell Pro Max GB10.",
      icon: <Trophy className="w-5 h-5" />
    },
    {
      title: "Technical Volunteer, Boston Claude Community",
      org: "Community",
      date: "Sep 2026",
      desc: "Supported builders at two Claude community events in Boston.",
      icon: <Users className="w-5 h-5" />
    }
  ];

  const certifications = [
    "Bloomberg Finance Fundamentals (Bloomberg L.P., 2026)",
    "Machine Learning (Stanford Online)",
    "K-Means Clustering in Python (University of London)",
    "Intermediate Machine Learning (Kaggle)",
    "Microsoft SQL Server 2022",
    "Azure Administration Essential Training"
  ];

  const education = [
    {
      degree: "Master of Professional Studies in Analytics",
      school: "Northeastern University",
      location: "Boston, Massachusetts",
      period: "Jul 2024 - Dec 2026 (expected)",
      courses: ["Statistics", "Machine Learning", "Data Mining", "Data Management & Warehousing", "Visualization"]
    },
    {
      degree: "Bachelor of Engineering in Electronics and Communication Engineering",
      school: "Anna University",
      location: "Chennai, India",
      period: "Aug 2016 - Sep 2020",
      courses: []
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 relative overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full nav-glass z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="#home" className="text-3xl font-bold name-hover">
              MJ
            </a>

            <div className="hidden md:flex gap-10">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`nav-link text-sm tracking-wider uppercase py-1 ${
                    activeSection === item.toLowerCase() ? 'active' : ''
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              className="md:hidden p-2 hover:bg-red-500/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-red-500" /> : <Menu className="w-6 h-6 text-red-500" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-slide-up">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-red-500 transition-colors duration-300 pl-4 border-l-2 border-transparent hover:border-red-500 text-sm tracking-wider uppercase font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-28 pb-16 hero-glow">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className={`mb-8 ${visibleSections.has('home') ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="hero-pill inline-flex items-center gap-3 px-5 py-2.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600 text-sm tracking-widest uppercase font-medium">Quantitative Finance · Machine Learning</span>
            </div>
          </div>

          <h1 className={`text-5xl md:text-8xl font-bold tracking-tight mb-6 ${visibleSections.has('home') ? 'animate-slide-up delay-100' : 'opacity-0'}`}>
            <span className="name-hover">Madhan Jothimani</span>
          </h1>

          <p className={`text-xl md:text-2xl text-gray-700 mb-6 font-semibold tracking-wide ${visibleSections.has('home') ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
            Quant & Machine Learning <span className="text-red-500">·</span> Data Scientist
          </p>

          <div className={`mb-10 min-h-[4rem] md:min-h-[2.5rem] ${visibleSections.has('home') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <p className={`text-xl md:text-2xl text-gray-800 font-medium transition-all duration-500 ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {rotatingTexts[rotatingTextIndex]}
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-10 ${visibleSections.has('home') ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
            <a href="mailto:jothimani.m@northeastern.edu"
               className="btn-red px-10 py-4 rounded-full text-sm uppercase tracking-wider">
              Get In Touch
            </a>
            <a href="#projects"
               className="btn-blue px-10 py-4 rounded-full text-sm uppercase tracking-wider">
              View Projects
            </a>
          </div>

          <div className={`flex gap-4 justify-center mb-14 ${visibleSections.has('home') ? 'animate-slide-up delay-500' : 'opacity-0'}`}>
            {[
              { icon: <Linkedin className="w-5 h-5" />, href: "http://www.linkedin.com/in/madhanjothimani" },
              { icon: <Github className="w-5 h-5" />, href: "https://github.com/MadhanJ05?tab=repositories" },
              { icon: <Mail className="w-5 h-5" />, href: "mailto:jothimani.m@northeastern.edu" }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target={social.href.startsWith('http') ? "_blank" : undefined}
                rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                className="social-icon w-14 h-14 flex items-center justify-center rounded-full"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Highlights Strip */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto ${visibleSections.has('home') ? 'animate-slide-up delay-600' : 'opacity-0'}`}>
            {highlights.map((h, idx) => (
              <a key={idx} href="#awards" className="highlight-pill rounded-xl px-4 py-3 text-left">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  {h.icon}
                  <span className="text-base font-bold text-gray-900">{h.title}</span>
                </div>
                <p className="text-sm text-gray-500 leading-snug">{h.detail}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Projects Section */}
      <section id="projects" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Portfolio" title="Featured Projects" visible={visibleSections.has('projects')} />

          {/* Featured Project */}
          <div className={`project-card featured-card rounded-2xl p-6 md:p-10 mb-16 ${visibleSections.has('projects') ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
              <div className="lg:col-span-3">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="icon-box w-12 h-12 rounded-xl flex items-center justify-center text-red-500">
                    {featuredProject.icon}
                  </div>
                  <span className="text-xs text-red-600 px-3 py-1.5 bg-red-50 rounded-full border border-red-100 font-semibold">
                    {featuredProject.badge}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">{featuredProject.title}</h3>
                <p className="text-sm text-blue-600 font-semibold mb-4">{featuredProject.context}</p>
                <p className="text-gray-600 leading-relaxed mb-5">{featuredProject.summary}</p>
                <ul className="space-y-2.5 mb-6">
                  {featuredProject.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-gray-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mb-6"><TechTags tech={featuredProject.tech} /></div>
                <a href={featuredProject.github} target="_blank" rel="noopener noreferrer" className="project-link text-base">
                  View Project <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
              <div className="lg:col-span-2 flex flex-col justify-center">
                <p className="text-sm text-gray-500 tracking-widest uppercase font-semibold mb-3">Results</p>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                  {featuredProject.stats.map((stat, i) => (
                    <div key={i} className="stat-box rounded-xl px-4 py-4">
                      <p className="text-2xl md:text-4xl font-bold text-gray-900 tabular-nums leading-tight">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-snug">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quant & ML */}
          <h3 className="group-heading text-base font-bold tracking-widest uppercase text-gray-900 mb-6">Quant & ML</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {quantProjects.map((project, idx) => (
              <ProjectCard key={project.title} project={project} idx={idx} visible={visibleSections.has('projects')} />
            ))}
          </div>

          {/* Data, AI & Analytics */}
          <h3 className="group-heading text-base font-bold tracking-widest uppercase text-gray-900 mb-6">Data, AI & Analytics</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataProjects.map((project, idx) => (
              <ProjectCard key={project.title} project={project} idx={idx} visible={visibleSections.has('projects')} />
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Awards Section */}
      <section id="awards" className="py-28 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="Recognition" title="Awards & Community" visible={visibleSections.has('awards')} />

          <div className={`experience-card rounded-2xl shadow-sm divide-y divide-gray-100 ${visibleSections.has('awards') ? 'animate-slide-up delay-100' : 'opacity-0'}`}>
            {awards.map((award, idx) => (
              <div key={idx} className="flex gap-4 p-5 md:p-6">
                <div className="icon-box w-10 h-10 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                  {award.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{award.title}</h3>
                    <span className="text-sm text-gray-500 font-medium shrink-0">{award.org} · {award.date}</span>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed mt-1.5">{award.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Experience Section */}
      <section id="experience" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto relative">
          <SectionHeader eyebrow="Career" title="Experience" visible={visibleSections.has('experience')} />

          <div className="grid gap-6">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className={`experience-card rounded-2xl p-8 shadow-sm ${visibleSections.has('experience') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">{exp.role}</h3>
                    <p className="text-lg text-gray-600 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.location}</p>
                  </div>
                  <span className="text-gray-600 mt-3 md:mt-0 text-sm tracking-wider bg-gray-100 px-4 py-2 rounded-full font-medium w-fit shrink-0">{exp.period}</span>
                </div>

                <ul className="space-y-3">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                      <span className="text-base leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className={`mt-8 experience-card rounded-2xl p-8 shadow-sm ${visibleSections.has('experience') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-box p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Education</h3>
            </div>

            <div className="space-y-10">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{edu.degree}</h4>
                      <p className="text-lg text-gray-600 font-semibold">{edu.school}</p>
                      <p className="text-sm text-gray-500">{edu.location}</p>
                    </div>
                    <span className="text-gray-600 mt-3 md:mt-0 text-sm tracking-wider bg-gray-100 px-4 py-2 rounded-full font-medium w-fit shrink-0">{edu.period}</span>
                  </div>

                  {edu.courses.length > 0 && (
                    <div className="mt-6">
                      <p className="text-gray-500 mb-3 text-sm tracking-wider uppercase font-semibold">Relevant Coursework</p>
                      <div className="flex flex-wrap gap-2">
                        {edu.courses.map((course, i) => (
                          <span key={i} className="tech-tag text-xs px-4 py-2 rounded-full">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Skills Section */}
      <section id="skills" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Expertise" title="Technical Skills" visible={visibleSections.has('skills')} />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(skills).map(([category, { icon, items }], idx) => (
              <div
                key={category}
                className={`skill-card rounded-xl p-5 shadow-sm ${visibleSections.has('skills') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <h3 className="text-base font-bold mb-3 text-gray-900 flex items-center gap-2">
                  {icon}
                  {category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill, i) => (
                    <span key={i} className="tech-tag px-3 py-1.5 rounded-md text-sm cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className={`mt-6 skill-card rounded-xl p-5 shadow-sm ${visibleSections.has('skills') ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
            <h3 className="text-base font-bold mb-3 text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-red-500" />
              Certifications
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {certifications.map((cert, i) => (
                <span key={i} className="tech-tag px-3 py-1.5 rounded-md text-sm cursor-default">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Contact Section */}
      <section id="contact" className="py-28 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className={`mb-12 ${visibleSections.has('contact') ? 'animate-slide-up' : 'opacity-0'}`}>
            <p className="text-red-500 text-sm tracking-widest uppercase mb-3 font-semibold">Get In Touch</p>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-5">
              Let&apos;s Connect
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Looking for roles where rigorous modeling meets real markets.
            </p>
          </div>

          <div className={`grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12 ${visibleSections.has('contact') ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
            <a href="http://www.linkedin.com/in/madhanjothimani" target="_blank" rel="noopener noreferrer" className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl shadow-sm">
              <Linkedin className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-600 font-semibold">LinkedIn</span>
            </a>
            <a href="mailto:jothimani.m@northeastern.edu" className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl shadow-sm">
              <Mail className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-600 font-semibold">Email</span>
            </a>
          </div>

          <div className={`flex gap-4 justify-center ${visibleSections.has('contact') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <a href="http://www.linkedin.com/in/madhanjothimani" target="_blank" rel="noopener noreferrer"
               className="social-icon w-14 h-14 flex items-center justify-center rounded-full">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/MadhanJ05?tab=repositories" target="_blank" rel="noopener noreferrer"
               className="social-icon w-14 h-14 flex items-center justify-center rounded-full">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-500">
          © 2026 <span className="font-semibold text-gray-700">Madhan Jothimani</span> • Built with Next.js & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
