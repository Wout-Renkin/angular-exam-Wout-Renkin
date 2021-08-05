import { createHostListener } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { GroupUser } from 'src/app/models/groupUser.model';
import { User } from 'src/app/models/user.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit, OnDestroy{
  groupId: number;
  users: User[] = [];
  displayedColumns: string[] = ['email', 'first name', 'last name', 'remove', 'groupMod'];
  userCount = 0;
  usersPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  filter: string = "";
  selected: string = 'groupMembers';
  hidden:boolean = false;
  loggedInUser: User;
  test = new Subject<string>();
  groupUsers: GroupUser [] = [];
  groupSub: Subscription;
  constructor(private route: ActivatedRoute, private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupId = +this.route.snapshot.paramMap.get('groupId');
    this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    this.groupSub = this.groupService.groupUsersUpdated.subscribe(groupUser => {
      this.groupUsers = groupUser.groupUsers;
      this.userCount = groupUser.userCount;
    })
  }


  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
  }


  applyFilter(event) {

    this.filter = event.target.value

    if(this.filter.length > 3){
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    }

    if(this.filter.length == 0) {
      this.filter = ""
      console.log("this is the length: " + this.filter.length)
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);

    }

  }

  applyOptionFilter(selectedValue: string) {
    this.selected = selectedValue;
    this.currentPage = 1;
    switch(selectedValue) {
      case "nonMembers":
        this.hidden = true;
        break;
      case "moderators":
        this.hidden = false;
        break;
      case "groupRequests":
        this.hidden = true;
        break;
      case "moderatorRequests":
        this.hidden = true;
        break;
      default:
        this.hidden = false;
        break;
    }
    this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);

  }

  toggleModerator(event, user) {
    this.groupService.updateGroupUser(user, event.checked, this.groupId).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    })
    // this.userService.updateUser(user, event.checked).subscribe(() => {
    //   this.userService.getUsers(this.usersPerPage, this.currentPage,  this.selected, this.filter);
    // });

  }

  removeUserFromGroup(user: GroupUser) {
    this.groupService.deleteGroupUser(user.id).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    })
  }

  addUserToGroup(user: GroupUser) {
    this.groupService.addUserToGroup(user, this.groupId).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    })
  }

  approve(user: GroupUser) {
    if(user.moderatorRequest == true) {
      this.groupService.updateGroupUser(user, true, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }

    if(user.groupRequest == true) {
      this.groupService.updateGroupUser(user, false, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }
  }

  deny(user: GroupUser) {
    if(user.moderatorRequest == true) {
      this.groupService.updateGroupUser(user, false, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }

    if(user.groupRequest == true) {
      this.groupService.deleteGroupUser(user.id).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }
  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
  }


}
