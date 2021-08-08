import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/group/group.service';
import { Group } from 'src/app/models/group.model';
import { GroupUser } from 'src/app/models/groupUser.model';
import { Like } from 'src/app/models/like.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../post.service';
import { Comment } from "src/app/models/comment.model";
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  //Subscriptions
  postSub: Subscription;
  groupSub: Subscription;
  groupUsersSub: Subscription;

  groupId: number;
  group: Group;
  posts: Post[];
  groupUsers: GroupUser[];
  groupUser: GroupUser;
  user: User;
  //infinite loading variables
  throttle = 50;
  scrollDistance = 0.8;
  scrollUpDistance = 2;

  //Paginiation
  currentPage = 1;
  pageSize = 10;

  //EditMode
  editPostNumber: number;

  loadingGroup: boolean = true;
  loadingGroupUsers: boolean = true;
  loadingPosts: boolean = true;

  calls: number = 0;
  routerSubscription: Subscription;
  constructor(private route: ActivatedRoute, private postService: PostService, private groupService: GroupService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log("INITIALIZING POSTS")
    //Get the groupId from our URL
    this.groupId = +this.route.snapshot.paramMap.get('groupId');

    //Get the user from JSON, easier than setting up another subscription
    this.user = JSON.parse(localStorage.getItem('user'));

    //Get our group information
    this.groupSub = this.groupService.groupUpdated.subscribe(group => {
      this.group = group;
      if(this.group) {
        this.loadingGroup = false
      }
      document.documentElement.style.setProperty('--theme-color', this.group.themeColor);
    })

    //Get the posts from this group
    this.postSub = this.postService.postsUpdated.subscribe(posts => {
      this.posts = posts
      if(this.posts) {
        this.loadingPosts = false
      }
      this.editPostNumber = null;
    })

    //If our user isn't an super admin or moderator, if he has a groupUser record it means he is allowed to be here.
    this.groupUsersSub = this.groupService.groupsFromUserUpdated.subscribe(groupUsers => {
      this.groupUsers = groupUsers;
      if(this.groupUsers) {
        this.loadingGroupUsers = false
      }

      //We get an array of groups of this user. Check if he has a record for this group.
      this.groupUser = this.groupUsers.find(x => x.group.groupId === this.groupId);

      //If users doesn't pass this check he isn't allowed to be here.
      if(this.user.roleId !== 4 && this.user.roleId !==3 && !this.groupUser) {
        this.router.navigate(['/company/home'])
        this.toastr.error("Sorry access denied, send a request to watch the posts of group")
      }

      if(this.groupId) {
        this.routerSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
          const newId = +this.route.snapshot.paramMap.get('groupId')
          if(this.groupId !== newId){
            this.groupId = newId;
            this.onRouteChanged()
          }
        }
          )
      }
    })




    //All the calls we need to load the information needed.
    this.postService.getPosts(this.groupId, this.pageSize, this.currentPage)
    this.groupService.getGroup(this.groupId);
    this.groupService.getUserGroups();
  }

  onRouteChanged() {

    this.currentPage = 1;
    this.postService.clearPosts();
    this.postService.getPosts(this.groupId, this.pageSize, this.currentPage)
    this.groupService.getGroup(this.groupId);
    this.groupService.getUserGroups();
  }

  //Function to get more posts on scroll down.
  onScrollDown() {
    this.currentPage++;
    this.postService.getPosts(this.groupId, this.pageSize, this.currentPage)
  }



  //This is an event that comes from our edit component so we know to change the edit layout to a normal post.
  stopEditing() {
    this.editPostNumber = null;
  }

  //If we click on edit we send this variable to the edit component so it knows it is editting not creating.
  editMode(post: Post) {
    this.editPostNumber = post.postId
  }

  //Check if user is allowed to edit/delete something
  checkPermissions(userId: number) {
    if(this.user.userID === userId || this.user.roleId === 3 || this.user.roleId === 4) {
      return true;
    } else {
      if(this.groupUser) {
        if(this.groupUser.groupModerator){
          return true;
        }
        return false;
      } else {
        return false;
      }
    }
  }

  checkModeratorRequest() {
    if(this.groupUser){
      if(this.groupUser.moderatorRequest)
      {
        return true;
      } else {
        return false;
      }
    }
    else {
      return false;
    }


  }

  //Like a post
  likePost(post: Post) {
    if(this.checkIfLiked(post.likes)) {
      const like: Like = post.likes.find(x => x.userId == this.user.userID)
      this.postService.deleteLike(like);
    } else {
      this.postService.createLike(this.user, post.postId)
    }
  }

  //Check if our user has liked the post that is displaying in the list
  checkIfLiked(postLikes) {
    if(postLikes.length > 0) {
      if(this.groupUsers) {
        if(postLikes.find(x => x.userId == this.user.userID)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }

  }

  //Delete a comment
  removeComment(comment: Comment) {
    this.postService.deleteComment(comment);
  }

  //Delete a post
  deletePost(post: Post){
    this.postService.deletePost(post);
  }

  //Request moderator
  requestModerator(){
    this.groupService.updateGroupUser(this.groupUser, false, this.groupId, true).subscribe(response => {
      this.groupService.getUserGroups();
    })
  }

  //Clear our posts and destroy all subscriptions
  ngOnDestroy() {
    this.postService.clearPosts();
    this.groupSub.unsubscribe();
    this.postSub.unsubscribe();
    this.groupUsersSub.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

}
