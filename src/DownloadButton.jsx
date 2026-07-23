import { useState, useEffect } from 'react';

export default function DownloadButton({ apkUrl, fileName }) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isReady, setIsReady] = useState(false);

  // The Direct Link URL from your index.html snippet
  const DIRECT_LINK_URL = "https://www.effectivecpmnetwork.com/mxd1maewy?key=321322fe6fba9082b07848fd60f1f11f";

  useEffect(() => {
    let timer;
    if (isWaiting && countdown > 0) {
      // Tick down every 1 second
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (isWaiting && countdown === 0) {
      // Timer finished!
      setIsReady(true);
      setIsWaiting(false);
    }
    
    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [isWaiting, countdown]);

  const handleInitialClick = () => {
    // 1. Open the Adsterra Direct Link in a new tab
    window.open(DIRECT_LINK_URL, '_blank', 'noopener,noreferrer');

    // 2. Start the timer in the current tab
    setIsWaiting(true);
  };

  const handleFinalDownload = () => {
    // Trigger the actual file download
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = fileName || 'download.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // State 1: Timer is running
  if (isWaiting) {
    return (
      <button 
        disabled 
        style={{ padding: '15px 30px', cursor: 'not-allowed', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        Generating secure link... {countdown}s
      </button>
    );
  }

  // State 2: Timer is finished, real download is ready
  if (isReady) {
    return (
      <button 
        onClick={handleFinalDownload}
        style={{ padding: '15px 30px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        Download {fileName} Now
      </button>
    );
  }

  // State 0: Default state before user clicks
  return (
    <button 
      onClick={handleInitialClick}
      style={{ padding: '15px 30px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
    >
      Download APK
    </button>
  );
}
