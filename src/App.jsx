import { useEffect, useState } from "react";

function pickDisplayName(character, language) {
  if (language === "en") return character?.name?.en || character?.name?.ja || character?.id;
  return character?.name?.ja || character?.name?.en || character?.id;
}

function pickSummary(character, language) {
  if (language === "en") return character?.summary?.en || character?.summary?.ja || "";
  return character?.summary?.ja || character?.summary?.en || "";
}

function pickMetaLabel(character) {
  const parts = [character?.classification?.species, character?.classification?.role].filter(Boolean);
  return parts.join(" / ");
}

export default function App() {
  const [site, setSite] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [language, setLanguage] = useState("ja");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        const [siteRes, characterRes] = await Promise.all([
          fetch("/data/site.json"),
          fetch("/data/characters.json"),
        ]);

        if (!siteRes.ok || !characterRes.ok) {
          throw new Error("Failed to load public site data.");
        }

        const [siteData, characterData] = await Promise.all([siteRes.json(), characterRes.json()]);
        if (ignore) return;

        setSite(siteData);
        setCharacters(Array.isArray(characterData?.items) ? characterData.items.filter((item) => item.isActive !== false) : []);
        setLanguage(siteData?.defaultLanguage === "en" ? "en" : "ja");
        setError("");
      } catch (nextError) {
        if (ignore) return;
        setError(nextError.message || "Failed to load site data.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const totalCharacters = characters.length;
  const featuredCharacters = characters.slice(0, 6);

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-topline">
          <p className="eyebrow">Original Character Archive</p>
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLanguage((current) => (current === "ja" ? "en" : "ja"))}
          >
            {language === "ja" ? "EN" : "JP"}
          </button>
        </div>
        <h1>{site?.title || "Devils Your Friends"}</h1>
        <p className="lede">
          {site?.description ||
            "A public-facing archive for character profiles, world lore, and story fragments."}
        </p>

        <div className="hero-stats">
          <article className="stat-card">
            <span className="stat-label">Project</span>
            <strong>{site?.projectId || "loading"}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Characters</span>
            <strong>{loading ? "..." : totalCharacters}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Language</span>
            <strong>{language === "ja" ? "Japanese" : "English"}</strong>
          </article>
        </div>
      </header>

      <main className="content-grid">
        <section className="card card-accent intro-card">
          <h2>Public Site</h2>
          <p>
            This repository is the reading-facing archive. Character data is exported from the private
            staging app and published here as static files for GitHub Pages.
          </p>
        </section>

        <section className="card">
          <h2>Current Status</h2>
          <p>
            The public site is now loading staged JSON exports. The next step is to expand this into
            detail pages, worldbuilding sections, and visual identity.
          </p>
        </section>

        <section className="characters-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Featured</p>
              <h2>Characters</h2>
            </div>
            <p className="section-copy">
              Public profiles are generated from the staging database and rendered here as lightweight
              static content.
            </p>
          </div>

          {error ? <p className="error-message">{error}</p> : null}

          {loading ? (
            <div className="character-grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <article className="character-card skeleton-card" key={index}>
                  <div className="skeleton-line skeleton-line-title" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line skeleton-line-short" />
                </article>
              ))}
            </div>
          ) : (
            <div className="character-grid">
              {featuredCharacters.map((character) => (
                <article className="character-card" key={character.id}>
                  <div className="character-card-top">
                    <p className="character-id">{character.id}</p>
                    <span className="character-status">{character.status}</span>
                  </div>
                  <h3>{pickDisplayName(character, language)}</h3>
                  <p className="character-meta">{pickMetaLabel(character) || "profile in progress"}</p>
                  <p className="character-summary">{pickSummary(character, language) || "Summary coming soon."}</p>
                  <p className="character-notes">{character.notes || "Notes coming soon."}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
