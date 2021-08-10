import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularMaterialModule } from '../angular-material.module';
import { NoCompanyComponent } from './no-company/no-company.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { CompanyComponent } from './company.component';
import { CompanyCreateComponent} from './company-create/company-create.component';
import { ReactiveFormsModule} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GroupEmployeeListComponent } from '../group/group-employee-list/group-employee-list.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    declarations: [
        NoCompanyComponent,
        CompanyHomeComponent,
        CompanyCreateComponent,
        CompanyComponent,
        GroupEmployeeListComponent,
        ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ColorPickerModule,
    ]

})
export class CompanyModule {

}