import {createFeatureSelector, createSelector} from '@ngrx/store';
import {UserEntry, UserState} from './user.state';
import * as fromUser from './user.reducer';

export const getRouteState = createFeatureSelector<UserState>('user');

export const selectUserState = createSelector(
  getRouteState,
  (state): UserState => state
);

export const selectUserLoading = createSelector(
  selectUserState,
  ({loading}) => loading
);

export const selectAllUser = createSelector(
  selectUserState,
  fromUser.selectAll
);

export const selectUserEntites = createSelector(
  selectUserState,
  fromUser.selectEntities
);

export const selectUserById = (id: string) => createSelector(
  selectUserEntites,
  (entities) => entities && entities[id]
);

export const selectPimper = createSelector(
  selectAllUser,
  (users) => {
    if (users) {
      return users.filter((el: UserEntry) => el.role.name === 'PIMPER');
    }
    return [];
  }
);
