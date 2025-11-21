import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  Zap,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Upload,
  MessageCircle,
  ImageIcon,
  Send
} from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BarChart3,
      title: 'AI-Powered Analytics',
      description: 'Advanced AI analyzes your ad performance and identifies trends, patterns, and opportunities.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Insights',
      description: 'Get detailed insights on what\'s working and what\'s not with actionable recommendations.'
    },
    {
      icon: Sparkles,
      title: 'Content Strategy',
      description: 'AI generates creative prompts, captions, and hashtags tailored to your campaigns.'
    },
    {
      icon: Calendar,
      title: '30-Day Content Calendar',
      description: 'Receive a complete content calendar with strategic posting recommendations.'
    },
    {
      icon: FileText,
      title: 'Professional Reports',
      description: 'Beautiful PDF reports with charts, insights, and strategies ready to share.'
    },
    {
      icon: Zap,
      title: 'Multi-Platform Support',
      description: 'Connect Meta, Twitter/X, LinkedIn accounts or upload CSV files from any platform.'
    }
  ];

  const platforms = [
    { icon: Facebook, name: 'Meta (Facebook & Instagram)', color: '#1877F2' },
    { icon: Twitter, name: 'X / Twitter', color: '#000000' },
    { icon: Linkedin, name: 'LinkedIn', color: '#0A66C2' },
    { icon: MessageCircle, name: 'WhatsApp Business', color: '#25D366' },
    { icon: ImageIcon, name: 'Pinterest', color: '#E60023' },
    { icon: Send, name: 'Telegram Ads', color: '#0088CC' },
    { icon: Upload, name: 'CSV Upload', color: '#6366f1' }
  ];

  const benefits = [
    'Automated performance analysis',
    'AI-generated content strategies',
    'Professional PDF reports',
    'Multi-platform integration',
    'Real-time insights',
    'Email delivery',
    'Competitive analysis',
    'Optimization recommendations'
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Ad Analytics</span>
          </div>
          <h1 className="hero-title">
            Transform Your Ad Data Into
            <span className="gradient-text"> Actionable Insights</span>
          </h1>
          <p className="hero-description">
            Connect your social media ad accounts or upload CSV files. Our AI analyzes your performance,
            generates strategic insights, and delivers professional reports in seconds.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary-large"
                >
                  Go to Dashboard
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/connect-account')}
                  className="btn-secondary-large"
                >
                  Connect Account
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary-large"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary-large"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <BarChart3 size={24} color="#3b82f6" />
            <span>Real-time Analytics</span>
          </div>
          <div className="floating-card card-2">
            <TrendingUp size={24} color="#10b981" />
            <span>Performance Tracking</span>
          </div>
          <div className="floating-card card-3">
            <Sparkles size={24} color="#8b5cf6" />
            <span>AI Insights</span>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="platforms-section">
        <h2>Supported Platforms</h2>
        <p className="section-description">
          Connect your favorite advertising platforms or upload CSV files
        </p>
        <div className="platforms-showcase">
          {platforms.map((platform, index) => {
            const PlatformIcon = platform.icon;
            return (
              <div key={index} className="platform-showcase-item">
                <div
                  className="platform-showcase-icon"
                  style={{ backgroundColor: `${platform.color}15` }}
                >
                  <PlatformIcon size={32} color={platform.color} />
                </div>
                <span>{platform.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Powerful Features</h2>
        <p className="section-description">
          Everything you need to analyze and optimize your ad campaigns
        </p>
        <div className="features-grid">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <FeatureIcon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <h2>Why Choose Our Platform?</h2>
          <p className="section-description">
            Save time, gain insights, and optimize your advertising strategy
          </p>
          <div className="benefits-list">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <CheckCircle size={20} color="#10b981" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="benefits-visual">
          <div className="report-preview">
            <div className="report-header">
              <div className="report-title">AI Analysis Report</div>
              <div className="report-status">Completed</div>
            </div>
            <div className="report-metrics">
              <div className="metric">
                <span className="metric-label">ROI</span>
                <span className="metric-value">+245%</span>
              </div>
              <div className="metric">
                <span className="metric-label">CTR</span>
                <span className="metric-value">3.8%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Conversions</span>
                <span className="metric-value">1,284</span>
              </div>
            </div>
            <div className="report-chart">
              <div className="chart-bar" style={{ height: '60%' }}></div>
              <div className="chart-bar" style={{ height: '85%' }}></div>
              <div className="chart-bar" style={{ height: '45%' }}></div>
              <div className="chart-bar" style={{ height: '95%' }}></div>
              <div className="chart-bar" style={{ height: '70%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Ad Analytics?</h2>
          <p>Start analyzing your campaigns with AI-powered insights today</p>
          <button
            onClick={() => navigate(isAuthenticated ? '/connect-account' : '/register')}
            className="btn-cta"
          >
            {isAuthenticated ? 'Connect Your Account' : 'Get Started Free'}
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <BarChart3 size={28} />
            <span>AI Ad Analytics</span>
          </div>
          <p>&copy; 2025 AI Ad Analytics Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
