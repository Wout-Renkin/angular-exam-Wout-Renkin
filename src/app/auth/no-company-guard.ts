import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CompanyService } from "src/app/company/company.service";

@Injectable()
export class NoCompanyGuard implements CanActivate{
  constructor(private companyService: CompanyService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const check = this.companyService.hasCompany();
    if (!check) {
      return true;
    } else {
      return this.router.createUrlTree(['/company/home']);
    }

   }


}
