import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../../../shared/ui/Button';

/** Compact account row: who is signed in, and the permanent "Delete account" action (confirmed first). */
export default function AccountCard({ user, onDeleteAccount }) {
  return (
    <section className="card dash-account" aria-labelledby="dash-account-title">
      <div className="dash-account-info">
        <h2 id="dash-account-title" className="dash-account-title">
          Account
        </h2>
        <p className="dash-account-user">
          <span className="dash-account-name">{user?.displayName}</span>
          <span className="dash-account-email">{user?.email}</span>
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        icon={Trash2}
        className="dash-danger-text dash-account-delete"
        onClick={onDeleteAccount}
      >
        Delete account
      </Button>
    </section>
  );
}
