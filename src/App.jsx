import { useEffect, useState, useRef } from "react";
import {
  Compass,
  Grid,
  UploadCloud,
  BarChart3,
  Sun,
  Moon,
  Search,
  Download,
  Star,
  CheckCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Clock,
  ThumbsUp,
  Play,
  FileText
} from "lucide-react";
import "./App.css";

const INITIAL_APPS = [
  {
    id: "vibeflow",
    name: "Vibeflow Pro",
    developer: "Astraardency",
    version: "1.0.10",
    category: "Music & Audio",
    rating: 4.9,
    downloads: 12450,
    size: "24.6 MB",
    icon: "./icon.png",
    description: "Vibeflow is a modern, high-fidelity music streaming and audio management player with adaptive themes, premium equalizer controls, and offline syncing capabilities.",
    apkUrl: "/vibeflow.apk",
    featured: true,
  },
  {
    id: "retroarch",
    name: "RetroArch Arcade",
    developer: "Libretro Team",
    version: "1.16.0",
    category: "Games",
    rating: 4.7,
    downloads: 89400,
    size: "85.2 MB",
    icon: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=120&h=120&fit=crop&q=80",
    description: "A powerful frontend emulator for retro game consoles, game engines, and media players.",
    apkUrl: "#",
    featured: true,
  },
  {
    id: "tasker",
    name: "Tasker Automation",
    developer: "Crafty Apps EU",
    version: "6.1.32",
    category: "Productivity",
    rating: 4.6,
    downloads: 45200,
    size: "18.1 MB",
    icon: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=120&h=120&fit=crop&q=80",
    description: "Automate everything from settings to SMS. Custom triggers, actions, and full context-aware automations.",
    apkUrl: "#",
    featured: false,
  },
  {
    id: "solidexplorer",
    name: "Solid Explorer",
    developer: "NeatBytes Labs",
    version: "2.8.25",
    category: "Tools",
    rating: 4.8,
    downloads: 67100,
    size: "15.4 MB",
    icon: "https://images.unsplash.com/photo-1618005198143-e528346d9a59?w=120&h=120&fit=crop&q=80",
    description: "Elegant and secure dual-pane cloud and local file explorer with custom encryption.",
    apkUrl: "#",
    featured: false,
  },
  {
    id: "kinemaster",
    name: "KineMaster Editor",
    developer: "KineMaster Corp.",
    version: "7.0.8",
    category: "Productivity",
    rating: 4.5,
    downloads: 110200,
    size: "95.7 MB",
    icon: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=120&h=120&fit=crop&q=80",
    description: "Professional-grade mobile video editor featuring chroma key, multi-track timelines, and filters.",
    apkUrl: "#",
    featured: false,
  },
  {
    id: "novalauncher",
    name: "Nova Launcher Prime",
    developer: "TeslaCoil Software",
    version: "8.0.6",
    category: "Personalization",
    rating: 4.9,
    downloads: 154000,
    size: "12.3 MB",
    icon: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=120&h=120&fit=crop&q=80",
    description: "The definitive home screen replacement featuring gestures, custom icon packs, and subgrid positioning.",
    apkUrl: "#",
    featured: true,
  },
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Alex Rivera",
    appName: "Vibeflow Pro",
    rating: 5,
    text: "Absolutely stunning audio visualization. The dark theme matches my phone design perfectly, and it's super responsive!",
    date: "2 hours ago"
  },
  {
    id: 2,
    name: "Marcus Chen",
    appName: "RetroArch Arcade",
    rating: 5,
    text: "Outstanding emulator speed! Played my childhood favorite games smoothly. Thank you Libretro Team!",
    date: "1 day ago"
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    appName: "Tasker Automation",
    rating: 4,
    text: "Extremely powerful tools. Setting up context-based tasks has saved me so much time. Highly recommend it.",
    date: "3 days ago"
  }
];

const CATEGORIES = ["All", "Games", "Productivity", "Tools", "Music & Audio", "Personalization"];

