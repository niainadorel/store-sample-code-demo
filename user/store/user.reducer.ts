import {createReducer, on} from '@ngrx/store';
import {UserAdapter, UserInitialState} from './user.state';
import * as UserActions from './user.action';

export const reducer = createReducer(
  UserInitialState,
  on(UserActions.UserResetState, () => {
    return UserInitialState
  }),
  on(
    UserActions.UserLoadRequested,
    UserActions.UserCreateRequested,
    UserActions.UserUpdateRequested,
    UserActions.UserDeleteRequested,
    (state) => {
      return {
        ...state,
        loading: true
      }
    }),
  on(
    UserActions.UserCreateSuccess,
    (state, {entry}) => {
      return UserAdapter.addOne(entry, {
        ...state,
        loading: false
      })
    }),
  on(
    UserActions.UserRequestedSuccess,
    (state, {entries}) => {
      return UserAdapter.setAll(entries, {
        ...state,
        loading: false,
        loaded: true
      })
    }),
  on(
    UserActions.UserUpdateSuccess,
    (state, {entry}) => {
      return UserAdapter.updateOne({id: entry._id, changes: entry}, {
        ...state,
        loading: false
      })
    }),
  on(
    UserActions.UserDeleteSuccess,
    (state, {entry}) => {
      return UserAdapter.removeOne(entry._id, {
        ...state,
        loading: false
      })
    }),
  on(
    UserActions.UserRequestedFailure,
    UserActions.UserCreateFailure,
    UserActions.UserUpdateFailure,
    UserActions.UserDeleteFailure,
    (state, {errorMessage}) => {
      return {
        ...state,
        errorMessage,
        loading: false,
        loaded: false
      }
  })
);

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = UserAdapter.getSelectors();

