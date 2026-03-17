import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main aria-label="Home page" className="page-root">
      <h1 className="page-title">TTI Media Manager</h1>
      <p>
        Open the <Link to="/media">Media Library</Link>.
      </p>
    </main>
  );
}
