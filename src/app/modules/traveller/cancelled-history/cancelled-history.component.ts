import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancelled-history',
  templateUrl: './cancelled-history.component.html',
  styleUrls: ['./cancelled-history.component.scss']
})
export class CancelledHistoryComponent implements OnInit {
  @Input() public bookingHistory: any;
  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  openRefundPopup(){
    this.router.navigate(['/traveller/refund'])
  }

  printHistory(){
    window.print();
  }

}
