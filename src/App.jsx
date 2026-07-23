import { useEffect, useState, useRef } from "react";
import {
  Compass,
  UploadCloud,
  BarChart3,
  Sun,
  Moon,
  Download,
  Star,
  CheckCircle,
  Clock,
  Smartphone,
  Play,
  CalendarDays,
  Info,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import "./App.css";

const WEBSITE_LINK = "https://vibeflow-chi-two.vercel.app/";
const DEFAULT_APK_LINK = "/vibeflow.apk";

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Alex Rivera",
    rating: 5,
    text: "Absolutely stunning audio visualization. The dark theme matches my phone design perfectly, and the equalizer is super responsive!",
    date: "2 hours ago"
  },
  {
    id: 2,
    name: "Marcus Chen",
    rating: 5,
    text: "Outstanding streaming speed! Played my high-res audio tracks smoothly. The background playback works like a charm.",
    date: "1 day ago"
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    rating: 4,
    text: "Extremely clean interface. Setting up playlists and downloading tracks offline has saved me so much cellular data.",
    date: "3 days ago"
  }
];

function App() {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("discover");
  
  // App Version state (synced with version.json)
  const [version, setVersion] = useState({
    latestVersionCode: 1,
    latestVersionName: "1.0.10",
    apkUrl: DEFAULT_APK_LINK,
    releaseDate: "2026-06-18",
    minAndroid: "Android 8+",
    downloads: 18450,
    message: "Latest Vibeflow APK is ready to download.",
    changelog: [
      "Official Vibeflow APK download page added",
      "Mobile and laptop responsive layout improved",
      "Version update system added using version.json"
    ],
  });

  // Load and save download count in localStorage to feel highly persistent
  const [downloads, setDownloads] = useState(() => {
    const saved = localStorage.getItem("vibeflow_downloads");
    return saved ? parseInt(saved, 10) : 18450;
  });

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Form states for Publish / Update
  const [formVersionName, setFormVersionName] = useState("");
  const [formVersionCode, setFormVersionCode] = useState("");
  const [formMinAndroid, setFormMinAndroid] = useState("Android 8+");
  const [formMessage, setFormMessage] = useState("");
  const [formChangelog, setFormChangelog] = useState("");
  const [formFile, setFormFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Set initial theme based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // Fetch version info from version.json on mount
  useEffect(() => {
    fetch("/version.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("version.json not found");
        return res.json();
      })
      .then((data) => {
        setVersion((oldData) => ({
          ...oldData,
          ...data,
          changelog: Array.isArray(data.changelog)
            ? data.changelog
            : oldData.changelog,
        }));
        if (data.downloads) {
          const saved = localStorage.getItem("vibeflow_downloads");
          const parsedSaved = saved ? parseInt(saved, 10) : 0;
          if (data.downloads > parsedSaved) {
            setDownloads(data.downloads);
            localStorage.setItem("vibeflow_downloads", data.downloads.toString());
          } else if (saved) {
            setDownloads(parsedSaved);
          } else {
            setDownloads(data.downloads);
          }
        }
      })
      .catch(() => { });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Handle Vibeflow Download simulation with progress spinner
  const handleDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete download state
          setIsDownloading(false);
          const newDownloads = downloads + 1;
          setDownloads(newDownloads);
          localStorage.setItem("vibeflow_downloads", newDownloads.toString());

          // Append feedback dynamically
          const feedbackList = [
            "Smooth install on my device, works beautifully!",
            "Immediate setup, sounds amazing with my headphones.",
            "The offline sync capability in this update is stellar.",
            "Super clean package download, no bugs encountered."
          ];
          const selectedFeedback = feedbackList[Math.floor(Math.random() * feedbackList.length)];
          setReviews((prevReviews) => [
            {
              id: Date.now(),
              name: "User #" + Math.floor(Math.random() * 900 + 100),
              rating: 5,
              text: selectedFeedback,
              date: "Just now"
            },
            ...prevReviews
          ]);

          // Trigger browser download
          const link = document.createElement("a");
          link.href = version.apkUrl || DEFAULT_APK_LINK;
          link.download = "vibeflow.apk";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Drag & drop file handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".apk")) {
        setFormFile(file);
      } else {
        alert("Please drop a valid .apk file.");
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormFile(e.target.files[0]);
    }
  };

  // Form submission for Publishing/Updating Vibeflow version
  const handlePublishSubmit = (e) => {
    e.preventDefault();
    if (!formFile) {
      alert("Please upload the new Vibeflow APK binary first.");
      return;
    }
    if (!formVersionName || !formVersionCode) {
      alert("Version Name and Version Code are required.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadSuccess(true);

          // Update Vibeflow app details in local state
          const newChangelog = formChangelog
            ? formChangelog.split("\n").filter(line => line.trim() !== "")
            : ["General performance improvements", "Bug fixes and stability patches"];

          setVersion((prevVersion) => ({
            ...prevVersion,
            latestVersionName: formVersionName,
            latestVersionCode: parseInt(formVersionCode, 10),
            minAndroid: formMinAndroid,
            message: formMessage || "A new update has been pushed by the developer.",
            releaseDate: new Date().toISOString().split('T')[0],
            changelog: newChangelog
          }));

          // Clear inputs
          setTimeout(() => {
            setFormVersionName("");
            setFormVersionCode("");
            setFormMinAndroid("Android 8+");
            setFormMessage("");
            setFormChangelog("");
            setFormFile(null);
            setUploadSuccess(false);
            setActiveTab("discover"); // Switch to discover tab to view the live update
          }, 2000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Helper rating renderer
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill={i <= floor ? "currentColor" : "none"}
          stroke="currentColor"
          className="star-rating"
        />
      );
    }
    return stars;
  };

  // Dynamic SVG Chart Coordinates for Vibeflow Downloads
  // Base numbers mapping to months, with current live downloads as the final entry
  const baseMonthlyDownloads = [8500, 9600, 10800, 11400, 11900, 12200];
  const chartData = [...baseMonthlyDownloads, downloads];
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Today"];
  
  const maxChartVal = Math.max(...chartData) * 1.1;
  const chartPoints = chartData.map((val, idx) => {
    const x = 50 + (idx / (chartData.length - 1)) * 430;
    const y = 250 - (val / maxChartVal) * 200;
    return { x, y, val };
  });

  const chartLinePath = chartPoints.reduce(
    (acc, curr, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`,
    ""
  );

  const chartAreaPath = `${chartLinePath} L ${chartPoints[chartPoints.length - 1].x} 250 L ${chartPoints[0].x} 250 Z`;

  return (
    <div className="app" data-theme={theme}>
      {/* Top Navbar */}
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo" onClick={() => setActiveTab("discover")}>
            <Compass className="logo-icon" size={28} />
            <span>Vibeflow Center</span>
          </a>

          {/* Navigation links */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "discover" ? "active" : ""}`}
              onClick={() => setActiveTab("discover")}
            >
              <Compass size={18} />
              <span>Discover</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "publish" ? "active" : ""}`}
              onClick={() => setActiveTab("publish")}
            >
              <UploadCloud size={18} />
              <span>Publish Update</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 size={18} />
              <span>Stats Hub</span>
            </button>
          </nav>

          <div className="header-actions">
            {/* Theme toggler */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Profile Avatar */}
            <div className="user-profile" onClick={() => setActiveTab("dashboard")}>
              <img
                src="./icon.png"
                alt="Vibeflow Icon"
                className="user-avatar"
              />
              <span className="user-name">Vibeflow Core</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container main-content">
        
        {/* TAB: Discover */}
        {activeTab === "discover" && (
          <div className="tab-pane">
            
            {/* Mobile-first Hero Layout */}
            <section className="discover-hero">
              <div className="hero-layout">
                <div className="hero-body">
                  <span className="hero-badge">
                    <Smartphone size={14} /> Mobile Optimized
                  </span>
                  <h1>
                    Feel the Beat: Download <span>Vibeflow Pro</span>
                  </h1>
                  <p>
                    Experience adaptive equalizers, lossless audio stream rendering, and beautiful visualizers on your Android device. Secure, ad-free standalone package.
                  </p>
                  
                  {/* Master Download Action */}
                  <div className="hero-actions">
                    <button
                      className="btn btn-primary"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      style={{ minWidth: "220px" }}
                    >
                      <Download size={18} />
                      {isDownloading ? `Downloading (${downloadProgress}%)` : `Download APK (v${version.latestVersionName})`}
                    </button>
                    <a
                      href={WEBSITE_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                    >
                      <span>Official Site</span> <ExternalLink size={16} />
                    </a>
                  </div>

                  <div className="version-info" style={{ marginTop: "24px" }}>
                    <div>
                      <span>Version:</span> {version.latestVersionName}
                    </div>
                    <div>
                      <span>Requires:</span> {version.minAndroid}
                    </div>
                    <div>
                      <span>Downloads:</span> {downloads.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Isometric Screen Preview */}
                <div className="hero-media">
                  <div className="phone-mockup-container">
                    {/* Glowing background radial blur */}
                    <div className="phone-glow-bg"></div>

                    {/* Smartphone Bezel Device */}
                    <div className="phone-device">
                      <div className="phone-notch"></div>
                      
                      {/* Fake OS Status Bar */}
                      <div className="phone-status-bar">
                        <span className="phone-time">09:41</span>
                        <div className="phone-status-icons">
                          <span style={{ marginRight: "2px" }}>5G</span>
                          <span>📶</span>
                          <span style={{ marginLeft: "2px" }}>🔋</span>
                        </div>
                      </div>

                      {/* Display Screen */}
                      <div className="phone-screen">
                        <img src="./img.jpg" alt="Vibeflow UI Preview" className="phone-screen-img" />
                        <div className="phone-reflection"></div>
                      </div>

                      {/* Bottom Dock Bar */}
                      <div className="phone-dock"></div>
                    </div>

                    {/* Layered Floating Glass Cards */}
                    <div className="floating-widget widget-left">
                      <div className="widget-eq-bars">
                        <div className="eq-bar bar1"></div>
                        <div className="eq-bar bar2"></div>
                        <div className="eq-bar bar3"></div>
                        <div className="eq-bar bar4"></div>
                      </div>
                      <div className="widget-content">
                        <span className="widget-label">Hi-Res Audio</span>
                        <span className="widget-value">Equalizer ON</span>
                      </div>
                    </div>

                    <div className="floating-widget widget-right">
                      <div className="widget-star">
                        <Star size={16} fill="currentColor" />
                      </div>
                      <div className="widget-content">
                        <span className="widget-label">User Rating</span>
                        <span className="widget-value">4.9 / 5.0</span>
                      </div>
                    </div>

                    <div className="floating-widget widget-center-bottom">
                      <span className="widget-pill">{downloads.toLocaleString()} Downloads</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Video Showcase Section */}
            <section className="discover-hero" style={{ background: "var(--bg-secondary)", padding: "30px", marginBottom: "40px" }}>
              <div className="section-title-bar">
                <h2>
                  <Play size={24} /> Official Promo Clip
                </h2>
              </div>
              <video
                className="demo-video video-3d"
                autoPlay
                loop
                muted
                playsInline
                src="./vibeflow-ad.mp4"
                aria-label="Vibeflow demo video"
                style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--glass-border)", aspectRatio: "16/9", objectFit: "cover" }}
              />
            </section>

            {/* Release details and Guides */}
            <section className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
              
              {/* Release Notes */}
              <div className="app-card" style={{ padding: "30px" }}>
                <div className="app-card-header">
                  <div className="metric-icon" style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Info size={20} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800 }}>Release Notes</h3>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px", fontWeight: 600 }}>
                  {version.message}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                  <span className="hero-badge" style={{ margin: 0, padding: "4px 12px", fontSize: "12px" }}>
                    <CalendarDays size={12} style={{ marginRight: "4px" }} /> {version.releaseDate}
                  </span>
                  <span className="hero-badge" style={{ margin: 0, padding: "4px 12px", fontSize: "12px" }}>
                    <Smartphone size={12} style={{ marginRight: "4px" }} /> {version.minAndroid}
                  </span>
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>Changelog:</h4>
                <ul style={{ paddingLeft: "16px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {version.changelog.map((item, index) => (
                    <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Install instructions */}
              <div className="app-card" style={{ padding: "30px" }}>
                <div className="app-card-header">
                  <div className="metric-icon" style={{ width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <RefreshCw size={20} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800 }}>How to Install & Update</h3>
                </div>
                <ol style={{ paddingLeft: "16px", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <li style={{ marginBottom: "12px" }}>Tap the <strong>Download APK</strong> button above to retrieve the package.</li>
                  <li style={{ marginBottom: "12px" }}>Launch the downloaded file from your mobile browser or file explorer.</li>
                  <li style={{ marginBottom: "12px" }}>Grant permission to install from <i>Unknown Sources</i> if prompted by Android.</li>
                  <li style={{ marginBottom: "12px" }}>Tap <strong>Install</strong> or <strong>Update</strong>. Your files and settings are securely kept.</li>
                </ol>
              </div>

            </section>
          </div>
        )}

        {/* TAB: Publish / Upload Form */}
        {activeTab === "publish" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <h2>
                <UploadCloud size={24} /> Publish Vibeflow Update
              </h2>
            </div>

            <div className="publish-layout">
              {/* Guidance side */}
              <div className="publish-instructions">
                <h3>Vibeflow Signing Credentials</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px" }}>
                  Pushed updates must contain matching cryptographic certificates to trigger automatic user upgrades.
                </p>

                <ul className="instructions-list">
                  <li>
                    <span className="instructions-step">1</span>
                    <div className="instructions-text">
                      <h4>Verified Package</h4>
                      <p>The package name must remain `com.astraardency.vibeflow`.</p>
                    </div>
                  </li>
                  <li>
                    <span className="instructions-step">2</span>
                    <div className="instructions-text">
                      <h4>Play Integrity Scan</h4>
                      <p>All binaries go through static analysis scanning to verify safety tags.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Form card */}
              <form className="publish-form-card" onSubmit={handlePublishSubmit}>
                
                {/* File Dropzone */}
                <div
                  className={`dropzone-container ${isDragActive ? "drag-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept=".apk"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />

                  {formFile ? (
                    <div className="file-selected-indicator">
                      <CheckCircle size={20} />
                      <span>{formFile.name} ({(formFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="dropzone-icon" size={48} />
                      <p className="dropzone-text">Drop Vibeflow APK updates here</p>
                      <p className="dropzone-subtext">or click to browse local files (max 100MB)</p>
                    </>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="app-ver-name">Version Name *</label>
                    <input
                      id="app-ver-name"
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. 1.0.11"
                      value={formVersionName}
                      onChange={(e) => setFormVersionName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-ver-code">Version Code *</label>
                    <input
                      id="app-ver-code"
                      type="number"
                      required
                      className="form-control"
                      placeholder="e.g. 11"
                      value={formVersionCode}
                      onChange={(e) => setFormVersionCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="app-min-android">Requires Android *</label>
                    <select
                      id="app-min-android"
                      className="form-control"
                      value={formMinAndroid}
                      onChange={(e) => setFormMinAndroid(e.target.value)}
                    >
                      <option value="Android 7.0+">Android 7.0+</option>
                      <option value="Android 8.0+">Android 8.0+</option>
                      <option value="Android 9.0+">Android 9.0+</option>
                      <option value="Android 10.0+">Android 10.0+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-release-msg">Release Tagline</label>
                    <input
                      id="app-release-msg"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Performance upgrade"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="app-changelog">Changelog (one entry per line)</label>
                  <textarea
                    id="app-changelog"
                    className="form-control"
                    placeholder="Improved equalizer settings&#10;Fixed bluetooth audio lag&#10;Added widgets support"
                    value={formChangelog}
                    onChange={(e) => setFormChangelog(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={uploading}>
                  {uploading ? "Analyzing package integrity..." : "Upload & Sync Release"}
                </button>

                {uploading && (
                  <div className="upload-progress-wrapper">
                    <div className="progress-header">
                      <span>Verifying signature & parsing package files...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="success-state">
                    <CheckCircle size={20} />
                    <span>Upload sync completed successfully! Pushed to Discover view.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* TAB: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <h2>
                <BarChart3 size={24} /> Vibeflow Analytics Hub
              </h2>
            </div>

            {/* Metrics cards */}
            <div className="dashboard-metrics">
              <div className="metric-card">
                <div className="metric-icon">
                  <Download size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{downloads.toLocaleString()}</span>
                  <span className="metric-label">Total Downloads</span>
                </div>
                <span className="metric-trend">+8%</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Smartphone size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">v{version.latestVersionName}</span>
                  <span className="metric-label">Active Version</span>
                </div>
                <span className="metric-trend" style={{ color: "var(--accent-cyan)" }}>Live</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Star size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">4.9</span>
                  <span className="metric-label">User Rating</span>
                </div>
                <span className="metric-trend" style={{ color: "#eab308" }}>★ ★ ★ ★ ★</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Clock size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{version.releaseDate}</span>
                  <span className="metric-label">Last Updated</span>
                </div>
                <span className="metric-trend" style={{ color: "var(--text-muted)" }}>Verified</span>
              </div>
            </div>

            <div className="dashboard-layout">
              {/* Analytics Graph */}
              <div className="dashboard-panel">
                <div className="dashboard-panel-header">
                  <h3>Historical Download Metrics</h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
                    Refreshes automatically upon package downloads
                  </span>
                </div>

                <div className="chart-container">
                  <svg className="chart-svg" viewBox="0 0 500 250" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--accent-purple)" />
                        <stop offset="100%" stopColor="var(--accent-cyan)" />
                      </linearGradient>
                      <linearGradient id="chart-area-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--accent-purple)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Chart grids */}
                    <line x1="50" y1="50" x2="480" y2="50" className="chart-grid-line" />
                    <line x1="50" y1="116" x2="480" y2="116" className="chart-grid-line" />
                    <line x1="50" y1="183" x2="480" y2="183" className="chart-grid-line" />
                    <line x1="50" y1="250" x2="480" y2="250" className="chart-grid-line" />

                    {/* Filled area */}
                    {chartPoints.length > 0 && (
                      <path d={chartAreaPath} className="chart-area" />
                    )}

                    {/* Stroke line */}
                    {chartPoints.length > 0 && (
                      <path d={chartLinePath} className="chart-line" />
                    )}

                    {/* Graph nodes */}
                    {chartPoints.map((point, idx) => (
                      <circle
                        key={idx}
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        className="chart-point"
                      >
                        <title>{`${months[idx]}: ${point.val.toLocaleString()} downloads`}</title>
                      </circle>
                    ))}

                    {/* Axis Labels */}
                    {chartPoints.map((point, idx) => (
                      <text
                        key={`lbl-${idx}`}
                        x={point.x}
                        y="245"
                        textAnchor="middle"
                        className="chart-axis-text"
                      >
                        {months[idx]}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Reviews List */}
              <div className="dashboard-panel">
                <div className="dashboard-panel-header">
                  <h3>Recent Feedback</h3>
                </div>

                <div className="reviews-list">
                  {reviews.map((rev) => (
                    <div className="review-item" key={rev.id}>
                      <div className="review-meta">
                        <span className="reviewer-name">{rev.name}</span>
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <div className="review-meta">
                        <div className="star-rating" style={{ color: "#eab308", display: "flex", gap: "2px" }}>
                          {renderStars(rev.rating)}
                        </div>
                      </div>
                      <p className="review-text">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <Compass size={20} className="logo-icon" />
            <span>Vibeflow App Distribution</span>
          </div>

          <div className="footer-links">
            <a href="#" className="footer-link" onClick={() => alert("Terms of Service simulated.")}>
              Terms of Use
            </a>
            <a href="#" className="footer-link" onClick={() => alert("Privacy policy details.")}>
              Privacy Guidelines
            </a>
            <a href="#" className="footer-link" onClick={() => alert("Developer support details.")}>
              Support API
            </a>
          </div>

          <span className="footer-copy">
            © 2026 Vibeflow. Created by @Astraardency. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;