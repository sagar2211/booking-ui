import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import _ from "lodash";
import { LocalService } from 'src/app/services/local.service';
import { SubmitBooking } from "../../../models/submit-booking";
import { AvailableFaresService } from "../../../services/available-fares.service";

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})

export class PaymentFormComponent implements OnInit {
  selectedFlight: any;
  flightInfo: any;
  searchObj: any;
  travellerInfo: any;
  addOnsFormValue: any;
  isSpinner = false;
  serviceData: any;
  constructor(private localService: LocalService,
    private activatedRoute: ActivatedRoute,
    private afService: AvailableFaresService,
    private router: Router) { }
  ancillariesArray: any;
  serviceTotal: any = 0;
  finalObj: any;

  ngOnInit(): void {
    this.getSelectedAncServcData();
    let data: any = this.activatedRoute.snapshot.queryParamMap.get("userObj");
    let userObj = JSON.parse(data);
    this.selectedFlight = userObj.flightData;
    this.localService.extraServices$.subscribe((res) => {
      if (res) {
        this.ancillariesArray = res;
        this.serviceTotal = 0;
        _.map(this.ancillariesArray, itr => {
          this.serviceTotal = this.serviceTotal + itr.price;
        })
      }
    })
    this.getPassangerInfo();
  }

  payNow() {
    this.isSpinner = true;
    let authUser = this.getAuthUserObj();
    let passengerArray = this.getTravelObj();
    let flightObj = this.getSearchObj();
    const submitBook = new SubmitBooking();
    if (passengerArray.adultArray.length > 0)
      submitBook.generatePassengerObj(passengerArray.adultArray);
    if (passengerArray.childArray.length > 0)
      submitBook.generatePassengerObj(passengerArray.childArray);
    if (passengerArray.infantArray.length > 0)
      submitBook.generatePassengerObj(passengerArray.infantArray);
    if (authUser !== null) {
      this.finalObj = submitBook.finalObj(flightObj, authUser);
    } else if (authUser == null) {
      this.finalObj = submitBook.finalGustObj(flightObj, passengerArray);
    }

    let Obj = {
      finalObj: this.finalObj,
      flightObj: flightObj,
      hepstarServices: this.generateHepstarServiceObj(),
      extraServices: this.serviceData
    }

    this.afService.submitbooking(Obj).subscribe((res: any) => {
      // localStorage.setItem('bookingHistory', JSON.stringify(res));
      localStorage.setItem('tempTicket', JSON.stringify(res));
      this.isSpinner = false;
      if (res.status == 200) {
        this.router.navigate(['payment/payment-success']);
      } else {
        const queryParams: any = {};
        queryParams.errObj = JSON.stringify(res);
        const navigationExtras: NavigationExtras = { queryParams };
        this.router.navigate(['payment/payment-unsuccess'],navigationExtras);
      }
    })
  }

  generateHepstarServiceObj() {
    let obj = {
      searchObj: this.searchObj,
      travellerInfo: this.travellerInfo,
      flightInfo: this.flightInfo.flightData,
      productInfo: this.addOnsFormValue.value
    }
    return obj;
  }

  getAuthUserObj() {
    let authUser: any = localStorage.getItem('authUser');
    authUser = authUser ? JSON.parse(authUser) : null;
    return authUser;
  }

  getTravelObj() {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    return stepper.step2.travellData;
  }

  getSearchObj() {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    stepper = JSON.parse(stepper.step2.navigationExtras.queryParams.userObj)
    this.addOnsFormValue = stepper.travellData
    return stepper.flightData
  }

  getPassangerInfo() {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    let searchObj = JSON.parse(stepper.step1.navigationExtras.queryParams.searchObj);
    this.flightInfo = JSON.parse(stepper.step2.navigationExtras.queryParams.userObj);
    this.searchObj = searchObj;
    this.travellerInfo = stepper.step2.travellData;
  }

  getSelectedAncServcData = () => {
    let extraServices = localStorage.getItem("extraServices");
    this.serviceData = extraServices ? JSON.parse(extraServices) : null;
    console.log("this.serviceArray", this.serviceData);

    // this.localService.serviceArray$.subscribe(response => {
    // })
  }
}