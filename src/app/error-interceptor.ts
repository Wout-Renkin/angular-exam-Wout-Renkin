import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { ErrorService } from "./error/error.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred!";
        if(error.status === 403 || error.status === 401) {
          errorMessage = "Sorry you don't have the permission to do this!"
        } else {
          if (error.error.message) {
            errorMessage = error.error.message;
          }
        }

        this.errorService.throwError(errorMessage);
        return throwError(error);
      })
    );
  }
}
