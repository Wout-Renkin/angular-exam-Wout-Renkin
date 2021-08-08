import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user.service';
import { debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy{
  users: User[] = [];
  private usersSub: Subscription;
  displayedColumns: string[] = ['email', 'first name', 'last name', 'add to company', 'Moderator'];
  userCount = 0;
  usersPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  filter: string = "";
  selected: string = 'Users';
  hidden:boolean = true;
  loggedInUser: User;
  test = new Subject<string>();

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {

    this.userService.getUsers(this.usersPerPage, this.currentPage, this.selected, this.filter);
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.usersSub = this.userService.usersUpdated.subscribe( userData => {
      this.users = userData.users;
      this.userCount = userData.userCount;
    }
    )

  }
  addUserToCompany(user: User) {
    this.userService.updateUser(user).subscribe(() => {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
      this.toastr.success('User ' + user.firstName + ' ' + user.lastName + " added to your company!");
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    if(this.selected == "Employees" || this.selected == "Moderators") {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);

    } else {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
    }

  }

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

  deleteUserFromCompany(user: User) {
    this.userService.updateUser(user, false, true).subscribe(() => {
      this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
      this.toastr.success('User ' + user.firstName + ' ' + user.lastName + " removed from your company!");
    });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

}
