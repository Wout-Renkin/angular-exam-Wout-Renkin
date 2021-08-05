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
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit, OnDestroy{
  form: FormGroup;
  imagePreview: string;
  group: Group;
  groupSub: Subscription;
  post: Post;
  @Input() groupId: number;
  @Input() postId: number;
  @Output() stopEditing: EventEmitter<number> = new EventEmitter();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(private postService: PostService, private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupSub = this.groupService.groupUpdated.subscribe(group => {
      this.group = group;
    })

    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'body': new FormControl(null,  {validators: [Validators.required, Validators.minLength(3)]}),
      'imagePath': new FormControl(null, {asyncValidators: [mimeType]})
    })

    if(this.postId) {
      this.postService.getPost(this.postId).subscribe(post => {
        this.post = post;
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

  cancelEdit() {
    this.post = null;
    this.clearForm();
    this.stopEditing.emit(null);
  }
  removeImage() {
    this.form.patchValue({imagePath: null})
    this.imagePreview = null;

  }

  clearForm() {
    this.formGroupDirective.resetForm();
    // this.form.reset();
    // this.form.markAsPristine();
    // this.form.markAsUntouched();
    // this.form.updateValueAndValidity();
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

  ngOnDestroy() {
    this.groupSub.unsubscribe();
  }

}
