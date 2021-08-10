import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss']
})
export class CommentCreateComponent implements OnInit {
  @Input() postId: number;
  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  //Create a comment
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.postService.createComment(this.postId, form.value.body)
      form.resetForm();

    }
  }

}
