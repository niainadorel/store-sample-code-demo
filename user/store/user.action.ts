import {createAction, props} from '@ngrx/store';
import {UserEntry} from './user.state';

const source = 'user';

export const UserResetState = createAction(
  `[${source}] reset state`
);

export const UserLoadRequested = createAction(
  `[${source}] load requested`
);

export const UserRequestedSuccess = createAction(
  `[${source}] loaded`,
  props<{ entries: UserEntry[] }>()
);

export const UserRequestedFailure = createAction(
  `[${source}] load failed`,
  props<{ errorMessage: string }>()
);

export const UserCreateRequested = createAction(
  `[${source}] create requested`,
  props<{ entry: UserEntry }>()
);

export const UserCreateSuccess = createAction(
  `[${source}] created`,
  props<{ entry: UserEntry }>()
);

export const UserCreateFailure = createAction(
  `[${source}] create failed`,
  props<{ errorMessage: string }>()
);

export const UserUpdateRequested = createAction(
  `[${source}] update requested`,
  props<{ entry: UserEntry, isAccountActivation?: boolean }>()
);

export const UserUpdateSuccess = createAction(
  `[${source}] updated`,
  props<{ entry: UserEntry }>()
);

export const UserUpdateFailure = createAction(
  `[${source}] update failed`,
  props<{ errorMessage: string }>()
);

export const UserDeleteRequested = createAction(
  `[${source}] delete requested`,
  props<{ entry: UserEntry }>()
);

export const UserDeleteSuccess = createAction(
  `[${source}] deleted`,
  props<{ entry: UserEntry }>()
);

export const UserDeleteFailure = createAction(
  `[${source}] delete failed`,
  props<{ errorMessage: string }>()
);
