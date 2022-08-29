import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthenticationService } from "../../../services/authentication.service" 
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  user_form!: FormGroup;
  passLength: boolean = false;
  @Output() signInResObj = new EventEmitter<any>();
  signinSubscription!: Subscription;
  constructor(private authService:AuthenticationService) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.user_form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  get userEmail(){
    return this.user_form.get('email');
  }
  get userPassword(){
    return this.user_form.get('password');
  }

  onSubmit(): void {
    if(!this.user_form.valid){
      return;
    }
   let value = this.user_form.value;
    this.signinSubscription = this.authService.signInPopup(value).subscribe({
      next:(res:any)=>{
        localStorage.setItem("userId", res.user._id);
        localStorage.setItem("authToken", res.token);
        localStorage.setItem("authUser",JSON.stringify(res.user));
        this.authService.users = this.authService.getUser(res.token);
        this.authService.setAuthentication(true);
        this.authService.openSnackBar("Login Successful", 'success', true);
        let obj = {
          response : res,
          status : true
        }
        this.signInResObj.emit(obj);
        // 
      },
      error:(error)=>{
        this.authService.openSnackBar(error.error.message.MESSAGE, 'Danger', false);
        let obj = {
          response : error,
          status : false
        }
        this.signInResObj.emit(obj);
        // this.dialogRef.close({data: "failure" });
      },
      complete:()=>{
      }
    });
  }

  onConfirmPassword(){
    setTimeout(() => {
      if(this.user_form.value.password.length > 3 && this.user_form.value.password.length < 6){
        this.passLength = false
      } 
    }, 10);
  }

  ngOnDestroy(){
    this.signinSubscription.unsubscribe();
  }

}
