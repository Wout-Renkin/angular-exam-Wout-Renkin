import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Company } from "../models/company.model";
import { User } from "../models/user.model";
import { ToastrService } from 'ngx-toastr';


@Injectable({providedIn: "root"})
export class CompanyService {

  company = new BehaviorSubject<Company>(null);
  authSub: Subscription;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private toastr: ToastrService){}



  //Create a new company
  createCompany (company: Company) {
    const companyData = new FormData();
    for ( var key in company ) {
      companyData.append(key, company[key]);
  }

    this.http.post<any>("https://localhost:44348/api/Company", companyData).subscribe(response => {
      //We save the company in a temporary variable.
      //We save it in our company subscription (broadcast it to listeners that are interested)
      const saveCompany =  new Company(response.companyId, response.name, response.city, response.street, response.streetNumber, response.description, response.color, response.backgroundColor, response.imagePath);
      this.company.next(saveCompany);

      //Since we created a company we want to update the user with the companyId and the superadmin role
      this.authService.updateUserRole(4, response.companyId)

      const updateUser: User = JSON.parse(localStorage.getItem('user'));
      updateUser.companyId = response.companyId;
      localStorage.setItem('user', JSON.stringify(updateUser));

      this.toastr.success('Company successfully created!');


      //redirect to /company
      this.router.navigate(["/company/home"])
    })
  }

  updateCompany(company: Company, companyId: number) {
    const companyData = new FormData();
    for ( var key in company ) {
      companyData.append(key, company[key]);
  }
  companyData.append("companyId", companyId.toString())

    this.http.put<any>("https://localhost:44348/api/company/" + companyId, companyData).subscribe(() => {
      this.router.navigate(["company/home"])
      this.toastr.success('Company successfully updated!');

    }
    )

  }


  //Function to get the company of the user
  getCompany (id: number) {
    this.http.get<any>("https://localhost:44348/api/Company/" + id).subscribe(response => {
      const saveCompany = new Company(response.companyId, response.name, response.city, response.street, response.streetNumber, response.description, response.backgroundColor, response.color, response.imagePath);

      //Broadcast the company to the listeners
      this.company.next(saveCompany);
    })
  }

  hasCompany() {
    const check: User = JSON.parse(localStorage.getItem('user'))
    if(!check.companyId) {
      return false;
    } else {
      return true;
    }
  }

  clearCompany() {
    this.company.next(null);
  }


}
