import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor( private dialog: MatDialog ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        //handle gives us the response observable stream and we can hook into it and listen to events
        return next.handle(req).pipe(
            //adding error to stream
            catchError((error: HttpErrorResponse) => {
                // console.log(error);
                let errorMessage = "An unknown error occurred!";
                if (error.error.message) {
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorComponent, {data: { message: errorMessage} });
                return throwError(error);
            })
        );
    }
}