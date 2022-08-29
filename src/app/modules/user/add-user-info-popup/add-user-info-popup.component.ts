import { Component, ElementRef, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { LocaleConfig, LocaleService } from 'ngx-daterangepicker-material';
@Component({
  selector: 'app-add-user-info-popup',
  templateUrl: './add-user-info-popup.component.html',
  styleUrls: ['./add-user-info-popup.component.scss'],
  providers: [LocaleService],
})
export class AddUserInfoPopupComponent implements OnInit, OnDestroy {
  moment = moment;
  calendarLocale: LocaleConfig;
  calendarPlaceholder: string;
  selectedRange: any = { startDate: null, endDate: null };

  model!: NgbDateStruct;
  profileForm!: FormGroup;
  @ViewChild('genderId') genderId!: MatSelect;
  userSubscription!: Subscription;
  renderDate: any = new Date;
  constructor(private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddUserInfoPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.getUserInfo()
    let date = this.userInfo.dateOfBirth;

    this.calendarLocale = {
      customRangeLabel: 'Pick a date...',
      applyLabel: 'Apply',
      clearLabel: 'Clear',
      format: 'DD/MM/YYYY',
      firstDay: 1,
    };

    this.calendarPlaceholder = 'All';
    const pastDate = moment(date);
    const currentDate = moment();
    let dayDiff = pastDate.diff(currentDate, 'days');
    this.selectedRange.startDate = moment().add(dayDiff, 'days').startOf('day');
    this.selectedRange.endDate = moment().add(dayDiff, 'days').startOf('day');
  }

  @ViewChild('profileId') profileId!: ElementRef;
  editProfileForm = false;
  userInfo: any;
  submitted = false;
  maxDate: any;
  gender = "gender"
  minDate: any;
  passMatch = false;
  selectedFiles: any;
  userData = this.data.userObj;
  ngOnInit(): void {
    this.maxDate = this.minDate = new Date();
    this.createForm();
    this.editUserInfo();
    setTimeout(() => this.setFocus(this.data.activeFieldName), 10);
  }

  editUserInfo() {
    this.profileForm.patchValue({
      prefix: this.userData.prefix ? this.userData.prefix : null,
      firstName: this.userData.firstName ? this.userData.firstName : null,
      middleName: this.userData.middleName ? this.userData.middleName : null,
      lastName: this.userData.lastName ? this.userData.lastName : null,
      gender: this.userData.gender ? this.userData.gender : null,
      maritalStatus: this.userData.maritalStatus ? this.userData.maritalStatus : null,
      dateOfBirth: this.userData.dateOfBirth.endDate ? this.userData.dateOfBirth.endDate : null
    })
  }

  createForm() {
    this.profileForm = new FormGroup({
      prefix: new FormControl(""),
      firstName: new FormControl(""),
      middleName: new FormControl(""),
      lastName: new FormControl(""),
      gender: new FormControl(""),
      maritalStatus: new FormControl(""),
      dateOfBirth: new FormControl("")
    });
  }

  onDateChange() {
    let dob = this.profileForm.value.dateOfBirth;
    let newDate = dob.endDate._d;
    dob = moment(newDate).format("DD-MM-YYYY");
    this.profileForm.patchValue({ dateOfBirth: dob });
  }

  getUserInfo() {
    let data: any = localStorage.getItem("authUser");
    this.userInfo = JSON.parse(data);
  }

  onSubmit() {
    this.submitted = true;
    const userId = this.authService.getUserId();
    this.userSubscription = this.authService.updateUserInfo(userId, this.profileForm.value)
      .subscribe({
        next: (res) => {
          if (res.TYPE !== "error") {
            localStorage.setItem("authUser", JSON.stringify(res.result));
            this.openSnackBar("Update Successful", "Success", true);
            this.editProfileForm = false;
            this.dialogRef.close(res.result);
          } else {
            this.openSnackBar(res.MESSAGE, "Danger", false);
          }
        },
        error: (error) => {
          this.openSnackBar(error, "Danger", false);
        },
      });
    // this.dialogRef.close({data: '' });
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ["success-snackbar"] : ["danger-snackbar"],
    });
  }


  setFocus(name: any) {
    if (name === 'gender') {
      this.genderId.focus();
    }
    else {
      const ele = this.profileId.nativeElement[name];
      if (ele) {
        ele.focus();
      }
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}