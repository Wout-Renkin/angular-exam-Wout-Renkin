import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth-guard";
import { CompanyGuard } from "./auth/company-guard";
import { LoginComponent } from "./auth/login/login.component";
import { NoCompanyGuard } from "./auth/no-company-guard";
import { SignupComponent } from "./auth/signup/signup.component";
import { SuperAdminGuard } from "./auth/superAdmin-guard";
import { CompanyCreateComponent } from "./company/company-create/company-create.component";
import { CompanyHomeComponent } from "./company/company-home/company-home.component";
import { CompanyComponent } from "./company/company.component";
import { NoCompanyComponent } from "./company/no-company/no-company.component";
import { GroupDetailComponent } from "./group/group-detail-manage/group-detail.component";
import { GroupListComponent } from "./group/group-list-manage/group-list.component";
import { PostListComponent } from "./post/post-list/post-list.component";
import { UserComponent } from "./user/user.component";

const routes: Routes = [
  {path: '', redirectTo: '/company/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'profile/edit', component: SignupComponent},
  {path: 'company', component: CompanyComponent,
  canActivate:[AuthGuard],
  children: [
    {path: 'new', component: CompanyCreateComponent, canActivate:[NoCompanyGuard]},
    {path: 'users', component: UserComponent, canActivate:[SuperAdminGuard]},
    {path: 'nocompany', component: NoCompanyComponent},
    {path: 'home', component: CompanyHomeComponent, canActivate:[CompanyGuard]},
    {path: 'edit/:companyId', component: CompanyCreateComponent, canActivate:[SuperAdminGuard]},
    {path: 'group', component: GroupListComponent},
    {path: 'group/manage/:groupId', component: GroupDetailComponent},
    {path: 'group/home/:groupId', component: PostListComponent}
  ]},
  {path:'**', redirectTo: '/company/home'},
]

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, CompanyGuard, SuperAdminGuard, NoCompanyGuard]
})
export class AppRoutingModule {

}
