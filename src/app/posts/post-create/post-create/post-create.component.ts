import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId:string;
  public post: Post;
  isLoading = false;

  constructor(public postService: PostService, public route:ActivatedRoute){}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postService.getPost(this.postId).subscribe(postsData=>{ 
          this.isLoading = false                   
          this.post = {id:postsData.posts.id,title:postsData.posts.title,content: postsData.posts.content}          
        })

      }else{
        this.mode = 'create'
      }
    });
  }
  onSavePost(form:NgForm){
    if(form.invalid) return;
    this.isLoading = true;
    if(this.mode === 'edit'){
      this.postService.updatePost(this.postId,form.value.title,form.value.content);
      form.resetForm();
    }else{
      this.postService.addPost(form.value.title,form.value.content);
      form.resetForm();
    }
    

  }
}
