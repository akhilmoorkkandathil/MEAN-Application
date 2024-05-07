import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../../post.model';
import { Title } from '@angular/platform-browser';

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
  imagePreview:string;

  form:FormGroup;

  constructor(public postService: PostService, public route:ActivatedRoute){}
  ngOnInit(): void {
    this.form = new FormGroup({
      'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      'content': new FormControl(null,{validators:[Validators.required,Validators.minLength(4)]}),
      'image': new FormControl(null,{validators:[Validators.required]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postService.getPost(this.postId).subscribe(postsData=>{ 
          this.isLoading = false                   
          this.post = {
            id:postsData.posts.id,
            title:postsData.posts.title,
            content: postsData.posts.content,
            imagePath:null
          };
          this.form.setValue({
            title: this.post.title,
            content:this.post.content
          })
        })

      }else{
        this.mode = 'create'
      }
    });
  }
  onImagePick(event:Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSavePost(){
    if(this.form.invalid) return;
    this.isLoading = true;
    if(this.mode === 'edit'){
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }else{
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    

  }
}
