import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Company } from "../models/company.model";
import { User } from "../models/user.model";


@Injectable({providedIn: "root"})
export class CompanyService {

  company = new BehaviorSubject<Company>(null);
  authSub: Subscription;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService){}



  //Create a new company
  createCompany (company: Company) {
    const companyData = new FormData();
    for ( var key in company ) {
      companyData.append(key, company[key]);
  }

    this.http.post<any>("https://localhost:44348/api/Company", companyData).subscribe(response => {
      console.log("POST COMPANY API CALL")
      //We save the company in a temporary variable.
      //We save it in our company subscription (broadcast it to listeners that are interested)
      const saveCompany =  new Company(response.companyId, response.name, response.city, response.street, response.streetNumber, response.description, response.color, response.backgroundColor, "https://localhost:44348/" + response.imagePath);
      this.company.next(saveCompany);

      //Since we created a company we want to update the user with the companyId and the superadmin role
      this.authService.updateUserRole(4, response.companyId)

      const updateUser: User = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify(updateUser));



      //redirect to /company
      this.router.navigate(["company/home"])
    })
  }

  updateCompany(company: Company, companyId: number) {
    console.log(company)
    const companyData = new FormData();
    for ( var key in company ) {
      companyData.append(key, company[key]);
  }
  companyData.append("companyId", companyId.toString())
    this.http.put<any>("https://localhost:44348/api/company/" + company.id, companyData)

  }


  //Function to get the company of the user
  getCompany (id: number) {
    console.log("GET COMPANY API CALL")
    this.http.get<any>("https://localhost:44348/api/Company/" + id).subscribe(response => {
      const saveCompany = new Company(response.companyId, response.name, response.city, response.street, response.streetNumber, response.description, response.color, response.backgroundColor, "https://localhost:44348/" + response.imagePath);

      //Broadcast the company to the listeners
      this.company.next(saveCompany);
    })
  }

  hasCompany() {
    const check: User = JSON.parse(localStorage.getItem('user'))
    console.log(check.companyId)
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
