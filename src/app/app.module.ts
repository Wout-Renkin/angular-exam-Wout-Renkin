import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyCreateComponent} from './company/company-create/company-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ColorPickerModule } from 'ngx-color-picker';
import { CompanyComponent } from './company/company.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { NoCompanyComponent } from './company/no-company/no-company.component';
import { CompanyHomeComponent } from './company/company-home/company-home.component';
import { GroupListComponent } from './group/group-list-manage/group-list.component';
import { GroupEditComponent } from './group/group-edit-manage/group-edit.component';
import { GroupDetailComponent } from './group/group-detail-manage/group-detail.component';
import { ToastrModule } from 'ngx-toastr';
import { GroupEmployeeListComponent } from './group/group-employee-list/group-employee-list.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { EditPostComponent } from './post/edit-post/edit-post.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommentCreateComponent } from './post/comment-create/comment-create.component';
import {AngularMaterialModule} from './angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    CompanyCreateComponent,
    SignupComponent,
    LoginComponent,
    CompanyComponent,
    MainNavComponent,
    UserComponent,
    UserListComponent,
    NoCompanyComponent,
    CompanyHomeComponent,
    GroupListComponent,
    GroupEditComponent,
    GroupDetailComponent,
    GroupEmployeeListComponent,
    PostListComponent,
    EditPostComponent,
    CommentCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule,
    ColorPickerModule,
    LayoutModule,
    ToastrModule.forRoot(),
    InfiniteScrollModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},],
  bootstrap: [AppComponent]
})
export class AppModule { }
