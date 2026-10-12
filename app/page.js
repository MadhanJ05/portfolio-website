// app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Code, Database, BarChart3, Brain, ChevronDown, ExternalLink, Award, FileText, Menu, X, Shield, Sparkles, ArrowUpRight, Cloud, Cpu, Settings, Layers, Search, Trophy, TrendingUp, Activity, Sigma, Users } from 'lucide-react';
import { MessageSquare } from "lucide-react";

export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
      setScrollY(window.scrollY);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
      const sections = ['home', 'awards', 'projects', 'experience', 'skills', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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

  const projects = [
    {
      title: "VOLTEX: Volatility-Triggered Early-Warning System",
      desc: "Led a 3-person team (sponsor: PayPal) building a system that predicts trading-platform stress from equity-market signals (505 S&P 500 tickers, VIX, FOMC/CPI/NFP events) and alerts on-call SREs before outages. An XGBoost risk-tier classifier with Prophet/ARIMA forecasts and Isolation Forest reached macro-F1 0.79 vs. a 0.61 baseline and flagged 6 of 6 historical crises; a guardrailed RAG agent turns SHAP drivers into auditable alerts.",
      tech: ["XGBoost", "Prophet", "ARIMA", "Isolation Forest", "SHAP", "Gemini", "ChromaDB", "Python"],
      metrics: "Best Project • PayPal",
      icon: <Activity className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/Voltex"
    },
    {
      title: "Quant Strategy Search: Overfitting-Aware Backtesting",
      desc: "Built a vectorized backtesting engine that searches 240 momentum and mean-reversion strategies across 15 ETFs (2007–2025) with transaction costs, walk-forward validation, and a 36-test suite proving no lookahead bias. Deflated Sharpe Ratio, PBO via CSCV (12,870 splits), and block-bootstrap CIs showed the top backtest (Sharpe 0.80) was likely luck (DSR 0.29).",
      tech: ["Python", "Backtesting", "Deflated Sharpe Ratio", "PBO / CSCV", "Bootstrap"],
      metrics: "240 Strategies • 15 ETFs",
      icon: <TrendingUp className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/strategy-search"
    },
    {
      title: "Quant Options Engine: Pricing, IV & Variance Risk Premium",
      desc: "Built a pricing engine (Black-Scholes, binomial tree, Monte Carlo) whose methods agree within 2 standard errors, with a control variate that cut Asian-option variance 1,385× and a 310-test suite. Extracted the SPY implied-volatility smile from 1,991 quotes and measured the variance risk premium across 228 monthly delta-hedged options: VIX exceeded realized vol by 3.6 points on average.",
      tech: ["Python", "Black-Scholes", "Monte Carlo", "Binomial Tree", "Implied Volatility"],
      metrics: "1,385× Variance Reduction",
      icon: <Sigma className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/options-lab"
    },
    {
      title: "Marketplace Product Retrieval and Ranking System",
      desc: "Built an AI-powered B2B product search system combining LLM query understanding (Groq), hybrid retrieval (BM25 + FAISS), CrossEncoder neural reranking, and wholesale boost scoring. Evaluated on Amazon ESCI dataset with 100K products.",
      tech: ["FAISS", "Sentence Transformers", "CrossEncoder", "Streamlit", "Python", "Groq LLM"],
      metrics: "100K Products • 5-Stage Pipeline",
      icon: <Search className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/wholesale-product-retrieval"
    },

    {
      title: "Talk to Data - AI SQL Chatbot",
      desc: "Built an AI-powered SQL chatbot that converts natural language questions into SQL queries using Llama 3.3 70B via Groq API, connected to a PostgreSQL database with 16K+ rental transactions, featuring real-time query generation, validation, and interactive Streamlit UI.",
      tech: ["Llama 3.3 70B", "Groq API", "PostgreSQL", "Neon", "Streamlit", "Python", "LangChain"],
      metrics: "NLP",
      icon: <MessageSquare className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/talk-to-data-sql-chatbot"

    },

     {
      title: "H&M Fashion Data Warehouse",
      desc: "Built a production-grade data warehouse processing 15M+ fashion retail transactions across 1M customers and 105K products, implementing automated ELT pipelines with Airflow, dbt transformations, and interactive Streamlit dashboards.",
      tech: ["Apache Airflow", "Docker", "PostgreSQL", "dbt", "Streamlit", "Python"],
      metrics: "15M+ Transactions",
      icon: <Database className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/HM-fashion-data-warehouse"
    },
    
    {
      title: "Real-Time Credit Card Fraud Detection System",
      desc: "An end-to-end streaming credit card transaction fraud detection pipeline that streams transactions through Kafka, computes real-time features, detects fraud using rule-based algorithms, and visualizes the results on a live dashboard.",
      tech: ["Apache Kafka", "MongoDB", "Pyspark", "Redis", "Streamlit"],
      metrics: "Live Monitoring",
      icon: <Shield className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/real-time-credit-card-fraud-detection"
    },
    {
      title: "Customer Purchase Pattern Analysis",
      desc: "Developed a Spark-based data pipeline to process 10M+ transactions. Engineered RFM features and applied K-Means clustering to segment customers into behavioral groups.",
      tech: ["Python", "Spark", "K-Means", "RFM Analysis"],
      metrics: "10M+ Transactions",
      icon: <BarChart3 className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/Customer_Pattern_Analysis/tree/main"
    },
    {
      title: "Boston Fire Incident Analytics",
      desc: "Implemented Random Forest to predict high-loss fire incidents and classified fire severity using Logistic Regression with time series analysis.",
      tech: ["Python", "Random Forest", "Logistic Regression", "Plotly"],
      metrics: "92.3% Accuracy",
      icon: <Brain className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/Boston_Fire_Incident_Analysis"
    }
    
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

      {/* Mouse Glow Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.06), transparent 40%)`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full nav-glass z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold name-hover cursor-pointer hover:scale-110 transition-transform duration-500">
              MJ
            </div>
            
            <div className="hidden md:flex gap-10">
              {['Home', 'Awards', 'Projects', 'Experience', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`nav-link text-sm tracking-wider uppercase py-1 ${
                    activeSection === item.toLowerCase() ? 'active text-red-500' : ''
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
              {['Home', 'Awards', 'Projects', 'Experience', 'Skills', 'Contact'].map((item) => (
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
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 glow-section">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className={`mb-8 ${visibleSections.has('home') ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-card rounded-full hover:shadow-xl transition-all duration-500 cursor-default">
              <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-gray-600 text-sm tracking-widest uppercase font-medium">Quantitative Finance · Machine Learning</span>
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
          </div>
          
          <h1 className={`text-6xl md:text-8xl font-bold tracking-tight mb-8 ${visibleSections.has('home') ? 'animate-slide-up delay-100' : 'opacity-0'}`}>
            <span className="name-hover">Madhan Jothimani</span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-gray-500 mb-6 font-light tracking-wide ${visibleSections.has('home') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <span className="name-hover font-semibold">Quant & Machine Learning</span> · <span className="name-hover font-semibold">Data Scientist</span>
          </p>
          
          <div className={`mb-12 h-10 ${visibleSections.has('home') ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
            <p className={`text-xl md:text-2xl text-gray-900 font-bold transition-all duration-500 ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {rotatingTexts[rotatingTextIndex]}
            </p>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${visibleSections.has('home') ? 'animate-slide-up delay-500' : 'opacity-0'}`}>
            <a href="mailto:jothimani.m@northeastern.edu" 
               className="btn-red px-10 py-4 rounded-full text-sm uppercase tracking-wider">
              Get In Touch
            </a>
            <a href="#projects" 
               className="btn-blue px-10 py-4 rounded-full text-sm uppercase tracking-wider">
              View Projects
            </a>
          </div>
          
          <div className={`flex gap-5 justify-center ${visibleSections.has('home') ? 'animate-slide-up delay-600' : 'opacity-0'}`}>
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
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block">
            <ChevronDown className="w-8 h-8 text-red-500/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider-thick" />

      {/* Awards Section */}
      <section id="awards" className="py-32 px-6 relative glow-section-blue">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 ${visibleSections.has('awards') ? 'animate-slide-up' : 'opacity-0'}`}>
            <p className="name-hover text-sm tracking-widest uppercase mb-4 font-semibold">Recognition</p>
            <h2 className="text-4xl md:text-6xl font-bold name-hover">
              Awards & Community
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award, idx) => (
              <div
                key={idx}
                className={`project-card rounded-2xl p-6 ${visibleSections.has('awards') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-box w-12 h-12 rounded-xl flex items-center justify-center text-red-500">
                    {award.icon}
                  </div>
                  <span className="text-xs text-red-500 px-3 py-1.5 bg-red-50 rounded-full border border-red-100 font-semibold">
                    {award.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-1 text-gray-800">{award.title}</h3>
                <p className="text-sm text-blue-500 font-semibold mb-3">{award.org}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{award.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider-thick" />

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 relative glow-section">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 ${visibleSections.has('projects') ? 'animate-slide-up' : 'opacity-0'}`}>
            <p className="name-hover text-sm tracking-widest uppercase mb-4 font-semibold">Portfolio</p>
            <h2 className="text-4xl md:text-6xl font-bold name-hover">
              Featured Projects
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div 
                key={idx} 
                className={`project-card rounded-2xl p-6 ${visibleSections.has('projects') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-box w-12 h-12 rounded-xl flex items-center justify-center text-red-500">
                    {project.icon}
                  </div>
                  <span className="text-xs text-red-500 px-3 py-1.5 bg-red-50 rounded-full border border-red-100 font-semibold">
                    {project.metrics}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-gray-800">{project.title}</h3>
                <p className="text-gray-500 mb-5 text-sm leading-relaxed">{project.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag text-xs px-3 py-1.5 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link text-sm">
                  View Project <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider-thick" />

      {/* Experience Section */}
      <section id="experience" className="py-32 px-6 relative glow-section-blue">
        <div className="max-w-6xl mx-auto relative">
          <div className={`text-center mb-20 ${visibleSections.has('experience') ? 'animate-slide-up' : 'opacity-0'}`}>
            <p className="name-hover text-sm tracking-widest uppercase mb-4 font-semibold">Career</p>
            <h2 className="text-4xl md:text-6xl font-bold name-hover">
              Experience
            </h2>
          </div>
          
          <div className="grid gap-6">
            {experience.map((exp, idx) => (
              <div 
                key={idx} 
                className={`experience-card rounded-2xl p-8 shadow-lg ${visibleSections.has('experience') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex flex-col mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold gradient-gold">{exp.role}</h3>
                    <p className="text-lg text-gray-600 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-400">{exp.location}</p>
                  </div>
                  <span className="text-gray-500 mt-2 text-sm tracking-wider bg-gray-100 px-4 py-2 rounded-full font-medium w-fit">{exp.period}</span>
                </div>
                
                <ul className="space-y-3">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-600 group">
                      <span className="text-red-500 mt-1.5 text-sm font-bold">●</span>
                      <span className="text-sm leading-relaxed group-hover:text-gray-800 transition-colors">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className={`mt-12 experience-card rounded-2xl p-8 shadow-lg ${visibleSections.has('experience') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-box p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-500">Education</h3>
            </div>
            
            <div className="space-y-10">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{edu.degree}</h4>
                      <p className="text-lg text-gray-600 font-semibold">{edu.school}</p>
                      <p className="text-sm text-gray-400">{edu.location}</p>
                    </div>
                    <span className="text-gray-500 mt-2 md:mt-0 text-sm tracking-wider bg-gray-100 px-4 py-2 rounded-full font-medium w-fit shrink-0">{edu.period}</span>
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

      {/* Gradient Divider */}
      <div className="gradient-divider-glow" />

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 glow-section-mixed">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 ${visibleSections.has('skills') ? 'animate-slide-up' : 'opacity-0'}`}>
            <p className="name-hover text-sm tracking-widest uppercase mb-4 font-semibold">Expertise</p>
            <h2 className="text-4xl md:text-6xl font-bold name-hover">
              Technical Skills
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(skills).map(([category, { icon, items }], idx) => (
              <div 
                key={category} 
                className={`skill-card rounded-xl p-4 shadow-lg ${visibleSections.has('skills') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <h3 className="text-sm font-bold mb-3 text-red-500 flex items-center gap-2">
                  {icon}
                  {category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((skill, i) => (
                    <span key={i} className="tech-tag px-3 py-1 rounded-md text-xs cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className={`mt-8 skill-card rounded-xl p-4 shadow-lg ${visibleSections.has('skills') ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
            <h3 className="text-sm font-bold mb-3 text-red-500 flex items-center gap-2">
              <Award className="w-4 h-4 text-red-500" />
              Certifications
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {certifications.map((cert, i) => (
                <span key={i} className="tech-tag px-3 py-1 rounded-md text-xs cursor-default">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider-glow" />

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative glow-section">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className={`mb-16 ${visibleSections.has('contact') ? 'animate-slide-up' : 'opacity-0'}`}>
            <p className="name-hover text-sm tracking-widest uppercase mb-4 font-semibold">Get In Touch</p>
            <h2 className="text-4xl md:text-6xl font-bold name-hover mb-6">
              Let's Connect
            </h2>
            <p className="text-gray-900 font-bold max-w-xl mx-auto text-lg">
              Looking for roles where rigorous modeling meets real markets.
            </p>
          </div>
          
          <div className={`grid sm:grid-cols-3 gap-6 mb-12 ${visibleSections.has('contact') ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
            <a href="http://www.linkedin.com/in/madhanjothimani" target="_blank" rel="noopener noreferrer" className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl shadow-lg">
              <Linkedin className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-600 font-semibold">LinkedIn</span>
            </a>
            <a href="mailto:jothimani.m@northeastern.edu" className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl shadow-lg">
              <Mail className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-600 font-semibold">Email</span>
            </a>
            <a href="tel:617-331-8900" className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl shadow-lg">
              <Phone className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-600 font-semibold">Phone</span>
            </a>
          </div>
          
          <div className={`flex gap-5 justify-center ${visibleSections.has('contact') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <a href="http://www.linkedin.com/in/madhanjothimani" target="_blank" rel="noopener noreferrer"
               className="social-icon w-14 h-14 flex items-center justify-center rounded-full">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://github.com/MadhanJ05?tab=repositories" target="_blank" rel="noopener noreferrer"
               className="social-icon w-14 h-14 flex items-center justify-center rounded-full">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-red-500/10 bg-white">
        <p className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          © 2024 <span className="gradient-gold-blue font-semibold">Madhan Jothimani</span> • Built with Next.js & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}