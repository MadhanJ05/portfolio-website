// app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Code, Database, BarChart3, Brain, ChevronDown, ExternalLink, Award, FileText, Menu, X, Warehouse, Shield } from 'lucide-react';


export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      const sections = ['home', 'projects', 'experience', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = {
    "Programming": ["Python", "SQL", "R", "Bash"],
    "ML & Statistics": ["Scikit-learn", "Time Series", "Regression", "Clustering"],
    "Visualization": ["Tableau", "Power BI", "Matplotlib", "Plotly"],
    "Tools & Platforms": ["Git", "Docker", "Jenkins", "MySQL", "PostgreSQL"]
  };

  const projects = [
    {
      title: "H&M Fashion Data Warehouse & Analytics Pipeline",
      desc: "Built a production-grade data warehouse processing 15M+ fashion retail transactions across 1M customers and 105K products, implementing automated ELT pipelines with Airflow, dbt transformations, and interactive Streamlit dashboards for customer segmentation analysis.",
      tech: ["Apache Airflow", "Docker", "PostgreSQL", "dbt", "Streamlit", "Python"],
      metrics: "15M+ Transactions Processed",
      icon: <Database className="w-6 h-6" />,
      github: "https://github.com/MadhanJ05/HM-fashion-data-warehouse"
    },
    {
      title: "Real-Time Credit Card Fraud Detection System",
      desc: "End-to-end streaming fraud detection pipeline built from a credit card company's perspective. Streams transactions through Kafka, calculates real-time features (velocity, travel speed, spending patterns), detects fraud using rule-based algorithms, and visualizes results on a live dashboard.",
      tech: ["Apache Kafka", "MongoDB", "Pyspark", "Redis", "Python", "Streamlit", "Redis"],
      metrics: "5 fraud patterns • 3 real-time features • Sub-second detection • Live monitoring",
      icon: <Shield className="w-6 h-6" />,
      github: "https://github.com/MadhanJ05/real-time-credit-card-fraud-detection"
    },
    {
      title: "Customer Purchase Pattern Analysis",
      desc: "Developed a Spark-based data pipeline to process 10M+ transactions. Engineered RFM features and applied K-Means clustering to segment customers into behavioral groups.",
      tech: ["Python", "Spark", "K-Means", "RFM Analysis"],
      metrics: "10M+ Transactions Processed",
      icon: <BarChart3 className="w-6 h-6" />,
      github: "https://github.com/MadhanJ05/Customer_Pattern_Analysis/tree/main"
    },
    {
      title: "Boston Fire Incident Analytics",
      desc: "Implemented Random Forest to predict high-loss fire incidents and classified fire severity using Logistic Regression with time series analysis.",
      tech: ["Python", "Random Forest", "Logistic Regression", "Plotly"],
      metrics: "92.3% Test Accuracy",
      icon: <Brain className="w-6 h-6" />,
      github: "https://github.com/MadhanJ05/Boston_Fire_Incident_Analysis"
    },
    {
      title: "British Airways Dashboard",
      desc: "Designed interactive dashboard analyzing flight delays, passenger satisfaction, and operational performance using advanced Tableau features.",
      tech: ["Tableau", "Data Visualization", "Dashboard Design"],
      metrics: "Real-time Operations Tracking",
      icon: <Database className="w-6 h-6" />,
      github: "https://github.com/MadhanJ05/BritishAirways_Interactive_Dashboard/blob/main/SignatureDashboard.pdf"
    }
  ];

  const experience = [
    {
      role: "Systems Data Engineer",
      company: "Infosys",
      location: "Chennai, India",
      period: "Nov 2021 - Sep 2023",
      achievements: [
        "Improved broadband performance by 15% by implementing predictive models (Isolation Forest, Random Forest Regression)",
        "Automated Data Pipelines using Docker and Jenkins to conduct weekly sanity tests, reducing manual effort by 25%",
        "Designed and implemented new features in RDK-B software stack to enhance broadband device functionality"
      ]
    },
    {
      role: "Data Analyst Intern",
      company: "Infosys",
      location: "Mysore, India",
      period: "May 2021 - Nov 2021",
      achievements: [
        "Automated data collection, cleaning and transformation processes using SQL and Python, reducing data preparation time by 30%",
        "Conducted exploratory data analysis (EDA) and applied K-Means Clustering to segment customers based on credit card purchase behavior",
        "Provided actionable insights for targeted marketing strategies"
      ]
    }
  ];

  const certifications = [
    "Machine Learning (Stanford Online)",
    "Foundations of Data Science: K-Means Clustering in Python (University of London)",
    "Intermediate Machine Learning (Kaggle)",
    "Microsoft SQL Server 2022",
    "Azure Administration Essential Training"
  ];

  const education = {
    degree: "Master of Professional Studies in Analytics",
    school: "Northeastern University",
    location: "Boston, Massachusetts",
    period: "July 2024 - Apr 2026",
    courses: ["Data Visualization", "Enterprise Analytics", "Intermediate Analytics", "Database Management Systems", "Probability Distribution"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/90 backdrop-blur-md z-50 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              MJ
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              {['Home', 'Projects', 'Experience', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`hover:text-blue-400 transition-colors duration-300 ${
                    activeSection === item.toLowerCase() ? 'text-blue-400' : ''
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              {['Home', 'Projects', 'Experience', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-blue-400 transition-colors duration-300"
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
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-4">
              <span className="text-blue-300">Data Science & Analytics</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Madhan Jothimani
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Data Scientist & Analytics Professional
          </p>
          
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Master's student at Northeastern University with 2+ years of experience in predictive modeling, 
            data engineering, and building scalable analytics solutions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="mailto:jothimani.m@northeastern.edu" 
               className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
              Get In Touch
            </a>
            <a href="#projects" 
               className="px-8 py-3 border-2 border-blue-400 rounded-lg font-semibold hover:bg-blue-400/10 transition-all duration-300">
              View Projects
            </a>
          </div>
          
          <div className="flex gap-6 justify-center">
            <a href="http://www.linkedin.com/in/madhanjothimani" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://github.com/MadhanJ05?tab=repositories" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="mailto:jothimani.m@northeastern.edu" className="hover:text-blue-400 transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
            <ChevronDown className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div key={idx} 
                   className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {project.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-blue-300">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.desc}</p>
                
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 border border-blue-500/30">
                    {project.metrics}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-slate-800 rounded-full text-gray-300 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  View on GitHub <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Experience
          </h2>
          
          <div className="space-y-8">
            {experience.map((exp, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-blue-500/20 hover:border-blue-400/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-blue-300">{exp.role}</h3>
                    <p className="text-lg md:text-xl text-gray-400">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.location}</p>
                  </div>
                  <span className="text-gray-500 mt-2 md:mt-0">{exp.period}</span>
                </div>
                
                <ul className="space-y-3">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-blue-400 mt-1">▹</span>
                      <span className="text-sm md:text-base">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mt-12 bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-blue-300">Education</h3>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-200">{education.degree}</h4>
                <p className="text-lg text-gray-400">{education.school}</p>
                <p className="text-sm text-gray-500">{education.location}</p>
              </div>
              <span className="text-gray-500 mt-2 md:mt-0">{education.period}</span>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-400 mb-2">Key Courses:</p>
              <div className="flex flex-wrap gap-2">
                {education.courses.map((course, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-slate-800 rounded-full text-gray-300 border border-slate-700">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="bg-slate-900/50 rounded-2xl p-6 border border-blue-500/20">
                <h3 className="text-lg md:text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, i) => (
                    <span key={i} className="px-3 md:px-4 py-2 bg-slate-800 rounded-lg text-sm text-gray-300 border border-slate-700 hover:border-blue-500/50 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="mt-12 bg-slate-900/50 rounded-2xl p-6 md:p-8 border border-blue-500/20">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-blue-300 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Certifications
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <span className="text-blue-400 text-xl">✓</span>
                  <span className="text-sm md:text-base">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-slate-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12">
            Currently seeking Data Science Intern opportunities. Let's discuss how I can contribute to your team!
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <a href="mailto:jothimani.m@northeastern.edu" className="flex flex-col items-center justify-center gap-3 bg-slate-900/50 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all">
              <Mail className="w-6 h-6 text-blue-400" />
              <span className="text-sm">Email</span>
            </a>
            <a href="tel:617-331-8900" className="flex flex-col items-center justify-center gap-3 bg-slate-900/50 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all">
              <Phone className="w-6 h-6 text-blue-400" />
              <span className="text-sm">Phone</span>
            </a>
            <div className="flex flex-col items-center justify-center gap-3 bg-slate-900/50 p-6 rounded-xl border border-blue-500/20">
              <MapPin className="w-6 h-6 text-blue-400" />
              <span className="text-sm">Boston, MA</span>
            </div>
          </div>
          
          <div className="flex gap-6 justify-center">
            <a href="http://www.linkedin.com/in/madhanjothimani" target="_blank" rel="noopener noreferrer"
               className="w-12 h-12 flex items-center justify-center bg-slate-900/50 rounded-lg border border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://github.com/MadhanJ05?tab=repositories" target="_blank" rel="noopener noreferrer"
               className="w-12 h-12 flex items-center justify-center bg-slate-900/50 rounded-lg border border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-blue-500/20">
        <p className="text-sm">© 2024 Madhan Jothimani. Built with Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}