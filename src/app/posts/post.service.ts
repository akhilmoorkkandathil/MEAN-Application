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
  private postUpdated = new Subject<Post[]>()
  baseUrl = 'http://localhost:3000/api/posts'

  constructor( private http:HttpClient, private router:Router){}
  getPosts(){
    this.http
    .get<{message:string,posts:Post[]}>(this.baseUrl)
    .subscribe(transformedPosts=>{
      this.posts = transformedPosts.posts;
      this.postUpdated.next([...this.posts]);
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
      const newPost:Post = {
        id:resData.post.id,
        title:title,
        content:content,
        imagePath:resData.post.imagePath
      }
      const postID = resData.post.id
      newPost.id = postID
      this.posts.push(newPost);
      this.postUpdated.next([...this.posts])
      this.router.navigate(['/'])
    })
  }
  
  updatePost(id: string, title:string, content:string){
    const post:Post = {id:id,title:title,content:content,imagePath:null}
    this.http.put(this.baseUrl+"/"+id, post)
    .subscribe((response)=>{
        const updatedPosts = [...this.posts];
        const oldePostIndex = updatedPosts.findIndex(p=>p.id === post.id);
        updatedPosts[oldePostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
    })
  }

  deletePost(postId:string){
    this.http.delete(this.baseUrl+"/"+postId)
    .subscribe(()=>{
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
      
    })
  }
}



