import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { GroupUser } from 'src/app/models/groupUser.model';
import { User } from 'src/app/models/user.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-employee-list',
  templateUrl: './group-employee-list.component.html',
  styleUrls: ['./group-employee-list.component.scss']
})
export class GroupEmployeeListComponent implements OnInit, OnDestroy{
  groupSub: Subscription;
  groupsFromUser: GroupUser[];
  allGroupsSub: Subscription;
  allGroups: Group[];
  user: User;
  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    //Basically we have two calls here, we get all the groups and all the groups of the user
    //If we are SuperAdmin or Moderator we will just have a list with all the groups
    //If not we will have 3 seperate lists, to get this result we first get all the groups of the user
    //Then we get all the groups of the company. We remove all groups that the user has from the company groups
    //Then we display the company groups in a list, a list with the user groups and a list with group requests
    this.user = JSON.parse(localStorage.getItem('user'))
    if(this.user.roleId !== 3 && this.user.roleId !== 4){
      this.groupSub = this.groupService.groupsFromUserUpdated.subscribe(groupsFromUser => {
        this.groupsFromUser = groupsFromUser;
      }
      )
    }

    //We get all the groups here and remove the ones the user is part off
    this.allGroupsSub = this.groupService.groupsUpdated.subscribe(groups => {
      this.allGroups = groups;
      if(this.user.roleId !== 3 && this.user.roleId !== 4){
        this.allGroups.forEach(obj => {
          if(this.groupsFromUser) {
            var group = this.groupsFromUser.find(x => x.group.groupId == obj.groupId)
            if(group) {
              this.allGroups.splice(obj.groupId, 1)
            }
          }
         }
         );
      }
    })
    this.groupService.getGroups();
    this.groupService.getUserGroups();
  }

  checkIfUserHasGroup(id: number) {
    if(this.groupsFromUser) {
      if(this.groupsFromUser.find(x => x.group.groupId == id)) {
        return true;
      }
    return false
  }
    return false

  }

  //Send a request to join a group
  sendJoinRequest(group: Group) {
    this.groupService.addRequestToGroup(group);
  }


  //Destroy subscriptions
  ngOnDestroy() {
    if(this.groupSub) {
      this.groupSub.unsubscribe();
    }
    this.allGroupsSub.unsubscribe();
  }

}
