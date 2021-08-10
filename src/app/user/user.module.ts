import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule,} from "@angular/forms"
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from '../angular-material.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
@NgModule({
    declarations: [
      UserComponent,
      UserListComponent
        ],
    imports: [
        CommonModule,
        AngularMaterialModule,
    ]

})
export class UserModule {

}