import { NgModule } from "@angular/core";
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule,} from "@angular/forms"
import { RouterModule } from "@angular/router";
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
        ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
    ]

})
export class AuthModule {

}