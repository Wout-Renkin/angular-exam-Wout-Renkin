import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/group/group.service';
import { Group } from 'src/app/models/group.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  groupId: number;
  group: Group;
  groupSub: Subscription;
  posts: Post[];
  postSub: Subscription;
  throttle = 50;
  scrollDistance = 0.8;
  scrollUpDistance = 2;
  currentPage = 1;
  pageSize = 10;
  editPostNumber: number;


  constructor(private route: ActivatedRoute, private postService: PostService, private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupId = +this.route.snapshot.paramMap.get('groupId');

    this.groupSub = this.groupService.groupUpdated.subscribe(group => {
      this.group = group;
    })

    this.postSub = this.postService.postsUpdated.subscribe(posts => {
      this.posts = posts
      this.editPostNumber = null;
    })
    this.postService.getPosts(this.groupId, this.pageSize, this.currentPage)
    this.groupService.getGroup(this.groupId);

    this.changeTheme('red', 'blue')


  }

  changeTheme(primary: string, secondary: string) {
    console.log("changing styles")
    document.documentElement.style.setProperty('--primary-color', primary );
    document.documentElement.style.setProperty('--secondary-color', secondary);
  }

  onScrollDown() {
    this.currentPage++;
    this.postService.getPosts(this.groupId, this.pageSize, this.currentPage)
  }

  stopEditing() {
    this.editPostNumber = null;
  }

  editMode(post: Post) {
    this.editPostNumber = post.postId
  }

  onScrollUp() {

  }
}
