import { Component, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
import { AvailableFaresService } from "../../../services/available-fares.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";

import { LocalService } from "src/app/services/local.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FilterSort } from "src/app/models/filter-sort-model";
import { Subscription } from "rxjs";
@Component({
  selector: "app-flight-sort",
  templateUrl: "./flight-sort.component.html",
  styleUrls: ["./flight-sort.component.scss"],
})
export class FlightSortComponent implements OnInit, OnDestroy {
  @Input() public flightData: any;
  @HostBinding("@.disabled") disabled = true;
  flightDataClone: any;
  sortTimes: any;
  currentSort: any;
  step: any = "step1";
  isSpinner = false;
  newArray: Array<any> = [];
  filterFlightSubscription!: Subscription;
  constructor(
    private afService: AvailableFaresService,
    private activatedRoute: ActivatedRoute,
    private local: LocalService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isSpinner = true;
    this.getFlightData();
  }

  getFlightData(){
    this.filterFlightSubscription = this.afService.filterFlight$.subscribe({
      next: (flights: any) => {
        if (flights === "Flight not found.") {
          this.flightData = null;
        } else {
          this.flightData = flights;
          this.newArray = flights;
          this.isSpinner = false;
          this.local.setSpinner(this.isSpinner);
        }
      },
      error: (error) => {
        this.openSnackBar(error, "Danger", false);
      },
    });
  }

  getMinmumDuration() {
    let durationArr: Array<any> = [];
    _.map(this.flightData, (duration) => {
      let obj = {
        time: duration.legs[0].connections[0].connectionHeader.legTravelTime,
        price: duration.totalPrice + duration.totalTax,
        currency: duration.currency,
      };
      durationArr.push(obj);
    });

    let minDurattion = _.orderBy(
      durationArr,
      ["time.addHours", "time.minutes"],
      ["asc", "asc"]
    );
    let msg = {
      currency: minDurattion[0].currency,
      price: minDurattion[0].price,
      duration: `${minDurattion[0].time.addHours} h ${minDurattion[0].time.minutes} m`,
    };
    return msg;
  }

  showPrice() {
    const sort = new FilterSort();
    let sortedData = sort.sortByAscCheapest(this.flightData)

    let msg = {
      currency: sortedData[0].customObj.currency,
      price: sortedData[0].customObj.price,
      duration: `${sortedData[0].customObj.time.addHours} h ${sortedData[0].customObj.time.minutes} m`,
    };
    return msg;
  }

  showBest() {
    let bestArr: Array<any> = [];
    _.map(this.flightData, (best) => {
      let newVal = {
        currency: best.currency,
        time: best.legs[0].connections[0].connectionHeader.legTravelTime,
        price: best.totalPrice + best.totalTax,
      };
      bestArr.push(newVal);
    });
    let newArr = _.orderBy(
      bestArr,
      ["time.addHours", "time.minutes", "price"],
      ["asc", "asc", "asc"]
    );
    let msg = {
      currency: newArr[0].currency,
      price: newArr[0].price,
      duration: `${newArr[0].time.addHours} h ${newArr[0].time.minutes} m`,
    };
    return msg;
  }

  sortCommonData(val: any) {
    const sort = new FilterSort();
    this.flightData = sort.getActiveSort(val, this.flightData)
    this.currentSort = val;
    this.afService.updateCurrentSort(this.currentSort);
    this.afService.updateFlights(this.flightData);
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ["success-snackbar"] : ["danger-snackbar"],
    });
  }

  ngOnDestroy(): void {
    this.filterFlightSubscription.unsubscribe();
  }
}
