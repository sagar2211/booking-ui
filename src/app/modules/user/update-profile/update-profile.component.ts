import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AuthenticationService } from "src/app/services/authentication.service";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { URL } from "../../../../environments/environment";
import { AddUserInfoPopupComponent } from "../add-user-info-popup/add-user-info-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { AddTravellerComponent } from "../../traveller/add-traveller/add-traveller.component";
import moment from "moment";
import { Router } from "@angular/router";

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: "app-update-profile",
  templateUrl: "./update-profile.component.html",
  styleUrls: ["./update-profile.component.scss"],
  providers: []
})

export class UpdateProfileComponent implements OnInit, AfterContentChecked {
  profileForm!: FormGroup;
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === "month") {
      const date = cellDate.getDate();
      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? "example-custom-date-class" : "";
    }
    return "";
  };
  progress = 0;
  editProfileForm = false;
  userInfo: any;
  submitted = false;
  maxDate: any;
  minDate: any;
  passMatch = false;
  selectedFiles: any;
  profilePic!: any;
  isValidImg = true;
  clicked = 0;
  constructor(
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
    this.maxDate = this.minDate = new Date();
    this.getUserInfo();
    this.showProgress();
  }

  ngAfterContentChecked(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    let data: any = localStorage.getItem("authUser");
    this.userInfo = JSON.parse(data);
    if (this.userInfo.image_name)
      this.profilePic = `${URL + "/image/" + this.userInfo.image_name}`;
  }

  cancelEdit() {  
    this.editProfileForm = false;
  }

  showProgress() {
    this.progress = 0;
    if (this.userInfo.email.length !== 0) {
      this.progress = this.progress + 15;
    }
    if (this.userInfo.mobile.length !== 0) {
      this.progress = this.progress + 15;
    }
    if (this.profilePic !== undefined) {
      this.progress = this.progress + 20;
    }
    if (this.userInfo.firstName.length !== 0, this.userInfo.lastName.length !== 0, this.userInfo.middleName.length !== 0) {
      this.progress = this.progress + 30;
    }
    if (this.userInfo.dateOfBirth !== null) {
      this.progress = this.progress + 10;
    }
    if (this.userInfo.gender !== null) {
      this.progress = this.progress + 10;
    }
  }

  onSubmit() {
    this.submitted = true;
    const userId = this.authService.getUserId();
    this.authService.updateUser(userId, this.profileForm.value, this.selectedFiles)
      .subscribe({
        next: (res) => {
          if (res.TYPE !== "error") {
            this.profilePic = res.result.image_name;
            localStorage.setItem("authUser", JSON.stringify(res.result));
            this.openSnackBar("Update Successful", "Success", true);
            this.getUserInfo();
            this.editProfileForm = false;
          } else {
            this.openSnackBar(res.MESSAGE, "Danger", false);
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

  selectFiles(event: any) {
    this.selectedFiles = event.target.files;
    const file: File = event.target.files[0];
    if (
      file.type == 'image/png' ||
      file.type == 'image/jpeg' ||
      file.type == 'image/x-png'
    ) {
      this.isValidImg = true;
    } else {
      this.isValidImg = false;
    }

    const userId = this.authService.getUserId();
    this.authService.updateProfile(userId, this.selectedFiles).subscribe({
      next: (res: any) => {
        if (res.status !== "error") {
          this.profilePic = res.image_name;
          localStorage.setItem("authUser", JSON.stringify(res.result));
          this.openSnackBar(res.response, "Success", true);
          this.getUserInfo();
          this.editProfileForm = false;
          this.showProgress();
        } else {
          this.openSnackBar(res.response, "Danger", false);
        }
      },
      error: (error) => {
        this.openSnackBar(error, "Danger", false);
      }
    })
  }

  selectedTab(i: number) {
    this.clicked = i;
  }

  openEditPopup(name: any) {
    const dialogRef = this.dialog.open(AddUserInfoPopupComponent, {
      data: {
        userObj: this.userInfo,
        activeFieldName: name
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.showProgress();
    });
  }

  addTravellerPopup(traveller?: any) {
    const dialogRef = this.dialog.open(AddTravellerComponent, {
      data: traveller,
      width: '660px'
    },);
    dialogRef.afterClosed().subscribe((result: any) => {
      this.getUserInfo();
    });
  }

  calculateAge(dob: any) {
    var years = moment().diff(dob, 'years', true);
    return years.toFixed();
  }

  editTraveller(traveller: any) {
    this.addTravellerPopup(traveller);
  }

  logout() {
    this.authService.doLogout();
    localStorage.clear();
    window.location.reload();
    this.router.navigate(["/"]);
  }
}
