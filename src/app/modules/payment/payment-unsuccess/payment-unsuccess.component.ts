import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-payment-unsuccess',
  templateUrl: './payment-unsuccess.component.html',
  styleUrls: ['./payment-unsuccess.component.scss']
})
export class PaymentUnsuccessComponent implements OnInit {
  errorObj: any
  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    let errObj:any = this.activatedRoute.snapshot.queryParamMap.get('errObj');
    this.errorObj = JSON.parse(errObj);
  }

}
