import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";
import { CompanyService } from "src/app/company/company.service";

@Injectable()
export class CompanyGuard implements CanActivate{
  constructor(private companyService: CompanyService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const check = this.companyService.hasCompany();
    console.log(check)
    if (check) {
      console.log("Company found")
      return true;
    } else {
      console.log("No company found")
      return this.router.createUrlTree(['/company/nocompany']);
    }

   }


}
