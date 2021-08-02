import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Group } from "../models/group.model";
import { GroupUser } from "../models/groupUser.model";
import { User } from "../models/user.model";



@Injectable({providedIn: "root"})
export class GroupService {
  user: User;
  groups: Group[] = [];
  groupsUpdated = new Subject<Group[]>();
  private groupUsers: GroupUser[] = [];
  groupUsersUpdated = new Subject<{groupUsers: GroupUser[], userCount: number}>();

  constructor(private http: HttpClient, private router: Router, private authService: AuthService){}

  getGroups() {
    const user: User = JSON.parse(localStorage.getItem('user'))
    if(user.companyId) {
      this.http.get<any>("https://localhost:44348/api/Group/company/" + user.companyId)
      //I want to change the data bit so we call the pipe function
      .pipe(
        //We want to transform the data so we first call a map function
        map( response => {
          //Response is a list of groups so we call map on it so we can modify every object we received and we return the end result
          return response.map(group => {
            //We transform the individual group object and return it
            return {
              groupId: group.groupId,
              name: group.name
            }
          }
          )

      })
      )
      .subscribe(response => {
        this.groups = response;
        this.groupsUpdated.next([...this.groups])
      })
    }
  }

  addUserToGroup(groupUser: GroupUser, groupId: number) {
    groupUser.id = null;
    groupUser.groupModerator = false;
    groupUser.moderatorRequest = false;
    groupUser.groupRequest = false;

    return this.http.post<any>("https://localhost:44348/api/GroupUser/",
    {
      moderator: groupUser.groupModerator,
      requestedModerator: groupUser.moderatorRequest,
      groupRequest: groupUser.moderatorRequest,
      userId: groupUser.user.userID,
      groupId: groupId,
      companyId: this.user.companyId
    })
  }

  deleteGroupUser(groupUserId: number) {
    return this.http.delete("https://localhost:44348/api/GroupUser/" + groupUserId)
  }


  updateGroupUser(groupUser: GroupUser, moderator: boolean = false, groupId: number) {

      if(moderator) {
        groupUser.groupModerator = true;
        groupUser.moderatorRequest = false;
      } else {
        groupUser.groupModerator = false
        groupUser.moderatorRequest = false;
      }

    return this.http.put("https://localhost:44348/api/GroupUser/" + groupUser.id, {
      GroupUserId: groupUser.id,
      moderator: groupUser.groupModerator,
      requestedModerator: groupUser.moderatorRequest,
      groupRequest: groupUser.moderatorRequest,
      userId: groupUser.user.userID,
      groupId: groupId,
      companyId: this.user.companyId
    });
  }

  getGroupUsers(groupId: number, pageSize: number, currentPage: number, selectedValue: string, filter: string) {
    let nonMembers: boolean = false;
    let moderator: boolean = false;
    let groupRequests: boolean = false;
    let moderatorRequests: boolean = false;
    switch(selectedValue) {
      case "nonMembers":
        console.log("filter on not members")
        nonMembers = true;
        break;
      case "moderators":
        moderator = true;
        break;
      case "groupRequests":
        console.log("filter on group requests")
        groupRequests = true;
        break;
      case "moderatorRequests":
        console.log("filter on Moderator requests")
        moderatorRequests = true;
        break;
      default:
        console.log("filter on group members")
        break;
    }


    this.user = JSON.parse(localStorage.getItem('user'))
    this.http.get<any>("https://localhost:44348/api/GroupUser/" + groupId + "/" + this.user.companyId,
    {params:
      {
        pageSize: pageSize,
        currentPage:currentPage,
        filter: filter,
        notInGroup: nonMembers,
        requestedModerator: moderatorRequests,
        moderator: moderator,
        groupRequest: groupRequests
      }})
      .pipe(
      map (response => {
        const responseUsers =
       response.users.map(response => {
         if(nonMembers) {
          return {
            id: null,
            groupModerator: null,
            moderatorRequest:null,
            groupRequest: null,
            user: {
              userID: response.userID,
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
              roleId: response.roleID,
              companyId: response.companyID,
              _token: response.token,
           }
          }
         } else {
          return {
            id: response.groupUserId,
            groupModerator: response.moderator,
            moderatorRequest: response.requestedModerator,
            groupRequest: response.groupRequest,
            user: {
              userID: response.user.userID,
              email: response.user.email,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              roleId: response.user.roleID,
              companyId: response.user.companyID,
              _token: response.user.token,
           }
          }
         }

       })
       const totalUsers = response.totalUsers;
       return {responseUsers, totalUsers}
      })
      ).subscribe(
      response => {
        this.groupUsers = response.responseUsers
        this.groupUsersUpdated.next({groupUsers: [...this.groupUsers], userCount: response.totalUsers})
      }
    )
  }




}
