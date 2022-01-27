import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserComponent} from './user.component';
import {RouterModule, Routes} from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UserModalComponent} from './user-modal/user-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from '../../../components/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {DialogConfirmationModule} from '../../../components/dialog-confirmation/dialog-confirmation.module';
import {MatRippleModule} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const routes: Routes = [
  {
    path: '', component: UserComponent
  }
];


@NgModule({
  declarations: [UserComponent, UserModalComponent],
    imports: [
        CommonModule,
        NgxDatatableModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatSlideToggleModule,
        MatIconModule,
        FlexLayoutModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
        ReactiveFormsModule,
        MatSelectModule,
        DialogConfirmationModule,
        MatRippleModule,
        ClipboardModule,
        MatSnackBarModule
    ]
})
export class UserModule { }
