import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {TableColumn} from '@swimlane/ngx-datatable';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {UserModalComponent} from './user-modal/user-modal.component';
import {Store} from '@ngrx/store';
import {UserEntry, UserState} from './store/user.state';
import {UserDeleteRequested, UserUpdateRequested} from './store/user.action';
import {selectAllUser} from './store/user.selector';
import {DialogConfirmationComponent} from '../../../components/dialog-confirmation/dialog-confirmation.component';
import { combineLatest } from 'rxjs';
import { selectAccountState } from 'src/app/account/store/account.selector';
import {map} from 'rxjs/operators';
import {selectAllRole} from '../../../role/store/role.selector';
import {RoleEntry} from '../../../role/store/role.state';
import { Clipboard } from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit, AfterViewInit {

  rows = [] as UserEntry[];
  rowsFiltered = [] as UserEntry[];
  columns = [] as TableColumn[];
  itemPerPage = 5;
  itemPerPageChoice = [5, 10, 15, 25, 100]
  showAddUser = false;
  roles: RoleEntry[] = [];
  user: any;
  userActiveFilter = 'ALL';
  userFonctionFilter = 'ALL';
  userActiveArray = [
    { label: 'Activé', color: '#19c93f', value: 'ACTIVE' },
    { label: 'Désactivé', color: '#c91919', value: 'INACTIVE' },
  ]
  @ViewChild('userTable') table: any;

  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any> | undefined;
  @ViewChild('activeTemplate') activeTemplate: TemplateRef<any> | undefined;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any> | undefined;
  @ViewChild('dateTemplate') dateTemplate: TemplateRef<any> | undefined;
  @ViewChild('longtext') longtextTemplate: TemplateRef<any> | undefined;


  constructor(private dialog: MatDialog, protected store: Store<UserState>, private clipboard: Clipboard, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.store.select(selectAllRole).subscribe(roles => {
      this.roles = roles;
    });
  }
  ngAfterViewInit(): void {
    combineLatest(
      [this.store.select(selectAccountState),
      this.store.select(selectAllUser)]
    ).pipe(
      map(([user, entries]) => {
        const rows = entries.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return [user, rows] as any;
      })
    )
      .subscribe(([user, users]) => {
      this.user = {...user};

      if (this.user?.role?.name) {
        console.log('Users:', users)
        if (this.user?.role.name === 'SUPER ADMIN' && !this.user?.isPimper) {
          this.showAddUser = true;
        }
        this.rows = [...users].map(u => {
          if (u.role?.name === 'SUPER ADMIN' && u.isPimper) {
            return {...u,
              role: {
                ...u.role,
                name: 'ADMIN PIMPER'
              }
            }
          }
          return u;
        })
        if (user.role.name === 'USER') {
          this.columns = [
            { name: 'Identifiant', prop: '_id', cellTemplate: this.longtextTemplate},
            { name: 'Date de création', prop: 'createdAt', cellTemplate: this.dateTemplate},
            { name: 'Nom', prop: 'firstName'},
            { name: 'Prénom', prop: 'lastName'},
            { name: 'Email', prop: 'email'},
            { name: 'Fonction', prop: 'role.name'}
          ];
          this.rows = this.rows.filter(e => e.role.name === 'USER')
        } else {
          if (user.role.name === 'ADMIN') {
            this.rows = this.rows.filter(e => {
              return e.role.name !== 'PIMPER' && e.role.name !== 'SUPER ADMIN' && !e.isPimper
            })
          } else if (user.role.name === 'SUPER ADMIN' && user.isPimper) {
            this.rows = this.rows.filter(e => {
              return (e.role.name === 'SUPER ADMIN' && e.isPimper) ||
                e.role.name === 'PIMPER';
            });
          }
          this.columns = [
            { name: 'Identifiant', prop: '_id', cellTemplate: this.longtextTemplate},
            { name: 'Date de création', prop: 'createdAt', cellTemplate: this.dateTemplate},
            { name: 'Nom', prop: 'firstName'},
            { name: 'Prénom', prop: 'lastName'},
            { name: 'Email', prop: 'email'},
            { name: 'Fonction', prop: 'role.name', cellTemplate: this.roleTemplate},
            { name: 'Compte activé', cellTemplate: this.activeTemplate, prop: 'active'},
            { name: '', cellTemplate: this.actionTemplate}
          ];
        }
      }

      this.rowsFiltered = [...this.rows];
      this.filterChanged();
    });

    this.table.offset = 0;
  }

  getAccountActivationText(activeStatus: string): string {
    switch (activeStatus) {
      case 'ACTIVE': return 'Activé';
      case 'INACTIVE': return 'Désactivé';
      case 'ALL': return 'Tout';
    }
    return 'Tout';
  }

  deleteModal(row: UserEntry): void {
    const modalRef: MatDialogRef<any> = this.dialog.open(DialogConfirmationComponent);
    modalRef.afterClosed().subscribe(response => {
      if (response === 'confirmed') {
        this.store.dispatch(UserDeleteRequested({
          entry: row
        }));
      }
    });
  }

  openModal(): void {
    const modalRef: MatDialogRef<any> = this.dialog.open(UserModalComponent, {
      data: { user: this.user }
    });
    modalRef.afterClosed().subscribe(response => {
      if (response === 'creating') {};
    });
  }

  editModal(row: UserEntry): void {
    const modalRef: MatDialogRef<any> = this.dialog.open(UserModalComponent, {
      data: {row, user: this.user}
    });
    modalRef.afterClosed().subscribe(response => {
      if (response === 'updating') {};
    });
  }

  updateAccountActive(row: UserEntry, value: boolean): void {
    this.store.dispatch(UserUpdateRequested({
      entry: {
        ...row,
        active: value,
      },
      isAccountActivation: true
    }));
  }

  filterChanged(): void {
    this.rowsFiltered = this.rows.filter(row => {
      const userActive = row.active ? 'ACTIVE' : 'INACTIVE';
      return (row.role.name === this.userFonctionFilter || this.userFonctionFilter === 'ALL') &&
        (userActive === this.userActiveFilter || this.userActiveFilter === 'ALL');
    });
  }

  copyToClipboard(data: string): void {
    this.clipboard.copy(data);
    this.snackBar.open('Presse-papier', 'Copié', {duration: 2500})
  }
}
