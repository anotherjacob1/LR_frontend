import { createAction } from '@reduxjs/toolkit';

// fired once when the app reloads but before the app renders
// allows any updates to be applied to store data loaded from localStorage
export const updateVersion = createAction<void>('global/updateVersion');

export const updateMediaDarkMode = createAction<{ mediaDarkMode: boolean }>(
  'user/updateMediaDarkMode',
);
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
  'user/updateUserDarkMode',
);
