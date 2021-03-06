import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { User } from 'src/app/models/user.model';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.scss']
})
export class CompanyHomeComponent implements OnInit, OnDestroy{
  private companySub: Subscription;
  company: Company;
  user: User;

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {

    //We get the user, subscribe to the company and get the company so we can display it.
    this.user = JSON.parse(localStorage.getItem('user'))

    this.companyService.getCompany(this.user.companyId)

    this.companySub = this.companyService.company.subscribe(company => {
      this.company = company;
    })
  }

  //Destroy subscription
  ngOnDestroy() {
    this.companySub.unsubscribe();
  }

}
