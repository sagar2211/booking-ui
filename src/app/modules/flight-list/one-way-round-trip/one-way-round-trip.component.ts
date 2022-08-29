import { BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import _ from 'lodash';
import { AvailableFaresService } from 'src/app/services/available-fares.service';
import { BreakPointTracker } from 'src/app/_helpers/breakPointTracker.component';
import { HITCH_HIKER_URL } from "../../../../environments/environment";
import { MatDialog } from '@angular/material/dialog';
import { FilterFilghtComponent } from "../../filter/filter-filght/filter-filght.component"
@Component({
  selector: 'app-one-way-round-trip',
  templateUrl: './one-way-round-trip.component.html',
  styleUrls: ['./one-way-round-trip.component.scss']
})

export class OneWayRoundTripComponent implements OnInit {
  @Input() public flightData: any;
  H_URL = HITCH_HIKER_URL;
  flightDetailPanel: Array<any> = [];
  selectedFlight: any;
  isBelowLg: boolean = true;
  isBelowSm: boolean = true;
  dailogData: any;
  fliterKeys: any
  constructor(public dialog: MatDialog, private router: Router, private BTracker: BreakPointTracker, private changeDetector: ChangeDetectorRef, private afService: AvailableFaresService) { }

  ngOnInit(): void {
    this.afService.filterFlight$.subscribe((res: any) => {
      if (res !== null) {
        _.map(this.flightData, (itr, indx: any) => {
          if (this.flightDetailPanel[indx] === true)
            this.flightDetailPanel[indx] = false;
        })
      }
    })
    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });
    this.BTracker.isBelowSm().subscribe((isBelowSm: BreakpointState) => {
      this.isBelowSm = isBelowSm.matches;
    });
    this.changeDetector.detectChanges()
    this.afService.dailogData$.subscribe(key => {
      console.log("key", key);
      this.fliterKeys = key;
    })
  }

  toggleFlightDetailPanel(i: number) {
    _.map(this.flightData, (itr, indx: any) => {
      if (i !== indx && this.flightDetailPanel[indx] === true)
        this.flightDetailPanel[indx] = false;
    })
    this.flightDetailPanel[i] = !this.flightDetailPanel[i];
    this.selectedFlight = this.flightData[i];
  }

  updateNumber(num: any) {
    if (num >= 0 && num <= 9) {
      return "0" + num;
    } else {
      return num;
    }
  }

  bookFlight(flightData: any) {
    const queryParams: any = {}
    queryParams.flightData = JSON.stringify(flightData);
    let navigationExtras: NavigationExtras = { queryParams }
    let stepper = this.generateStepperObj(navigationExtras);
    localStorage.setItem('stepper', JSON.stringify(stepper));
    this.router.navigate(['/flight-booking/review-booking'], navigationExtras);
  }

  generateStepperObj(navigationExtras: any) {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    let stepperObj = {
      navigationExtras: navigationExtras
    }
    stepper.step2 = stepperObj;
    return stepper;
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
  getairlineLogo() {
  }

  // openDialog() {
  //   console.log("this.dailogData === ",this.dailogData);

  //   const dialogRef = this.dialog.open(FilterFilghtComponent, {
  //     height : '80%',
  //     data: {
  //       animal: 'panda'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  openDialog() {
    this.dialog.open(FilterFilghtComponent, {
      height: '80%'
    });
  }

}
