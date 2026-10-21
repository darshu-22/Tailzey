import React from 'react';
import { AlertCircle, Save } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import StatusBadge from '../../../shared/ui/StatusBadge';
import UnitToggle from '../../../shared/measurements/UnitToggle';

const PROFILE_FORM_ID = 'profile-form';

/**
 * Compact page header: title, the profile name (its own form, so Enter saves), the unit
 * switch and Save. Server errors that don't belong to a field are listed underneath.
 */
export default function FitHeader({ profile, unit, onUnitChange }) {
  const nameError = profile.errors.profileName;

  const handleSubmit = (e) => {
    e.preventDefault();
    profile.save();
  };

  return (
    <header className="fit-head">
      <h1 className="page-title fit-title">Fit &amp; Size</h1>

      <form id={PROFILE_FORM_ID} className="fit-profile" onSubmit={handleSubmit} noValidate aria-label="Measurement profile">
        <label htmlFor="profile-name" className="fit-profile-label">
          Profile name<span className="form-required-mark" aria-hidden="true"> *</span>
        </label>
        <div className="fit-profile-field">
          <input
            id="profile-name"
            className="form-input fit-profile-input"
            value={profile.profileName}
            onChange={(e) => profile.setProfileName(e.target.value)}
            maxLength={80}
            required
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? 'profile-name-error' : 'profile-name-status'}
          />
          {nameError && (
            <span id="profile-name-error" className="form-error-text" role="alert">
              {nameError}
            </span>
          )}
        </div>
        <span id="profile-name-status" className="fit-profile-status">
          <StatusBadge variant={profile.isSaved ? 'success' : 'neutral'}>
            {profile.isSaved ? 'Saved · Save updates it' : 'Not saved yet'}
          </StatusBadge>
        </span>
      </form>

      <div className="fit-head-actions">
        <UnitToggle unit={unit} onChange={onUnitChange} />
        <Button type="submit" form={PROFILE_FORM_ID} icon={Save} loading={profile.saving}>
          {profile.isSaved ? 'Save changes' : 'Save'}
        </Button>
      </div>

      {profile.formError && (
        <div className="fit-alert is-danger fit-head-alert" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <div>
            <p>{profile.formError}</p>
            {profile.errors.other.length > 0 && (
              <ul className="fit-alert-list">
                {profile.errors.other.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
