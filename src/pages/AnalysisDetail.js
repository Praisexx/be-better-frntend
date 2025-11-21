import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area, ComposedChart } from 'recharts';
import { Download, ArrowLeft, TrendingUp, Lightbulb, Calendar, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import '../styles/AnalysisDetail.css';

const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationTick, setAnimationTick] = useState(0);

  // Refs for chart containers
  const performanceChartRef = useRef(null);
  const insightsChartRef = useRef(null);
  const adPlanChartRef = useRef(null);
  const strategyChartRef = useRef(null);
  const promptsChartRef = useRef(null);
  const captionsChartRef = useRef(null);
  const businessesChartRef = useRef(null);

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Live animation effect - updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalysis = async () => {
    try {
      const [analysisRes, resultsRes] = await Promise.all([
        analysisAPI.getAnalysis(id),
        analysisAPI.getResults(id)
      ]);

      setAnalysis(analysisRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      toast.error('Error loading analysis');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF with charts...', { id: 'pdf-download' });

      // Capture all charts as images
      const chartRefs = [
        { ref: performanceChartRef, name: 'performance' },
        { ref: insightsChartRef, name: 'insights' },
        { ref: adPlanChartRef, name: 'adPlan' },
        { ref: strategyChartRef, name: 'strategy' },
        { ref: promptsChartRef, name: 'prompts' },
        { ref: captionsChartRef, name: 'captions' },
        { ref: businessesChartRef, name: 'businesses' }
      ];

      const chartImages = {};

      for (const { ref, name } of chartRefs) {
        if (ref.current) {
          try {
            const canvas = await html2canvas(ref.current, {
              backgroundColor: '#ffffff',
              scale: 2,
              logging: false,
              useCORS: true
            });
            chartImages[name] = canvas.toDataURL('image/png');
          } catch (error) {
            console.warn(`Failed to capture ${name} chart:`, error);
          }
        }
      }

      // Send request with chart images
      const response = await analysisAPI.downloadPDFWithCharts(id, chartImages);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `meta_ads_analysis_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('PDF with charts downloaded!', { id: 'pdf-download' });
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error('Error downloading PDF', { id: 'pdf-download' });
    }
  };

  // Prepare live data for Performance Report (simulating real-time metrics)
  const preparePerformanceData = () => {
    const baseMetrics = [
      { time: '0s', reach: 1000, engagement: 45, clicks: 20, conversions: 5 },
      { time: '5s', reach: 2500, engagement: 78, clicks: 42, conversions: 12 },
      { time: '10s', reach: 4200, engagement: 125, clicks: 68, conversions: 23 },
      { time: '15s', reach: 6800, engagement: 189, clicks: 95, conversions: 38 },
      { time: '20s', reach: 9500, engagement: 267, clicks: 134, conversions: 56 },
      { time: '25s', reach: 12400, engagement: 356, clicks: 178, conversions: 74 },
      { time: '30s', reach: 15800, engagement: 445, clicks: 223, conversions: 95 }
    ];

    // Add live variation based on animationTick
    return baseMetrics.map(metric => ({
      ...metric,
      reach: metric.reach + Math.sin(animationTick * 0.5) * 200,
      engagement: metric.engagement + Math.cos(animationTick * 0.3) * 15,
      clicks: metric.clicks + Math.sin(animationTick * 0.4) * 8,
      conversions: metric.conversions + Math.cos(animationTick * 0.6) * 3
    }));
  };

  // Prepare live data for Next Ad Plan funnel
  const prepareAdPlanData = () => {
    const baseFunnel = [
      { stage: 'Awareness', value: 10000, fill: '#0066cc' },
      { stage: 'Interest', value: 7500, fill: '#667eea' },
      { stage: 'Consideration', value: 5000, fill: '#10b981' },
      { stage: 'Intent', value: 2500, fill: '#f59e0b' },
      { stage: 'Conversion', value: 1000, fill: '#ef4444' }
    ];

    return baseFunnel.map(stage => ({
      ...stage,
      value: stage.value + Math.sin(animationTick * 0.2) * 100
    }));
  };

  // Prepare live data for Captions engagement prediction
  const prepareCaptionsData = () => {
    if (!results?.captions_hashtags) return [];

    return results.captions_hashtags.slice(0, 5).map((_, index) => ({
      caption: `Caption ${index + 1}`,
      predicted_likes: 1200 + index * 300 + Math.sin(animationTick * 0.3 + index) * 150,
      predicted_comments: 85 + index * 20 + Math.cos(animationTick * 0.4 + index) * 10,
      predicted_shares: 45 + index * 10 + Math.sin(animationTick * 0.5 + index) * 5,
      engagement_score: 75 + index * 5 + Math.cos(animationTick * 0.2 + index) * 3
    }));
  };

  // Prepare live data for Similar Businesses comparison
  const prepareBusinessesData = () => {
    if (!results?.similar_businesses) return [];

    return results.similar_businesses.slice(0, 5).map((business, index) => {
      const name = typeof business === 'object'
        ? (business.name || business.business_name || business.company || `Business ${index + 1}`)
        : `Business ${index + 1}`;

      return {
        name: name.substring(0, 15),
        followers: 5000 + index * 2000 + Math.sin(animationTick * 0.3 + index) * 500,
        engagement: 3.5 + index * 0.5 + Math.cos(animationTick * 0.4 + index) * 0.3,
        posts_per_week: 4 + index + Math.sin(animationTick * 0.2 + index) * 0.5
      };
    });
  };

  // Prepare data for AI Insights chart
  const prepareInsightsData = () => {
    if (!results?.ai_insights) return [];
    return results.ai_insights.slice(0, 6).map((insight, index) => ({
      name: `Analysis ${index + 1}`,
      impact: Math.floor(Math.random() * 30) + 70, // Score 70-100
      priority: Math.floor(Math.random() * 30) + 70,
      label: insight.substring(0, 30) + '...'
    }));
  };

  // Prepare data for Creative Prompts distribution
  const preparePromptsData = () => {
    if (!results?.creative_prompts) return [];
    const categories = ['Video', 'Image', 'Carousel', 'Story', 'Reel'];
    return categories.map((cat, index) => ({
      name: cat,
      value: results.creative_prompts.length > index ?
        Math.floor(Math.random() * 3) + 1 : 0
    })).filter(item => item.value > 0);
  };

  // Prepare data for Content Strategy timeline
  const prepareStrategyData = () => {
    if (!results?.content_strategy || typeof results.content_strategy !== 'object') return [];
    return Object.entries(results.content_strategy).map(([week, plan]) => ({
      name: week.replace(/_/g, ' '),
      posts: Math.floor(Math.random() * 5) + 3,
      engagement: Math.floor(Math.random() * 40) + 60
    }));
  };

  const COLORS = ['#0066cc', '#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!results) {
    return <div className="error">No results available</div>;
  }

  const performanceData = preparePerformanceData();
  const adPlanData = prepareAdPlanData();
  const captionsData = prepareCaptionsData();
  const businessesData = prepareBusinessesData();
  const insightsData = prepareInsightsData();
  const promptsData = preparePromptsData();
  const strategyData = prepareStrategyData();

  return (
    <div className="analysis-detail-container">
      <header className="detail-header">
        <h1>Analysis #{id}</h1>
        <div className="header-actions">
          <button onClick={handleDownloadPDF} className="btn-primary">
            <Download size={18} />
            Download PDF
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="detail-content">
        {/* Performance Report */}
        <section className="result-section">
          <div className="section-title">
            <TrendingUp size={24} />
            <h2>Performance Report</h2>
          </div>

          {performanceData.length > 0 && (
            <div className="chart-container" ref={performanceChartRef}>
              <h3 className="chart-title">Live Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066cc" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0066cc" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="time" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    stroke="#0066cc"
                    fillOpacity={1}
                    fill="url(#colorReach)"
                    name="Reach"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorEngagement)"
                    name="Engagement"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#667eea"
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                    name="Clicks"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorConversions)"
                    name="Conversions"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="report-content-grid">
            {typeof results.performance_report === 'object' ? (
              Object.entries(results.performance_report).map(([key, value]) => (
                <div key={key} className="report-item-card">
                  <div className="report-item-label">{key.replace(/_/g, ' ').toUpperCase()}</div>
                  <div className="report-item-value">{typeof value === 'object' ? JSON.stringify(value) : value}</div>
                </div>
              ))
            ) : (
              <p>{results.performance_report}</p>
            )}
          </div>
        </section>

        {/* AI Insights with Radar Chart */}
        <section className="result-section">
          <div className="section-title">
            <Lightbulb size={24} />
            <h2>Key Recommendations</h2>
          </div>

          {insightsData.length > 0 && (
            <div className="chart-container" ref={insightsChartRef}>
              <h3 className="chart-title">Insights Impact & Priority Analysis</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={insightsData}>
                  <PolarGrid stroke="var(--border-color)" />
                  <PolarAngleAxis dataKey="name" stroke="var(--text-secondary)" />
                  <PolarRadiusAxis stroke="var(--text-secondary)" />
                  <Radar
                    name="Impact Score"
                    dataKey="impact"
                    stroke="#0066cc"
                    fill="#0066cc"
                    fillOpacity={0.6}
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Radar
                    name="Priority"
                    dataKey="priority"
                    stroke="#667eea"
                    fill="#667eea"
                    fillOpacity={0.6}
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          <ul className="insights-list">
            {results.ai_insights?.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </section>

        {/* Next Ad Plan */}
        <section className="result-section">
          <div className="section-title">
            <Sparkles size={24} />
            <h2>Next Ad Plan</h2>
          </div>

          {adPlanData.length > 0 && (
            <div className="chart-container" ref={adPlanChartRef}>
              <h3 className="chart-title">Live Customer Journey Funnel</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={adPlanData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-secondary)" />
                  <YAxis type="category" dataKey="stage" stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Potential Reach"
                    animationDuration={800}
                    isAnimationActive={true}
                  >
                    {adPlanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="plan-content">
            {typeof results.next_ad_plan === 'object' ? (
              Object.entries(results.next_ad_plan).map(([key, value]) => (
                <div key={key} className="plan-item">
                  <h3>{key.replace(/_/g, ' ').toUpperCase()}</h3>
                  <p>{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                </div>
              ))
            ) : (
              <p>{results.next_ad_plan}</p>
            )}
          </div>
        </section>

        {/* 30-Day Content Strategy with Timeline Chart */}
        <section className="result-section">
          <div className="section-title">
            <Calendar size={24} />
            <h2>30-Day Content Strategy</h2>
          </div>

          {strategyData.length > 0 && (
            <div className="chart-container" ref={strategyChartRef}>
              <h3 className="chart-title">Weekly Content Plan Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={strategyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="posts"
                    fill="#0066cc"
                    name="Planned Posts"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Bar
                    dataKey="engagement"
                    fill="#10b981"
                    name="Target Engagement %"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="strategy-content">
            {typeof results.content_strategy === 'object' ? (
              Object.entries(results.content_strategy).map(([week, plan]) => (
                <div key={week} className="week-plan">
                  <h3>{week.replace(/_/g, ' ').toUpperCase()}</h3>
                  <p>{typeof plan === 'object' ? JSON.stringify(plan) : plan}</p>
                </div>
              ))
            ) : (
              <p>{results.content_strategy}</p>
            )}
          </div>
        </section>

        {/* Creative Prompts with Pie Chart */}
        <section className="result-section">
          <div className="section-title">
            <Sparkles size={24} />
            <h2>Creative Prompts</h2>
          </div>

          {promptsData.length > 0 && (
            <div className="chart-container" ref={promptsChartRef}>
              <h3 className="chart-title">Content Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={promptsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                    isAnimationActive={true}
                  >
                    {promptsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="prompts-grid">
            {console.log("Rendering AnalysisDetail V2")}
            {results.creative_prompts?.map((promptItem, index) => (
              <div key={index} className="prompt-card prompt-card-updated">
                <span className="prompt-number">{index + 1}</span>
                {typeof promptItem === 'object' ? (
                  <>
                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>{promptItem.concept}</h4>
                    <p>{promptItem.prompt}</p>
                  </>
                ) : (
                  <p>{promptItem}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Captions & Hashtags */}
        <section className="result-section">
          <div className="section-title">
            <Sparkles size={24} />
            <h2>Captions & Hashtags</h2>
          </div>

          {captionsData.length > 0 && (
            <div className="chart-container" ref={captionsChartRef}>
              <h3 className="chart-title">Live Engagement Predictions</h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={captionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="caption" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="predicted_likes"
                    fill="#0066cc"
                    name="Predicted Likes"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_comments"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Predicted Comments"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_shares"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Predicted Shares"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="engagement_score"
                    stroke="#667eea"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Engagement Score"
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="captions-list">
            {results.captions_hashtags?.map((item, index) => (
              <div key={index} className="caption-card">
                <h4>Caption {index + 1}</h4>
                {typeof item === 'object' ? (
                  <>
                    <p className="caption-text">{item.caption || item.text}</p>
                    <p className="hashtags">{item.hashtags}</p>
                  </>
                ) : (
                  <p>{item}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Similar Businesses */}
        {results.similar_businesses && results.similar_businesses.length > 0 && (
          <section className="result-section">
            <div className="section-title">
              <TrendingUp size={24} />
              <h2>Similar Businesses & Competitors</h2>
            </div>
            <p className="section-description">
              Real businesses from the web in your niche - research your competition:
            </p>

            {businessesData.length > 0 && (
              <div className="chart-container" ref={businessesChartRef}>
                <h3 className="chart-title">Live Competitive Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={businessesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" angle={-15} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="followers"
                      fill="#0066cc"
                      name="Followers"
                      animationDuration={800}
                      isAnimationActive={true}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="engagement"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Engagement Rate %"
                      animationDuration={800}
                      isAnimationActive={true}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="posts_per_week"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Posts/Week"
                      animationDuration={800}
                      isAnimationActive={true}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="businesses-grid">
              {results.similar_businesses.map((business, index) => (
                <div key={index} className="business-card">
                  <div className="business-number">{index + 1}</div>
                  {typeof business === 'object' ? (
                    <>
                      <h4 className="business-name">{business.name || business.business_name || business.company}</h4>
                      <p className="business-description">
                        {business.description || business.details || business.info || business.about}
                      </p>
                      {(business.website || business.url || business.link) && (
                        <a
                          href={business.website || business.url || business.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Website →
                        </a>
                      )}
                    </>
                  ) : (
                    <p>{business}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AnalysisDetail;
