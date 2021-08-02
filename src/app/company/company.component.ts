import { Component, ComponentFactoryResolver, OnDestroy, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Company } from "../models/company.model";
import { User } from "../models/user.model";
import { CompanyService } from "./company.service";

@Component({
  selector: 'app-company-create',
  templateUrl:'./company.component.html',
  styleUrls: ['./company.component.css']

})
export class CompanyComponent implements OnInit, OnDestroy{
  private companySub: Subscription;
  public isAuthenticated = false;

  user: User;
  company: Company;
  constructor(private authService: AuthService,private router: Router) {}
  ngOnInit() {

    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      this.company = null;
    })
  }

  ngOnDestroy() {
  }

}
