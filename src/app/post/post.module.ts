import { NgModule } from "@angular/core";
import { PostListComponent } from './post-list/post-list.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { CommentCreateComponent } from './comment-create/comment-create.component';
import { AngularMaterialModule } from '../angular-material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule,} from "@angular/forms"
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [
        PostListComponent,
        EditPostComponent,
        CommentCreateComponent,
        ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        InfiniteScrollModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
    ]

})
export class PostModule {

}