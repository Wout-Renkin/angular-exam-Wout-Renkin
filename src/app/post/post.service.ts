import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { Post } from "src/app/models/post.model";
import { User } from "../models/user.model";
import { Like } from "../models/like.model";
import { Comment } from "../models/comment.model";



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
      if(this.posts) {
        this.posts = this.posts.concat(response);
      } else {
        this.posts = response
      }
      console.log("doing this twice ...")
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
      this.posts = null;
      this.getPosts(groupId, 5, 1);
      this.toastr.success("You've successfully create a post!");
    })
  }


  getPost(postId) {
    return this.http.get<Post>("https://localhost:44348/api/Post/" + postId);
  }

  createLike(user: User, postId:number) {
    this.http.post<any>("https://localhost:44348/api/Like",  {userId: user.userID, postId: postId}).subscribe(response => {
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

  deleteLike(like: Like) {
    this.http.delete<any>("https://localhost:44348/api/Like/" + like.likeId).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === like.postId)
      const indexOfLike = updatedPosts[oldPostIndex].likes.findIndex(x => x.likeId === like.likeId)
      updatedPosts[oldPostIndex].likes.splice(indexOfLike, 1)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've disliked a post of " + updatedPosts[oldPostIndex].user.firstName);
    })
  }

  clearPosts() {
    this.posts = null;
    this.postsUpdated.next(this.posts);
  }

  deleteComment(comment: Comment) {
    this.http.delete<any>("https://localhost:44348/api/Comment/" + comment.commentId).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === comment.postId)
      const indexOfComment = updatedPosts[oldPostIndex].comments.findIndex(x => x.commentId === comment.commentId)
      updatedPosts[oldPostIndex].comments.splice(indexOfComment, 1)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've removed a comment!");
    })
  }

  createComment(postId, body:string) {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.http.post<any>("https://localhost:44348/api/Comment", {body: body, postId: postId, userId: user.userID}).subscribe(response => {
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

  deletePost(post: Post) {
    this.http.delete<any>("https://localhost:44348/api/Post/" + post.postId).subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.postId === post.postId);
      updatedPosts.splice(oldPostIndex, 1)
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.toastr.success("You've delete a post from: " + post.user.firstName + " " + post.user.lastName);
    })
  }

}
