import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { CompanyService } from "../company/company.service";
import { User } from "../models/user.model";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: "root"})
export class AuthService {
  //Token variable, used to authenticate with the backend
  private token: string;

  //Our authenticated user
  private authUser: User;

  //Our user subscription
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router){}

  //Simple create user function
  createUser (email: string, password: string, firstName: string, lastName: string) {
    console.log("CREATE USER API CALL")
    const authData: AuthData = {email: email, password: password, firstname: firstName, lastname: lastName, roleId: 1, companyId: null };
    this.http.post("https://localhost:44348/api/User", authData).subscribe(response => {
      //If we succesfully registered our user we redirect to the login page.
      this.router.navigate(['/login'])
    })
  }

  login(email: string, password: string) {

    console.log("AUTHENTICATE API CALL")

    this.http.post<any>("https://localhost:44348/api/User/Authenticate", {email: email, password: password}).subscribe(response => {

      //If we get a user as respond it means login is succesfull
      if(User) {
        //Create a user object
        const user = new User(response.userID, response.email, response.firstName, response.lastName, response.roleID, response.companyId, response.token)
        console.log(response)
        //Set our token
        this.token = response.token;
        this.authUser = user;
        //Let listeners know a user is logged in
        this.user.next(user);
        //Add user to local storage
        localStorage.setItem('user', JSON.stringify(user));
        // this.authStatusListener.next(true);
        // this.isAuthenticated = true;
        // localStorage.setItem('token', token);
        this.router.navigate(['/'])
      }
    })
  }

  //Function used to update a users role
  updateUserRole(roleId: number, companyId: number) {

    console.log("UPDATE USER ROLE API CALL")

    //We get our authenticated user
    this.authUser = this.user.value;

    //We set the new companyId and userRole
    this.authUser.companyId = companyId;
    this.authUser.roleId = roleId;

    //We update the user with the new data
    this.http.put("https://localhost:44348/api/User/" + this.user.value.userID, this.authUser).subscribe(response => {

      //Broadcast our new changes and overwrite the localstorage user
      this.user.next(this.authUser);
      localStorage.setItem('user', JSON.stringify(this.user.value));


    })
  }

  getToken () {
    return this.token;
  }



  checkIfAuthenticated () {

    //Automated login
    if (localStorage.getItem('user')) {
      //We check if the user has a user in localstorage, if yes we update our values and broadcast it to all services
      this.user.next(JSON.parse(localStorage.getItem('user')));
      this.authUser = JSON.parse(localStorage.getItem('user'));
    }
  }



  logout () {
    //Logout the user
    console.log("User logged out")
    //Remove the user from localstorage
    this.clearAuthData();
    //Let listeners know the user changed
    this.user.next(null);
    this.authUser = null;

    //Navigate to login page if user logged out.
    this.router.navigate(['/login'])
  }

  clearAuthData() {
    //Delete user from localstorage
    localStorage.removeItem('user');
  }
}
