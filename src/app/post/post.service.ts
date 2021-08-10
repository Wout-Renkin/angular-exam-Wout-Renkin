import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { Post } from "src/app/models/post.model";
import { User } from "../models/user.model";
import { Like } from "../models/like.model";
import { Comment } from "../models/comment.model";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;


@Injectable({providedIn: "root"})
export class PostService {
  post: Post;
  posts: Post[];
  postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  //Function to get all posts
  getPosts(groupId, pageSize: number, currentPage: number) {
   return this.http.get<any>(BACKEND_URL + "/Post/group/" + groupId,  {params: {pageSize: pageSize, currentPage: currentPage}})
    .subscribe(response => {
      if(this.posts) {
        //Concat because we use infinite loader, we add our posts to the other posts
        this.posts = this.posts.concat(response);
      } else {
        this.posts = response
      }
      this.postsUpdated.next([...this.posts])
    })
  }

  //Update a post
  updatePost(oldPost: Post, updatePost: any) {
    const postData = new FormData();
    for ( var key in oldPost ) {
      postData.append(key, oldPost[key]);
    }

    postData.set("title", updatePost.title);
    postData.set("body", updatePost.body);
    postData.set("imagePath", updatePost.imagePath);

    this.http.put<any>(BACKEND_URL + "/Post/" + oldPost.postId, postData).subscribe(
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

  //Create a post
  createPost (post: any, groupId: number) {

    const postData = new FormData();
    const user: User = JSON.parse(localStorage.getItem('user'));

    postData.append("title", post.title)
    postData.append("body", post.body)
    postData.append("imagePath", post.imagePath)
    postData.append("companyId", user.companyId.toString());
    postData.append("userId", user.userID.toString());
    postData.append("groupId", groupId.toString());

    this.http.post<any>(BACKEND_URL + "/Post", postData).subscribe(response => {
      this.posts = null;
      this.getPosts(groupId, 5, 1);
      this.toastr.success("You've successfully create a post!");
    })
  }

  //Get a specific post
  getPost(postId) {
    return this.http.get<Post>(BACKEND_URL + "/Post/" + postId);
  }

  //Like a post
  createLike(user: User, postId:number) {
    this.http.post<any>(BACKEND_URL + "/Like",  {userId: user.userID, postId: postId}).subscribe(response => {
      const like: Like = response;
      like.user = user;
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === postId);
      updatedPosts[oldPostIndex].likes.push(like);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've liked a post of " + updatedPosts[oldPostIndex].user.firstName);
    })
  }

  //Remove a like
  deleteLike(like: Like) {
    this.http.delete<any>(BACKEND_URL + "/Like/" + like.likeId).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === like.postId)
      const indexOfLike = updatedPosts[oldPostIndex].likes.findIndex(x => x.likeId === like.likeId)
      updatedPosts[oldPostIndex].likes.splice(indexOfLike, 1)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've disliked a post of " + updatedPosts[oldPostIndex].user.firstName);
    })
  }

  //Remove posts, we need this when we switch to another group we don't want to append to the previous group posts
  clearPosts() {
    this.posts = null;
    this.postsUpdated.next(this.posts);
  }

  //Delete a comment
  deleteComment(comment: Comment) {
    this.http.delete<any>(BACKEND_URL + "/Comment/" + comment.commentId).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === comment.postId)
      const indexOfComment = updatedPosts[oldPostIndex].comments.findIndex(x => x.commentId === comment.commentId)
      updatedPosts[oldPostIndex].comments.splice(indexOfComment, 1)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've removed a comment!");
    })
  }

  //Create a comment
  createComment(postId, body:string) {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.http.post<any>(BACKEND_URL + "/Comment", {body: body, postId: postId, userId: user.userID}).subscribe(response => {
      const comment: Comment = response;
      comment.user = user;
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === postId);
      updatedPosts[oldPostIndex].comments.push(comment);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've added a comment!");
    })
  }

  //Delete a post
  deletePost(post: Post) {
    this.http.delete<any>(BACKEND_URL + "/Post/" + post.postId).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === post.postId);
      updatedPosts.splice(oldPostIndex, 1)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've delete a post from: " + post.user.firstName + " " + post.user.lastName);
    })
  }

}
