import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { ErrorService } from "./error.service";

@Component({
  templateUrl: "./error.component.html",
  selector: "app-error",
  styleUrls: ["./error.component.scss"]
})
export class ErrorComponent implements OnInit, OnDestroy {
  //Our error
  error: string;

  //Check if we have to show our html
  hasError: boolean = false;

  //Subscriptopn
  private errorSub: Subscription;

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    //We subscribe to the error listener, if so we display message for 5 seconds
    this.errorSub = this.errorService.errorListener.subscribe(message => {
      if(message) {
        this.error = message;
        this.hasError = true;
        setTimeout(() => {
          this.onHandleError();
          this.hasError = false;
        }, 5000);
      }

    });
  }

  onHandleError() {
    //Delete the orror
   this.errorService.handleError();
  }

  //Destroy subscription
  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

}
