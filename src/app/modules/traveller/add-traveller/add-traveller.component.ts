import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import countryInfo from '../../../../assets/json/countryList.json';
import {
  SearchCountryField,
  CountryISO
} from "ngx-intl-tel-input";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from "lodash";
import { isEmpty } from 'lodash';
import { Subscription } from 'rxjs';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { LocaleConfig, LocaleService } from 'ngx-daterangepicker-material';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}; 

@Component({
  selector: 'app-add-traveller',
  templateUrl: './add-traveller.component.html',
  styleUrls: ['./add-traveller.component.scss'],
  providers: [
    LocaleService,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AddTravellerComponent implements OnInit, OnDestroy {
  model!: NgbDateStruct;
  model1!: NgbDateStruct;
  minDate = new Date();
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Qatar];
  travellerForm!: FormGroup;
  submitted: boolean = false;
  userInfo: any;
  maxDate = new Date();
  allCountry: any;
  travellerSubscription!: Subscription;
  delSubscription!: Subscription;
  userSubscription!: Subscription;

  moment = moment;
  calendarLocale: LocaleConfig;
  calendarPlaceholder: string = "ALL";
  selectedRange: any = { startDate: null, endDate: null };
  selectedRange1: any = { startDate: null, endDate: null };

  constructor(private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTravellerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public travellerInfo: any) { 
    
      this.calendarLocale = {
        customRangeLabel: 'Pick a date...',
        applyLabel: 'Apply',
        clearLabel: 'Clear',
        format: 'DD/MM/YYYY',
        firstDay: 1,
      };
      
      if(!isEmpty(travellerInfo)){
        console.log("Dobdate",travellerInfo);
      }
      if(travellerInfo){
        let DOB = travellerInfo.dateOfBirth.startDate ? travellerInfo.dateOfBirth.startDate : null
        let erpiryDate = travellerInfo.passportExpiry.startDate ? travellerInfo.passportExpiry.startDate : null
        const pastDate = moment(DOB);
        const pastDate1 = moment(erpiryDate);
        const currentDate = moment();
        let dayDiff = pastDate.diff(currentDate, 'days');
        let dayDiff1 = pastDate1.diff(currentDate, 'days');
        this.selectedRange.startDate = moment().add(dayDiff, 'days').startOf('day');
        this.selectedRange.endDate = moment().add(dayDiff, 'days').startOf('day');
        this.selectedRange1.startDate = moment().add(dayDiff1, 'days').startOf('day');
        this.selectedRange1.endDate = moment().add(dayDiff1, 'days').startOf('day');
      }
    }
  ngOnInit(): void {
    this.getUserInfo()
    this.createForm()
    this.allCountry = [...countryInfo];
    if(!isEmpty(this.travellerInfo)){
      this.editTraveller();
    }
  }

  editTraveller(){
    this.travellerForm.patchValue({
      prefix: this.travellerInfo.prefix ? this.travellerInfo.prefix :null,
      firstName: this.travellerInfo.firstName ? this.travellerInfo.firstName : null,
      middleName: this.travellerInfo.middleName ? this.travellerInfo.middleName : null,
      lastName: this.travellerInfo.lastName ? this.travellerInfo.lastName : null,
      gender: this.travellerInfo.gender ? this.travellerInfo.gender : null,
      email: this.travellerInfo.email ? this.travellerInfo.email : null,
      phone: this.travellerInfo.phone ? this.travellerInfo.phone : null,
      dateOfBirth: this.travellerInfo.dateOfBirth.startDate ? this.travellerInfo.dateOfBirth.startDate : null,
      passportNo: this.travellerInfo.passportNo ? this.travellerInfo.passportNo : null,
      passportIssuingCountry: this.travellerInfo.passportIssuingCountry ? this.travellerInfo.passportIssuingCountry: null,
      passportExpiry: this.travellerInfo.passportExpiry.startDate ? this.travellerInfo.passportExpiry.startDate : null
    })
  }

  updateTraveller(){
    this.submitted = true;
    this.travellerSubscription = this.authService.updateTravellerInfo(this.userInfo._id, this.travellerForm.value)
      .subscribe({
        next: (res) => {
          if (res.TYPE !== "error") {
            localStorage.setItem("authUser", JSON.stringify(res.result));
            this.openSnackBar("Update Successful", "Success", true);
            this.submitted = false;
            this.dialogRef.close(res.result);
          } else {
            this.openSnackBar(res.MESSAGE, "Danger", false);
          }
        },
        error: (error) => {
          this.openSnackBar(error, "Danger", false);
        },
      });
  }

  deleteTraveller(){
    this.submitted = true;
    this.delSubscription = this.authService.deleteTravellerInfo(this.userInfo._id, this.travellerForm.value)
      .subscribe({
        next: (res) => {
          if (res.TYPE !== "error") {
            localStorage.setItem("authUser", JSON.stringify(res.result));
            this.openSnackBar("Delete Traveller Successful", "Success", true);
            this.submitted = false;
            this.dialogRef.close(res.result);
          } else {
            this.openSnackBar(res.MESSAGE, "Danger", false);
          }
        },
        error: (error) => {
          this.openSnackBar(error, "Danger", false);
        },
      });
  }

  showCountryResult(event: any){
    this.allCountry = [...countryInfo];
    let newCountry:Array<any> = []
    let country = event.target.value.toLowerCase();
    _.map(this.allCountry, itr=>{
      let newItr = itr.name.toLowerCase();
      if(newItr.includes(country)){
        // this.allCountry = itr
        newCountry.push(itr);
        this.allCountry = newCountry;
      }
    })
  }

  getUserInfo() {
    let data: any = localStorage.getItem("authUser");
    this.userInfo = JSON.parse(data);
  }

  createForm() {
    this.travellerForm = new FormGroup({
      prefix: new FormControl("", [Validators.required]),
      firstName: new FormControl("", [Validators.required]),
      middleName: new FormControl(""),
      lastName: new FormControl("", [Validators.required]),
      gender: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.required]),
      dateOfBirth: new FormControl("", [Validators.required]),
      passportNo: new FormControl("", [Validators.required]),
      passportIssuingCountry: new FormControl("", [Validators.required]),
      passportExpiry: new FormControl("", [Validators.required]),
    });
  }

  onSubmit() {
    this.submitted = true;
    let travellerObj = this.generateTravellerObj(this.travellerForm.value)
    let userId = this.userInfo._id
    this.userSubscription = this.authService.updateUserInfo(userId, travellerObj).subscribe({
      next: (data: any) => {
        if (data.TYPE.TYPE == "success" && data.TYPE.STATUS == 200) {
          localStorage.setItem('authUser', JSON.stringify(data.result));
          this.openSnackBar(data.TYPE.MESSAGE, "success", true);
          this.submitted = false;
          this.dialogRef.close(data.result);
        } else {
          this.openSnackBar(data.message, "Danger", false);
        }
      },
      error: (error) => {
        this.openSnackBar(error, "Danger", false);
      }
    })
  }

  generateTravellerObj(obj: any) {
    delete obj.passportIssuingCountry._id
    let travellerObj = {
      prefix : this.userInfo.prefix,
      firstName : this.userInfo.firstName,
      lastName : this.userInfo.lastName,
      email : this.userInfo.email,
      travellerObj : {
        prefix: obj.prefix,
        firstName: obj.firstName,
        middleName: obj.middleName,
        lastName: obj.lastName,
        gender : obj.gender,
        email : obj.email,
        phone : obj.phone.internationalNumber,
        dateOfBirth : obj.dateOfBirth,
        passportNo : obj.passportNo,
        passportIssuingCountry : obj.passportIssuingCountry,
        passportExpiry : obj.passportExpiry,
      }
    }
    return travellerObj;
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ["success-snackbar"] : ["danger-snackbar"],
    });
  }

  ngOnDestroy(): void {
    // this.travellerSubscription.unsubscribe();
    // this.delSubscription.unsubscribe();
    // this.userSubscription.unsubscribe();
  }
}