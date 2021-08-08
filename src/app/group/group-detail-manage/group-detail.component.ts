import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { GroupUser } from 'src/app/models/groupUser.model';
import { User } from 'src/app/models/user.model';
import { GroupService } from '../group.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit, OnDestroy{

  //Id of the group we are managing
  groupId: number;

  //Columns for the mat-table
  displayedColumns: string[] = ['email', 'first name', 'last name', 'remove', 'groupMod'];

  //Pagination variables
  userCount = 0;
  usersPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];

  //Filters
  filter: string = "";
  selected: string = 'groupMembers';

  //Hidden -> We use this so we can hide certain actions depending on which user kind we are showing
  hidden:boolean = false;

  user: User;
  group: Group;
  userGroup: GroupUser;

  //The users we are displaying
  groupUsers: GroupUser [] = [];

  //Subscription
  groupSub: Subscription;
  otherSubs: Subscription;
  secondGroupSub: Subscription;
  userGroupSub: Subscription;

  moderator: boolean;

  constructor(private route: ActivatedRoute, private groupService: GroupService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.groupId = +this.route.snapshot.paramMap.get('groupId');

    this.secondGroupSub = this.groupService.groupUpdated.subscribe(group => {
      this.group = group;
    })

    this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);

    this.groupSub = this.groupService.groupUsersUpdated.subscribe(groupUser => {
      this.groupUsers = groupUser.groupUsers;
      this.groupUsers =this.groupUsers.filter((x) => x.user.roleId !== 4 && x.user.roleId !== 3)
      this.userCount = this.groupUsers.length;
    })

    this.userGroupSub = this.groupService.userGroupUpdated.subscribe(userGroup => {
      this.userGroup = userGroup;
      if(this.user.roleId !== 3 && this.user.roleId !== 4){
        if(this.userGroup) {
          if(this.userGroup.groupModerator){
            this.moderator = true;
          } else {
            this.router.navigate(['/company/home'])
            this.toastr.error("Sorry, you aren't a moderator for this group.")
          }
        } else {
          this.router.navigate(['/company/home'])
          this.toastr.error("Sorry, you aren't part of this group.")
        }
      }
    })

    this.groupService.getGroupUser(this.user, this.groupId)
    this.groupService.getGroup(this.groupId);
  }

  //Change page event, get users on pageswitch
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
  }

  //Search filter
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

  //Options filter
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

  //Turn group moderator on and off
  toggleModerator(event, user) {
    this.otherSubs = this.groupService.updateGroupUser(user, event.checked, this.groupId).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    })
  }

  //Remove user from group
  removeUserFromGroup(user: GroupUser) {
    this.otherSubs = this.groupService.deleteGroupUser(user.groupUserId).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    })
  }

  //Add user to group
  addUserToGroup(user: GroupUser) {
    this.otherSubs = this.groupService.addUserToGroup(user, this.groupId).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    })
  }

  //Approve moderator and join requests
  approve(user: GroupUser) {
    if(user.moderatorRequest == true) {
      this.otherSubs = this.groupService.updateGroupUser(user, true, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }

    if(user.groupRequest == true) {
      this.otherSubs = this.groupService.updateGroupUser(user, false, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }
  }

  //Deny moderator and join requests
  deny(user: GroupUser) {
    if(user.moderatorRequest == true) {
      this.otherSubs = this.groupService.updateGroupUser(user, false, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }

    if(user.groupRequest == true) {
      this.otherSubs = this.groupService.deleteGroupUser(user.groupUserId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      })
    }
  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
    if(this.otherSubs){
      this.otherSubs.unsubscribe();
    }
    this.secondGroupSub.unsubscribe();
  }


}
