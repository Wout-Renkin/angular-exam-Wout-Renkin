import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { GroupUser } from 'src/app/models/groupUser.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-employee-list',
  templateUrl: './group-employee-list.component.html',
  styleUrls: ['./group-employee-list.component.css']
})
export class GroupEmployeeListComponent implements OnInit, OnDestroy{
  groupSub: Subscription;
  groupsFromUser: GroupUser[];
  allGroupsSub: Subscription;
  allGroups: Group[];
  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupSub = this.groupService.groupsFromUserUpdated.subscribe(groupsFromUser => {
      this.groupsFromUser = groupsFromUser;
    }
    )
    this.allGroupsSub = this.groupService.groupsUpdated.subscribe(groups => {
      this.allGroups = groups;
      this.allGroups.forEach(obj => {
        if(this.groupsFromUser) {
          var group = this.groupsFromUser.find(x => x.group.groupId == obj.groupId)
          if(group) {
            this.allGroups.splice(obj.groupId, 1)
          }
        }

       });
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

  sendJoinRequest(group: Group) {
    this.groupService.addRequestToGroup(group);
  }



  ngOnDestroy() {
    this.groupSub.unsubscribe();
    this.allGroupsSub.unsubscribe();
  }

}
