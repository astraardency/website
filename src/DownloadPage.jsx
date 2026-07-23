import AdBanner from './AdBanner';

export default function DownloadPage() {
  return (
    <main className="download-page">
      <h1>AeroPublish Premium APK</h1>
      <p>Version 2.4.1 | 105 MB</p>
      
      {/* Place the ad right above the download button */}
      <AdBanner />
      
      <button className="primary-btn">Download Now</button>
    </main>
  );
}
