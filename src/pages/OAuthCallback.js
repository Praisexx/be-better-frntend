import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { accountAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import '../styles/OAuthCallback.css';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing your connection...');
  const navigate = useNavigate();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const platform = searchParams.get('platform');

    // Check for OAuth errors
    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      toast.error('Failed to connect account');
      setTimeout(() => navigate('/connect-account'), 3000);
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setMessage('Invalid authentication response');
      toast.error('Invalid authentication response');
      setTimeout(() => navigate('/connect-account'), 3000);
      return;
    }

    try {
      const response = await accountAPI.handleOAuthCallback(platform, code, state);

      setStatus('success');
      setMessage(`Successfully connected ${platform} account!`);
      toast.success('Account connected successfully!');

      // Redirect to connect account page after 2 seconds
      setTimeout(() => {
        navigate('/connect-account');
      }, 2000);
    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(error.response?.data?.detail || 'Failed to connect account');
      toast.error('Failed to connect account');

      setTimeout(() => {
        navigate('/connect-account');
      }, 3000);
    }
  };

  return (
    <div className="oauth-callback-container">
      <div className="callback-card">
        {status === 'processing' && (
          <>
            <Loader className="status-icon spinner" size={64} />
            <h2>Connecting Account...</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="status-icon success" size={64} />
            <h2>Success!</h2>
            <p>{message}</p>
            <p className="redirect-message">Redirecting you back...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="status-icon error" size={64} />
            <h2>Connection Failed</h2>
            <p>{message}</p>
            <button
              onClick={() => navigate('/connect-account')}
              className="btn-primary"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
