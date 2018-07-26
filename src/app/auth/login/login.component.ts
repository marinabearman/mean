import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service"
import { Subscription } from "rxjs";
@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    private authStatusSub: Subscription;
    isLoading = false;

    constructor(public authService: AuthService) { }

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }
    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
    onLogin(form: NgForm) {
        //console.log(form.value)
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.login(form.value.email, form.value.password);
    }

}