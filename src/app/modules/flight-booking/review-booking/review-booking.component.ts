import { Component, HostListener, Input, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as moment from 'moment';
import { AuthenticationService } from "src/app/services/authentication.service";
import { AvailableFaresService } from "src/app/services/available-fares.service";
import { LocalService } from "src/app/services/local.service";
import { HITCH_HIKER_URL } from "../../../../environments/environment";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { ReplaySubject, Subject, Subscription, take, takeUntil } from "rxjs";
import * as Country from "../../../../assets/json/country.json";
import { BreakPointTracker } from "src/app/_helpers/breakPointTracker.component";
import { BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "app-review-booking",
  templateUrl: "./review-booking.component.html",
  styleUrls: ["./review-booking.component.scss"],
})
export class ReviewBookingComponent implements OnInit, OnDestroy {
  @Input() public item: any;
  @Input() public flightDetailIndex: any = 0;
  @Input() public flightData: any;


  baggagePrice:any
  H_URL = HITCH_HIKER_URL;
  selectedFlight: any;
  travellData: any;
  ancillariesData: any;
  offSet: any;
  viewDetails: boolean = false;
  selectedLegConnections: Array<any> = [];
  protected country: any = [];
  public cntryCtrl: FormControl = new FormControl();
  public cntryFilterCtrl: FormControl = new FormControl();
  public countriesData: ReplaySubject<any> = new ReplaySubject<any>(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild('singleSelect') singleSelect!: MatSelect;
  scrollPosition: number = 0;
  ancillariesSubscription!: Subscription;
  filterCntrySubscription!: Subscription;

  isBelowLg: boolean = true ;


  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private afService: AvailableFaresService,
    private _snackBar: MatSnackBar,
    private local: LocalService,
    private authService: AuthenticationService,
    private BTracker: BreakPointTracker,
    private changeDetector:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let flight: any = this.activatedRoute.snapshot.queryParamMap.get("flightData");
    this.selectedFlight = JSON.parse(flight);
    
    let data: any = this.activatedRoute.snapshot.queryParamMap.get("userObj");
    let datas = JSON.parse(data);

    if (datas !== null) {
      this.selectedFlight = datas.flightData;
      this.travellData = datas.travellData;
    }
    this.getAncillariesData();
    this.country = Country;
    this.cntryCtrl.setValue(this.country[100].phonecode);
    this.filterCntrySubscription = this.cntryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountry();
      });

      //detector
      this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
        this.isBelowLg = isBelowLg.matches;
      });
      this.changeDetector.detectChanges()
  }

  @HostListener("document:scroll", ['$event'])
  onWindowScroll(event: any) {
    this.scrollPosition = window.pageYOffset;
  }

  addItem(newItem: any) {
    this.baggagePrice = newItem;
  }

  updateWidth() {
    let classObj = {}
    if (this.scrollPosition >= 150) {
      classObj = {
        classOnScroll: 'updateWidth',
        spacing: "75%"
      }
    } else {
      classObj = {
        classOnScroll: 'initialWidth',
        spacing: "100%"
      }
    }
    return classObj
  }

  


  protected setInitialValue() {
    this.countriesData
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });
  }

  protected filterCountry() {
    if (!this.country) {
      return;
    }
    // get the search keyword
    let search = this.cntryFilterCtrl.value;
    if (!search) {
      this.countriesData.next(this.country.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the country
    this.countriesData.next(
      this.country.filter((item: any) => {
        let country = item.name.toLowerCase()
        if (country.indexOf(search)) {
          return country
        }
      })
    );
  }


  getAncillariesData() {

    let legArray: Array<number> = []
      let legArrayNo = this.selectedFlight.legs[0].connections[0].connectionIdentifier.legIndex
      legArray.push(legArrayNo)
      if(this.selectedFlight.legs.length == 2){
        let newLegArr = this.selectedFlight.legs[1].connections[0].connectionIdentifier.legIndex
        legArray.push(newLegArr)
      }
      
    const param = {
      fareIdentifier: {
        fareIndex: this.flightDetailIndex,
        fareResultID: this.selectedFlight.identifier.fareResultID
      },
      selectedLegConnections: this.selectedLegConnections,
    };
    param.selectedLegConnections = [];
    _.map(this.selectedFlight.legs, (loop) => {
      param.selectedLegConnections.push(0);
    });
    this.afService.ancillaries(param).subscribe({
      next: (data: any) => {
        this.ancillariesData = data.Result.result;
      },
      error: (err: any) => {
        this.openSnackBar(err, 'Danger', false);
      },
    });
  }




  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ["success-snackbar"] : ["danger-snackbar"],
    });
  }

  getDuration(flights: any, index: any) {
    let departure = moment(flights[index + 1].departureDate);
    let arrival = moment(flights[index].arrivalDate);
    var duration = moment.duration(departure.diff(arrival)).asHours();
    let hours = duration.toString().split(".")[0];
    let minutes = (Number(duration.toString().split(".")[1]) * 60).toString().slice(0, 2);
    return `${hours} h ${minutes} m`
  }

  updateDate(date: any) {
    let dt = moment(date, "YYYY-MM-DD HH:mm:ss")
    let dayString = dt.format('dddd');
    dayString = dayString.substring(0, 3);
    let day = moment(date).date();
    let month = moment(date).month() + 1;
    let year = moment(date).format("YY");
    const monthName = moment(month, "M").format("MMMM");
    date = dayString + " " + day + " " + monthName + " " + year;
    return date;
  }

  updateFlightTime(time: any) {
    let updatedTimes = moment(time).format("HH:mm");
    return updatedTimes;
  }

  addStopClass(item: any) {
    let stop = item.legs[0].connections[0].connectionHeader.travelStopps;
    let activeStop
    if (stop === 0) {
      activeStop = "travelbar"
    } else if (stop === 1) {
      activeStop = "travelbar1"
    } else if (stop === 2) {
      activeStop = "travelbar2"
    }
    return activeStop || "travelbar"
  }

  addStopClass2(item: any) {
    let stop = item.legs[1].connections[0].connectionHeader.travelStopps;
    let activeStop
    if (stop === 0) {
      activeStop = "travelbar"
    } else if (stop === 1) {
      activeStop = "travelbar1"
    } else if (stop === 2) {
      activeStop = "travelbar2"
    }
    return activeStop || "travelbar"
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.filterCntrySubscription.unsubscribe();
  }

}
