import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './models/user.model';
import { ErrorService } from './error/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CSM Group';
  constructor(private authService: AuthService, private errorService: ErrorService){}
  user: User = null;
  userSubscription: Subscription;
  errorSubscription: Subscription;
  errorMessage: boolean = false;
  ngOnInit() {
    //Since this is the first component to load we check if the user is authenticated
    this.authService.checkIfAuthenticated();


  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
  }




}
