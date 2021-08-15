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

  //Variables we use
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

  //Check if user is moderatior
  moderator: boolean;

  constructor(private route: ActivatedRoute, private groupService: GroupService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    //Get our user
    this.user = JSON.parse(localStorage.getItem('user'))

    //Get the group Id
    this.groupId = +this.route.snapshot.paramMap.get('groupId');

    //Call to get our current group
    this.secondGroupSub = this.groupService.groupUpdated.subscribe(group => {
      this.group = group;
    })

    //Function to get the users that are in the group
    this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);

    //Subscription to the users, we remove admins and moderators, they don't need a group
    this.groupSub = this.groupService.groupUsersUpdated.subscribe(groupUser => {
      this.groupUsers = groupUser.groupUsers;
      this.groupUsers =this.groupUsers.filter((x) => x.user.roleId !== 4 && x.user.roleId !== 3)
      this.userCount = this.groupUsers.length;
    })

    //This is a check, if the user is not an SuperAdmin or Moderator or GroupModerator he isn't supposed to be here
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

    //Call to initiate the check
    this.groupService.getGroupUser(this.user, this.groupId)
    //Call to get our group
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
      if(event.checked) {
        this.toastr.success(user.user.firstName + " has been promoted to moderator!")
      } else {
        this.toastr.success(user.user.firstName + " has been demoted from moderator!")

      }
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
    })
  }

  //Remove user from group
  removeUserFromGroup(user: GroupUser) {
    this.otherSubs = this.groupService.deleteGroupUser(user.groupUserId).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
            this.toastr.success(user.user.firstName + " has been removed from the group!")
    })
  }

  //Add user to group
  addUserToGroup(user: GroupUser) {
    this.otherSubs = this.groupService.addUserToGroup(user, this.groupId).subscribe(() => {
      this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
      this.toastr.success(user.user.firstName + " has been added to the group!")
    })
  }

  //Approve moderator and join requests
  approve(user: GroupUser) {
    if(user.moderatorRequest == true) {
      this.otherSubs = this.groupService.updateGroupUser(user, true, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
        this.toastr.success("Moderator request of " + user.user.firstName + " is approved!")
      })
    }

    if(user.groupRequest == true) {
      this.otherSubs = this.groupService.updateGroupUser(user, false, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
        this.toastr.success("Group request of " + user.user.firstName + " is approved!")
      })
    }
  }

  //Deny moderator and join requests
  deny(user: GroupUser) {
    if(user.moderatorRequest == true) {
      this.otherSubs = this.groupService.updateGroupUser(user, false, this.groupId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
        this.toastr.success("Moderator request of " + user.user.firstName + " is denied!")

      })
    }

    if(user.groupRequest == true) {
      this.otherSubs = this.groupService.deleteGroupUser(user.groupUserId).subscribe(() => {
        this.groupService.getGroupUsers(this.groupId, this.usersPerPage, this.currentPage, this.selected, this.filter);
        this.toastr.success("Group request of " + user.user.firstName + " is denied!")
      })
    }
  }

  //Destroy subs
  ngOnDestroy() {
    this.groupSub.unsubscribe();
    if(this.otherSubs){
      this.otherSubs.unsubscribe();
    }
    this.secondGroupSub.unsubscribe();
  }


}
