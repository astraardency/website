import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    // 1. Prevent the script from loading twice in React 18 Strict Mode
    if (bannerRef.current && !bannerRef.current.querySelector('script')) {
      
      // 2. Create the Adsterra script element dynamically
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false'); // Prevents Cloudflare from breaking the script
      script.src = 'https://pl30500412.effectivecpmnetwork.com/104665f6d5c53e39ba250bd4621fa43e/invoke.js';

      // 3. Append the script directly below the container
      bannerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '20px 0', 
        minHeight: '250px' // Prevents layout shift while the ad loads
      }}
    >
      {/* 
        This is the exact container ID Adsterra is looking for. 
        The script we append below will inject the iframe right here.
      */}
      <div id="container-104665f6d5c53e39ba250bd4621fa43e"></div>
      
      {/* This hidden div holds the actual script tag */}
      <div ref={bannerRef}></div>
    </div>
  );
}