import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './signup/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token:string;
  constructor( private http:HttpClient) { }

getToken(){
  return this.token;
}
  createUser(username:string,email:string,password:string,confirmpassword:string){
    const authDate:AuthData = {
      username:username,
      email:email,
      password:password,
      confirmpassword:confirmpassword
    }
    this.http.post<{token:string}>("http://localhost:4000/api/user/signup", authDate)
    .subscribe(response=>{
      const token = response.token;
      this.token = token;
      
    })
  }

  loginUser(email:string,password:string){
    const authDate:{email:string,password:string}= {
      email:email,
      password:password
    }
    this.http.post("http://localhost:4000/api/user/login", authDate)
    .subscribe(response=>{
      
      
    })


  }
}
