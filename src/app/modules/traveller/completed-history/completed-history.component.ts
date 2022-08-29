import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-completed-history',
  templateUrl: './completed-history.component.html',
  styleUrls: ['./completed-history.component.scss']
})
export class CompletedHistoryComponent implements OnInit {
  @Input() public bookingHistory: any;
  constructor() { }

  ngOnInit(): void {
  }

  printHistory(){
    window.print();
  }

}
