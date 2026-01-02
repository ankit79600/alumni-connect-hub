import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface FirebaseAnalytics {
  analytics: any;
  logEvent: (analytics: any, eventName: string, params?: Record<string, any>) => void;
}

declare global {
  interface Window {
    firebaseAnalytics?: FirebaseAnalytics;
  }
}

export function useFirebaseAnalytics() {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    if (window.firebaseAnalytics) {
      const { analytics, logEvent } = window.firebaseAnalytics;
      logEvent(analytics, "page_view", {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);

  // Track custom events
  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (window.firebaseAnalytics) {
      const { analytics, logEvent } = window.firebaseAnalytics;
      logEvent(analytics, eventName, params);
      console.log(`📊 Firebase Analytics: ${eventName}`, params);
    }
  }, []);

  // Track user login
  const trackLogin = useCallback((method: string) => {
    trackEvent("login", { method });
  }, [trackEvent]);

  // Track sign up
  const trackSignUp = useCallback((method: string) => {
    trackEvent("sign_up", { method });
  }, [trackEvent]);

  // Track search
  const trackSearch = useCallback((searchTerm: string) => {
    trackEvent("search", { search_term: searchTerm });
  }, [trackEvent]);

  // Track content view
  const trackContentView = useCallback((contentType: string, contentId: string) => {
    trackEvent("view_item", { content_type: contentType, content_id: contentId });
  }, [trackEvent]);

  // Track button clicks
  const trackClick = useCallback((buttonName: string, section?: string) => {
    trackEvent("click", { button_name: buttonName, section });
  }, [trackEvent]);

  return {
    trackEvent,
    trackLogin,
    trackSignUp,
    trackSearch,
    trackContentView,
    trackClick,
  };
}
