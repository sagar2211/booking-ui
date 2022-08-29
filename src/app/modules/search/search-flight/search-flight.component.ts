import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DailogBoxComponent } from "../dailog-box/dailog-box.component";
import { faPlane, faHotel, faMapMarkerAlt, faCalendarAlt, faRunning, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { MatDialog } from "@angular/material/dialog";
import { AvailableFaresService } from "../../../services/available-fares.service";
import { PublicService } from "../../../services/public.service";
import { LocalService } from "../../../services/local.service";
import { NavigationExtras, Router } from "@angular/router";
import * as _ from "lodash";
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as moment from "moment";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSelect } from "@angular/material/select";
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { BreakPointTracker } from "src/app/_helpers/breakPointTracker.component";
import { BreakpointState } from "@angular/cdk/layout";
// import { NgbDateCustomParserFormatter} from '../dateformat';
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

export interface State {
  flag: string;
  name: string;
  population: string;
}

@Component({
  selector: "app-search-flight",
  templateUrl: "./search-flight.component.html",
  styleUrls: ["./search-flight.component.scss"],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})
export class SearchFlightComponent implements OnInit, AfterViewInit {
  @ViewChild('airlineClass') airlineClass!: MatSelect;
  @ViewChild('travellerPopup') travellerPopup!: ElementRef;
  @ViewChild('departFrom') departFrom!: ElementRef;
  @ViewChild('arrivalTo') arrivalTo!: ElementRef;
  @ViewChild('departDate') departDate!: ElementRef;
  @ViewChild('arrivalDateId') arrivalDate1!: ElementRef;
  @ViewChild(DaterangepickerDirective, { static: true }) picker!: DaterangepickerDirective;
  selected!: { startDate: moment.Moment, endDate: moment.Moment };
  plane = faPlane;
  hotel = faHotel;
  faCalendarAlt = faCalendarAlt;
  faMapMarkerAlt = faMapMarkerAlt;
  fafasttrack = faRunning;
  faBoardingPass = faTicketAlt;
  flights = [];
  arrivalDate: any;
  val: any;
  searchForm: FormGroup;
  filteredStates: any = "";
  travellers: any = {
    Adult: 1,
    Child: "",
    Infant: "",
  };
  Travellers = this.travellers?.Adult + " Travellers";
  selectedTrip = "Round Trip";
  isSpinner = false;
  // minDate = new Date();
  selectedObjects: any;
  departCode: any;
  arrivalCode: any;
  minDate: any;
  Airlines: Array<any> = [
    { value: 'economy', viewValue: 'Economy' },
    { value: 'premiumEconomy', viewValue: 'Premium Economy' },
    { value: 'business', viewValue: 'Business' },
    { value: 'first', viewValue: 'First' }
  ];

  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate | null;
  toDate!: NgbDate | null;
  minArrvDate: any;
  ipAddress: any;
  location: any;
  dialogSection = false;
  isValidData: any;
  submitted: boolean = false;
  updatedFromDate: any;
  renderFromDate: any = null;
  isBelowLg: boolean = false;
  dateArr:any = [];

  constructor(
    public dialog: MatDialog,
    private formbuilder: FormBuilder,
    private afService: AvailableFaresService,
    private publicService: PublicService,
    private local: LocalService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,
    private BTracker: BreakPointTracker,
    private changeDetector: ChangeDetectorRef
  ) {
    // this.bindData();
    this.searchForm = this.formbuilder.group({
      departureArray: this.formbuilder.array([]),
      NoOfTravellers: [""],
      AirlineClass: ["", Validators.required],
      TripType: ["Round Trip", Validators.required],
    });
    this.local.getIPAddress();
    this.local.getLocation();

    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.name === o2.name : o2 === o2;
  }

  // changeDate(event: any) {
  //   let departureArray = this.searchForm.value.departureArray;
  //   let updatedDate: any = moment(new Date(event.target.value))
  //   departureArray[0].arrivalDate = updatedDate['_i'];
  //   this.searchForm.patchValue({ departureArray: departureArray })
  // }

  dateChange(date: any) {
    this.minArrvDate = this.searchForm.value.departureArray[0].departureDate;
    this.arrivalDate = date.value;
  }

