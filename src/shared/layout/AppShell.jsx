import React, { useState } from 'react';
import AppHeader from './AppHeader';
import AppNavDrawer from './AppNavDrawer';

/**
 * Layout for every signed-in page: sticky header + full-height main area.
 * Pages render their content only — no own header, nav or <main>.
 */
export default function AppShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <AppHeader onOpenMenu={() => setMenuOpen(true)} />
      <AppNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
