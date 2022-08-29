import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import {MatAccordion} from '@angular/material/expansion';
import { AvailableFaresService } from 'src/app/services/available-fares.service';
import * as _ from "lodash";
import { MatSnackBar } from '@angular/material/snack-bar';
import { HITCH_HIKER_URL } from "../../../../environments/environment";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-multi-trip-flight-details',
  templateUrl: './multi-trip-flight-details.component.html',
  styleUrls: ['./multi-trip-flight-details.component.scss']
})
export class MultiTripFlightDetailsComponent implements OnInit, OnDestroy {
  H_URL = HITCH_HIKER_URL;
  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion;
  @Input() public item:any;
  @Input() public flightDetailIndex:any;
  @Input() public flightDetailInnerIndex: any;
  @Input() public flightData:any;
  ancillariesData: any;
  collapseAllGroup= false;
  panelOpenState = false;
  selectedLegConnections: Array<any> = [];
  ancillariesSubscription!: Subscription;

  constructor(private afService: AvailableFaresService,private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    // this.getAncillariesData()
  }

  getAncillariesData(){
    if (this.flightDetailIndex) {
      const param = {
        fareIdentifier: {
          fareIndex: this.flightData[this.flightDetailIndex].identifier.fareIndex,
          fareResultID: this.flightData[this.flightDetailIndex].identifier.fareResultID,
        },
        selectedLegConnections: this.selectedLegConnections,
      };
      param.selectedLegConnections = [];
      _.map(this.flightData, (itr, indx) => {

        if (+indx === this.flightDetailIndex) {
          _.map(itr.legs, (loop) => {
            param.selectedLegConnections.push(0);
          });
        }
      });
      this.ancillariesSubscription = this.afService.ancillaries(param).subscribe({
        next: (data: any) => {
          this.ancillariesData = data.Result.result;
        },
        error: (err: any) => {
          this.openSnackBar(err, 'Danger', false);
        },
      });
    }
  }

  displayDate(date: any) {
    const day = date.split(".")[0];
    let getMonth = date.split(".")[1];
    const monthName = moment(getMonth, "M").format("MMMM");
    date = day + " " + monthName;
    return date;
  }

  updateFlightTime(time: any) {
    let updatedTimes = moment(time).format("HH:mm ");
    return updatedTimes;
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

  toggleGroup() {
    this.collapseAllGroup = !this.collapseAllGroup
  }

  openSnackBar(message: string, action: string, status:boolean) {
    this._snackBar.open(message, action,{
      duration: 3000,
      panelClass: status===true?['success-snackbar']:['danger-snackbar']
    });
  }

  ngOnDestroy(): void {
    this.ancillariesSubscription.unsubscribe();
  }
}
