import { Component, HostBinding, OnDestroy, OnInit} from "@angular/core";
import { AvailableFaresService } from "../../../services/available-fares.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import { LocalService } from "src/app/services/local.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FilterSort } from "src/app/models/filter-sort-model";
import { Subscription } from "rxjs";
@Component({
  selector: "app-flights",
  templateUrl: "./flights.component.html",
  styleUrls: ["./flights.component.scss"],
})
export class FlightsComponent implements OnInit, OnDestroy {
  flights: any;
  flightData: any;
  flightDataClone: any;
  currentTripType: any;
  isSpinner = false;
  @HostBinding("@.disabled") disabled = true;
  filterFlightSubscription!: Subscription;
  constructor(
    private afService: AvailableFaresService,
    private activatedRoute: ActivatedRoute,
    private local: LocalService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) { }
  
  ngOnInit(): void {
    this.isSpinner = true;
    let searchObj: any = this.activatedRoute.snapshot.queryParamMap.get('searchObj');
    searchObj = JSON.parse(searchObj);
    this.currentTripType = searchObj.tripType;
    this.getFlightInfo(searchObj);

    this.filterFlightSubscription = this.afService.filterFlight$.subscribe({
      next: (flights: any) => {
        if (flights === "Flight not found.") {
          this.flightData = null;
        } else {
          this.flightData = flights;
          this.isSpinner = false;
          this.local.setSpinner(this.isSpinner);
        }
      },
      error: (error) => {
        this.openSnackBar(error, 'Danger', false);
      },
    });
  }

  getFlightInfo(reqObject: any) {
    const sort = new FilterSort();
    this.isSpinner = true;
    this.local.setSpinner(this.isSpinner);
    this.afService.searchFlight(reqObject).subscribe({
      next: (data: any) => {
        if (data.Result) {
          this.flightData = sort.sortByAscCheapest(data.Result.result.fareSearchResult.fares);
          this.isSpinner = false;
          this.local.setSpinner(this.isSpinner);
          this.flightDataClone = _.cloneDeep(this.flightData);
        } else {
          this.flightData = null;
          this.isSpinner = false;
          this.local.setSpinner(this.isSpinner);
        }
      },
      error: (error:any) => {
        this.isSpinner = false;
        this.openSnackBar("Invalid Parameter", 'Danger', false);
        this.local.setSpinner(this.isSpinner);
        this.router.navigate([`/search/searchFlight`]);
      }
    }
)
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ['success-snackbar'] : ['danger-snackbar']
    });
  }

  ngOnDestroy(): void {
    this.filterFlightSubscription.unsubscribe();
  }
}