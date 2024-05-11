import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts:Post[]= []
  private postUpdated = new Subject<{posts:Post[],postCount:number}>()
  public baseUrl = 'http://localhost:4000/api/posts'

  constructor( private http:HttpClient, private router:Router){}
  getPosts(postsPerPage:number,currentPage:number){
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`
    this.http
    .get<{message:string,posts:Post[],maxPosts:number}>(this.baseUrl + queryParams)
    .subscribe(transformedPostData=>{
      this.posts = transformedPostData.posts;
      this.postUpdated.next({
        posts:[...this.posts],
        postCount:transformedPostData.maxPosts
      });
    });
  }
  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }
getPost(id:string){
  return this.http.get<{message:string,posts:Post}>(this.baseUrl+"/"+id)
}

  addPost(title:string,content:string,image:File){
    const postData = new FormData();
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image,title)
    this.http.post<{message:string,post:Post}>(this.baseUrl, postData)
    .subscribe((resData)=>{
      this.router.navigate(['/'])
    })
  }
  
  updatePost(id: string, title:string, content:string, image:File | string){
    let postData:Post | FormData;
    if(typeof(image)==='object'){
       postData = new FormData();
       postData.append("id",id)
       postData.append("title",title);
       postData.append("content",content);
       postData.append("image",image,title);
    }else{
      postData = {
        id:id,
        title:title,
        content:content,
        imagePath:image
      }
    }
  this.http.put(this.baseUrl+"/"+id, postData)
    .subscribe((response)=>{
        this.router.navigate(['/']);
    })
  }

  deletePost(postId:string){
    return this.http.delete(this.baseUrl+"/"+postId)
    
  }
}



