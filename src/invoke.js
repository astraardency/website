export default function AdBanner() {
  const adCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <div id="container-YOUR-UNIQUE-ID"></div>
        <!-- PASTE YOUR EXACT ADSTERRA SCRIPT URL HERE -->
        <script async="async" data-cfasync="false" src="https://pl30500412.effectivecpmnetwork.com/YOUR-UNIQUE-ID/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <iframe 
        title="Adsterra Banner"
        srcDoc={adCode} 
        width="300" 
        height="250" 
        frameBorder="0" 
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden' }}
      ></iframe>
    </div>
  );
}
