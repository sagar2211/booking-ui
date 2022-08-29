import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { AuthenticationService } from "../../../services/authentication.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPwdSubscription!: Subscription;
  constructor(private authService: AuthenticationService, private _snackBar: MatSnackBar, public router: Router) { }

  forgot_password_form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  ngOnInit(): void { }

  onSubmit(): void {
    if(!this.forgot_password_form.valid){
      return;
    }
    let value = this.forgot_password_form.value;
    this.forgotPwdSubscription = this.authService.forgotPassword(value).subscribe({
      next:(data:any)=>{
        if(data.TYPE=="error"){
          this.openSnackBar(data.MESSAGE, 'Danger', false);
        } else {
          this.openSnackBar(data.MESSAGE, 'success', true);
          this.router.navigate(["/user/login"]);
        }
      },
      error: (error) => {
        this.openSnackBar(error, 'Danger', false);
      }
    })
  }

  get userEmail(){
    return this.forgot_password_form.get('email');
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ['success-snackbar'] : ['danger-snackbar']
    });
  }

  ngOnDestroy(): void {
    this.forgotPwdSubscription.unsubscribe();
  }
}
