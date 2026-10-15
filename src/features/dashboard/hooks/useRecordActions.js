import { useState } from 'react';
import { useRouter, useToast, useWorkspace } from '../../../app/hooks';
import { getErrorMessage } from '../../../core/api/ApiError';
import { designService } from '../../../services/designService';
import { profileService } from '../../../services/profileService';

/**
 * Dashboard actions on saved designs / measurement profiles: start new, open into the
 * workspace, and delete (behind the confirmation dialog). `busyId` marks the record being opened.
 */
export function useRecordActions({ designs, profiles, confirm }) {
  const workspace = useWorkspace();
  const { navigate } = useRouter();
  const { notify } = useToast();
  const [busyId, setBusyId] = useState(null);

  const notifyError = (title, err) => notify({ title, message: getErrorMessage(err), variant: 'error' });

  const openRecord = async (id, load, route, kind) => {
    setBusyId(id);
    try {
      await load(id);
      navigate(route);
    } catch (err) {
      notifyError(`Could not open ${kind}`, err);
    } finally {
      setBusyId(null);
    }
  };

  const deleteRecord = ({ id, label, kind, service, list, isOpenInWorkspace, resetWorkspace }) =>
    confirm({
      title: `Delete this ${kind}?`,
      message: `"${label}" will be permanently removed. This cannot be undone.`,
      confirmLabel: `Delete ${kind}`,
      onConfirm: async () => {
        try {
          await service.remove(id);
          notify({ title: 'Deleted', message: `"${label}" was removed.`, variant: 'success' });
        } catch (err) {
          if (err?.status !== 404) {
            notifyError(`Could not delete ${kind}`, err);
            return;
          }
        }
        // Don't leave the workspace pointing at a record that no longer exists.
        if (isOpenInWorkspace) resetWorkspace();
        list.refresh();
      },
    });

  return {
    busyId,
    startDesign: () => {
      workspace.resetDesign();
      navigate('designer');
    },
    startMeasurement: () => {
      workspace.resetMeasurement();
      navigate('measurement');
    },
    openDesign: (design) => openRecord(design.id, workspace.openDesign, 'designer', 'design'),
    openProfile: (profile) => openRecord(profile.id, workspace.openProfile, 'results', 'measurement profile'),
    deleteDesign: (design) =>
      deleteRecord({
        id: design.id,
        label: design.name,
        kind: 'design',
        service: designService,
        list: designs,
        isOpenInWorkspace: workspace.design.designId === design.id,
        resetWorkspace: workspace.resetDesign,
      }),
    deleteProfile: (profile) =>
      deleteRecord({
        id: profile.id,
        label: profile.profileName,
        kind: 'measurement profile',
        service: profileService,
        list: profiles,
        isOpenInWorkspace: workspace.measurement.profileId === profile.id,
        resetWorkspace: workspace.resetMeasurement,
      }),
  };
}
