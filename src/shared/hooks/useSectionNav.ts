import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Click handler for the "#hero"/"#technologies"/"#blog"/"#footer" nav
 * links shared by the header and footer. These ids only exist on the
 * Home page — clicking them from the post page or the admin area used
 * to silently do nothing (document.getElementById found no match there).
 * When already on Home, scroll straight to the section; otherwise
 * navigate to Home with the hash and let the effect in app/App.tsx
 * finish the scroll once it mounts.
 */
export const useSectionNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, onNavigate?: () => void) => {
      e.preventDefault();
      const id = href.replace('#', '');

      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate(`/#${id}`);
      }

      onNavigate?.();
    },
    [location.pathname, navigate],
  );
};
