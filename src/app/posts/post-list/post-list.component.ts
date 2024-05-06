import { Component,OnDestroy,OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = []; 
  private subsribe!: Subscription;
  isLoading = false;
  constructor(private postService:PostService){}
  ngOnInit(): void {
    this.isLoading = true
      this.postService.getPosts()
      this.subsribe =  this.postService.getPostUpdateListener().subscribe((posts:Post[])=>{
        this.isLoading = false;
        this.posts = posts
        console.log(this.posts)
      });
  }

  onDelete(postId:string){
    this.postService.deletePost(postId);
    console.log("Deleted");
    
  }

  ngOnDestroy(): void {
      this.subsribe.unsubscribe();
  }
}
