import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import * as _ from "lodash";
import { LocalService } from "src/app/services/local.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakPointTracker } from "src/app/_helpers/breakPointTracker.component";
import { BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: 'app-ancillaries',
  templateUrl: './ancillaries.component.html',
  styleUrls: ['./ancillaries.component.scss']
})

export class AncillariesComponent implements OnInit {
  delayCompansation = false;
  failureProtection = false;
  cancellationProtection = false;
  delayCoverage = false;
  refundProtection = false;
  zarNumber: number = 0;
  addOnsForm!: FormGroup
  @Input() public item: any;
  @Input() public ancillariesData: any;
  scrollPosition: number = 0;
  id: any;
  objIndex!: number;
  totalServcPrice = 0;
  panelOpenState = false;
  collapseAllGroup = false;
  otherServices = false;
  baggageServices = false;
  seatServices = false;
  includedServices = false;
  overViewPanel: Array<any> = [];
  serviceArray: Array<any> = [];
  buttonDisabled: Array<any> = [];
  extraServices: Array<any> = [];
  selectedFlight: any;
  classOnScroll: any
  travellData: any
  passangerCnt: any;
  travellerInfo: any;
  searchObj: any;
  flightInfo: any;
  ancillariesObj: any = {
    hepstarServices: [],
    wadiiaSupport: {
      name: "Standard",
      price: 0,
      currency: 'ZAR',
      value: "Free"
    }
  }

  isBelowLg: boolean = true ;

  constructor(private local: LocalService,
    private router: Router,
    private activatedRoute: ActivatedRoute, private formbuilder: FormBuilder,private BTracker: BreakPointTracker,private changeDetector:ChangeDetectorRef) { }

  ngOnInit(): void {
    let data: any = this.activatedRoute.snapshot.queryParamMap.get("userObj");
    let userObj = JSON.parse(data);
    this.selectedFlight = userObj.flightData;
    this.travellData = userObj.travellData;

    this.getPassangerInfo();


    this.createForm();
    let serviceData: any = localStorage.getItem('extraServices');

    if (serviceData) {
      serviceData = serviceData ? JSON.parse(serviceData) : null;
      _.map(serviceData.hepstarServices, obj => {
        this.ancillariesObj.hepstarServices.push(obj)
      })
      this.ancillariesObj.wadiiaSupport = serviceData.wadiiaSupport;
    }

    if (this.travellData) {
      this.editTravellers()
    }

    this.getHepstarProduct()
    this.local.updateServiceArray(this.ancillariesObj)

    //tracker
    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });
    this.changeDetector.detectChanges()
  }

  getHepstarProduct() {
    let obj = {
      searchObj: this.searchObj,
      travellerInfo: this.travellerInfo,
      flightInfo: this.flightInfo.flightData
    }
    this.local.getProduct(obj).subscribe((response) => {
    });
  }

  createForm() {
    this.addOnsForm = this.formbuilder.group({
      service1: ["No"],
      service2: ["No"],
      service3: ["No"],
      service4: ["No"],
      service5: ["No"],
      service6: ["No"],
      service7: ["Standard"],
    });
  }

  editTravellers() {
    _.map(this.ancillariesObj.hepstarServices, itr => {
      if (itr.name === 'Travel Protection') {
        this.addOnsForm.patchValue({
          service1: 'Yes',
        })
      }

      if (itr.name === 'Flight Delay Compensation') {
        this.addOnsForm.patchValue({
          service2: 'Yes',
        })
      }

      if (itr.name === 'Airline Failure Protection') {
        this.addOnsForm.patchValue({
          service3: 'Yes',
        })
      }

      if (itr.name === 'Flight Cancellation Protection') {
        this.addOnsForm.patchValue({
          service4: 'Yes',
        })
      }

      if (itr.name === 'Airport Delay Coverage') {
        this.addOnsForm.patchValue({
          service5: 'Yes',
        })
      }

      if (itr.name === 'Flight Refund Protection') {
        this.addOnsForm.patchValue({
          service6: 'Yes',
        })
      }
    })
      this.addOnsForm.patchValue({
        service7: this.ancillariesObj.wadiiaSupport.value,
      })
  }

  addService(serviceName: string, evt?: any) {
    let serviceObj = {
      name: serviceName,
      price: (24.00 * this.passangerCnt).toFixed(2),
      currency: 'ZAR',
      value: evt.value
    }

    //sarfaraz =>
    this.zarNumber = evt.value === "Premium" ? 400 : evt.value === "Supreme" ? 500 : 0;
    let zarObj = {
      name: evt.value,
      price: this.zarNumber,
      currency: 'ZAR',
      value: evt.value
    }

    if (evt.value === "Standard" || evt.value === "Premium" || evt.value === "Supreme") {
      this.zarNumber = evt.value === "Premium" ? 400 : evt.value === "Supreme" ? 500 : 0;
      let zarObj = {
        name: evt.value,
        price: this.zarNumber,
        currency: 'ZAR',
        value: evt.value
      }
      this.ancillariesObj.wadiiaSupport = zarObj
    }

    if (evt.value === 'Yes') {
      this.ancillariesObj.hepstarServices.push(serviceObj)
      // this.serviceArray.push(serviceObj);
    } else {
      _.map(this.ancillariesObj.hepstarServices, (itr, index: any) => {
        if (itr.name === serviceName) {
          this.ancillariesObj.hepstarServices.splice(index, 1);
        }
      })
    }
    this.local.updateServiceArray(this.ancillariesObj)
    // this.updateTotalServicePrice("add");
  }

  generateStepperObj(navigationExtras: any) {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    let stepperObj = {
      navigationExtras: navigationExtras
    }
    stepper.step3 = stepperObj;
    return stepper;
  }

  onContinue() {
    // this.serviceArray.length ? this.serviceArray : null
    this.local.updateExtraServices(this.ancillariesObj);

    let userObj: any = {
      flightData: this.selectedFlight,
      travellData: this.addOnsForm.value,
      extraServices: this.extraServices
    }

    const queryParams: any = {}
    queryParams.userObj = JSON.stringify(userObj);
    let navigationExtras: NavigationExtras = { queryParams }
    let stepper = this.generateStepperObj(navigationExtras)
    localStorage.setItem('stepper', JSON.stringify(stepper));
    this.router.navigate(['/payment/payment-form'], navigationExtras);
  }

  onBack() {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    let userData = JSON.parse(stepper.step2.navigationExtras.queryParams.userObj)
    if (stepper.step2 !== null) {
      const queryParams: any = {}
      queryParams.userObj = JSON.stringify(userData);
      this.router.navigate(['/flight-booking/review-booking'], stepper.step2.navigationExtras);
    }
  }

  getCheckoutResponse(){
    this.onContinue();
  }

  getPassangerInfo() {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    let searchObj = JSON.parse(stepper.step1.navigationExtras.queryParams.searchObj);
    this.flightInfo = JSON.parse(stepper.step2.navigationExtras.queryParams.userObj);
    this.passangerCnt = searchObj.passengers.adultPassengers.passengers?.length + searchObj.passengers.childPassengers.passengers?.length + searchObj.passengers.infantPassengers.passengers?.length;
    this.searchObj = searchObj;
    this.travellerInfo = stepper.step2.travellData;
  }
}