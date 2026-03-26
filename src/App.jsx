import { useEffect, useMemo, useState } from "react";

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

function getCurrentRoute() {
  const hash = window.location.hash || "#/";
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;
  const pathname = normalized || "/";

  if (pathname === "/" || pathname === "") return { page: "home" };
  if (pathname === "/characters") return { page: "characters" };
  if (pathname.startsWith("/characters/")) {
    return { page: "character-detail", characterId: pathname.replace("/characters/", "") };
  }
  return { page: "not-found" };
}

function navigateTo(nextPath) {
  window.location.hash = nextPath;
}

function Navigation({ currentPage }) {
  const items = [
    { label: "Home", path: "/", active: currentPage === "home" },
    { label: "Characters", path: "/characters", active: currentPage === "characters" || currentPage === "character-detail" },
  ];

  return (
    <nav className="site-nav" aria-label="Primary">
      {items.map((item) => (
        <button
          key={item.path}
          className={`nav-link${item.active ? " nav-link-active" : ""}`}
          type="button"
          onClick={() => navigateTo(item.path)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function HomePage({ site, characters, language, loading, error }) {
  const featuredCharacters = characters.slice(0, 6);

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Original Character Archive</p>
        <h1>{site?.title || "Devils Your Friends"}</h1>
        <p className="lede">
          {site?.description ||
            "A public-facing archive for character profiles, world lore, and story fragments."}
        </p>

        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => navigateTo("/characters")}>
            Browse Characters
          </button>
        </div>

        <div className="hero-stats">
          <article className="stat-card">
            <span className="stat-label">Project</span>
            <strong>{site?.projectId || "loading"}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Characters</span>
            <strong>{loading ? "..." : characters.length}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Language</span>
            <strong>{language === "ja" ? "Japanese" : "English"}</strong>
          </article>
        </div>
      </header>

      <main className="content-grid">
        <section className="card card-accent">
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
            <button className="ghost-button" type="button" onClick={() => navigateTo("/characters")}>
              View all
            </button>
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
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => navigateTo(`/characters/${character.id}`)}
                  >
                    Open profile
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function CharactersPage({ characters, language, loading, error }) {
  return (
    <main className="content-grid">
      <section className="card page-header-card">
        <p className="section-kicker">Directory</p>
        <h1 className="page-title">Characters</h1>
        <p className="section-copy">
          Browse the exported roster and open each profile as a dedicated detail page.
        </p>
      </section>

      {error ? <p className="error-message">{error}</p> : null}

      {loading ? (
        <div className="character-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="character-card skeleton-card" key={index}>
              <div className="skeleton-line skeleton-line-title" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line-short" />
            </article>
          ))}
        </div>
      ) : (
        <div className="character-grid">
          {characters.map((character) => (
            <article className="character-card" key={character.id}>
              <div className="character-card-top">
                <p className="character-id">{character.id}</p>
                <span className="character-status">{character.status}</span>
              </div>
              <h3>{pickDisplayName(character, language)}</h3>
              <p className="character-meta">{pickMetaLabel(character) || "profile in progress"}</p>
              <p className="character-summary">{pickSummary(character, language) || "Summary coming soon."}</p>
              <button
                className="text-button"
                type="button"
                onClick={() => navigateTo(`/characters/${character.id}`)}
              >
                Open profile
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function CharacterDetailPage({ character, language }) {
  if (!character) {
    return (
      <main className="content-grid">
        <section className="card">
          <p className="section-kicker">Not Found</p>
          <h1 className="page-title">Character not found</h1>
          <p className="section-copy">The requested profile could not be loaded from the public export.</p>
          <button className="primary-button" type="button" onClick={() => navigateTo("/characters")}>
            Back to characters
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="content-grid">
      <section className="detail-hero">
        <div>
          <p className="section-kicker">Character Profile</p>
          <h1 className="page-title">{pickDisplayName(character, language)}</h1>
          <p className="detail-summary">{pickSummary(character, language) || "Summary coming soon."}</p>
        </div>
        <div className="detail-hero-side">
          <p className="detail-meta-label">Classification</p>
          <p className="detail-meta-value">{pickMetaLabel(character) || "profile in progress"}</p>
          <p className="detail-meta-label">Status</p>
          <p className="detail-meta-value">{character.status || "draft"}</p>
        </div>
      </section>

      <section className="detail-grid">
        <article className="card">
          <h2>Notes</h2>
          <p>{character.notes || "Notes coming soon."}</p>
        </article>
        <article className="card">
          <h2>Personality</h2>
          <p>{character.personality || "Personality notes coming soon."}</p>
        </article>
        <article className="card">
          <h2>Appearance</h2>
          <p>{character.appearance || "Appearance notes coming soon."}</p>
        </article>
        <article className="card">
          <h2>Motifs</h2>
          <ul className="token-list">
            {(character.motifs || []).length ? (
              character.motifs.map((motif) => <li key={motif}>{motif}</li>)
            ) : (
              <li>No motifs yet.</li>
            )}
          </ul>
        </article>
      </section>

      <button className="ghost-button align-start" type="button" onClick={() => navigateTo("/characters")}>
        Back to characters
      </button>
    </main>
  );
}

export default function App() {
  const [site, setSite] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [language, setLanguage] = useState("ja");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [route, setRoute] = useState(() => getCurrentRoute());

  useEffect(() => {
    const handleHashChange = () => setRoute(getCurrentRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        const [siteRes, characterRes] = await Promise.all([fetch("/data/site.json"), fetch("/data/characters.json")]);

        if (!siteRes.ok || !characterRes.ok) {
          throw new Error("Failed to load public site data.");
        }

        const [siteData, characterData] = await Promise.all([siteRes.json(), characterRes.json()]);
        if (ignore) return;

        setSite(siteData);
        setCharacters(
          Array.isArray(characterData?.items) ? characterData.items.filter((item) => item.isActive !== false) : [],
        );
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

  const selectedCharacter = useMemo(
    () => characters.find((character) => character.id === route.characterId) || null,
    [characters, route.characterId],
  );

  return (
    <div className="page-shell">
      <div className="top-bar">
        <Navigation currentPage={route.page} />
        <button
          className="language-toggle"
          type="button"
          onClick={() => setLanguage((current) => (current === "ja" ? "en" : "ja"))}
        >
          {language === "ja" ? "EN" : "JP"}
        </button>
      </div>

      {route.page === "home" ? <HomePage site={site} characters={characters} language={language} loading={loading} error={error} /> : null}
      {route.page === "characters" ? <CharactersPage characters={characters} language={language} loading={loading} error={error} /> : null}
      {route.page === "character-detail" ? <CharacterDetailPage character={selectedCharacter} language={language} /> : null}
      {route.page === "not-found" ? (
        <main className="content-grid">
          <section className="card">
            <p className="section-kicker">Not Found</p>
            <h1 className="page-title">Page not found</h1>
            <p className="section-copy">The requested route is not available in the public site yet.</p>
            <button className="primary-button" type="button" onClick={() => navigateTo("/")}>
              Return home
            </button>
          </section>
        </main>
      ) : null}
    </div>
  );
}
