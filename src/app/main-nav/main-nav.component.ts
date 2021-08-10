import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Company } from '../models/company.model';
import { AuthService } from '../auth/auth.service';
import { CompanyService } from '../company/company.service';
import { GroupUser } from '../models/groupUser.model';
import { GroupService } from '../group/group.service';
import { Group } from '../models/group.model';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy{
  //We listen if we found a user and a company and save them in variables
  private userSub: Subscription;
  private companySub: Subscription;
  private userGroupSub: Subscription;
  user: User;
  company: Company = null;
  userGroups: GroupUser[];
  groups: Group[];
  moderator: boolean = false;

  //This variable is used in the template to show options to authenticated users.
  isAuthenticated = false;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private companyService: CompanyService, private groupService: GroupService) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    //Subscription to company so we can change header if values from company change
    this.companySub = this.companyService.company.subscribe(company => {
      this.company = company;
    });

    //We get the user, user object sometimes changes
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
      //Check if authenticated
      this.isAuthenticated = !!user;
      //If we found a user we will check if he has a company
      //If so we get the company and check for the role of the user
      //If SuperAdmin or Moderator we show all groups in the sidebar
      //If not we show the groups of the user.
      //Depending on if the user has a moderator role in any of these groups we show the manage groups link
      if(this.user) {
        this.isAuthenticated = true;
        if(this.user.companyId){
          this.companyService.getCompany(this.user.companyId);
          if(this.user.roleId !== 3 && this.user.roleId !== 4) {
            this.userGroupSub = this.groupService.groupsFromUserUpdated.subscribe(groups => {
              this.userGroups = groups;
              if (groups.some(e => e.groupModerator === true)) {
                this.moderator = true;
              }
            })
            this.groupService.getUserGroups();
          } else {
            this.userGroupSub = this.groupService.groupsUpdated.subscribe(groups => {
              this.groups = groups

            })
            this.groupService.getGroups();
          }
      }
      } else {
        this.userGroups = null;
        this.groups = null;
      }
    })



   }

   onLogout(){
    //Logout function
    this.authService.logout();
    this.companyService.clearCompany();
  }

  ngOnDestroy() {
    //Unsubscribe from everything to prevent memory leaks.
    this.companySub.unsubscribe();
    this.userSub.unsubscribe();
    if(this.userGroupSub) {
      this.userGroupSub.unsubscribe();
    }
  }

  //Created by angular material
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


}
