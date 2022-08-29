import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { HITCH_HIKER_URL } from "../../../../environments/environment";

@Component({
  selector: 'app-multi-trip',
  templateUrl: './multi-trip.component.html',
  styleUrls: ['./multi-trip.component.scss']
})
export class MultiTripComponent implements OnInit {
  @Input() public flightData : any;
  H_URL = HITCH_HIKER_URL;
  panelOpenState = false;
  selectedFlightIndex!: number;
  flightDetailPanel: Array<any> = [];
  flightDetailLegsPanel: Array<any> = [];
  constructor() { }

  ngOnInit(): void {
  }

  toggleFlightDetailPanel(i: number,k: number) {
    this.selectedFlightIndex = i;
    this.flightDetailPanel[i] = !this.flightDetailPanel[i];
    this.flightDetailLegsPanel[k] = !this.flightDetailLegsPanel[k];
  }

  updateNumber(num: any) {
    if (num >= 0 && num <= 9) {
      return "0" + num;
    } else {
      return num;
    }
  }

}
