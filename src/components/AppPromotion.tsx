import React, { useEffect, useState } from 'react';
import './AppPromotion.css';

const AppPromotion: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Vérifier si c'est un appareil mobile
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Vérifier si l'utilisateur a déjà vu la bannière
    const hasSeenBanner = localStorage.getItem('hasSeenAppPromotion');
    if (!hasSeenBanner && isMobile) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenAppPromotion', 'true');
  };

  if (!isVisible || !isMobile) return null;

  return (
    <div className="app-promotion-banner">
      <div className="app-promotion-content">
        <div className="app-promotion-text">
          <h3>Téléchargez l'application CumMap</h3>
          <p>Profitez d'une expérience optimisée sur mobile</p>
        </div>
        <div className="app-promotion-buttons">
          <a 
            href="https://play.google.com/store/apps/details?id=com.cummap.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="app-promotion-button"
          >
            Google Play
          </a>
          <a 
            href="https://apps.apple.com/app/cummap" 
            target="_blank" 
            rel="noopener noreferrer"
            className="app-promotion-button"
          >
            App Store
          </a>
        </div>
        <button className="app-promotion-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default AppPromotion; 