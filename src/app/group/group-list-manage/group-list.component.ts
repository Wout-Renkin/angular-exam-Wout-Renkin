import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit, OnDestroy {
  groups: Group[] = [];
  groupSub: Subscription;

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupService.getGroups();
    this.groupSub = this.groupService.groupsUpdated.subscribe(groups => {
      this.groups = groups;
    })
  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
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
