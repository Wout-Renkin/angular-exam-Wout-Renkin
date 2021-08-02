import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Company } from '../models/company.model';
import { AuthService } from '../auth/auth.service';
import { CompanyService } from '../company/company.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, OnDestroy{
  //We listen if we found a user and a company and save them in variables
  private userSub: Subscription;
  private companySub: Subscription;
  user: User;
  company: Company;

    //This variable is used in the template to show options to authenticated users.
    isAuthenticated = false;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private companyService: CompanyService) {}

  ngOnInit(): void {


    this.userSub = this.authService.user.subscribe(user => {

     //If user is null, authenticated is false else it is true.
     this.isAuthenticated = !!user;

     //We save our user.
     this.user = user;

     //If the user isn't null we check for a companyId, if the company id is found we load the found company.
     if(user) {
       if(user.companyId) {
        this.companyService.getCompany(user.companyId);
       }
     }
     //If we didn't find a user, the company is null.
     else {
       this.company = null;
     }

    })

    //Subscription to company so we can change header if values from company change
    this.companySub = this.companyService.company.subscribe(company => {
      this.company = company;
    });


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
  }


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


}
