import { Component,OnDestroy,OnInit } from '@angular/core';
import { Subscription } from 'rxjs'
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = []; 
  private subsribe!: Subscription;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10]
  constructor(private postService:PostService){}
  ngOnInit(): void {
    this.isLoading = true
      this.postService.getPosts(this.postPerPage,this.currentPage)
      this.subsribe =  this.postService.getPostUpdateListener().subscribe((
        postsData:{posts:Post[],
          postCount:number
        })=>{
        this.isLoading = false;
        this.posts = postsData.posts;
        this.totalPosts = postsData.postCount
      });
  }

  onChangePage(pageData:PageEvent){
    console.log(pageData);
    
    this.isLoading = true
    this.currentPage = pageData.pageIndex +1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage,this.currentPage)
    
  }

  onDelete(postId:string){
    this.isLoading = true
    this.postService.deletePost(postId).subscribe(()=>{
      this.postService.getPosts(this.postPerPage,this.currentPage)
    })
    console.log("Deleted");
    
  }

  ngOnDestroy(): void {
      this.subsribe.unsubscribe();
  }
}
