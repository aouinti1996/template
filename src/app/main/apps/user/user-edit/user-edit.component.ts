import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { cloneDeep } from 'lodash';

import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';
import {Useratribute} from "../Useratribute";
import {id} from "@swimlane/ngx-datatable";
import {UserListService} from "../user-list/user-list.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit, OnDestroy {

  userModelObject: Useratribute= new Useratribute();
  formValue !: FormGroup;
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;

  @ViewChild('accountForm') accountForm: NgForm;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public selectMultiLanguages = ['English', 'Spanish', 'French', 'Russian', 'German', 'Arabic', 'Sanskrit'];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   * @param formbuilder
   */
  constructor(private router: Router, private _userEditService: UserEditService,private formbuilder : FormBuilder ,private _userListService:UserListService) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Submit
   *
   */
  submit() {
    {
      this.userModelObject.id = this.currentRow.id;
      this.userModelObject.fullname = this.formValue.value.fullname;
      this.userModelObject.username = this.formValue.value.username;
      this.userModelObject.email = this.formValue.value.email;
      this.userModelObject.phone = this.formValue.value.phone;
      this.userModelObject.salary = this.formValue.value.salary;
      this.userModelObject.role =this.formValue.value.role;
      this._userEditService.updateUser(this.userModelObject,this.userModelObject.id).subscribe(res => {
        console.log(res);
        alert("user updated successfully")
      })
    }
  }
  deleteUserDetail(){
    this._userListService.deleteUser(this.currentRow.id).subscribe(res =>{
          console.log(res);

          this.router.navigate(['/apps/user/user-list'])
          alert("deleted successfully")

        },
        error => {
          console.log(error)}
    )
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._userEditService.onUserEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.rows.map(row => {
        if (row.id == this.urlLastValue) {
          this.currentRow = row;
          this.tempRow = cloneDeep(row);
        }
      });
    });

    this.formValue = this.formbuilder.group({
      fullname : [''],
      username : [''],
      email : [''],
      phone : [''],
      salary : [''],
      role :['']

    })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
