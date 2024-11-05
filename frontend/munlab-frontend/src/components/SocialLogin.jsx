// src/components/SocialLogin.jsx
import { useEffect } from 'react';
import { socialConfig } from '../config/social';

const SocialLogin = ({ onSuccess, onError }) => {
  useEffect(() => {
    // Inizializza Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: socialConfig.facebook.appId,
        cookie: true,
        xfbml: true,
        version: socialConfig.facebook.version
      });
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(function(response) {
      if (response.authResponse) {
        onSuccess(response);
      } else {
        onError('Login Facebook annullato');
      }
    }, {scope: 'email'});
  };

  return (
    <div className="social-login-buttons">
      <GoogleLogin
        clientId={socialConfig.google.clientId}
        onSuccess={onSuccess}
        onError={onError}
      />
      <Button
        variant="outline-primary"
        onClick={handleFacebookLogin}
        className="w-100 mt-2"
      >
        <i className="bi bi-facebook me-2"></i>
        Continua con Facebook
      </Button>
    </div>
  );
};