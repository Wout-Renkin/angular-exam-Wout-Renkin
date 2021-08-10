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

  groupSub: Subscription;
  userGroupsSub: Subscription;
  editGroupSub: Subscription;
  
  groups: Group[] = [];
  userGroups: GroupUser[];
  user: User;
  moderatorEdit: boolean = false;
  moderator: boolean = false;
  loadingGroup: boolean = true;
  loadingUserGroup: boolean = true;

  constructor(private groupService: GroupService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    //Get all our groups
    this.groupSub = this.groupService.groupsUpdated.subscribe(groups => {
      this.groups = groups;
      this.loadingGroup = false;

      //If user is a moderator we get the userGroups too
      //I call this here since if I change something in the group this will be called and we would display all groups
      //this way I check everything again
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
      //Check if we found any groups of the user and filter so we only get groups where he is moderator
      //If the person is not a moderator of anything we redirect away from here
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

  //Emit event from edit component this way we know if we should show the edit component
  editModerator(moderatorEdit) {
    if(moderatorEdit == true) {
      this.moderatorEdit = false;
    } else {
      this.moderatorEdit = true;
    }

  }

  //Delete a group
  deleteGroup(group) {
    this.groupService.deleteGroup(group);
  }

  //Edit a group
  editGroup(group) {
    this.groupService.sendSelectedItem(group);
    }

  //Destroy subscriptions
  ngOnDestroy() {
    this.groupSub.unsubscribe();
    this.userGroupsSub.unsubscribe();
  }

}
