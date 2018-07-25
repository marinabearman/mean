import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service"

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    constructor(public authService: AuthService) {}
    isLoading = false;

    onLogin(form: NgForm){
        //console.log(form.value)
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.login(form.value.email, form.value.password);
    }

}