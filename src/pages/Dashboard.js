import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI, uploadAPI } from '../services/api';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText, Clock, CheckCircle, BarChart3, Upload } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [analyses, setAnalyses] = useState([]);
  const [queueStatus, setQueueStatus] = useState({ queue_count: 0, analyses: [] });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchQueueStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchAnalyses(), fetchQueueStatus()]);
    } catch (error) {
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyses = async () => {
    try {
      const response = await analysisAPI.getHistory(50);
      setAnalyses(response.data);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    }
  };

  const fetchQueueStatus = async () => {
    try {
      const response = await uploadAPI.getQueueStatus();
      setQueueStatus(response.data);
    } catch (error) {
      console.error('Error fetching queue status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;

    try {
      await analysisAPI.deleteAnalysis(id);
      toast.success('Analysis deleted');
      fetchAnalyses();
    } catch (error) {
      toast.error('Error deleting analysis');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'status-pending', text: 'Pending' },
      processing: { class: 'status-processing', text: 'Processing' },
      completed: { class: 'status-completed', text: 'Completed' },
      failed: { class: 'status-failed', text: 'Failed' }
    };

    const statusInfo = statusMap[status.toLowerCase()] || statusMap.pending;
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  // Calculate metrics
  const totalAnalyses = analyses.length;
  const completedAnalyses = analyses.filter(a => a.status === 'completed').length;
  const pendingAnalyses = analyses.filter(a => a.status === 'pending' || a.status === 'processing').length;
  const failedAnalyses = analyses.filter(a => a.status === 'failed').length;

  // Status distribution data for pie chart
  const statusData = [
    { name: 'Completed', value: completedAnalyses, color: '#10b981' },
    { name: 'Pending', value: pendingAnalyses, color: '#f59e0b' },
    { name: 'Failed', value: failedAnalyses, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Timeline data for line chart
  const timelineData = analyses.slice(0, 7).reverse().map((analysis, index) => ({
    name: `#${analysis.id}`,
    date: new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    analyses: index + 1
  }));

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <BarChart3 className="header-icon" size={32} />
          <h1>Meta Ads AI Analyzer</h1>
        </div>
        <div className="header-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={() => navigate('/upload')} className="btn-primary">
            <Upload size={18} />
            Upload New CSV
          </button>
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {queueStatus.queue_count > 0 && (
        <div className="queue-status">
          <div className="queue-header">
            <Clock size={20} />
            <h3>Processing Queue ({queueStatus.queue_count})</h3>
          </div>
          <div className="queue-list">
            {queueStatus.analyses.map((analysis) => (
              <div key={analysis.id} className="queue-item">
                <span>{analysis.filename}</span>
                {getStatusBadge(analysis.status)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon total">
            <FileText size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Analyses</h3>
            <p className="metric-value">{totalAnalyses}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon completed">
            <CheckCircle size={24} />
          </div>
          <div className="metric-content">
            <h3>Completed</h3>
            <p className="metric-value">{completedAnalyses}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <h3>In Progress</h3>
            <p className="metric-value">{pendingAnalyses}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon trend">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>Success Rate</h3>
            <p className="metric-value">
              {totalAnalyses > 0 ? Math.round((completedAnalyses / totalAnalyses) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {analyses.length > 0 && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Analysis Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Analysis Timeline</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="analyses" stroke="var(--primary-blue)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <h2>Analysis History</h2>

        {analyses.length === 0 ? (
          <div className="empty-state">
            <Upload size={48} />
            <p>No analyses yet. Upload your first Meta Ads CSV to get started!</p>
            <button onClick={() => navigate('/upload')} className="btn-primary">
              Upload CSV
            </button>
          </div>
        ) : (
          <div className="analyses-grid">
            {analyses.map((analysis) => {
              let title = `Analysis #${analysis.id}`;
              try {
                if (analysis.results_json) {
                  const results = JSON.parse(analysis.results_json);
                  if (results.company_name) {
                    title = `${results.company_name} Analysis`;
                  }
                }
              } catch (e) {
                // Fallback to ID if parsing fails
              }

              return (
                <div key={analysis.id} className="analysis-card">
                  <div className="card-header">
                    <h3>{title}</h3>
                    {getStatusBadge(analysis.status)}
                  </div>

                  <div className="card-body">
                    <p className="filename">{analysis.csv_filename}</p>
                    <p className="date">
                      Created: {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                    {analysis.completed_at && (
                      <p className="date">
                        Completed: {new Date(analysis.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="card-actions">
                    {analysis.status === 'completed' && (
                      <button
                        onClick={() => navigate(`/dashboard/analysis/${analysis.id}`)}
                        className="btn-primary"
                      >
                        View Results
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
