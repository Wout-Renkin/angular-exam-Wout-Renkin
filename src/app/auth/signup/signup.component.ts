import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  user: User;
  isEditing: boolean = false;

  constructor(public authService: AuthService, private router:Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    //Check if user is logged in. Check if the path contains /profile/edit, if so we allow the user to edit, else we redirect.
    this.user = JSON.parse(localStorage.getItem('user'))
    if(this.router.url === "/profile/edit" && this.user) {
      this.isEditing = true;


    } else {
      if(this.user){
        this.toastr.error("You are already logged in, if you want to create a second account please logout first.")
        this.router.navigate(['/'])
      }
    }

  }

  onSignup(form: NgForm){
    //Depending if the user is editing or not we use updateUser or createUser in our service
    if (form.invalid) {
      return;
    } else {
      if(this.isEditing) {
        this.authService.updateUser(form.value.email, form.value.firstName, form.value.lastName)
        this.isEditing = false;
        this.router.navigate(['/'])
      } else {
        this.authService.createUser(form.value.email, form.value.password, form.value.firstName, form.value.lastName);

      }
    }
    }
}
