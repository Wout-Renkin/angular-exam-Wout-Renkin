import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/company/company-create/mime-type.validator';
import { GroupService } from 'src/app/group/group.service';
import { Group } from 'src/app/models/group.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit, OnDestroy{
  form: FormGroup;
  imagePreview: string;
  group: Group;
  groupSub: Subscription;
  postSub: Subscription;
  post: Post;
  loading: boolean;

  //Input variables we get from the post-list
  @Input() groupId: number;
  @Input() postId: number;

  //Tell list we stopped editting
  @Output() stopEditing: EventEmitter<number> = new EventEmitter();

  //Needed for reset
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(private postService: PostService, private groupService: GroupService) { }

  ngOnInit(): void {
    //Initiate form
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'body': new FormControl(null,  {validators: [Validators.required, Validators.minLength(3)]}),
      'imagePath': new FormControl(null, {asyncValidators: [mimeType]})
    })

    //If we have a post Id from the @input we get the post and set values
    if(this.postId) {
      this.loading = true;
      this.postSub = this.postService.getPost(this.postId).subscribe(post => {
        this.post = post;
        this.loading = false;
        this.form.setValue({
          title: this.post.title,
          body: this.post.body,
          imagePath: this.post.imagePath,
        })
        if(this.post.imagePath != "null") {
          this.imagePreview = this.post.imagePath;
        }
      }
      )
    }
  }

  //Depending on edit or create we use different function
  onCreatePost() {
    if (this.form.invalid) {
      return;
    } else {
      if(this.post){
        this.postService.updatePost( this.post, this.form.value);
      } else {
        this.postService.createPost(this.form.value, this.groupId);
        this.clearForm();
      }

    }
  }

  //Press on cancel and we reset and clear the form. We emit an event telling the post-list that we stopped editting
  cancelEdit() {
    this.post = null;
    this.clearForm();
    this.stopEditing.emit(null);
  }

  //Remove the image
  removeImage() {
    this.form.patchValue({imagePath: null})
    this.imagePreview = null;

  }

  //Clear form function
  clearForm() {
    this.formGroupDirective.resetForm();
    this.imagePreview = null;
  }


  onImagePicked(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];
    //patchvalue -> target a single value of the form
    this.form.patchValue({imagePath: image});
    //validate the image inserted in the image form
    this.form.get('imagePath').updateValueAndValidity();
    //create file reader
    const reader = new FileReader();
    //if it is done reading i want to save the result as a string in imagePreview
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    //Load the file
    reader.readAsDataURL(image)
  }

  //Remove subs
  ngOnDestroy() {
    if(this.post) {
      this.postSub.unsubscribe();
    }
  }

}
