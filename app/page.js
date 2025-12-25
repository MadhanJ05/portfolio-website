// app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, Code, Database, BarChart3, Brain, ChevronDown, Award, FileText, Menu, X, Shield, Sparkles, ArrowUpRight } from 'lucide-react';

export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set(['home']));

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalHeight) * 100);
      const sections = ['home', 'projects', 'experience', 'skills', 'contact'];
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

  const skills = {
    "Programming": ["Python", "SQL", "R", "Bash"],
    "ML & Statistics": ["Scikit-learn", "Time Series", "Regression", "Clustering"],
    "Visualization": ["Tableau", "Power BI", "Matplotlib", "Plotly"],
    "Tools & Platforms": ["Git", "Docker", "Jenkins", "MySQL", "PostgreSQL"]
  };

  const projects = [
    {
      title: "H&M Fashion Data Warehouse",
      desc: "Built a production-grade data warehouse processing 15M+ fashion retail transactions across 1M customers and 105K products, implementing automated ELT pipelines with Airflow, dbt transformations, and interactive Streamlit dashboards.",
      tech: ["Apache Airflow", "Docker", "PostgreSQL", "dbt", "Streamlit", "Python"],
      metrics: "15M+ Transactions",
      icon: <Database className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/HM-fashion-data-warehouse"
    },
    {
      title: "Real-Time Fraud Detection System",
      desc: "End-to-end streaming fraud detection pipeline. Streams transactions through Kafka, calculates real-time features, detects fraud using rule-based algorithms, and visualizes results on a live dashboard.",
      tech: ["Apache Kafka", "MongoDB", "Pyspark", "Redis", "Streamlit"],
      metrics: "Sub-second Detection",
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
    },
    {
      title: "British Airways Dashboard",
      desc: "Designed interactive dashboard analyzing flight delays, passenger satisfaction, and operational performance using advanced Tableau features.",
      tech: ["Tableau", "Data Visualization", "Dashboard Design"],
      metrics: "Real-time Tracking",
      icon: <Database className="w-5 h-5" />,
      github: "https://github.com/MadhanJ05/BritishAirways_Interactive_Dashboard"
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
        "Conducted exploratory data analysis (EDA) and applied K-Means Clustering to segment customers",
        "Provided actionable insights for targeted marketing strategies"
      ]
    }
  ];

  const certifications = [
    "Machine Learning (Stanford Online)",
    "K-Means Clustering in Python (University of London)",
    "Intermediate Machine Learning (Kaggle)",
    "Microsoft SQL Server 2022",
    "Azure Administration Essential Training"
  ];

  const education = {
    degree: "Master of Professional Studies in Analytics",
    school: "Northeastern University",
    location: "Boston, Massachusetts",
    period: "July 2024 - Apr 2026",
    courses: ["Data Visualization", "Enterprise Analytics", "Intermediate Analytics", "Database Management", "Probability"]
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Mouse Glow Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.06), transparent 40%)`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full nav-glass z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold gradient-gold cursor-pointer hover:scale-110 transition-transform duration-500 animate-text-glow">
              MJ
            </div>
            
            <div className="hidden md:flex gap-10">
              {['Home', 'Projects', 'Experience', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`nav-link text-sm tracking-wider uppercase py-1 ${
                    activeSection === item.toLowerCase() ? 'active text-blue-400' : ''
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            <button 
              className="md:hidden p-2 hover:bg-blue-500/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-blue-400" /> : <Menu className="w-6 h-6 text-blue-400" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-slide-up">
              {['Home', 'Projects', 'Experience', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 pl-4 border-l-2 border-transparent hover:border-blue-400 text-sm tracking-wider uppercase font-medium"
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
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-gray-300 text-sm tracking-widest uppercase font-medium">Data Science & Analytics</span>
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          
          <h1 className={`text-6xl md:text-8xl font-bold tracking-tight mb-4 ${visibleSections.has('home') ? 'animate-slide-up delay-100' : 'opacity-0'}`}>
            <span className="gradient-gold animate-text-glow">Madhan</span>
          </h1>
          <h1 className={`text-6xl md:text-8xl font-bold tracking-tight mb-8 ${visibleSections.has('home') ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
            <span className="gradient-blue">Jothimani</span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-gray-400 mb-6 font-light tracking-wide ${visibleSections.has('home') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <span className="gradient-gold-blue font-semibold">Data Scientist</span> & <span className="gradient-gold-blue font-semibold">Analytics Professional</span>
          </p>
          
          <p className={`text-base text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed ${visibleSections.has('home') ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
            Master's student at Northeastern University with 2+ years of experience in predictive modeling, 
            data engineering, and building scalable analytics solutions
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${visibleSections.has('home') ? 'animate-slide-up delay-500' : 'opacity-0'}`}>
            <a href="mailto:jothimani.m@northeastern.edu" 
               className="btn-gold px-10 py-4 rounded-full text-sm uppercase tracking-wider">
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
            <ChevronDown className="w-8 h-8 text-blue-500/50 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider-thick" />

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 relative glow-section">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 ${visibleSections.has('projects') ? 'animate-slide-up' : 'opacity-0'}`}>
            <p className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-semibold">Portfolio</p>
            <h2 className="text-4xl md:text-6xl font-bold gradient-gold">
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
                  <div className="icon-box w-12 h-12 rounded-xl flex items-center justify-center text-blue-400">
                    {project.icon}
                  </div>
                  <span className="text-xs text-cyan-400 px-3 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/30 font-semibold">
                    {project.metrics}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-white">{project.title}</h3>
                <p className="text-gray-400 mb-5 text-sm leading-relaxed">{project.desc}</p>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.slice(0, 4).map((tech, i) => (
                    <span key={i} className="tech-tag text-xs px-3 py-1.5 rounded-full">
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-xs px-3 py-1.5 text-gray-500 font-medium">+{project.tech.length - 4}</span>
                  )}
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
            <p className="text-cyan-400 text-sm tracking-widest uppercase mb-4 font-semibold">Career</p>
            <h2 className="text-4xl md:text-6xl font-bold gradient-blue">
              Experience
            </h2>
          </div>
          
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div 
                key={idx} 
                className={`experience-card rounded-2xl p-8 ${visibleSections.has('experience') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold gradient-gold">{exp.role}</h3>
                    <p className="text-lg text-gray-300 font-semibold">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.location}</p>
                  </div>
                  <span className="text-gray-400 mt-2 md:mt-0 text-sm tracking-wider bg-white/5 px-4 py-2 rounded-full font-medium border border-white/10">{exp.period}</span>
                </div>
                
                <ul className="space-y-3">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-4 text-gray-400 group">
                      <span className="text-blue-400 mt-1.5 text-sm font-bold">●</span>
                      <span className="text-sm leading-relaxed group-hover:text-gray-200 transition-colors">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className={`mt-12 experience-card rounded-2xl p-8 ${visibleSections.has('experience') ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="icon-box p-3 rounded-xl">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold gradient-blue">Education</h3>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h4 className="text-xl font-bold text-white">{education.degree}</h4>
                <p className="text-lg text-gray-300 font-semibold">{education.school}</p>
                <p className="text-sm text-gray-500">{education.location}</p>
              </div>
              <span className="text-gray-400 mt-2 md:mt-0 text-sm tracking-wider bg-white/5 px-4 py-2 rounded-full font-medium border border-white/10">{education.period}</span>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-500 mb-3 text-sm tracking-wider uppercase font-semibold">Key Courses</p>
              <div className="flex flex-wrap gap-2">
                {education.courses.map((course, i) => (
                  <span key={i} className="tech-tag text-xs px-4 py-2 rounded-full">
                    {course}
                  </span>
                ))}
              </div>
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
            <p className="text-blue-400 text-sm tracking-widest uppercase mb-4 font-semibold">Expertise</p>
            <h2 className="text-4xl md:text-6xl font-bold gradient-gold-blue">
              Technical Skills
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(skills).map(([category, items], idx) => (
              <div 
                key={category} 
                className={`skill-card rounded-2xl p-6 ${visibleSections.has('skills') ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <h3 className="text-lg font-bold mb-5 gradient-blue flex items-center gap-3">
                  <Code className="w-5 h-5 text-blue-400" />
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, i) => (
                    <span key={i} className="tech-tag px-4 py-2 rounded-lg text-sm cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className={`mt-12 skill-card rounded-2xl p-8 ${visibleSections.has('skills') ? 'animate-slide-up delay-400' : 'opacity-0'}`}>
            <h3 className="text-xl font-bold mb-8 gradient-gold flex items-center gap-3">
              <Award className="w-6 h-6 text-cyan-400" />
              Certifications
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <div key={i} className="cert-item flex items-center gap-4 text-gray-400 cursor-default">
                  <span className="cert-check text-lg">✓</span>
                  <span className="text-sm font-medium">{cert}</span>
                </div>
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
            <p className="text-cyan-400 text-sm tracking-widest uppercase mb-4 font-semibold">Get In Touch</p>
            <h2 className="text-4xl md:text-6xl font-bold gradient-gold-blue mb-6">
              Let's Connect
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Currently seeking Data Science Intern opportunities. Let's discuss how I can contribute to your team.
            </p>
          </div>
          
          <div className={`grid sm:grid-cols-3 gap-6 mb-12 ${visibleSections.has('contact') ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
            <a href="mailto:jothimani.m@northeastern.edu" className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl">
              <Mail className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-300 font-semibold">Email</span>
            </a>
            <a href="tel:617-331-8900" className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl">
              <Phone className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-300 font-semibold">Phone</span>
            </a>
            <div className="contact-card flex flex-col items-center justify-center gap-4 p-8 rounded-2xl">
              <MapPin className="contact-icon w-8 h-8" />
              <span className="text-sm text-gray-300 font-semibold">Boston, MA</span>
            </div>
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
      <footer className="py-8 text-center border-t border-blue-500/10 bg-[#0a0a0f]">
        <p className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          © 2024 <span className="gradient-gold-blue font-semibold">Madhan Jothimani</span> • Built with Next.js & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}