import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AuthenticationService } from "../../../services/authentication.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as error_messages_data from "../../../../assets/json/message.json";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LocalService } from "src/app/services/local.service";
import { Subscription } from "rxjs";
import {
  SearchCountryField,
  CountryISO
} from "ngx-intl-tel-input";
@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  @Output() signUpResObj = new EventEmitter<any>();
  user_form: FormGroup;
  passMatch = false;
  news = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  constructor(
    private authService: AuthenticationService,
    private local: LocalService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.user_form = this.formBuilder.group({
      prefix: new FormControl("", [Validators.required]),
      firstName: new FormControl("", [Validators.required]),
      middleName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      mobile: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(""),
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      // newsLetter: new FormControl(true),
    });
  }

  ngOnInit(): void {
    let errorMsgData = JSON.stringify(error_messages_data);
    let error_messages = JSON.parse(errorMsgData);
  }

  onSubmit(): void {
    let user_form = this.user_form.value;

    if (!this.user_form.valid || this.passMatch === false) {
      return;
    }
    this.authService.signUp(this.user_form.value).subscribe({
      next: (data: any) => {
        if (data.type == "error" || data.message.type == "error") {
          this.openSnackBar(data.message, "Danger", false);
        } else {
          this.openSnackBar(data.message, "success", true);
          let obj = {
            response : data,
            status : true
          }
          this.signUpResObj.emit(obj)
        }
      },
      error: (error) => {
        this.openSnackBar(error, "Danger", false);
      },
    });
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ["success-snackbar"] : ["danger-snackbar"],
    });
  }

  onConfirmPassword() {
    setTimeout(() => {
      if (
        this.user_form.value.confirmPassword.length > 3 &&
        this.user_form.value.password !== this.user_form.value.confirmPassword
      ) {
        this.passMatch = false;
      } else if (
        this.user_form.value.confirmPassword.length > 3 &&
        this.user_form.value.password === this.user_form.value.confirmPassword
      ) {
        this.passMatch = true;
      }
    }, 10);
  }
}
