import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService, private router:Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    //Check if user is already logged in, redirect if logged in.
    if(JSON.parse(localStorage.getItem('user'))){
      this.toastr.error("You are already logged in!")
      this.router.navigate(['/'])
    }
  }

  onLogin(form: NgForm){
    //Check if form is invalid, if it is valid login.
    if (form.invalid) {
      return;
    } else {
      this.authService.login(form.value.email, form.value.password);
    }
  }

}
