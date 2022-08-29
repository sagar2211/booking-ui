import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from "@angular/forms";
import { AuthenticationService } from "../../../services/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  user_form:FormGroup
  passMatch: boolean = true;
  changPwdSubscription!: Subscription;
  constructor(private authService: AuthenticationService,private route: ActivatedRoute,
    private router: Router, public formBuilder: FormBuilder, private _snackBar:MatSnackBar) {
      this.user_form = this.formBuilder.group({
        email: new FormControl("",[
          Validators.required,
          Validators.email
        ]),
        current_password: new FormControl("", [
          Validators.required
        ]),
        newPassword: new FormControl("", [
          Validators.required, Validators.minLength(6),
          Validators.pattern("")
        ]),
        confirmPassword: new FormControl("", [
          Validators.required,
          Validators.minLength(6)
        ])
      });
     }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(!this.user_form.valid || this.passMatch === false){
      return;
    }
      this.changPwdSubscription = this.authService.changePassword(this.user_form.value).subscribe({
        next:(data:any)=>{
        if(data.TYPE=="error"){
          this.openSnackBar(data.MESSAGE, 'Danger', false);
        }else{
          this.router.navigate(["/search/searchFlight"], { relativeTo: this.route });
          this.openSnackBar(data.MESSAGE, 'success', true);
        }},
        error:(error)=>{
          this.openSnackBar(error, 'Danger', false);
        }
      })
  }

  get userEmail(){
    return this.user_form.get('email');
  }

  onConfirmPassword(){
    setTimeout(() => {
      if(this.user_form.value.confirmPassword.length > 3 &&  this.user_form.value.newPassword !== this.user_form.value.confirmPassword){
        this.passMatch = false
      } else if(this.user_form.value.confirmPassword.length > 3 &&  this.user_form.value.newPassword === this.user_form.value.confirmPassword){
        this.passMatch = true
      }
    }, 10);
  }
  
  openSnackBar(message: string, action: string, status:boolean){
    this._snackBar.open(message, action,{
      duration: 3000,
      panelClass: status===true?['success-snackbar']:['danger-snackbar']
    });
  }

  // ngOnDestroy(): void {
  //   this.changPwdSubscription.unsubscribe();
  // }

}