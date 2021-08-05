import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { group } from "@angular/animations";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { first, map } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { Post } from "src/app/models/post.model";
import { User } from "../models/user.model";
import { Company } from "../models/company.model";


@Injectable({providedIn: "root"})
export class PostService {
  post: Post;
  posts: Post[];
  postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  getPosts(groupId, pageSize: number, currentPage: number) {
   return this.http.get<any>("https://localhost:44348/api/Post/group/" + groupId,  {params: {pageSize: pageSize, currentPage: currentPage}})
    .subscribe(response => {
      console.log("GETTIN MORE POSTS")
      console.log(response)
      if(this.posts) {
        this.posts = this.posts.concat(response);
      } else {
        this.posts = response
      }
      this.postsUpdated.next([...this.posts])
    })
  }

  updatePost(oldPost: Post, updatePost: any) {
    const postData = new FormData();
    for ( var key in oldPost ) {
      postData.append(key, oldPost[key]);
    }

    postData.set("title", updatePost.title);
    postData.set("body", updatePost.body);
    postData.set("imagePath", updatePost.imagePath);



    this.http.put<any>("https://localhost:44348/api/Post/" + oldPost.postId, postData).subscribe(
      response => {
        oldPost.title = updatePost.title;
        oldPost.body = updatePost.body;
        oldPost.imagePath = response.imagePath
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.postId === oldPost.postId);
        updatedPosts[oldPostIndex] = oldPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.toastr.success("You've successfully updated a post!");
      }
    )
  }

  createPost (post: any, groupId: number) {

    const postData = new FormData();
    const user: User = JSON.parse(localStorage.getItem('user'));

    postData.append("title", post.title)
    postData.append("body", post.body)
    postData.append("imagePath", post.imagePath)
    postData.append("companyId", user.companyId.toString());
    postData.append("userId", user.userID.toString());
    postData.append("groupId", groupId.toString());

    this.http.post<any>("https://localhost:44348/api/Post", postData).subscribe(response => {
      this.post = response;
      this.post.user = new User(user.userID, user.email, user.firstName, user.lastName, user.roleId, user.companyId, null);
      this.posts.unshift(response);
      this.postsUpdated.next([...this.posts])
      this.toastr.success("You've successfully create a post!");
    })
  }


  getPost(postId) {
    return this.http.get<Post>("https://localhost:44348/api/Post/" + postId);
  }

}
