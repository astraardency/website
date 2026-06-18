import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  FileJson,
  Headphones,
  Info,
  Music2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";
import "./App.css";

const WEBSITE_LINK = "https://vibeflow-chi-two.vercel.app/";
const DEFAULT_APK_LINK = "";

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

  useEffect(() => {
    fetch("/version.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("version.json not found");
        }
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
      .catch(() => {
        // Fallback data already exists.
      });
  }, []);

  const apkLink = version.apkUrl || DEFAULT_APK_LINK;

  return (
    <div className="app">
      <div className="grid-bg"></div>
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="orb orb-three"></div>

      <header className="navbar">
        <a href="#home" className="brand" aria-label="Vibeflow home">
          <span className="brand-icon">
            <Headphones size={23} />
          </span>
          <span>Vibeflow</span>
        </a>

        <a
          className="website-link"
          href={WEBSITE_LINK}
          target="_blank"
          rel="noreferrer"
        >
          <span>Open Website</span>
          <ExternalLink size={16} />
        </a>
      </header>

      <main id="home" className="hero">
        <section className="hero-content">
          <div className="badge">
            <Sparkles size={16} />
            Official APK Update Page
          </div>

          <h1>
            Download the latest <span>Vibeflow</span> APK
          </h1>

          <p className="hero-text">
            Install Vibeflow for the first time or update to the newest version
            without uninstalling your existing app.
          </p>

          <div className="actions">
            <a className="download-btn" href={apkLink} download>
              <ArrowDownToLine size={21} />
              Download APK v{version.latestVersionName}
            </a>

            <a
              className="outline-btn"
              href={WEBSITE_LINK}
              target="_blank"
              rel="noreferrer"
            >
              Visit Website
              <ExternalLink size={18} />
            </a>
          </div>

          <div className="version-strip">
            <div>
              <small>Latest Version</small>
              <strong>{version.latestVersionName}</strong>
            </div>
            <div>
              <small>Version Code</small>
              <strong>{version.latestVersionCode}</strong>
            </div>
            <div>
              <small>Support</small>
              <strong>{version.minAndroid}</strong>
            </div>
          </div>
        </section>

        <section className="preview-section">
          <div className="phone-frame">
            <div className="speaker"></div>

            <div className="phone-screen">
              <div className="screen-top">
                <span>Vibeflow</span>
                <Music2 size={18} />
              </div>

              <div className="album-card">
                <div className="disc">
                  <Music2 size={58} />
                </div>
              </div>

              <h2>Version {version.latestVersionName}</h2>
              <p>Music • Podcast • Playlist</p>

              <div className="player-line">
                <span></span>
              </div>

              <div className="equalizer" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="update-card">
        <div className="update-left">
          <div className="section-badge">
            <RefreshCw size={17} />
            Update System
          </div>

          <h2>Update without uninstall</h2>
          <p>
            When users download the new APK, Android will update the existing
            Vibeflow app if the package name and signing key are the same and
            the new versionCode is higher.
          </p>
        </div>

        <div className="rules">
          <div className="rule">
            <BadgeCheck size={22} />
            <div>
              <h3>Same package name</h3>
              <p>Do not change your app applicationId.</p>
            </div>
          </div>

          <div className="rule">
            <ShieldCheck size={22} />
            <div>
              <h3>Same signing key</h3>
              <p>Use the same release keystore for every APK.</p>
            </div>
          </div>

          <div className="rule">
            <UploadCloud size={22} />
            <div>
              <h3>Higher versionCode</h3>
              <p>Increase versionCode for every new release.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="details-grid">
        <article className="latest-card">
          <div className="card-title">
            <Info size={22} />
            <h2>Latest release</h2>
          </div>

          <p className="message">{version.message}</p>

          <div className="release-meta">
            <span>
              <CalendarDays size={16} />
              {version.releaseDate}
            </span>
            <span>
              <Smartphone size={16} />
              {version.minAndroid}
            </span>
            <span>
              <FileJson size={16} />
              version.json
            </span>
          </div>

          <h3>What&apos;s new</h3>
          <ul>
            {version.changelog.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="steps-card">
          <h2>How users update</h2>

          <div className="step">
            <span>1</span>
            <p>User opens this Vibeflow download page.</p>
          </div>

          <div className="step">
            <span>2</span>
            <p>User clicks Download APK and installs the new APK.</p>
          </div>

          <div className="step">
            <span>3</span>
            <p>Android shows Update this app? instead of uninstall.</p>
          </div>

          <div className="step">
            <span>4</span>
            <p>User clicks Update and the old app updates safely.</p>
          </div>
        </article>
      </section>

      <section className="features">
        <article>
          <Smartphone size={27} />
          <h3>Mobile Ready</h3>
          <p>Full width download action and clean layout for phone users.</p>
        </article>

        <article>
          <Zap size={27} />
          <h3>Smooth UI</h3>
          <p>Animated background, hover effects, and modern transitions.</p>
        </article>

        <article>
          <FileJson size={27} />
          <h3>Version JSON</h3>
          <p>Update the latest version details from public/version.json.</p>
        </article>
      </section>

      <footer>
        <p>© 2026 Vibeflow. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
