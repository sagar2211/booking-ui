import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
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
import { MatDialog } from "@angular/material/dialog";
import {
  SearchCountryField,
  CountryISO
} from "ngx-intl-tel-input";
import { BreakPointTracker } from "src/app/_helpers/breakPointTracker.component";
import { BreakpointState } from "@angular/cdk/layout";
@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  user_form: FormGroup;
  passMatch = false;
  passwordType = "password";
  news = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;

  isBelowLg: boolean = true ;
  
  constructor(
    private authService: AuthenticationService,
    private local: LocalService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private BTracker: BreakPointTracker,
    private changeDetector:ChangeDetectorRef
  ) {
    this.user_form = this.formBuilder.group({
      prefix: ["", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      mobile: ["", Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$")]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
      newsLetter: [true, Validators.required],
      termAndCondition: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    let errorMsgData = JSON.stringify(error_messages_data);
    let error_messages = JSON.parse(errorMsgData);
    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });
    this.changeDetector.detectChanges()
  }

  get f() {
    return this.user_form.controls;
  }

  onSubmit(): void {
    let user_form = this.user_form.value;

    if (this.user_form.valid === false || this.passMatch === false || this.user_form.value.termAndCondition === false) {
      return;
    }
    this.authService.signUp(this.user_form.value).subscribe({
      next: (data: any) => {
        if (data.type == "error" || data.message.type == "error") {
          this.openSnackBar(data.message, "Danger", false);
        } else {
          this.openSnackBar(data.message, "success", true);
          let newsLetterObj = {
            firstname: user_form.firstName,
            lastname: user_form.lastName,
            email: user_form.email,
            mobile: user_form.mobile,
            interest: ["Flights", "Hotels", "Activities"],
          };
          if (user_form.newsLetter) {
            this.local.setSubscription(newsLetterObj).subscribe({
              next: (response: any) => {
                if (
                  response.Result.TYPE === "success" &&
                  response.Result.data
                ) {
                  this.router.navigate(["/user/login"], {
                    relativeTo: this.route,
                  });
                }
              },
              error: (error) => {
                this.openSnackBar(error, "Danger", false);
              }
            });
          } else {
            this.router.navigate(["/user/login"], {
              relativeTo: this.route,
            });
          }
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

  // openTermPopup() {
  //   const dialogRef = this.dialog.open(TermConditionComponent, {});

  //   dialogRef.afterClosed().subscribe((result) => {
  //     // if(result.data)
  //     // this.travellers = result.data;
  //   });
  // }

  changePasswordType() {
    if (this.passwordType === "password") {
      this.passwordType = "search";
    } else if (this.passwordType === "search") {
      this.passwordType = "password";
    }
  }
}
