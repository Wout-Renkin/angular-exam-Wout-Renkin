import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule,} from "@angular/forms"
import { RouterModule } from "@angular/router";
import { AngularMaterialModule } from '../angular-material.module';
import { GroupListComponent } from './group-list-manage/group-list.component';
import { GroupEditComponent } from './group-edit-manage/group-edit.component';
import { GroupDetailComponent } from './group-detail-manage/group-detail.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
    declarations: [
        GroupListComponent,
        GroupEditComponent,
        GroupDetailComponent
        ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        RouterModule,
        ReactiveFormsModule,
        ColorPickerModule,

    ]

})
export class GroupModule {

}