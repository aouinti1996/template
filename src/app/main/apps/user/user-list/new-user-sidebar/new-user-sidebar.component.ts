import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import {Useratribute} from "../../Useratribute";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserListService} from "../user-list.service";
import {UserListComponent} from "../user-list.component";

@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit {

  userModelObject: Useratribute= new Useratribute();
  formValue !: FormGroup;
  getAllData: UserListComponent ;


  /**
   * Constructor
   *
   * @param userListService
   * @param {FormBuilder} formbuilder
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
      private userListService : UserListService,
      private formbuilder : FormBuilder,
      private _coreSidebarService : CoreSidebarService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }



  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {

      this.toggleSidebar('new-user-sidebar');
    }
  }



  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
       fullname : [''],
       username : [''],
       email : [''],
       phone : [''],
       salary : [''],
       role :['']

    })


  }


  addUserDetails() {
    this.userModelObject.fullname = this.formValue.value.fullname;
    this.userModelObject.username = this.formValue.value.username;
    this.userModelObject.email = this.formValue.value.email;
    this.userModelObject.phone = this.formValue.value.phone;
    this.userModelObject.salary = this.formValue.value.salary;
    this.userModelObject.role =this.formValue.value.role;
    this.userListService.addUser(this.userModelObject)
        .subscribe(res=>{
      console.log(res);
          alert("user added successfully")
          this.formValue.reset();

    },
            error => {
          alert("Somthing worng")
            })
  }


}
