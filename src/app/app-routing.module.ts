import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth-guard";
import { CompanyGuard } from "./auth/company-guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { CompanyCreateComponent } from "./company/company-create/company-create.component";
import { CompanyHomeComponent } from "./company/company-home/company-home.component";
import { CompanyComponent } from "./company/company.component";
import { NoCompanyComponent } from "./company/no-company/no-company.component";
import { GroupDetailComponent } from "./group/group-detail-manage/group-detail.component";
import { GroupEditComponent } from "./group/group-edit-manage/group-edit.component";
import { GroupListComponent } from "./group/group-list-manage/group-list.component";
import { PostListComponent } from "./post/post-list/post-list.component";
import { UserComponent } from "./user/user.component";

const routes: Routes = [
  {path: '', redirectTo: '/company/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'company', component: CompanyComponent,
  canActivate:[AuthGuard],
  children: [
    {path: 'new', component: CompanyCreateComponent},
    {path: 'users', component: UserComponent},
    {path: 'nocompany', component: NoCompanyComponent},
    {path: 'home', component: CompanyHomeComponent, canActivate:[CompanyGuard]},
    {path: 'edit/:companyId', component: CompanyCreateComponent},
    {path: 'group', component: GroupListComponent},
    {path: 'group/manage/:groupId', component: GroupDetailComponent},
    {path: 'group/home/:groupId', component: PostListComponent}
  ]},
]

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, CompanyGuard]
})
export class AppRoutingModule {

}
