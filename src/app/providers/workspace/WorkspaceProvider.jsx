import React, { useCallback, useMemo, useState } from 'react';
import { designService } from '../../../services/designService';
import { profileService } from '../../../services/profileService';
import { WorkspaceContext } from './WorkspaceContext';
import {
  INITIAL_DESIGN,
  INITIAL_MEASUREMENT,
  applyAnalysis,
  changeUnit,
  designFromRecord,
  designSaveStatus,
  designSignature,
  designToPayload,
  profileFromRecord,
  profileToPayload,
  setMeasurementValue,
} from './workspaceState';

/**
 * The user's working copy of a design and a measurement profile, shared across
 * designer → measurement → results → 3D → report. Explicit save/load sync it with the API.
 * Mounted once per signed-in user (see AppProviders), so one user's work never leaks to the next.
 */
export default function WorkspaceProvider({ children }) {
  const [design, setDesign] = useState(INITIAL_DESIGN);
  const [measurement, setMeasurement] = useState(INITIAL_MEASUREMENT);
  // Fingerprint of the design as last saved to / loaded from the server.
  const [savedSignature, setSavedSignature] = useState(null);

  const updateDesign = useCallback((patch) => setDesign((d) => ({ ...d, ...patch })), []);
  const resetDesign = useCallback(() => {
    setDesign(INITIAL_DESIGN);
    setSavedSignature(null);
  }, []);

  const adoptDesign = useCallback((record) => {
    const next = designFromRecord(record);
    setDesign(next);
    setSavedSignature(designSignature(next));
  }, []);

  const updateMeasurement = useCallback((patch) => setMeasurement((m) => ({ ...m, ...patch })), []);
  const setValue = useCallback((key, value) => setMeasurement((m) => setMeasurementValue(m, key, value)), []);
  const setUnit = useCallback((unit) => setMeasurement((m) => changeUnit(m, unit)), []);
  const applyCameraAnalysis = useCallback(
    (analysis, options) => setMeasurement((m) => applyAnalysis(m, analysis, options)),
    []
  );
  const resetMeasurement = useCallback(() => setMeasurement(INITIAL_MEASUREMENT), []);

  const saveDesign = useCallback(async () => {
    const payload = designToPayload(design);
    const record = design.designId
      ? await designService.update(design.designId, payload)
      : await designService.create(payload);
    adoptDesign(record);
    return record;
  }, [design, adoptDesign]);

  const openDesign = useCallback(async (id) => {
    const record = await designService.get(id);
    adoptDesign(record);
    return record;
  }, [adoptDesign]);

  const saveProfile = useCallback(async () => {
    const payload = profileToPayload(measurement);
    const record = measurement.profileId
      ? await profileService.update(measurement.profileId, payload)
      : await profileService.create(payload);
    setMeasurement((m) => ({ ...m, profileId: record.id }));
    return record;
  }, [measurement]);

  const openProfile = useCallback(async (id) => {
    const record = await profileService.get(id);
    setMeasurement(profileFromRecord(record));
    return record;
  }, []);

  const value = useMemo(
    () => ({
      design,
      designStatus: designSaveStatus(design, savedSignature),
      measurement,
      updateDesign,
      resetDesign,
      saveDesign,
      openDesign,
      updateMeasurement,
      setValue,
      setUnit,
      applyCameraAnalysis,
      resetMeasurement,
      saveProfile,
      openProfile,
    }),
    [design, savedSignature, measurement, updateDesign, resetDesign, saveDesign, openDesign, updateMeasurement,
      setValue, setUnit, applyCameraAnalysis, resetMeasurement, saveProfile, openProfile]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
