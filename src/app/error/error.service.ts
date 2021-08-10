import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ErrorService {

  //Error listener, our error component will listen to this
  errorListener = new Subject<string>();

  //Send message to component
  throwError(message: string) {
    this.errorListener.next(message);
  }

  //Remove error
  handleError() {
    this.errorListener.next(null);
  }
}
