import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'company-social-media';
  constructor(private authService: AuthService){}
  user: User = null;
  userSubscription: Subscription;

  ngOnInit() {
    //Since this is the first component to load we check if the user is authenticated
    this.authService.checkIfAuthenticated();
    //Not sure if I need this
    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }




}
