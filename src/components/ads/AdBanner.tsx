'use client';

import React, { useEffect } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}) => {
  useEffect(() => {
    try {
      // Google AdSense reklamlarını yükle
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense reklam yükleme hatası:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Buraya Google AdSense Publisher ID'si gelecek
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

// Responsive Ad Banner Component
export const ResponsiveAdBanner: React.FC<{ adSlot: string; className?: string }> = ({ 
  adSlot, 
  className = '' 
}) => (
  <AdBanner
    adSlot={adSlot}
    adFormat="auto"
    fullWidthResponsive={true}
    className={`responsive-ad ${className}`}
  />
);

// Square Ad Banner Component
export const SquareAdBanner: React.FC<{ adSlot: string; className?: string }> = ({ 
  adSlot, 
  className = '' 
}) => (
  <AdBanner
    adSlot={adSlot}
    adFormat="rectangle"
    fullWidthResponsive={false}
    className={`square-ad ${className}`}
  />
);

// Sidebar Ad Banner Component
export const SidebarAdBanner: React.FC<{ adSlot: string; className?: string }> = ({ 
  adSlot, 
  className = '' 
}) => (
  <AdBanner
    adSlot={adSlot}
    adFormat="vertical"
    fullWidthResponsive={false}
    className={`sidebar-ad ${className}`}
  />
);

// Header/Footer Ad Banner Component
export const HeaderAdBanner: React.FC<{ adSlot: string; className?: string }> = ({ 
  adSlot, 
  className = '' 
}) => (
  <AdBanner
    adSlot={adSlot}
    adFormat="horizontal"
    fullWidthResponsive={true}
    className={`header-ad ${className}`}
  />
);

// Ad Manager Hook
export const useAdManager = () => {
  const refreshAds = () => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Reklam yenileme hatası:', error);
      }
    }
  };

  const loadAdScript = () => {
    if (typeof window !== 'undefined' && !document.querySelector('#adsense-script')) {
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  };

  return { refreshAds, loadAdScript };
};