  ngOnInit(): void {
    let day = moment(this.minDate).date();
    let month = moment(this.minDate).month() + 1;
    let year = moment(this.minDate).year();
    this.minDate = { day: day, month: month, year: year, };
    this.selectedObjects = [{ value: 'economy', viewValue: 'Economy' }];
    this.afService.flightData = {};
    this.addDeparture();
    localStorage.removeItem('stepper');
    localStorage.removeItem('extraServices');
    this.getIpAddress();
    this.getLocation();
  }

  ngAfterViewInit(): void {
    this.BTracker.isBelowMd().subscribe((isBelowMd: BreakpointState) => {
      this.isBelowLg = isBelowMd.matches;
    });
    this.changeDetector.detectChanges()
  }

  onDateChange() {
    
    // departureDate: this.fromDate ? `${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year}` : null,
    if (this.selectedTrip === "One Way") {

      this.renderFromDate = this.fromDate ? `${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year}` : null
      console.log(this.renderFromDate);

    } else if (this.toDate && this.selectedTrip === "Round Trip") {
      let toDate: any = {
        day: this.toDate.day,
        month: this.toDate.month,
        year: this.toDate.year,
      }

      if (this.toDate.month >= 1 && this.toDate.month <= 9) {
        let month = "0" + this.toDate.month
        toDate.month = +month
      } else if (this.toDate.day >= 1 && this.toDate.day <= 9) {
        let day = "0" + this.toDate.day
        toDate.day = day
      }

      let formVal = {
        tempFrom: this.searchForm.value["departureArray"][0].from,
        tempTo: this.searchForm.value["departureArray"][0].to,
        departureDate: this.fromDate ? `${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year}` : null,
        arrivalDate: `${toDate.day}-${toDate.month}-${toDate.year}`
      }
      this.editDeparture(formVal);
      this.adultTravellers().removeAt(0);
    }
  }

  editAdultTravellers(): FormGroup {
    return this.formbuilder.group({
      from: this.searchForm.value.from,
      to: this.searchForm.value.to,
      departureDate: this.fromDate,
      arrivalDate: this.toDate,
    });
  }

  adultTravellers(): FormArray {
    return this.searchForm.get('departureArray') as FormArray;
  }

  getIpAddress() {
    this.local.ipAddress.subscribe((res) => {
      if (res)
        this.ipAddress = res.ip;
    })
  }

  getLocation() {
    this.local.location.subscribe((res) => {
      if (res)
        this.location = res;
    })
  }

  noOfDepartures(): FormArray {
    return this.searchForm.get("departureArray") as FormArray;
  }

  newDepartures(): FormGroup {
    return this.formbuilder.group({
      from: new FormControl(""),
      to: new FormControl(""),
      departureDate: new FormControl(this.minDate),
      arrivalDate: new FormControl(null),
    });
  }

  addDeparture(): void {
    if (this.searchForm.value.departureArray.length < 6) {
      this.noOfDepartures().push(this.newDepartures());
    } else {
      this.openSnackBar("You are cross add departure limit.", "Danger", false);
    }
  }

  editDepartures(formVal: any): FormGroup {
    return this.formbuilder.group({
      from: new FormControl(formVal.tempFrom),
      to: new FormControl(formVal.tempTo),
      departureDate: new FormControl(formVal.departureDate),
      arrivalDate: new FormControl(formVal.arrivalDate ? formVal.arrivalDate : this.toDate),
    });
  }

  editDeparture(formVal: any): void {
    if (this.searchForm.value.departureArray.length < 6) {
      this.noOfDepartures().push(this.editDepartures(formVal));
    } else {
      this.openSnackBar("You are cross add departure limit.", "Danger", false);
    }
  }

  removeDeparture(index: any) {
    this.noOfDepartures().removeAt(index);
  }

