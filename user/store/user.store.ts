import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import * as fromUser from './user.reducer';
import {EffectsModule} from '@ngrx/effects';
import {UsersEffects} from './user.effect';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    StoreModule.forFeature('user', fromUser.reducer),
    EffectsModule.forFeature([UsersEffects])
  ]
})
export class UserStore { }
