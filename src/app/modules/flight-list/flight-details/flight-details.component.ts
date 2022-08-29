import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MatAccordion } from '@angular/material/expansion';
import { AvailableFaresService } from 'src/app/services/available-fares.service';
import * as _ from "lodash";
import { LocalService } from 'src/app/services/local.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HITCH_HIKER_URL } from "../../../../environments/environment";
import { Subscription } from 'rxjs';
import { MAT_DATE_FORMATS } from '@angular/material/core';

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
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class FlightDetailsComponent implements OnInit {
  @Input() public item: any;
  @Input() public flightDetailIndex: any;
  @Input() public selectedFlight: any;
  @ViewChild(MatAccordion)
  ancillariesData: any;
  serviceArray: any = [];
  totalServcPrice: number = 0;
  H_URL = HITCH_HIKER_URL;
  panelOpenState = false;
  selectedLegConnections: Array<any> = [];
  accordion: MatAccordion = new MatAccordion;

  constructor(
    private afService: AvailableFaresService,
    private _snackBar: MatSnackBar,
    private local: LocalService
  ) { }

  ngOnInit(): void {
    this.getAncillariesData()
    this.getSelectedAncServcData();
    this.getTotalServcPrice();
  }

  getAncillariesData() {
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

  getSelectedAncServcData() {
    this.local.serviceArray$.subscribe(response => {
      this.serviceArray = response;
    })
  }

  getTotalServcPrice() {
    this.local.serviceTotalPrice$.subscribe(response => {
      this.totalServcPrice = response;
    })
  }

  displayDate(date: any) {
    const day = date.split(".")[0];
    let getMonth = date.split(".")[1];
    const monthName = moment(getMonth, "M").format("MMMM");
    date = day + " " + monthName;
    return date;
  }

  updateFlightTime(time: any) {
    let updatedTimes = moment(time).format("HH:mm");
    return updatedTimes;
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

  getPrice(priceRef: number) {
    let servicePrice: any;
    _.map(this.ancillariesData.prices, (itr) => {
      if (itr.priceID === priceRef) {
        servicePrice =
          itr.equivalentPrice.currencyCode + " " + itr.equivalentPrice.value;
      }
    });
    return servicePrice;
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ['success-snackbar'] : ['danger-snackbar']
    });
  }

  // ngOnDestroy(): void {
  //   this.ancillariesSubscription.unsubscribe();
  // }
}
