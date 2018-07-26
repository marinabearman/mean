import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable() // have to have injectable // keep empty in this case

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        const authToken = this.authService.getToken();

        // clone before you manipulate it because of the way requests are handled

        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + authToken)
        })

        return next.handle(authRequest);
    }
}