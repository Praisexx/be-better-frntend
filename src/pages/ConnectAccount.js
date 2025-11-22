import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { accountAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Facebook, Twitter, Linkedin, FileSpreadsheet, CheckCircle, XCircle, Loader, MessageCircle, ImageIcon, Send } from 'lucide-react';
import '../styles/ConnectAccount.css';

const ConnectAccount = () => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await accountAPI.getConnectedAccounts();
      // Add mock Meta connection for demo
      const mockMetaConnection = {
        id: 1,
        platform: 'meta',
        account_name: 'covenantchukwudi4real',
        account_id: 'meta_demo_001',
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString()
      };
      setConnectedAccounts([mockMetaConnection, ...response.data]);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Even if API fails, show mock Meta connection
      const mockMetaConnection = {
        id: 1,
        platform: 'meta',
        account_name: 'covenantchukwudi4real',
        account_id: 'meta_demo_001',
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString()
      };
      setConnectedAccounts([mockMetaConnection]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform) => {
    setConnecting(platform);
    try {
      const response = await accountAPI.initiateOAuth(platform);

      // Redirect to OAuth provider
      if (response.data.auth_url) {
        window.location.href = response.data.auth_url;
      }
    } catch (error) {
      toast.error(`Failed to connect ${platform}`);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!window.confirm('Are you sure you want to disconnect this account?')) return;

    try {
      await accountAPI.disconnectAccount(accountId);
      toast.success('Account disconnected');
      fetchConnectedAccounts();
    } catch (error) {
      toast.error('Failed to disconnect account');
    }
  };

  const platforms = [
    {
      id: 'meta',
      name: 'Meta (Facebook & Instagram)',
      icon: Facebook,
      color: '#1877F2',
      description: 'Connect your Facebook and Instagram ad accounts',
      available: true
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: Twitter,
      color: '#000000',
      description: 'Connect your X/Twitter ad account',
      available: true
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0A66C2',
      description: 'Connect your LinkedIn ad account',
      available: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: MessageCircle,
      color: '#25D366',
      description: 'Connect your WhatsApp Business ad account',
      available: true
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: ImageIcon,
      color: '#E60023',
      description: 'Connect your Pinterest ad account',
      available: true
    },
    {
      id: 'telegram',
      name: 'Telegram Ads',
      icon: Send,
      color: '#0088CC',
      description: 'Connect your Telegram ad account',
      available: true
    }
  ];

  const isConnected = (platformId) => {
    return connectedAccounts.some(acc => acc.platform === platformId);
  };

  const getAccountInfo = (platformId) => {
    return connectedAccounts.find(acc => acc.platform === platformId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={48} />
        <p>Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="connect-account-container">
      <header className="page-header">
        <div>
          <h1>Connect Ad Accounts</h1>
          <p>Connect your social media ad accounts to automatically analyze your campaigns</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          ← Back to Dashboard
        </button>
      </header>

      <div className="platforms-section">
        <h2>Social Media Platforms</h2>
        <div className="platforms-grid">
          {platforms.map((platform) => {
            const PlatformIcon = platform.icon;
            const connected = isConnected(platform.id);
            const accountInfo = getAccountInfo(platform.id);
            const isConnecting = connecting === platform.id;

            return (
              <div key={platform.id} className="platform-card">
                <div className="platform-header">
                  <div
                    className="platform-icon"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    <PlatformIcon size={32} color={platform.color} />
                  </div>
                  <div className="platform-status">
                    {connected ? (
                      <span className="status-badge connected">
                        <CheckCircle size={16} />
                        Connected to {platform.id === 'meta' ? 'covenantchukwudi4real' : accountInfo?.account_name || 'Account'}
                      </span>
                    ) : (
                      <span className="status-badge disconnected">
                        <XCircle size={16} />
                        Not Connected
                      </span>
                    )}
                  </div>
                </div>

                <div className="platform-content">
                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>

                  {connected && accountInfo && (
                    <div className="account-details">
                      <p><strong>Account:</strong> {accountInfo.account_name || accountInfo.account_id}</p>
                      <p><strong>Connected:</strong> {new Date(accountInfo.connected_at).toLocaleDateString()}</p>
                      {accountInfo.last_sync && (
                        <p><strong>Last Sync:</strong> {new Date(accountInfo.last_sync).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="platform-actions">
                  {connected ? (
                    <>
                      <button
                        onClick={() => navigate(`/generate-report?source=${platform.id}&accountId=${accountInfo.id}`)}
                        className="btn-primary"
                      >
                        Generate Report
                      </button>
                      <button
                        onClick={() => handleDisconnect(accountInfo.id)}
                        className="btn-danger-outline"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting || !platform.available}
                      className="btn-primary"
                      style={{ borderColor: platform.color }}
                    >
                      {isConnecting ? (
                        <>
                          <Loader className="spinner-small" size={16} />
                          Connecting...
                        </>
                      ) : (
                        'Connect Account'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="manual-upload-section">
        <div className="divider">
          <span>OR</span>
        </div>

        <div className="manual-upload-card">
          <FileSpreadsheet size={48} color="var(--primary-blue)" />
          <h3>Upload CSV Manually</h3>
          <p>Don't want to connect your account? Upload your ad data as a CSV file instead.</p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-secondary-large"
          >
            Upload CSV File
          </button>
        </div>
      </div>

      <div className="info-section">
        <h3>Why Connect Your Accounts?</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <CheckCircle size={24} color="var(--success-color)" />
            <div>
              <h4>Automatic Data Sync</h4>
              <p>No need to manually export and upload CSV files</p>
            </div>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="var(--success-color)" />
            <div>
              <h4>Real-Time Insights</h4>
              <p>Get the latest data and insights automatically</p>
            </div>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="var(--success-color)" />
            <div>
              <h4>Secure & Private</h4>
              <p>We use read-only access and encrypted connections</p>
            </div>
          </div>
          <div className="benefit-item">
            <CheckCircle size={24} color="var(--success-color)" />
            <div>
              <h4>Easy Management</h4>
              <p>Disconnect anytime with a single click</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccount;
