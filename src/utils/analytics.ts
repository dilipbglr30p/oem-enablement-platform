// Google Analytics 4 and Tag Manager integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initializeGA = () => {
  const ga4Id = import.meta.env.VITE_PUBLIC_GA4_ID;
  const gtmId = import.meta.env.VITE_PUBLIC_GTM_ID;

  if (gtmId) {
    // Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gtmId);
  }

  if (ga4Id) {
    // Google Analytics 4
    window.gtag = window.gtag || function() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  const ga4Id = import.meta.env.VITE_PUBLIC_GA4_ID;
  
  if (ga4Id && window.gtag) {
    window.gtag('config', ga4Id, {
      page_path: url,
      page_title: title || document.title,
      page_location: window.location.origin + url,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  const ga4Id = import.meta.env.VITE_PUBLIC_GA4_ID;
  
  if (ga4Id && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Track user interactions
export const trackUserAction = (action: string, category: string, label?: string, value?: number) => {
  trackEvent(action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    event_category: 'engagement',
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: location,
    event_category: 'engagement',
  });
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
    event_category: 'engagement',
  });
};
