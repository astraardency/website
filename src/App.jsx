import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  CalendarDays,
  ExternalLink,
  FileJson,
  Headphones,
  Info,
  Music2,
  RefreshCw,
  Smartphone,
  Zap,
  Moon,
  Sun
} from "lucide-react";
import "./App.css";

const WEBSITE_LINK = "https://vibeflow-chi-two.vercel.app/";
const DEFAULT_APK_LINK = " ";

function App() {
  const [version, setVersion] = useState({
    latestVersionCode: 1,
    latestVersionName: "1.0.0",
    apkUrl: DEFAULT_APK_LINK,
    releaseDate: "2026-06-18",
    minAndroid: "Android 8+",
    message: "Latest Vibeflow APK is ready to download.",
    changelog: [
      "Fresh APK download page",
      "Smooth mobile and laptop responsive UI",
      "Version update system using version.json",
    ],
  });

  const [theme, setTheme] = useState("dark"); // Start with dark or light

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

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
      })
      .catch(() => { });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const apkLink = version.apkUrl || DEFAULT_APK_LINK;

  return (
    <div className="app" data-theme={theme}>
      <header className="header">
        <div className="container header-content">
          <a href="#home" className="logo">
            <Headphones size={24} />
            <span>Vibeflow</span>
          </a>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a
              href={WEBSITE_LINK}
              target="_blank"
              rel="noreferrer"
              className="link-button"
            >
              <span>Website</span> <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="container hero-container">
            <div className="hero-text">
              <span className="pill">Official APK Update</span>
              <h1>Download <span>Vibeflow</span></h1>
              <p>
                Get the latest version of Vibeflow for your Android device.
                Install or update safely without losing your data.
              </p>

              <div className="hero-actions">
                <a href={apkLink} className="btn btn-primary btn-3d" download>
                  <ArrowDownToLine size={20} />
                  Download APK (v{version.latestVersionName})
                </a>
              </div>

              <div className="version-info">
                <div>
                  <span>Version:</span> {version.latestVersionName}
                </div>
                <div>
                  <span>Code:</span> {version.latestVersionCode}
                </div>
                <div>
                  <span>Requires:</span> {version.minAndroid}
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="simple-phone phone-3d">
                <div className="phone-notch"></div>
                <img src="./img.jpg" alt="Vibeflow App" className="phone-screenshot" />
              </div>
            </div>
          </div>
        </section>

        <section className="container section">
          <video
            className="demo-video video-3d"
            autoPlay
            loop
            muted
            playsInline
            src="./vibeflow-ad.mp4"
            aria-label="Vibeflow demo video"
          />
        </section>

        <section className="container section">
          <div className="grid-2">
            <div className="card card-3d">
              <div className="card-header">
                <div className="icon-3d"><Info size={24} /></div>
                <h2>Release Notes</h2>
              </div>
              <p className="release-msg">{version.message}</p>
              <div className="meta-tags">
                <span className="tag">
                  <CalendarDays size={16} /> {version.releaseDate}
                </span>
                <span className="tag">
                  <Smartphone size={16} /> {version.minAndroid}
                </span>
                <span className="tag">
                  <FileJson size={16} /> version.json
                </span>
              </div>
              <h4>Changelog:</h4>
              <ul className="changelog">
                {version.changelog.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card card-3d">
              <div className="card-header">
                <div className="icon-3d"><RefreshCw size={24} /></div>
                <h2>How to Update</h2>
              </div>
              <ol className="steps-list">
                <li>Download the latest APK from this page.</li>
                <li>Open the downloaded file on your Android device.</li>
                <li>
                  When prompted with "Update this app?", tap <strong>Update</strong>.
                </li>
                <li>Your existing data and settings will remain safe.</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="container section features-grid">
          <div className="feature card-3d">
            <div className="icon-3d"><Smartphone size={32} /></div>
            <h3>Mobile Ready</h3>
            <p>Optimized for an effortless download experience on your phone.</p>
          </div>
          <div className="feature card-3d">
            <div className="icon-3d"><Zap size={32} /></div>
            <h3>Fast & Clean</h3>
            <p>A simple, lightweight page designed to get you the app quickly.</p>
          </div>
          <div className="feature card-3d">
            <div className="icon-3d"><FileJson size={32} /></div>
            <h3>Auto-Synced</h3>
            <p>Always fetches the latest release details automatically.</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 Vibeflow. Created by @Astraardency.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;