import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';

export interface UserEntry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  active: boolean;
  isPimper?: boolean;
  createdAt?: Date;
}

export interface UserState extends EntityState<UserEntry>{
  loading: boolean;
  loaded: boolean;
  errorMessage: any;
}

export const UserAdapter: EntityAdapter<UserEntry> = createEntityAdapter<UserEntry>({
  selectId: (entry) => entry._id
});

export const UserInitialState: UserState = UserAdapter.getInitialState({
  loaded: false,
  loading: false,
  errorMessage: undefined
});
