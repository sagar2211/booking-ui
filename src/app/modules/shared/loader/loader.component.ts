import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @ViewChild('loaderScroll', { read: ElementRef }) public panel!: ElementRef<any>;
  isPayment: boolean = false;
  scrollPosition!: number;
  headText = ""
  constructor() {
    let url = window.location.href;
    this.isPayment = url.includes("payment");
    if (this.isPayment) {
      this.headText = "Payment Processing.."
    } else {
      this.headText = "Searching for the best flights.."
    }
  }

  ngOnInit(): void {
  }

}
