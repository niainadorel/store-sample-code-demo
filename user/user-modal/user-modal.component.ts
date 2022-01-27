import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../../../../classes/error-state.matcher';
import {Store} from '@ngrx/store';
import {UserEntry, UserState} from '../store/user.state';
import {UserCreateRequested, UserUpdateRequested} from '../store/user.action';
import {selectAllRole} from '../../../../role/store/role.selector';
import {RoleEntry} from '../../../../role/store/role.state';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  userForm: FormGroup;
  passwordMatcher: any;
  roles = [] as RoleEntry[];
  isEdit = false;
  user: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {row: UserEntry, user: UserEntry}, private formBuilder: FormBuilder, protected store: Store<UserState>,
              public dialogRef: MatDialogRef<any>) {
    this.userForm = this.formBuilder.group({
      role: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.checkPasswords });
  }

  ngOnInit(): void {
    this.passwordMatcher = new MyErrorStateMatcher();
    this.store.select(selectAllRole).subscribe(roles => {
      this.roles = roles;
      this.roles = [...roles, {name: 'ADMIN PIMP', _id: 'ADMIN_PIMP_FAKE_ID'}]
      if (this.data && this.data?.user?.role?.name === 'ADMIN') {
        this.roles = roles.filter(role => role.name === 'USER' || role.name === 'ADMIN');
      }
    });

    if (this.data) {
      if (this.data.user) {
        this.user = this.data.user;
      }
      if (this.data.row) {
        this.isEdit = true;
        this.userForm.controls.password.setValidators([]);
        this.userForm.controls.confirmPassword.setValidators([]);
        this.userForm.patchValue({
          role: this.data.row.role._id
        });
      }
    }
  }

  checkPasswords(group: FormGroup): any {
    // @ts-ignore
    const password = group.get('password').value;
    // @ts-ignore
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true };
  }

  addFormControl(fieldName: any, event: FormControl): void {
    if (!this.userForm.controls[fieldName]){
      this.userForm.addControl(fieldName, event);
      if (this.isEdit) {
        this.userForm.patchValue({
          // @ts-ignore
          [fieldName]: this.data.row[fieldName]
        });
      }
    }
  }

  addUser(formValue: any): void {
    let update = {...formValue};
    if (formValue.role === 'ADMIN_PIMP_FAKE_ID') {
      update.role = this.roles.find(el => el.name == 'SUPER ADMIN')._id
      console.log('Update rle', update.role)
      update.isPimper = true;
    } else {
      update.isPimper = false;
    }
    this.store.dispatch(UserCreateRequested({
      entry: update
    }));
    this.dialogRef.close('adding');
  }

  updateUser(formValue: any): void {
    console.log('User data to update:', formValue);
    console.log('role', formValue.role);
    let update = {...formValue};
    if (formValue.role === 'ADMIN_PIMP_FAKE_ID') {
      update.role = this.roles.find(el => el.name == 'SUPER ADMIN')._id
      console.log('Update rle', update.role)
      update.isPimper = true;
    } else {
      update.isPimper = false;
    }
    if (this.isEdit) {
      this.store.dispatch(UserUpdateRequested({
        entry: {
          ...update,
          _id: this.data.row._id
        }
      }));
    } else {
      this.store.dispatch(UserCreateRequested({
        entry: {
          ...update
        }
      }))
    }

    this.dialogRef.close('updating');
  }
}