function App() {
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [apps, setApps] = useState(INITIAL_APPS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [downloadingAppId, setDownloadingAppId] = useState(null);

  // Publish form states
  const [formTitle, setFormTitle] = useState("");
  const [formDev, setFormDev] = useState("");
  const [formVersion, setFormVersion] = useState("");
  const [formCategory, setFormCategory] = useState("Games");
  const [formSize, setFormSize] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formFile, setFormFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Set initial theme
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Dynamic metrics
  const totalDownloads = apps.reduce((sum, app) => sum + app.downloads, 0);
  const activeAppsCount = apps.length;
  const averageRating = (apps.reduce((sum, app) => sum + app.rating, 0) / apps.length).toFixed(1);
  const totalPoints = Math.round(totalDownloads * 0.15);

  // Dynamically calculate mock monthly data for the chart, tying the last index to totalDownloads
  const baseMonthlyDownloads = [120000, 185000, 240000, 210000, 310000, 390000];
  const chartData = [...baseMonthlyDownloads, totalDownloads];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Today"];

  // Search filter helper
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "All") {
      return matchesSearch;
    }
    return matchesSearch && app.category === selectedCategory;
  });

  // Handle mock download
  const handleDownload = (appId, apkUrl, appName) => {
    setDownloadingAppId(appId);
    
    // Simulate connection delay for premium feel
    setTimeout(() => {
      setApps((prevApps) =>
        prevApps.map((app) => {
          if (app.id === appId) {
            return { ...app, downloads: app.downloads + 1 };
          }
          return app;
        })
      );
      
      // Inject dynamic positive review
      const randomComments = [
        "Just downloaded, super fast install!",
        "Excellent package, safe and verified signature.",
        "The new update is running flawless.",
        "Smooth setup, immediately operational."
      ];
      const selectedComment = randomComments[Math.floor(Math.random() * randomComments.length)];
      
      setReviews((prevReviews) => [
        {
          id: Date.now(),
          name: "Anonymous User",
          appName: appName,
          rating: 5,
          text: selectedComment,
          date: "Just now"
        },
        ...prevReviews.slice(0, 5) // Cap reviews list
      ]);

      setDownloadingAppId(null);
      
      // Trigger actual download if it is Vibeflow
      if (apkUrl && apkUrl !== "#") {
        const link = document.createElement("a");
        link.href = apkUrl;
        link.download = apkUrl.substring(apkUrl.lastIndexOf('/') + 1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 1200);
  };

  // Drag and Drop simulation
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
        // Autofill size and title details from filename
        setFormSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        const cleanedName = file.name.replace(".apk", "").split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        setFormTitle(cleanedName);
      } else {
        alert("Please drop a valid .apk file.");
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormFile(file);
      setFormSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      const cleanedName = file.name.replace(".apk", "").split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      setFormTitle(cleanedName);
    }
  };

  // Submit and simulate publishing
  const handlePublishSubmit = (e) => {
    e.preventDefault();
    if (!formFile) {
      alert("Please upload an APK file first.");
      return;
    }
    if (!formTitle || !formDev || !formVersion || !formSize) {
      alert("Please fill out all mandatory fields.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    // Simulate progress bar movement
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadSuccess(true);
          
          // Add new app to the listing
          const newAppId = formTitle.toLowerCase().replace(/\s+/g, "-");
          const newApp = {
            id: newAppId,
            name: formTitle,
            developer: formDev,
            version: formVersion,
            category: formCategory,
            rating: 5.0,
            downloads: 100, // Starts with some initial downloads
            size: formSize,
            icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop&q=80", // Default gradient icon
            description: formDesc || "A modern application published by verified developers.",
            apkUrl: "#",
            featured: false,
          };

          setApps((prevApps) => [newApp, ...prevApps]);
          
          // Clear inputs
          setTimeout(() => {
            setFormTitle("");
            setFormDev("");
            setFormVersion("");
            setFormSize("");
            setFormDesc("");
            setFormFile(null);
            setUploadSuccess(false);
            setActiveTab("browse"); // Route back to see uploaded file
          }, 2000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={14} fill="currentColor" />);
      } else {
        stars.push(<Star key={i} size={14} />);
      }
    }
    return stars;
  };

  // SVG Chart path calculation helper
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
      {/* Sticky Navbar */}
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo" onClick={() => setActiveTab("discover")}>
            <Compass className="logo-icon" size={28} />
            <span>AeroPublish</span>
          </a>

          {/* Navigation Tab Links */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "discover" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("discover");
                setSearchQuery("");
              }}
            >
              <Compass size={18} />
              <span>Discover</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "browse" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("browse");
                setSearchQuery("");
              }}
            >
              <Grid size={18} />
              <span>Browse Categories</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "publish" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("publish");
                setSearchQuery("");
              }}
            >
              <UploadCloud size={18} />
              <span>Publish APK</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("dashboard");
                setSearchQuery("");
              }}
            >
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </button>
          </nav>

          <div className="header-actions">
            {/* Theme Toggle Button */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Profile Avatar */}
            <div className="user-profile" onClick={() => setActiveTab("dashboard")}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80"
                alt="Developer Avatar"
                className="user-avatar"
              />
              <span className="user-name">Dev Studio</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container main-content">
        {/* Global Search Bar */}
        {(activeTab === "discover" || activeTab === "browse") && (
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search apps, games, developers, categories..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* TAB: Discover */}
        {activeTab === "discover" && (
          <div className="tab-pane">
            {/* If searching, redirect display to filtered list */}
            {searchQuery ? (
              <section className="search-results-section">
                <div className="section-title-bar">
                  <h2>
                    <Search size={24} /> Search Results ({filteredApps.length})
                  </h2>
                </div>
                {filteredApps.length > 0 ? (
                  <div className="app-grid">
                    {filteredApps.map((app) => (
                      <div className="app-card" key={app.id}>
                        <div className="app-card-header">
                          <img src={app.icon} alt={app.name} className="app-icon" />
                          <div className="app-details">
                            <h3 className="app-name">{app.name}</h3>
                            <p className="app-developer">{app.developer}</p>
                          </div>
                        </div>
                        <div className="app-rating-row">
                          <div className="star-rating">{renderStars(app.rating)}</div>
                          <span className="rating-text">{app.rating}</span>
                          <span className="download-count">
                            {app.downloads.toLocaleString()} downloads
                          </span>
                        </div>
                        <div className="app-card-footer">
                          <span className="app-size">{app.size}</span>
                          <button
                            className="btn-card"
                            onClick={() => handleDownload(app.id, app.apkUrl, app.name)}
                            disabled={downloadingAppId === app.id}
                          >
                            {downloadingAppId === app.id ? (
                              <span>Starting...</span>
                            ) : (
                              <>
                                <Download size={14} /> Download
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px" }}>
                    No applications matched your query.
                  </p>
                )}
              </section>
            ) : (
              <>
                {/* Featured Hero Banner */}
                <section className="discover-hero">
                  <div className="hero-layout">
                    <div className="hero-body">
                      <span className="hero-badge">
                        <Cpu size={14} /> Featured App
                      </span>
                      <h1>
                        High Fidelity Music Streaming: <span>Vibeflow Pro</span>
                      </h1>
                      <p>
                        Experience premium, studio-quality sound tuning, customizable visualizers, and cross-device playlist syncing directly on Android. Free and secure offline downloads.
                      </p>
                      <div className="hero-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDownload("vibeflow", "/vibeflow.apk", "Vibeflow Pro")}
                          disabled={downloadingAppId === "vibeflow"}
                        >
                          <Download size={18} />
                          {downloadingAppId === "vibeflow" ? "Processing..." : "Get Vibeflow (v1.0.10)"}
                        </button>
                        <a href="#demo-video-anchor" className="btn btn-secondary">
                          <Play size={18} /> Watch Demo
                        </a>
                      </div>
                    </div>

                    <div className="hero-media">
                      <div className="hero-glow-card">
                        <img src="./img.jpg" alt="Vibeflow UI Preview" />
                        <div className="hero-app-meta">
                          <div>
                            <h3 className="hero-app-title">Vibeflow Pro</h3>
                            <span className="hero-app-dev">Astraardency • Music & Audio</span>
                          </div>
                          <div className="star-rating">
                            <Star size={16} fill="currentColor" />
                            <span style={{ marginLeft: "4px", fontWeight: "bold" }}>4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Video Demo Section */}
                <section className="discover-hero" id="demo-video-anchor" style={{ background: "var(--bg-secondary)", padding: "40px" }}>
                  <div className="section-title-bar">
                    <h2>
                      <Play size={24} /> Application Demo
                    </h2>
                  </div>
                  <video
                    className="demo-video video-3d"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="./vibeflow-ad.mp4"
                    aria-label="Vibeflow promo video"
                    style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--glass-border)" }}
                  />
                </section>

                {/* Popular App Card Section */}
                <section className="popular-releases">
                  <div className="section-title-bar">
                    <h2>
                      <TrendingUp size={24} /> Popular App Releases
                    </h2>
                    <button className="btn btn-secondary" onClick={() => setActiveTab("browse")}>
                      View All <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="app-grid">
                    {apps.map((app) => (
                      <div className="app-card" key={app.id}>
                        <div className="app-card-header">
                          <img src={app.icon} alt={app.name} className="app-icon" />
                          <div className="app-details">
                            <h3 className="app-name">{app.name}</h3>
                            <p className="app-developer">{app.developer}</p>
                          </div>
                        </div>
                        <div className="app-rating-row">
                          <div className="star-rating">{renderStars(app.rating)}</div>
                          <span className="rating-text">{app.rating}</span>
                          <span className="download-count">
                            {app.downloads.toLocaleString()} downloads
                          </span>
                        </div>
                        <div className="app-card-footer">
                          <span className="app-size">{app.size}</span>
                          <button
                            className="btn-card"
                            onClick={() => handleDownload(app.id, app.apkUrl, app.name)}
                            disabled={downloadingAppId === app.id}
                          >
                            {downloadingAppId === app.id ? (
                              <span>Starting...</span>
                            ) : (
                              <>
                                <Download size={14} /> Download
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* TAB: Browse Categories */}
        {activeTab === "browse" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <h2>
                <Grid size={24} /> App Directory Catalog
              </h2>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600 }}>
                Showing {filteredApps.length} apps
              </span>
            </div>

            {/* Category selection bar */}
            <div className="categories-filter-bar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            {filteredApps.length > 0 ? (
              <div className="app-grid">
                {filteredApps.map((app) => (
                  <div className="app-card" key={app.id}>
                    <div className="app-card-header">
                      <img src={app.icon} alt={app.name} className="app-icon" />
                      <div className="app-details">
                        <h3 className="app-name">{app.name}</h3>
                        <p className="app-developer">{app.developer}</p>
                      </div>
                    </div>
                    <div className="app-rating-row">
                      <div className="star-rating">{renderStars(app.rating)}</div>
                      <span className="rating-text">{app.rating}</span>
                      <span className="download-count">
                        {app.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                    <div className="app-card-footer">
                      <span className="app-size">{app.size}</span>
                      <button
                        className="btn-card"
                        onClick={() => handleDownload(app.id, app.apkUrl, app.name)}
                        disabled={downloadingAppId === app.id}
                      >
                        {downloadingAppId === app.id ? (
                          <span>Starting...</span>
                        ) : (
                          <>
                            <Download size={14} /> Download
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "60px 0" }}>
                No apps found matching the filter combination. Try clearing your search parameters.
              </p>
            )}
          </div>
        )}

        {/* TAB: Publish / Upload Form */}
        {activeTab === "publish" && (
          <div className="tab-pane">
            <div className="section-title-bar">
              <h2>
                <UploadCloud size={24} /> Developer APK Publisher
              </h2>
            </div>

            <div className="publish-layout">
              {/* Instructions Side */}
              <div className="publish-instructions">
                <h3>Verification Checklist</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "8px" }}>
                  To maintain the security integrity of our catalog, all submissions go through automated malware analysis.
                </p>

                <ul className="instructions-list">
                  <li>
                    <span className="instructions-step">1</span>
                    <div className="instructions-text">
                      <h4>Verified Package ID</h4>
                      <p>Ensure your Android manifest file includes a distinct package namespace.</p>
                    </div>
                  </li>
                  <li>
                    <span className="instructions-step">2</span>
                    <div className="instructions-text">
                      <h4>Cryptographic Signature</h4>
                      <p>Sign the binary release using your official developer keystore certificate.</p>
                    </div>
                  </li>
                  <li>
                    <span className="instructions-step">3</span>
                    <div className="instructions-text">
                      <h4>Metadata Optimization</h4>
                      <p>Upload screenshot images, version info, and descriptive explanations.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Form Side */}
              <form className="publish-form-card" onSubmit={handlePublishSubmit}>
                {/* Drag and Drop Zone */}
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
                      <span>{formFile.name} ({formSize})</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="dropzone-icon" size={48} />
                      <p className="dropzone-text">Drag & drop your APK file here</p>
                      <p className="dropzone-subtext">or click to browse local files (max 100MB)</p>
                    </>
                  )}
                </div>

                {/* Form Fields */}
                <div className="form-group">
                  <label htmlFor="app-title">Application Title *</label>
                  <input
                    id="app-title"
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Astro Explorer"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="app-dev">Developer Studio *</label>
                    <input
                      id="app-dev"
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. NextGen Apps Ltd"
                      value={formDev}
                      onChange={(e) => setFormDev(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-ver">Version *</label>
                    <input
                      id="app-ver"
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. 1.2.0"
                      value={formVersion}
                      onChange={(e) => setFormVersion(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="app-cat">Category *</label>
                    <select
                      id="app-cat"
                      className="form-control"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {CATEGORIES.filter(c => c !== "All").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="app-size">Simulated Package Size *</label>
                    <input
                      id="app-size"
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. 35.4 MB"
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="app-desc">Description</label>
                  <textarea
                    id="app-desc"
                    className="form-control"
                    placeholder="Write a clear functional overview of the app..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={uploading}>
                  {uploading ? "Publishing Upload in Progress..." : "Publish to Directory"}
                </button>

                {/* Progress bar animation */}
                {uploading && (
                  <div className="upload-progress-wrapper">
                    <div className="progress-header">
                      <span>Simulating Secure Sandbox Scanning...</span>
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
                    <span>Upload Successful! Scanning completed, listed in Directory.</span>
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
                <BarChart3 size={24} /> Developer Analytics Hub
              </h2>
            </div>

            {/* Metrics cards */}
            <div className="dashboard-metrics">
              <div className="metric-card">
                <div className="metric-icon">
                  <Download size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{totalDownloads.toLocaleString()}</span>
                  <span className="metric-label">Total Downloads</span>
                </div>
                <span className="metric-trend">+14%</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Grid size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{activeAppsCount}</span>
                  <span className="metric-label">Active Apps</span>
                </div>
                <span className="metric-trend" style={{ color: "var(--accent-cyan)" }}>Stable</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <Star size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{averageRating}</span>
                  <span className="metric-label">Average Rating</span>
                </div>
                <span className="metric-trend">+0.2</span>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <ThumbsUp size={24} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{totalPoints.toLocaleString()}</span>
                  <span className="metric-label">Developer Score</span>
                </div>
                <span className="metric-trend" style={{ color: "#eab308" }}>+22%</span>
              </div>
            </div>

            <div className="dashboard-layout">
              {/* Analytics Graph */}
              <div className="dashboard-panel">
                <div className="dashboard-panel-header">
                  <h3>Cumulative Monthly Downloads</h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 700 }}>
                    Updates in real-time on card download triggers
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

                    {/* Chart grid helper lines */}
                    <line x1="50" y1="50" x2="480" y2="50" className="chart-grid-line" />
                    <line x1="50" y1="116" x2="480" y2="116" className="chart-grid-line" />
                    <line x1="50" y1="183" x2="480" y2="183" className="chart-grid-line" />
                    <line x1="50" y1="250" x2="480" y2="250" className="chart-grid-line" />

                    {/* Fill Area */}
                    {chartPoints.length > 0 && (
                      <path d={chartAreaPath} className="chart-area" />
                    )}

                    {/* Stroke line */}
                    {chartPoints.length > 0 && (
                      <path d={chartLinePath} className="chart-line" />
                    )}

                    {/* Individual points */}
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

                    {/* X-axis labels */}
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

              {/* Recent User Reviews */}
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
                        <span className="review-app-name">{rev.appName}</span>
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

      {/* Footer Links */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <Compass size={20} className="logo-icon" />
            <span>AeroPublish Platform</span>
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
            © 2026 AeroPublish. All rights and distribution certificates active.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;