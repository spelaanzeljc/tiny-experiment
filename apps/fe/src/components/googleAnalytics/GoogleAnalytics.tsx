import { useEffect, useRef } from "react";

import { AppConfig } from "@/config/app.config";

const { measurementId } = AppConfig.googleAnalytics;

const GoogleAnalytics = () => {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || !measurementId || (window as any).gtag) {
      return;
    }
    isInitializedRef.current = true;

    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;

    document.head.appendChild(script1);
    document.head.appendChild(script2);
  }, []);

  return null;
};

export default GoogleAnalytics;
