import { BreakpointState } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import moment from 'moment';
import { BreakPointTracker } from 'src/app/_helpers/breakPointTracker.component';

@Component({
  selector: 'app-upcoming-history',
  templateUrl: './upcoming-history.component.html',
  styleUrls: ['./upcoming-history.component.scss']
})

export class UpcomingHistoryComponent implements OnInit {
  bagPrice: any = 0;
  @Input() public bookingHistory: any;

  isBelowSm: boolean = true;

  constructor(   private BTracker: BreakPointTracker,
        private changeDetector: ChangeDetectorRef) { }
  ngOnInit(): void {
    // console.log(this.bookingHistory);
    this.BTracker.isBelowSm().subscribe((isBelowSm: BreakpointState) => {
      this.isBelowSm = isBelowSm.matches;
    });
    this.changeDetector.detectChanges()
  }
  printHistory() {
    window.print();
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
