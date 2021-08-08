import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { GroupUser } from 'src/app/models/groupUser.model';
import { User } from 'src/app/models/user.model';
import { GroupService } from '../group.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit, OnDestroy {
  groups: Group[] = [];
  userGroups: GroupUser[];
  groupSub: Subscription;
  userGroupsSub: Subscription;
  editGroupSub: Subscription;
  user: User;
  moderatorEdit: boolean = false;
  moderator: boolean = false;
  loadingGroup: boolean = true;
  loadingUserGroup: boolean = true;

  constructor(private groupService: GroupService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.groupSub = this.groupService.groupsUpdated.subscribe(groups => {
      this.groups = groups;
      this.loadingGroup = false;
      // if(this.userGroups) {
      //   this.checkMod()
      // }
      if(this.moderator) {
        this.groupService.getUserGroups();
      }
    })

    this.user = JSON.parse(localStorage.getItem('user'))

    //Variable to get groups of a user so we can load the groups he is moderator from
    this.userGroupsSub = this.groupService.groupsFromUserUpdated.subscribe(userGroups => {
      this.userGroups = userGroups
      this.checkMod()

    })
    this.groupService.getGroups();
    this.groupService.getUserGroups();

  }

  checkMod() {
    //First check if the role of the user is not 3 or 4
    if(this.user.roleId !== 3 && this.user.roleId !== 4) {
      //this.groupService.getUserGroups();
      //Check if we found any groups of the user and filter so we only get groups where he is moderator
      if(this.userGroups.length > 0) {
        this.userGroups =  this.userGroups .filter(x => x.groupModerator === true);
        if(this.userGroups.length > 0) {
          this.moderatorEdit = true;
          this.moderator = true;
          this.groups = [];
          this.userGroups.forEach(group => {
            this.groups.push(group.group)
          })

        } else {
          this.router.navigate(['/company/home'])
          this.toastr.error("Sorry, you aren't in a group with moderator permissions!")
        }
      } else {
        this.router.navigate(['/company/home'])
        this.toastr.error("Sorry, you aren't in a group with moderator permissions!")
      }
    }
    this.loadingUserGroup = false;
  }

  editModerator(moderatorEdit) {
    if(moderatorEdit == true) {
      this.moderatorEdit = false;
    } else {
      this.moderatorEdit = true;
    }

  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
    // this.editGroupSub.unsubscribe();
    this.userGroupsSub.unsubscribe();
  }

  manageGroup(groupId: number) {
    console.log(groupId)
  }

  deleteGroup(group) {
    this.groupService.deleteGroup(group);
  }

  editGroup(group) {
    this.groupService.sendSelectedItem(group);
    }

}
