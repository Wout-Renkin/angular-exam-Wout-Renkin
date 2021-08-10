import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy{
  //Users variable
  users: User[] = [];

  //Users subscription
  private usersSub: Subscription;

  //Table variable
  displayedColumns: string[] = ['email', 'first name', 'last name', 'add to company', 'Moderator'];

  //Pagination and filters
  userCount = 0;
  usersPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  filter: string = "";
  selected: string = 'Users';

  //Boolean to hide columns depending on the filter
  hidden:boolean = true;

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {

    //Get all users with current filters
    this.userService.getUsers(this.usersPerPage, this.currentPage, this.selected, this.filter);
    this.usersSub = this.userService.usersUpdated.subscribe( userData => {
      this.users = userData.users;
      this.userCount = userData.userCount;
    }
    )

  }

  //Add a user to our company
  addUserToCompany(user: User) {
    this.userService.updateUser(user).subscribe(() => {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
      this.toastr.success('User ' + user.firstName + ' ' + user.lastName + " added to your company!");
    });
  }

  //When page changes we need to get new users
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    if(this.selected == "Employees" || this.selected == "Moderators") {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);

    } else {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
    }

  }

  //Our search filter
  applyFilter(event) {

    this.filter = event.target.value

    if(this.filter.length > 3){
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
    }

    if(this.filter.length == 0) {
      this.filter = ""
      console.log("this is the length: " + this.filter.length)
      this.userService.getUsers(this.usersPerPage, this.currentPage, this.selected, this.filter);

    }

  }

  //Our option filter, on change we need to do a call again
  applyOptionFilter(selectedValue: string) {
    this.selected = selectedValue;
    switch(selectedValue) {
      case "Employees":
        this.hidden = false;
        break;
      case "Moderators":
        this.hidden = false;
        break;
      default:
        this.hidden = true;
        break;
    }
    this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);

  }

  //Grant or remove moderator
  toggleModerator(event, user) {
    this.userService.updateUser(user, event.checked).subscribe(() => {
      if(event.checked == true) {
        this.toastr.success('User ' + user.firstName + ' ' + user.lastName + " promoted to moderator!");
      } else {
        this.toastr.success('User ' + user.firstName + ' ' + user.lastName + " demoted from moderator!");
      }
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
    });

  }

  //Delete users from the company
  deleteUserFromCompany(user: User) {
    this.userService.updateUser(user, false, true).subscribe(() => {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
      this.toastr.success('User ' + user.firstName + ' ' + user.lastName + " removed from your company!");
    });
  }

  //Destroy subscription
  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

}
