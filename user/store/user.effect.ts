import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import * as UserActions from './user.action';
import {AppService} from '../../../../services/app.service';
import {of} from 'rxjs';

@Injectable()
export class UsersEffects {
  GetUsers$ = createEffect( () => this.action$.pipe(
    ofType(UserActions.UserLoadRequested),
    switchMap(() => {
      return this.appService.get('api/user').pipe(
        map(res => {
          if (res.errorMessage) {
            throw res.errorMessage;
          }
          return UserActions.UserRequestedSuccess( {
            entries: res
          });
        }),
        catchError((errorMessage) => {
          return of(UserActions.UserRequestedFailure({
            errorMessage
          }));
        })
      );
    })
  ));

  CreateUsers$ = createEffect( () => this.action$.pipe(
    ofType(UserActions.UserCreateRequested),
    switchMap(({entry}) => {
      return this.appService.post('signup', entry).pipe(
        map(res => {
          if (res.errorMessage) {
            throw res.errorMessage;
          }
          return UserActions.UserCreateSuccess( {entry: res});
        }),
        catchError((errorMessage) => {
          return of(UserActions.UserCreateFailure({
            errorMessage
          }));
        })
      );
    })
  ));

  UpdateUsers$ = createEffect( () => this.action$.pipe(
    ofType(UserActions.UserUpdateRequested),
    switchMap(({entry, isAccountActivation}) => {
      return this.appService.put(`api/user/${entry._id}`, {...entry, isAccountActivation}).pipe(
        map(res => {
          if (res.errorMessage) {
            throw res.errorMessage;
          }
          return UserActions.UserUpdateSuccess( {entry: res.updated});
        }),
        catchError((errorMessage) => {
          return of(UserActions.UserUpdateFailure({
            errorMessage
          }));
        })
      );
    })
  ));

  DeleteUsers$ = createEffect( () => this.action$.pipe(
    ofType(UserActions.UserDeleteRequested),
    switchMap(({entry}) => {
      return this.appService.delete(`api/user/${entry._id}`).pipe(
        map(res => {
          if (res.errorMessage) {
            throw res.errorMessage;
          }
          return UserActions.UserDeleteSuccess( {entry});
        }),
        catchError((errorMessage) => {
          return of(UserActions.UserDeleteFailure({
            errorMessage
          }));
        })
      );
    })
  ));

  constructor(
    private action$: Actions,
    private appService: AppService
  ) {}
}
