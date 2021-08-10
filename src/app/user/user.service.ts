import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import {  map } from "rxjs/operators";
import { User } from "../models/user.model";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: "root"})
export class UserService {
  private users: User[] = [];
  usersUpdated = new Subject<{users: User[], userCount: number}>();
  roleId: number;
  companyId: number;

  constructor(private http: HttpClient, private router: Router){}

  //Get all users with filters
  getUsers (pageSize: number, currentPage: number, selectedValue: string, filter: string) {

    const loggedInUser: User = JSON.parse(localStorage.getItem('user'))

    switch(selectedValue) {
      case "Employees":
        this.roleId = 2
        this.companyId = loggedInUser.companyId;
        break;
      case "Moderators":
        this.roleId = 3
        this.companyId = loggedInUser.companyId;
        break;
      default:
        this.roleId = 1
        this.companyId = 0;
        break;
    }
    this.http.get<{users: any; totalUsers: number}>( BACKEND_URL + "/User/users", {params: {roleId: this.roleId, pageSize: pageSize, currentPage: currentPage, filter: filter, companyId: this.companyId}}).pipe(
      map(response => {
        const loadedUsers = response.users.map(user => {
          return {
          userID: user.userID,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          companyId: user.companyId,
          _token: user.token
        }
        })
        const totalUsers = response.totalUsers;
        return {totalUsers, loadedUsers}
      })
    ).subscribe(transformedData => {
      this.users = transformedData.loadedUsers;
      this.usersUpdated.next({users: [...this.users], userCount: transformedData.totalUsers})

    })
  }

  //Update an user (Adding to company or change role)
  updateUser(user: User, moderator: boolean = false, removed: boolean = false) {

    const loggedInUser: User = JSON.parse(localStorage.getItem('user'))
    user.companyId = loggedInUser.companyId;

    if (removed) {
      user.roleId = 1;
      user.companyId = null;
    } else {
      if(moderator) {
        console.log("upgrading to moderator")
        user.roleId = 3;
      } else {
        user.roleId = 2;
      }
    }

    return this.http.put( BACKEND_URL + "/User/" + user.userID, user);
  }

}
