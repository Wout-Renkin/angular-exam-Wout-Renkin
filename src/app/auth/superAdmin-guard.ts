import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";
import { CompanyService } from "src/app/company/company.service";
import { User } from "../models/user.model";

@Injectable()
export class SuperAdminGuard implements CanActivate{
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const user: User = JSON.parse(localStorage.getItem('user'))
    if (user.roleId === 4) {
      return true;
    } else {
      return this.router.createUrlTree(['/company/home']);
    }

   }


}