  tripChange(evt: any) {
    this.selectedTrip = evt.value;
    if (this.selectedTrip === "One Way" || this.selectedTrip === "Round Trip") {
      if (this.searchForm.value.departureArray.length > 1) {
        const departureFromLength = this.searchForm.value.departureArray.length;
        for (let i = departureFromLength - 1; i > 0; i--) {
          if (i !== 0) this.removeDeparture(i);
        }
      }
    } else if (this.selectedTrip === "Multi Trip") {
      this.noOfDepartures().push(this.newDepartures());
    }
    // this.airlineClass.open();
    this.departFrom.nativeElement.focus();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DailogBoxComponent, {
      data: this.travellers
        ? this.travellers
        : (this.travellers = {
          Adult: 1,
          Child: 0,
          Infant: 0,
        }),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.data) {
        this.travellers = result.data;
      }
      this.travellerPopup.nativeElement.focus();
    });
  }

  onSearch(event: any) {
    let value = event.target.value;
    let newValue = value.toString();
    if (newValue.length >= 3) {
      this.publicService.GetAirportsByPrefix(value).subscribe({
        next: (Airports: any) => {
          let data = Airports.Result;
          this.filteredStates = data; //JSON.parse(data);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.selectedTrip === "Round Trip") {
      let formVal = {
        tempFrom: this.searchForm.value["departureArray"][0].from,
        tempTo: this.searchForm.value["departureArray"][0].to,
        departureDate: this.fromDate,
        arrivalDate: this.toDate
      }
      this.editDeparture(formVal);
      this.adultTravellers().removeAt(0);
    }
    if ((!this.searchForm.valid || this.searchForm.value.departureArray[0].from === "" || this.searchForm.value.departureArray[0].to === "" ||
      this.searchForm.value.departureArray[0].departureDate === "" || this.searchForm.value.departureArray[0].departureDate === null) || (this.selectedTrip === "Round Trip" && this.searchForm.value.departureArray[0].arrivalDate === null)) {
      this.addValidation();
      return;
    }
    let reqObject =
      this.searchForm.value.TripType == "One Way"
        ? this.getReqObjectForOneWay()
        : this.searchForm.value.TripType == "Round Trip"
          ? this.getReqObjectForRoundTrip()
          : this.getReqObjectForMultiTrip();
    reqObject.tripType = this.selectedTrip;
    this.isSpinner = true;
    this.local.setSpinner(this.isSpinner);
    const queryParams: any = {};
    queryParams.searchObj = JSON.stringify(reqObject);
    const navigationExtras: NavigationExtras = { queryParams };
    let stepperObj = this.generateStepperObj(navigationExtras);
    localStorage.setItem('stepper', JSON.stringify(stepperObj));
    this.afService.updateTripType(this.selectedTrip);
    let countryCode = ["ZA"];
    if (countryCode.includes(this.departCode) && countryCode.includes(this.arrivalCode)) {
      this.router.navigate([`/flight-list/dom-flights`], navigationExtras);
    } else {
      this.router.navigate([`/flight-list/int-flights`], navigationExtras);
    }
  }

  addValidation() {
    if (this.selectedTrip === 'One Way' || this.selectedTrip === 'Round Trip') {
      this.isValidData = this.searchForm.value.departureArray[0];
    }
  }

  generateStepperObj(navigationExtras: any) {
    let stepperObj = {
      step1: {
        "navigationExtras": navigationExtras,
        "departCode": this.departCode,
        "arrivalCode": this.arrivalCode
      },
      step2: {
        "navigationExtras": '',
      },
      step3: {
        "navigationExtras": '',
      },
      step4: {
        "navigationExtras": '',
      }
    }
    return stepperObj;
  }

  selectAirport(airportCode: any, airportType: string) {
    if (airportType == "departure") {
      this.departCode = airportCode.countryCode;
      this.arrivalTo.nativeElement.focus();
    } else if (airportType == "arrival") {
      this.arrivalCode = airportCode.countryCode
      // this.departDate.nativeElement.focus();
    }
    this.filteredStates = null
    this.addValidation()
  }

  onDepartDateChange() {
    this.arrivalDate1.nativeElement.focus();
    this.addValidation();
  }

  onArrivalDateChange() {
    this.arrivalDate1.nativeElement.focus();
    this.addValidation();
  }

  getReqObjectForOneWay() {
    let obj: any = {
      cabinClassPerLeg: false,
      segments: [],
      passengers: {
        adultPassengers: {
          passengers: [],
          passengerType: "ADT",
        },
        childPassengers: {
          passengerType: "CHD",
          passengers: [],
        },
        infantPassengers: {
          passengerType: "INF",
          passengers: [],
        },
      },
      cabinClasses: {
        economy: false,
        premiumEconomy: false,
        business: false,
        first: false,
      },
      directFlightsOnly: false,
      includeAirlines: [],
      excludeAirlines: [],
      overrideMultiChannelBranch: "",
      overrideMultiChannelBranchgroup: "",
      ipAddress: this.ipAddress,
      location: this.location
    };

    let segmentObj = {};
    _.map(this.searchForm.value.departureArray, (itr) => {
      segmentObj = {};
      segmentObj = {
        from: itr.from,
        to: itr.to,
        radius: 0,
        cabinClasses: {
          economy: false,
          premiumEconomy: false,
          business: false,
          first: false,
        },
        departureDate: {
          day: moment(itr.departureDate).date(),
          month: moment(itr.departureDate).month(),
          year: moment(itr.departureDate).year(),
        },
      };
      obj.segments.push(segmentObj);
    });

    // _.map(this.searchForm.value.AirlineClass, (itr) => {
    //   obj.segments[0].cabinClasses[itr] = true
    // })
    _.map(this.searchForm.value.AirlineClass, (itr) => {
      obj.cabinClasses[itr.value] = true
    })
    // obj.cabinClasses[this.searchForm.value.AirlineClass[0]] = true;

    for (let i = 0; i < this.travellers.Adult; i++) {
      obj.passengers.adultPassengers.passengers.push({
        date: new Date(),
      });
    }

    for (let i = 0; i < this.travellers.Child; i++) {
      obj.passengers.childPassengers.passengers.push({
        date: new Date(),
      });
    }

    for (let i = 0; i < this.travellers.Infant; i++) {
      obj.passengers.infantPassengers.passengers.push({
        date: new Date(),
      });
    }

    return obj;
  }

  getReqObjectForRoundTrip() {
    let departureArray = this.searchForm.value.departureArray;

    let obj: any = {
      segments: [],
      passengers: {
        adultPassengers: {
          passengerType: "ADT",
          passengers: [],
        },
        childPassengers: {
          passengerType: "CHD",
          passengers: [],
        },
        infantPassengers: {
          passengerType: "INF",
          passengers: [],
        },
      },
      cabinClasses: {
        economy: false,
        premiumEconomy: false,
        business: false,
        first: false,
      },
      directFlightsOnly: false,
      cabinClassPerLeg: false,
      includeAirlines: [],
      excludeAirlines: [],
      overrideMultiChannelBranch: "",
      overrideMultiChannelBranchgroup: "",
      ipAddress: this.ipAddress,
      location: this.location
    };

    let segmentDepartureObj = {};
    let segmentArrivalObj = {};
    _.map(departureArray, (itr) => {
      segmentDepartureObj = {};
      segmentDepartureObj = {
        from: itr.from,
        to: itr.to,
        radius: 0,
        cabinClasses: {
          economy: false,
          premiumEconomy: false,
          business: false,
          first: false,
        },
        departureDate: {
          day: moment(itr.departureDate).date().toString(),
          month: (moment(itr.departureDate).month()).toString(),
          year: moment(itr.departureDate).year().toString(),
        },
      };

      segmentArrivalObj = {};
      segmentArrivalObj = {
        from: itr.to,
        to: itr.from,
        radius: 0,
        cabinClasses: {
          economy: false,
          premiumEconomy: false,
          business: false,
          first: false,
        },
        departureDate: {
          day: moment(itr.arrivalDate).date().toString(),
          month: (moment(itr.arrivalDate).month()).toString(),
          year: moment(itr.arrivalDate).year().toString(),
        },
      };

      obj.segments.push(segmentDepartureObj);
      obj.segments.push(segmentArrivalObj);
    });
    // obj.segments[0].cabinClasses[this.searchForm.value.AirlineClass] = true;
    // obj.cabinClasses[this.searchForm.value.AirlineClass] = true;

    _.map(this.searchForm.value.AirlineClass, (itr) => {
      obj.cabinClasses[itr.value] = true
    })

    for (let i = 0; i < this.travellers.Adult; i++) {
      obj.passengers.adultPassengers.passengers.push({
        date: new Date(),
      });
    }

    for (let i = 0; i < this.travellers.Child; i++) {
      obj.passengers.childPassengers.passengers.push({
        date: new Date(),
      });
    }

    for (let i = 0; i < this.travellers.Infant; i++) {
      obj.passengers.infantPassengers.passengers.push({
        date: new Date(),
      });
    }
    return obj;
  }

  getReqObjectForMultiTrip() {
    let departureArray = this.searchForm.value.departureArray;
    let obj: any = {
      segments: [],
      passengers: {
        adultPassengers: {
          passengerType: "ADT",
          passengers: [],
        },
        childPassengers: {
          passengerType: "CHD",
          passengers: [],
        },
        infantPassengers: {
          passengerType: "INF",
          passengers: [],
        },
      },
      cabinClasses: {
        economy: false,
        premiumEconomy: false,
        business: false,
        first: false,
      },
      directFlightsOnly: false,
      cabinClassPerLeg: false,
      includeAirlines: [],
      excludeAirlines: [],
      overrideMultiChannelBranch: "",
      overrideMultiChannelBranchgroup: "",
      ipAddress: this.ipAddress,
      location: this.location
    };

    let segmentDepartureObj = {};
    let segmentArrivalObj = {};
    _.map(departureArray, (itr, index) => {
      segmentDepartureObj = {};
      segmentArrivalObj = {};

      segmentDepartureObj = {
        from: itr.from,
        to: itr.to,
        radius: 0,
        cabinClasses: {
          economy: false,
          premiumEconomy: false,
          business: false,
          first: false,
        },
        departureDate: {
          day: moment(itr.departureDate).date().toString(),
          month: (moment(itr.departureDate).month()).toString(),
          year: moment(itr.departureDate).year().toString(),
        },
      };

      obj.segments.push(segmentDepartureObj);
    });
    // obj.segments[0].cabinClasses[this.searchForm.value.AirlineClass] = true;
    // obj.cabinClasses[this.searchForm.value.AirlineClass] = true;

    _.map(this.searchForm.value.AirlineClass, (itr) => {
      obj.cabinClasses[itr.value] = true
    })

    for (let i = 0; i < this.travellers.Adult; i++) {
      obj.passengers.adultPassengers.passengers.push({
        date: new Date(),
      });
    }

    for (let i = 0; i < this.travellers.Child; i++) {
      obj.passengers.childPassengers.passengers.push({
        date: new Date(),
      });
    }

    for (let i = 0; i < this.travellers.Infant; i++) {
      obj.passengers.infantPassengers.passengers.push({
        date: new Date(),
      });
    }
    return obj;
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ["success-snackbar"] : ["danger-snackbar"],
    });
  }

  updateNoOfTravellers() {
    let travellers =
      this.travellers?.Adult +
        this.travellers?.Child +
        this.travellers?.Infant >
        0
        ? this.travellers?.Adult +
        this.travellers?.Child +
        this.travellers?.Infant +
        " Travellers"
        : "";
    return travellers;
  }


  swapFlight() {
    let temp1;
    let tempFrom;
    let tempTo;
    let departureDate = this.searchForm.value.departureArray[0].departureDate;
    let arrivalDate = this.searchForm.value.departureArray[0].arrivalDate;
    let flight = this.searchForm.value.departureArray[0]
    if (flight.from == '' && flight.to == '') {
    } else {
      tempFrom = this.searchForm.value.departureArray[0].from;
      tempTo = this.searchForm.value.departureArray[0].to;
      temp1 = this.searchForm.value.departureArray[0].from;
      tempFrom = tempTo;
      tempTo = temp1;

      const ing = this.searchForm.get("departureArray") as FormArray;
      ing.clear();
      let formVal = {
        tempFrom: tempFrom,
        tempTo: tempTo,
        departureDate: departureDate,
        arrivalDate: arrivalDate
      }
      this.editDeparture(formVal);

      this.searchForm.get('departureArray')?.setValue({
        form: [this.searchForm.value.departureArray[0].from ? this.searchForm.value.departureArray[0].from : null, [Validators.required]],
        to: [this.searchForm.value.departureArray[0].to ? this.searchForm.value.departureArray[0].to : null, [Validators.required]]
      })
    }
  }




  onDateSelection(date: NgbDate) {

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;

    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
      date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
      this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
