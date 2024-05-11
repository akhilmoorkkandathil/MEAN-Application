import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from 'express';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private authService:AuthService, private router: Router){}
  onSignup(form:NgForm){
    if(form.invalid) return
    this.authService.createUser(form.value.username,form.value.email,form.value.password,form.value.confirmpassword)
    
  }
}
