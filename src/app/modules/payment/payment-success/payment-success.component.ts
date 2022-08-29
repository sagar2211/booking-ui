import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { Width } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import _ from 'lodash';
import moment from 'moment';
@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  name = 'Angular';
  slideNo = 0;
  withAnim = true;
  resetAnim = true;

  @ViewChild('myCarousel') myCarousel!: NguCarousel<any>;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 4, lg: 4, all: 0 },
    load: 5,
    slide: 1,
    interval: { timing: 4000, initialDelay: 1000 },
    loop: true,
    touch: true,
    velocity: 0.2,
  }
  carouselItems: any[any] = [
    {
      image: 'item_1.png',
      color: '#EF9D12',
      heading: 'Auto-Check-In',
      content: 'Check in automatically, and collect all your boarding pass at the airport.'
    },
    {
      image: 'item_2.png',
      color: '#0057B9',
      heading: 'Apply For e-Visa ',
      content: 'Need e Visa to travel? Get your online now.'
    },
    {
      image: 'item_3.png',
      color: '#208467',
      heading: 'Protect Your Luggages',
      content: 'Protect your bags & get reimbursed for lost, stolen, or damaged luggage and personal items '
    },
    {
      image: 'item_4.png',
      color: '#EB2533',
      heading: 'Book Airport Transfer ',
      content: 'Avoide long taxi queues at the airport, book your transfer now '
    }
  ];
  mainItems: any[] = [...this.carouselItems]
  bookingHistory: any;
  constructor(private _cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router, private afService: AuthenticationService) { }

  ngOnInit(): void {
    let ticket: any = localStorage.getItem('tempTicket');
    this.bookingHistory = JSON.parse(ticket);
    this.bookingHistory = this.bookingHistory;
    // this.bookingHistory = this.afService.getBookingHistory();
  }

  carouselTileLoad(data: any) {
    let arr = this.carouselItems;
    this.carouselItems = [...this.carouselItems, ...this.mainItems];
    
  }

  openRefundPopup() {
    this.router.navigate(['/traveller/refund'])
  }

  timeDiffrence(time1: any, time2: any) {
    var startTime: any = moment(time1, "HH:mm:ss a");
    var endTime: any = moment(time2, "HH:mm:ss a");
    var __startTime = moment(time1).format();
    var __endTime = moment(time2).format();
    var _duration = moment.duration(moment(__endTime).diff(__startTime));
    var _hours = _duration.asHours();
    if (_hours > 24) {
      _hours = _hours / 24
    }
  }

  updateDate(date: any) {
    var dayName = moment(date).format('dddd');
    dayName = dayName.slice(0, 3);
    var day = moment(date).date();
    var oneDate = moment(date, 'DD-MM-YYYY');
    var monthName = oneDate.format('MM');
    var oneDate = moment();
    var monthName = oneDate.format('MMMM');
    monthName = monthName.slice(0, 3);

    let finalString = dayName + ',' + day + " " + monthName
    return finalString;
  }

  updateDate1(date: any) {
    var day = moment(date).date();
    var oneDate = moment(date, 'DD-MM-YYYY');
    var monthName = oneDate.format('MM');
    var oneDate = moment();
    var monthName = oneDate.format('MMMM');
    monthName = monthName.slice(0, 3);
    var year = moment(date).format("YY");
    let finalString = day + " " + monthName + " " + year;
    return finalString;
  }

  updateDate2(date: any) {
    var day = moment(date).date();
    var oneDate = moment(date, 'DD-MM-YYYY');
    var monthName = oneDate.format('MM');
    var oneDate = moment();
    var monthName = oneDate.format('MMMM');
    monthName = monthName.slice(0, 3);
    var year = moment(date).format("YY");
    let finalString = day + " " + monthName;
    return finalString;
  }

  updateTime(date: any) {
    let updatedTime = moment(date).format("hh:mm");
    let timeChecker = updatedTime.split(':')[0];
    if (+timeChecker <= 12) {
      updatedTime = updatedTime + ' AM';
    } else {
      updatedTime = updatedTime + ' PM';
    }
    return updatedTime;
  }

  getbaggagePrice(bagData: any) {
    var finalPrice = 0;
    if (bagData.length) {

      _.map(bagData, itr => {
        finalPrice = finalPrice + itr.servicePrice.value;
      })
      return {
        currency: bagData[0].servicePrice.currencyCode,
        price: finalPrice
      }
    } else {
      return {
        currency: "ZAR",
        price: finalPrice
      }
    }
  }

  getAddOnsPrice(service: any) {
    var finalPrice = 0;
    let services = service.hepstarServices;
    let wadiiaSupport = service.wadiiaSupport;
    if (services.length) {
      _.map(services, itr => {
        finalPrice = finalPrice + (+itr.price);
      })
      return {
        currency: services[0].currency,
        price: finalPrice + wadiiaSupport.price
      }
    } else {
      return {
        currency: services[0].currency,
        price: finalPrice + wadiiaSupport.price
      }
    }
  }
}
