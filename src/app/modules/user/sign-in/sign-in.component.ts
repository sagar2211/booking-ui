import { BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from "@angular/forms";
import { BreakPointTracker } from 'src/app/_helpers/breakPointTracker.component';
import { AuthenticationService } from "../../../services/authentication.service" 
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  isBelowLg: boolean = true ;

  user_form!: FormGroup;
  passLength: boolean = false;
  passwordType = "password";
  constructor(private authService:AuthenticationService,private BTracker: BreakPointTracker,private changeDetector:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.createForm();

    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });
    this.changeDetector.detectChanges()
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

  changePasswordType(){
    if(this.passwordType === "password"){
      this.passwordType = "search";
    } else if(this.passwordType === "search"){
      this.passwordType = "password";
    }
  }

  onSubmit(): void {
    if(!this.user_form.valid){
      return;
    }
   let value = this.user_form.value;
    this.authService.signIn(value);
  }

  onConfirmPassword(){
    setTimeout(() => {
      if(this.user_form.value.password.length > 3 && this.user_form.value.password.length < 6){
        this.passLength = false
      } 
    }, 10);
  }
}
