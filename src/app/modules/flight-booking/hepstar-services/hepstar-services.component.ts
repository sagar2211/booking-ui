import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hepstar-services',
  templateUrl: './hepstar-services.component.html',
  styleUrls: ['./hepstar-services.component.scss']
})
export class HepstarServicesComponent implements OnInit {

  constructor() { }
  delayCompansation = false;
  failureProtection = false;
  cancellationProtection = false;
  delayCoverage = false;
  refundProtection = false;

  ngOnInit(): void {
  }

  onRadioChange(event: any) {
    
    // this.canViewDiv = event.value == 1;
  }

}
