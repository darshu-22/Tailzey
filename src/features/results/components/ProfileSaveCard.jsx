import React from 'react';
import { Save, AlertCircle } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input';

/** Name the measurements and save them to the user's account as a measurement profile. */
export default function ProfileSaveCard({ profile }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    profile.save();
  };

  return (
    <form className="results-save-card" onSubmit={handleSubmit} noValidate aria-label="Save measurements">
      <div className="results-save-header">
        <span className="summary-eyebrow-tag">Measurement Profile</span>
        <span className="results-save-status">
          {profile.isSaved ? 'Saving updates your saved profile' : 'Not saved to your account yet'}
        </span>
      </div>

      <Input
        id="profile-name"
        label="Profile name"
        value={profile.profileName}
        onChange={(e) => profile.setProfileName(e.target.value)}
        maxLength={80}
        error={profile.errors.profileName}
        required
      />

      {profile.formError && (
        <p className="results-save-error" role="alert">
          <AlertCircle size={13} />
          <span>{profile.formError}</span>
        </p>
      )}
      {profile.errors.other.length > 0 && (
        <ul className="results-save-error-list">
          {profile.errors.other.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}

      <Button type="submit" variant="primary" size="md" icon={Save} loading={profile.saving} className="results-save-btn">
        {profile.isSaved ? 'Save Changes' : 'Save Measurements'}
      </Button>
    </form>
  );
}
