import { Component, ElementRef, Input, Output, EventEmitter, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginSignupPopupComponent } from "../login-signup-popup/login-signup-popup.component";
import countryInfo from '../../../../assets/json/countryList.json';
import bagArray from '../../../../assets/json/airlineBaggageCode.json';
import * as _ from "lodash";
import moment from 'moment';
import { LocaleConfig, LocaleService } from 'ngx-daterangepicker-material';
import {
  SearchCountryField,
  CountryISO
} from "ngx-intl-tel-input";
import { AvailableFaresService } from 'src/app/services/available-fares.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { castArray, isObject } from 'lodash';
import { BreakpointState } from '@angular/cdk/layout';
import { BreakPointTracker } from 'src/app/_helpers/breakPointTracker.component';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
  providers: [LocaleService]
})

export class BookingFormComponent implements OnInit {
  moment = moment;
  calendarLocale1: LocaleConfig;
  calendarPlaceholder: string;
  selectedRange: any = { startDate: null, endDate: null };
  selectedRange1: any = { startDate: null, endDate: null };
  selectedRange2: any = { startDate: null, endDate: null };
  selectedRange3: any = { startDate: null, endDate: null };
  selectedRange4: any = { startDate: null, endDate: null };
  selectedRange5: any = { startDate: null, endDate: null };
  selectedRange6: any = { startDate: null, endDate: null };

  localconfi: any = { separator: ' To ', format: 'DD/MM/YYYY', direction: 'ltr', weekLabel: 'W', cancelLabel: 'Cancel', customRangeLabel: 'Custom range', daysOfWeek: moment.weekdaysMin(), monthNames: moment.monthsShort(), firstDay: moment.localeData().firstDayOfWeek() };
  @ViewChildren("carryOnBag") carryOnBag!: QueryList<ElementRef>;
  @ViewChildren("simpleOnBag") simpleOnBag!: QueryList<ElementRef>;
  @ViewChildren("luggageBag") luggageBag!: QueryList<ElementRef>;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  @Input() public updatedWidth: any;
  @Input() public selectedFlight: any;
  @Input() public travellData: any;
  // @Input() public ancillariesData: any;
  ancillariesData: any = [];
  travellerForm!: FormGroup;
  @Output() newItemEvent = new EventEmitter<string>();
  adultAge: any = 18;
  childAge: any = 12;
  infantAge: any = 2;
  savedTraveller: any = [];
  addNewItem(value: any) {
    this.newItemEvent.emit(value);
  }
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === "month") {
      const date = cellDate.getDate();
      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? "example-custom-date-class" : "";
    }
    return "";
  };

  isBelowLg: boolean = true;

  userName: any;
  allCountry: any;
  nationality: any;
  maxDate: any;
  minDate: any;
  isLoggedIn: any;
  submitted: boolean = false;
  travellUser: any
  passangerInfo: any;
  selectedIndex: number = 0;
  smallBag: number = 0;
  // ancillariesData: any;
  adultBaggageArray = <any>[];
  childBaggageArray = <any>[];
  adultLuggageArray = <any>[];
  childLuggageArray = <any>[];
  simplebaggageArray = <any>[];
  luggage = <any>[];
  passangerType: any = 0;
  renderAudltDate: any = [];
  renderAudltIssueDate: any = [];
  renderAudltvalidDate: any = [];
  renderChildDOB: any = [];
  renderChildIssueDate: any = [];
  renderChildvalidDate: any = [];
  renderInfantDate: any = [];
  childLuggage = <any>[];
  baggage = <any>[];
  freeAdultBaggageArray = <any>[];
  freeChildBaggageArray = <any>[];
  childBaggage = <any>[];
  childFreeLuggage = <any>[];
  adultFreeLuggage = <any>[];
  constructor(private formbuilder: FormBuilder, private authService: AuthenticationService, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute, private afService: AvailableFaresService, private _snackBar: MatSnackBar, private local: LocalService, private BTracker: BreakPointTracker, private changeDetector: ChangeDetectorRef) {
    this.calendarLocale1 = {
      customRangeLabel: 'Pick a date...',
      applyLabel: 'Apply',
      clearLabel: 'Clear',
      format: 'DD-MM-YYYY',
      firstDay: 1
    };
    let user = this.getUser();
    this.calendarPlaceholder = 'Date(DD-MM-YYYY)';
    // const pastDate = moment(user.dateOfBirth.startDate);
    // const currentDate = moment();
    // let dayDiff = pastDate.diff(currentDate, 'days');
    // this.selectedRange.startDate = moment().add(dayDiff, 'days').startOf('day');
    // this.selectedRange.endDate = moment().add(dayDiff, 'days').startOf('day');
  }

  ngOnInit(): void {
    let day = moment(this.minDate).date();
    let month = moment(this.minDate).month() + 1;
    let year = moment(this.minDate).year();
    this.minDate = { day: day, month: month, year: year, };
    this.maxDate = { day: day, month: month, year: year, };
    this.allCountry = [...countryInfo];
    this.nationality = [...countryInfo];
    this.getPassangerInfo();
    this.createForm();
    this.getSaveTraveller();

    this.getUser();
    if (this.travellData) {
      this.travellData.adultArray;
      _.map(this.travellData.adultArray, (travellerInfo, indx) => {
        this.addAdultTraveller(indx, travellerInfo);
      });
      _.map(this.travellData.childArray, (travellerInfo, indx) => {
        this.addChildTraveller(travellerInfo, indx);
      });
      _.map(this.travellData.infantArray, (travellerInfo, indx) => {
        this.addInfantTraveller(travellerInfo, indx);
      });
    } else {
      _.map(this.passangerInfo.adultPassengers.passengers, (itr, indx) => {
        this.addAdultTraveller(indx);
      });
      _.map(this.passangerInfo.childPassengers.passengers, itr => {
        this.addChildTraveller();
      });
      _.map(this.passangerInfo.infantPassengers.passengers, itr => {
        this.addInfantTraveller();
      });
    }
    this.getBaggage();
    setTimeout(() => {
    }, 5000);
  

    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });
    this.changeDetector.detectChanges()
  }

  get adult() { return this.travellerForm.get('adultArray') as FormArray; }
  get child() { return this.travellerForm.get('childArray') as FormArray; }
  get infant() { return this.travellerForm.get('infantArray') as FormArray; }

  createForm() {
    this.travellerForm = this.formbuilder.group({
      adultArray: this.formbuilder.array([]),
      childArray: this.formbuilder.array([]),
      infantArray: this.formbuilder.array([])
    });
  }

  getSaveTraveller() {
    let loginUserInfo = localStorage.getItem('authUser');
    if (loginUserInfo) {
      let data = JSON.parse(loginUserInfo);
      this.savedTraveller = data.travellerArray;
    }
  }

  //child carry-on baggage functionality start
  increseChildCarryOnBag(val: any, luggageIndex: any, bag: any, childIndex: any) {
    this.getChildCarryLuggage(childIndex);
    if (this.childBaggage.length <= 3) {
      let isExist = _.filter(this.childBaggage, itr => {
        if (itr.id === luggageIndex) {
          return itr
        }
      })

      if (isExist.length === 0) {
        let luggageInfo = {
          id: luggageIndex,
          bagInfo: {
            bookingCode: bag.bookingCode,
            count: +val + 1,
            currencyCode: bag.currencyCode,
            price: bag.price,
            priceId: bag.priceID,
            serviceDescription: bag.serviceDescription,
            text: bag.text
          }
        }
        this.childBaggage.push(luggageInfo);
      } else {
        _.find(this.childBaggage, itr => {
          if (itr.id === luggageIndex && +val < 1) {
            itr.bagInfo.count = +val + 1
          }
        })
      }
      this.updateChildPassengerCarryBag(this.childBaggage, childIndex);
    }
  }

  decreseChildCarryOnBag(val: any, luggageIndex: any, bag: any, childIndex: any) {
    this.getChildCarryLuggage(childIndex);

    _.find(this.childBaggage, itr => {
      if (itr.id === luggageIndex) {
        if (+val !== 0) {
          itr.bagInfo.count = +val - 1
        }
      }
    })
    this.updateChildPassengerCarryBag(this.childBaggage, childIndex);
  }

  getChildCarryBaggageVal(i: any, j: any) {
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(i) as FormGroup).get('baggageStyle1')?.value;
    let data = _.filter(luggage, (itr, k) => {
      return k == j;
    });
    return data[0].bagInfo.count;
  }

  getChildCarryLuggage(childIndex: any) {
    this.childBaggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle1')?.value;
  }

  updateChildPassengerCarryBag(luggage: any, childIndex: any) {
    if (luggage.length)
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle1')?.patchValue(luggage);
    else
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle1')?.patchValue(null);
  }

  getChildCarryBaggageCount(childIndex: any) {
    let count = 0;
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle1')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        count += itr.bagInfo.count
      })
    }
    return count
  }

  getChildCarryBaggageTypeCount(childIndex: any) {
    let count = 0;
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle1')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        if (itr.bagInfo.count > 0)
          count += itr.bagInfo.count > 0 ? 1 : 0
      })
    }
    return count
  }

  getChildAllCarryOnBagPrice(childIndex: any) {
    let allLuggageprice = 0;
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle1')?.value;
    if (luggage) {
      _.map(luggage, (itr, i) => {
        allLuggageprice += itr.bagInfo.price * itr.bagInfo.count
      })
    }
    return allLuggageprice.toFixed(2);
  }
  //child carry-on baggage functionality start

  //adult carry-on baggage functionality start
  increseCarryOnBag(val: any, luggageIndex: any, bag: any, adultIndex: any) {
    this.getAdultCarryLuggage(adultIndex);
    if (this.baggage.length <= 3) {
      let isExist = _.filter(this.baggage, itr => {
        if (itr.id === luggageIndex) {
          return itr
        }
      })

      if (isExist.length === 0) {
        let luggageInfo = {
          id: luggageIndex,
          bagInfo: {
            bookingCode: bag.bookingCode,
            count: +val + 1,
            currencyCode: bag.currencyCode,
            price: bag.price,
            priceId: bag.priceID,
            serviceDescription: bag.serviceDescription,
            text: bag.text
          }
        }
        this.baggage.push(luggageInfo);
      } else {
        _.find(this.baggage, itr => {
          if (itr.id === luggageIndex && +val < 1) {
            itr.bagInfo.count = +val + 1
          }
        })
      }
      this.updatePassengerCarryBag(this.baggage, adultIndex);
    }
  }

  decreseCarryOnBag(val: any, luggageIndex: any, bag: any, adultIndex: any) {
    this.getAdultCarryLuggage(adultIndex);

    _.find(this.baggage, itr => {
      if (itr.id === luggageIndex) {
        if (+val !== 0) {
          itr.bagInfo.count = +val - 1
        }
      }
    })
    this.updatePassengerCarryBag(this.baggage, adultIndex);
  }

  getCarryBaggageVal(i: any, j: any) {
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(i) as FormGroup).get('baggageStyle1')?.value;
    let data = _.filter(luggage, (itr, k) => {
      return k == j;
    });
    return data[0].bagInfo.count;
  }

  getAdultCarryLuggage(adultIndex: any) {
    this.baggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle1')?.value;
  }

  updatePassengerCarryBag(luggage: any, adultIndex: any) {
    if (luggage.length)
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle1')?.patchValue(luggage);
    else
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle1')?.patchValue(null);
  }

  getCarryBaggageCount(adultIndex: any) {
    let count = 0;
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle1')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        count += itr.bagInfo.count
      })
    }
    return count
  }

  getCarryBaggageTypeCount(adultIndex: any) {
    let count = 0;
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle1')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        if (itr.bagInfo.count > 0)
          count += itr.bagInfo.count > 0 ? 1 : 0
      })
    }
    return count
  }

  getAllCarryOnBagPrice(adultIndex: any) {
    let allLuggageprice = 0;
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle1')?.value;
    if (luggage) {
      _.map(luggage, (itr, i) => {
        allLuggageprice += itr.bagInfo.price * itr.bagInfo.count
      })
    }

    return allLuggageprice > 0 ? allLuggageprice.toFixed(2) : 0;
  }

  //adult carry-on baggage functionality start

  //adult luggage functionality start
  increseLuggageBag(val: any, luggageIndex: any, bag: any, adultIndex: any) {
    this.getAdultLuggage(adultIndex);
    let luggage = _.cloneDeep(this.luggage);
    
    if (luggage.length <= 5) {
      _.map(luggage, (itr) => {
        if (itr.bagInfo.code === "0C6"|| itr.bagInfo.code === "0CC" || itr.bagInfo.code === "0CE" || itr.bagInfo.code === "0CD" || itr.bagInfo.code === "0CE" || itr.bagInfo.code === "1P15" || itr.bagInfo.code === "1P20" || itr.bagInfo.code === "2P40" || itr.bagInfo.code === "1P23") {
          if (itr.id === luggageIndex && +val < 1 && luggageIndex === 0) {
            itr.bagInfo.count = +val + 1;
          } else if (itr.id === luggageIndex && +val < 1 && (luggageIndex > 0 && luggage[luggageIndex - 1].bagInfo.count > 0)) {
            itr.bagInfo.count = +val + 1;
          }
        } else {
          if (itr.id === luggageIndex && +val < 3 && luggageIndex === 0) {
            itr.bagInfo.count = +val + 1;
          } else if (itr.id === luggageIndex && +val < 3 && (luggageIndex > 0 && luggage[luggageIndex - 1].bagInfo.count > 0)) {
            itr.bagInfo.count = +val + 1;
          }
        }
      })

      this.updatePassengerBag(luggage, adultIndex);
    }
  }

  decreseLuggageBag(val: any, luggageIndex: any, bag: any, adultIndex: any) {
    this.getAdultLuggage(adultIndex);
    let luggage = _.cloneDeep(this.luggage);
    _.map(luggage, (itr, m) => {
      if (itr.id === luggageIndex) {
        if (+val !== 0) {
          itr.bagInfo.count = +val - 1
        }
      }

      if (luggageIndex < luggage.length - 1 && (+m > luggageIndex)) {
        if (+val !== 0) {
          itr.bagInfo.count = 0
        }
      }
    })
    this.updatePassengerBag(luggage, adultIndex);
  }

  getLuggageVal(i: any, j: any) {
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(i) as FormGroup).get('baggageStyle2')?.value;
    if (luggage) {
      let data = _.filter(luggage, (itr, k) => {
        return k == j;
      });
      return data[0].bagInfo.count;
    } else {
      return 0;
    }
  }

  onAdultClick(adultIndex: any) {
    this.getAdultLuggage(adultIndex)
  }

  getAdultLuggage(adultIndex: any) {
    this.luggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle2')?.value;
  }

  updatePassengerBag(luggage: any, adultIndex: any) {
    if (luggage.length)
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle2')?.patchValue(luggage);
    else
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle2')?.patchValue(null);
  }

  getLuggageCount(adultIndex: any) {

    let count = 0;
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle2')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        count += itr.bagInfo?.count
      })
    }
    return count
  }

  getLuggageTypeCount(adultIndex: any) {
    let count = 0;
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle2')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        if (itr.bagInfo.count > 0)
          count += itr.bagInfo?.count > 0 ? 1 : 0
      })
    }
    return count
  }

  getAllBagPrice(adultIndex: any) {
    let allLuggageprice = 0;
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle2')?.value;
    if (luggage) {
      _.map(luggage, (itr, i) => {
        allLuggageprice += itr.bagInfo.price * itr.bagInfo.count
      })
    }
    this.addNewItem(allLuggageprice);

    return allLuggageprice;
  }

  disabledButton(i: any, j: any) {
    let luggage = ((this.travellerForm.get("adultArray") as FormArray).at(i) as FormGroup).get('baggageStyle2')?.value;
    let check = _.filter(luggage, (itr, k): any => {
      return (j == k && j != 0 && luggage[j - 1].bagInfo.count < 1)
    })
    if (check.length) {
      return true
    } else {
      return false
    }
  }
  //adult luggage functionality end

  //child luggage functionality start
  increseChildLuggageBag(val: any, luggageIndex: any, bag: any, childIndex: any) {
    this.getChildLuggage(childIndex);
    let childLuggage = _.cloneDeep(this.childLuggage);
    if (childLuggage.length <= 3) {
      _.map(childLuggage, (itr) => {
        if (itr.bagInfo.code === "0CC" || itr.bagInfo.code === "0CE" || itr.bagInfo.code === "0CD" || itr.bagInfo.code === "0CE" || itr.bagInfo.code === "1P15" || itr.bagInfo.code === "1P20" || itr.bagInfo.code === "2P40" || itr.bagInfo.code === "1P23") {
          if (itr.id === luggageIndex && +val < 1 && luggageIndex === 0) {
            itr.bagInfo.count = +val + 1;
          } else if (itr.id === luggageIndex && +val < 1 && (luggageIndex > 0 && childLuggage[luggageIndex - 1].bagInfo.count > 0)) {
            itr.bagInfo.count = +val + 1;
          }
        } else {
          if (itr.id === luggageIndex && +val < 3 && luggageIndex === 0) {
            itr.bagInfo.count = +val + 1;
          } else if (itr.id === luggageIndex && +val < 3 && (luggageIndex > 0 && childLuggage[luggageIndex - 1].bagInfo.count > 0)) {
            itr.bagInfo.count = +val + 1;
          }
        }
      })
      this.updateChildPassengerBag(childLuggage, childIndex);
    }
  }

  decreseChildLuggageBag(val: any, luggageIndex: any, bag: any, childIndex: any) {
    this.getChildLuggage(childIndex);
    let childLuggage = _.cloneDeep(this.childLuggage);
    _.map(childLuggage, (itr, m) => {
      if (itr.id === luggageIndex) {
        if (+val !== 0) {
          itr.bagInfo.count = +val - 1
        }
      }

      if (luggageIndex < childLuggage.length - 1 && (+m > luggageIndex)) {
        if (+val !== 0) {
          itr.bagInfo.count = 0
        }
      }
    })
    this.updateChildPassengerBag(childLuggage, childIndex);
  }

  getChildLuggageVal(i: any, j: any) {
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(i) as FormGroup).get('baggageStyle2')?.value;
    let data = _.filter(luggage, (itr, k) => {
      return k == j
    });
    return data[0]?.bagInfo.count;
  }

  getChildLuggageCount(childIndex: any) {
    let count = 0;
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle2')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        count += itr.bagInfo.count
      })
    }
    return count
  }

  getChildLuggageTypeCount(childIndex: any) {
    let count = 0;
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle2')?.value;
    if (luggage) {
      _.map(luggage, (itr, k) => {
        if (itr.bagInfo.count > 0)
          count += itr.bagInfo.count > 0 ? 1 : 0
      })
    }
    return count
  }

  getChildAllBagPrice(childIndex: any) {
    let allLuggageprice = 0;
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle2')?.value;
    if (luggage) {
      _.map(luggage, (itr, i) => {
        allLuggageprice += itr.bagInfo.price * itr.bagInfo.count
      })
    }
    return allLuggageprice;
  }

  getChildLuggage(childIndex: any) {
    this.childLuggage = ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle2')?.value;
  }

  updateChildPassengerBag(luggage: any, childIndex: any) {
    if (luggage.length)
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle2')?.patchValue(luggage);
    else
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle2')?.patchValue(null);
  }

  disabledChildButton(i: any, j: any) {
    let luggage = ((this.travellerForm.get("childArray") as FormArray).at(i) as FormGroup).get('baggageStyle2')?.value;
    let check = _.filter(luggage, (itr, k): any => {
      return (j == k && j != 0 && luggage[j - 1].bagInfo.count < 1)
    })
    if (check.length) {
      return true
    } else {
      return false
    }
  }

  //child luggage functionality end
  adultTravellers(): FormArray {
    // this.travellerForm.get("adultArray") as FormArray
    return this.travellerForm.get("adultArray") as FormArray;
  }

  childTravellers(): FormArray {
    // this.travellerForm.get("childArray") as FormArray
    return this.travellerForm.get("childArray") as FormArray;
  }

  infantTravellers(): FormArray {
    // this.travellerForm.get("infantArray") as FormArray
    return this.travellerForm.get("infantArray") as FormArray;
  }

  addAdultTraveller(indx?: any, travellerInfo?: any,): void {
    this.adultTravellers().push(this.newAdultTravellers());
    if (travellerInfo) {
      this.editAdultTravellers(travellerInfo, indx)
      if (indx === 0) {
        setTimeout(() => {
          this.getAdultLuggage(indx)
        }, 1000);
      }
    } else {
      let mainUserInfo: any = localStorage.getItem('authUser');
      if (indx === 0 && mainUserInfo) {
        mainUserInfo = JSON.parse(mainUserInfo);
        let adultIndex = 0;
        setTimeout(() => {
          if (mainUserInfo.dateOfBirth) {
            const pastDate = moment(mainUserInfo.dateOfBirth.startDate);
            const currentDate = moment();
            let dayDiff = pastDate.diff(currentDate, 'days');
            this.selectedRange.startDate = moment().add(dayDiff, 'days').startOf('day');
            this.selectedRange.endDate = moment().add(dayDiff, 'days').startOf('day');
            ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('dateOfBirth')?.patchValue({
              endDate: this.selectedRange.endDate,
              startDate: this.selectedRange.startDate
            });
          }
          ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('prefix')?.patchValue(mainUserInfo?.prefix);
          ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('firstName')?.patchValue(mainUserInfo?.firstName);
          ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('middleName')?.patchValue(mainUserInfo?.middleName);
          ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('lastName')?.patchValue(mainUserInfo?.lastName);
          ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('email')?.patchValue(mainUserInfo?.email);
          ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('phone')?.patchValue(mainUserInfo?.mobile);
        }, 100);
      }
    }
  }

  addChildTraveller(travellerInfo?: any, indx?: any): void {
    this.childTravellers().push(this.newChildTravellers());
    if (travellerInfo) {
      this.editChildTravellers(travellerInfo, indx)
      if (indx === 0) {
        setTimeout(() => {
          this.getChildLuggage(indx);
        }, 1000)
      }
    }
  }

  addInfantTraveller(travellerInfo?: any, indx?: any): void {
    this.infantTravellers().push(this.newInfantTravellers());
    if (travellerInfo) {
      this.editInfantTravellers(travellerInfo, indx)
    }
  }

  removeTraveller(index: any) {
    this.adultTravellers().removeAt(index);
  }

  newAdultTravellers(): FormGroup {
    return this.formbuilder.group({
      prefix: ["Mr", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      documentId: ["", Validators.required],
      documentType: ["", Validators.required],
      country: ["", Validators.required],
      nationality: ["", Validators.required],
      issuedDate: ["", Validators.required],
      validTill: ["", Validators.required],
      email: ["", Validators.required],
      phone: [""],
      type: ["ADT"],
      BookdetailsOnWhatsApp: [""],
      Newsletter: [""],
      termAndCondition: ["", Validators.required],
      baggageStyle1: [null],
      baggageStyle2: [null]
    });
  }

  editAdultTravellers(travellerInfo: any, adultIndex: any) {
    const pastDate = moment(travellerInfo.dateOfBirth.startDate);
    const currentDate = moment();
    let dayDiff = pastDate.diff(currentDate, 'days');
    this.selectedRange.startDate = moment().add(dayDiff, 'days').startOf('day');
    this.selectedRange.endDate = moment().add(dayDiff, 'days').startOf('day');
    ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('dateOfBirth')?.patchValue({
      endDate: this.selectedRange.endDate,
      startDate: this.selectedRange.startDate
    });

    const pastDate1 = moment(travellerInfo.issuedDate.startDate);
    let dayDiff1 = pastDate1.diff(currentDate, 'days');
    this.selectedRange1.startDate = moment().add(dayDiff1, 'days').startOf('day');
    this.selectedRange1.endDate = moment().add(dayDiff1, 'days').startOf('day');
    ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('issuedDate')?.patchValue({
      endDate: this.selectedRange1.endDate,
      startDate: this.selectedRange1.startDate
    });

    const pastDate2 = moment(travellerInfo.validTill.startDate);
    let dayDiff2 = pastDate2.diff(currentDate, 'days');
    this.selectedRange2.startDate = moment().add(dayDiff2, 'days').startOf('day');
    this.selectedRange2.endDate = moment().add(dayDiff2, 'days').startOf('day');
    ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('validTill')?.patchValue({
      endDate: this.selectedRange2.endDate,
      startDate: this.selectedRange2.startDate
    });

    setTimeout(() => {
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('prefix')?.patchValue(travellerInfo.prefix);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('firstName')?.patchValue(travellerInfo.firstName);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('middleName')?.patchValue(travellerInfo.middleName);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('lastName')?.patchValue(travellerInfo.lastName);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('documentId')?.patchValue(travellerInfo.documentId);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('documentType')?.patchValue(travellerInfo.documentType);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('country')?.patchValue(travellerInfo.country);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('nationality')?.patchValue(travellerInfo.nationality);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('email')?.patchValue(travellerInfo.email);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('phone')?.patchValue(travellerInfo.phone);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('type')?.patchValue(travellerInfo.type);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('BookdetailsOnWhatsApp')?.patchValue(travellerInfo.BookdetailsOnWhatsApp);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('Newsletter')?.patchValue(travellerInfo.Newsletter);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('termAndCondition')?.patchValue(travellerInfo.termAndCondition);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle1')?.patchValue(travellerInfo.baggageStyle1);
      ((this.travellerForm.get("adultArray") as FormArray).at(adultIndex) as FormGroup).get('baggageStyle2')?.patchValue(travellerInfo.baggageStyle2);
    }, 100);
  }

  newChildTravellers(): FormGroup {
    return this.formbuilder.group({
      prefix: ["Mr", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      documentId: ["", Validators.required],
      documentType: ["", Validators.required],
      country: ["", Validators.required],
      nationality: ["", Validators.required],
      issuedDate: ["", Validators.required],
      validTill: ["", Validators.required],
      email: ["", Validators.required],
      phone: [""],
      type: ["CHD"],
      baggageStyle1: [null],
      baggageStyle2: [null]
    });
  }

  editChildTravellers(travellerInfo: any, childIndex: any) {
    const pastDate = moment(travellerInfo.dateOfBirth.startDate);
    const currentDate = moment();
    let dayDiff = pastDate.diff(currentDate, 'days');
    this.selectedRange3.startDate = moment().add(dayDiff, 'days').startOf('day');
    this.selectedRange3.endDate = moment().add(dayDiff, 'days').startOf('day');
    ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('dateOfBirth')?.patchValue({
      endDate: this.selectedRange3.endDate,
      startDate: this.selectedRange3.startDate
    });

    const pastDate1 = moment(travellerInfo.issuedDate.startDate);
    let dayDiff1 = pastDate1.diff(currentDate, 'days');
    this.selectedRange4.startDate = moment().add(dayDiff1, 'days').startOf('day');
    this.selectedRange4.endDate = moment().add(dayDiff1, 'days').startOf('day');
    ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('issuedDate')?.patchValue({
      endDate: this.selectedRange4.endDate,
      startDate: this.selectedRange4.startDate
    });

    const pastDate2 = moment(travellerInfo.validTill.startDate);
    let dayDiff2 = pastDate2.diff(currentDate, 'days');
    this.selectedRange5.startDate = moment().add(dayDiff2, 'days').startOf('day');
    this.selectedRange5.endDate = moment().add(dayDiff2, 'days').startOf('day');
    ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('validTill')?.patchValue({
      endDate: this.selectedRange5.endDate,
      startDate: this.selectedRange5.startDate
    });

    setTimeout(() => {
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('prefix')?.patchValue(travellerInfo.prefix);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('firstName')?.patchValue(travellerInfo.firstName);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('middleName')?.patchValue(travellerInfo.middleName);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('lastName')?.patchValue(travellerInfo.lastName);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('documentId')?.patchValue(travellerInfo.documentId);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('documentType')?.patchValue(travellerInfo.documentType);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('country')?.patchValue(travellerInfo.country);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('nationality')?.patchValue(travellerInfo.nationality);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('email')?.patchValue(travellerInfo.email);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('phone')?.patchValue(travellerInfo.phone);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('type')?.patchValue(travellerInfo.type);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle1')?.patchValue(travellerInfo.baggageStyle1);
      ((this.travellerForm.get("childArray") as FormArray).at(childIndex) as FormGroup).get('baggageStyle2')?.patchValue(travellerInfo.baggageStyle2);
    }, 100);
  }

  newInfantTravellers(): FormGroup {
    return this.formbuilder.group({
      prefix: ["Mr", Validators.required],
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      type: ["INF"]
    });
  }

  editInfantTravellers(travellerInfo: any, infantIndex: any) {
    const pastDate1 = moment(travellerInfo.dateOfBirth.startDate);
    const currentDate = moment();
    let dayDiff1 = pastDate1.diff(currentDate, 'days');
    this.selectedRange6.startDate = moment().add(dayDiff1, 'days').startOf('day');
    this.selectedRange6.endDate = moment().add(dayDiff1, 'days').startOf('day');
    ((this.travellerForm.get("infantArray") as FormArray).at(infantIndex) as FormGroup).get('dateOfBirth')?.patchValue({
      endDate: this.selectedRange6.endDate,
      startDate: this.selectedRange6.startDate
    });

    setTimeout(() => {
      ((this.travellerForm.get("infantArray") as FormArray).at(infantIndex) as FormGroup).get('prefix')?.patchValue(travellerInfo.prefix);
      ((this.travellerForm.get("infantArray") as FormArray).at(infantIndex) as FormGroup).get('firstName')?.patchValue(travellerInfo.firstName);
      ((this.travellerForm.get("infantArray") as FormArray).at(infantIndex) as FormGroup).get('middleName')?.patchValue(travellerInfo.middleName);
      ((this.travellerForm.get("infantArray") as FormArray).at(infantIndex) as FormGroup).get('lastName')?.patchValue(travellerInfo.lastName);
      ((this.travellerForm.get("infantArray") as FormArray).at(infantIndex) as FormGroup).get('type')?.patchValue("INF");
    }, 100);
  }

  editUserInfo() {
    this.travellerForm.patchValue({
      email: this.travellData.email ? this.travellData.email : null,
      phone: this.travellData.phone ? this.travellData.phone : null,
      BookdetailsOnWhatsApp: this.travellData.BookdetailsOnWhatsApp ? this.travellData.BookdetailsOnWhatsApp : null,
      Newsletter: this.travellData.Newsletter ? this.travellData.Newsletter : null,
      termAndCondition: this.travellData.termAndCondition ? this.travellData.termAndCondition : null
    })
  }

  showCountryResult(event: any) {
    this.allCountry = [...countryInfo];
    let newCountry: Array<any> = []
    let country = event.target.value.toLowerCase();
    _.map(this.allCountry, itr => {
      let newItr = itr.name.toLowerCase();
      if (newItr.includes(country)) {
        newCountry.push(itr);
        this.allCountry = newCountry;
      }
    })
  }

  showNationalityResult(event: any) {
    this.nationality = [...countryInfo];
    let newNationality: Array<any> = []
    let nationality = event.target.value.toLowerCase();
    _.map(this.nationality, itr => {
      let newItr = itr.name.toLowerCase();
      if (newItr.includes(nationality)) {
        newNationality.push(itr);
        this.nationality = newNationality;
      }
    })
  }

  getUser() {
    var userInfo: any;
    this.isLoggedIn = this.authService.isLoggedIn;
    if (this.isLoggedIn) {
      userInfo = localStorage.getItem('authUser');
      userInfo = JSON.parse(userInfo)
      this.userName = userInfo.firstName + ' ' + userInfo.lastName;
    } else {
      this.userName = ""
    }
    return userInfo
  }

  openPopup() {
    const dialogRef = this.dialog.open(LoginSignupPopupComponent, {
      data: '',
      height: '550px',
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.data.status) {
        this.isLoggedIn = true;
        this.userName = result.data.response.user.firstName + ' ' + result.data.response.user.lastName;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.travellerForm.status === 'INVALID') {
      return
    }
    // let mainUserInfo: any = localStorage.getItem('authUser');

    // if (!mainUserInfo) {
    //   this.openSnackBar("Please sign in / sign up for complete your flight booking.", "Danger", false);
    //   return
    // }
    const queryParams: any = {}
    let userObj: any = {
      flightData: this.selectedFlight,
      travellData: this.travellerForm.value
    }

    queryParams.userObj = JSON.stringify(userObj);

    let navigationExtras: NavigationExtras = { queryParams }
    let stepper = this.generateStepperObj(navigationExtras)
    localStorage.setItem('stepper', JSON.stringify(stepper));
    this.router.navigate(['/flight-booking/ancillaries-info'], navigationExtras);
  }

  onBack() {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;

    if (stepper.step1 !== null) {
      if (stepper.step1.departCode === stepper.step1.arrivalCode) {
        this.router.navigate([`/flight-list/dom-flights`], stepper.step1.navigationExtras);
      } else {
        this.router.navigate([`/flight-list/int-flights`], stepper.step1.navigationExtras);
      }
    }
  }

  onPrevious(i: number) {
    if (i === 0) {
      this.onBack();
    } else {
      this.selectedIndex = i - 1;
      window.scroll({
        top: 400,
        behavior: 'smooth'
      });
    }
  }

  onNext(i: number) {
    let lastIndex = this.passangerInfo.adultPassengers.passengers.length + this.passangerInfo.childPassengers.passengers.length + this.passangerInfo.infantPassengers.passengers.length;
    if (i === lastIndex - 1) {
      this.onSubmit();
    } else {
      this.selectedIndex = i + 1;
      window.scroll({
        top: 400,
        behavior: 'smooth'
      });
    }
  }

  generateStepperObj(navigationExtras: any) {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    let stepperObj = {
      navigationExtras: navigationExtras,
      travellData: this.travellerForm.value
    }
    stepper.step2 = stepperObj;

    return stepper;
  }

  getPassangerInfo() {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    if (stepper) {
      let searchObj = JSON.parse(stepper.step1.navigationExtras.queryParams.searchObj);
      this.passangerInfo = searchObj.passengers;
      // console.log(this.passangerInfo);
    }
  }

  countryChange(event: any) {
  }

  getBaggage() {
    let legArray: Array<number> = []
    let legArrayNo = this.selectedFlight.legs[0].connections[0].connectionIdentifier.legIndex
    legArray.push(legArrayNo)
    if (this.selectedFlight.legs.length == 2) {
      legArray.push(0)
    }
    const param = {
      fareIdentifier: {
        fareIndex: this.selectedFlight.fareIndex,
        fareResultID: this.selectedFlight.identifier.fareResultID,
      },
      selectedLegConnections: legArray,
    };

    this.afService.ancillaries(param).subscribe({
      next: (data: any) => {
        this.ancillariesData = data.Result.result;
        let priceData = this.ancillariesData?.prices;
        let serviceData = this.ancillariesData?.services;
        let groupedByServiceType = _.groupBy(serviceData, serviceType => serviceType.type);
        _.map(groupedByServiceType, (catVal: any, catKey) => {
          var catObj: any = { category_name: catKey, catData: [] };
          if (+catKey === 0) {
            catObj.category_name = 'baggage'
          }
          _.map(catVal, (loop) => {
            if (loop.bookingCode !== 'BIKE') {
              catObj.catData.push(loop)
            }
          })

          if (catObj.category_name === 'baggage') {
            let lugArray: any = [];
            let childLugArray: any = [];
            _.map(catObj.catData, itr => {
              _.map(itr.referenceIDs, itr2 => {
                // add free baggage data into array
                if (!this.freeAdultBaggageArray.some((value: any) => value.code === itr.code)) {
                  _.map(bagArray, freeBag => {
                    if (itr.bookingType === 0 && itr2.passengerID == 1 && itr.code !== "0DF" && freeBag.SUBCODE === itr.code) {
                      _.map(this.freeAdultBaggageArray, loop => {
                        if (loop.text.includes('CARRYON')) {
                          itr.text = 'ADDITIONAL CARRYON HAND BAGGAGE'
                        } else {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      })
                      if (this.freeAdultBaggageArray.length === 0) {
                        if (itr.text.includes('CARRYON')) {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      }
                      this.freeAdultBaggageArray.push(itr);
                    } else if (itr.bookingType === 0 && itr2.passengerID == 2 && itr.code !== "0DF" && freeBag.SUBCODE === itr.code) {
                      _.map(this.freeChildBaggageArray, loop => {
                        if (loop.text.includes('CARRYON')) {
                          itr.text = 'ADDITIONAL CARRYON HAND BAGGAGE'
                        } else {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      })
                      if (this.freeChildBaggageArray.length === 0) {
                        if (itr.text.includes('CARRYON')) {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      }
                      this.freeChildBaggageArray.push(itr);
                    } else if (itr.bookingType === 0 && itr2.passengerID == 1 && itr.code == "0DF" && freeBag.SUBCODE === itr.code) {
                      _.map(this.adultFreeLuggage, loop => {
                        if (loop.text.includes('CARRYON')) {
                          itr.text = 'ADDITIONAL CARRYON HAND BAGGAGE'
                        } else {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      })
                      if (this.adultFreeLuggage.length === 0) {
                        if (itr.text.includes('CARRYON')) {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      }
                      this.adultFreeLuggage.push(itr);
                    } else if (itr.bookingType === 0 && itr2.passengerID == 2 && itr.code == "0DF" && freeBag.SUBCODE === itr.code) {
                      _.map(this.childFreeLuggage, loop => {
                        if (loop.text.includes('CARRYON')) {
                          itr.text = 'ADDITIONAL CARRYON HAND BAGGAGE'
                        } else {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      })
                      if (this.childFreeLuggage.length === 0) {
                        if (itr.text.includes('CARRYON')) {
                          itr.text = 'CARRYON HAND BAGGAGE'
                        }
                      }
                      this.childFreeLuggage.push(itr);
                    }
                  })
                }

                // add adult luggage data into array
                if (itr.bookingType === 1 && itr2.passengerID == 1 || itr.bookingType === 2 && itr2.passengerID == 1) {
                  _.map(priceData, itr3 => {
                    let Obj = this.generateObj(itr, itr2, itr3);
                    if (itr3.priceID == itr2.priceID) {
                      if (itr2.segmentIDs[0] == 2) {
                        _.map(this.adultLuggageArray, lug => {
                          if (itr.code === lug.code) {
                            lug.price = lug.price * 2
                          }
                        })
                      } else {
                        let luggageInfo = {
                          id: lugArray.length,
                          bagInfo: Obj,
                          segments: this.selectedFlight.legs[0].connections[0].segments
                        };
                        const isLuggageExist = _.find(lugArray, luggageData => {
                          return luggageData.bagInfo.code === luggageInfo.bagInfo.code
                        })
                        if (!isLuggageExist) {
                          lugArray.push(luggageInfo)
                          this.adultLuggageArray.push(Obj);
                        }
                      }
                    }
                  })

                }

                // add child luggage data into array
                if (itr.bookingType == 1 && itr2.passengerID == 2 || itr.bookingType === 2 && itr2.passengerID == 2) {
                  _.map(priceData, itr3 => {
                    let Obj = this.generateObj(itr, itr2, itr3);
                    if (itr3.priceID == itr2.priceID) {
                      if (itr2.segmentIDs[0] == 2) {
                        _.map(this.childLuggageArray, lug => {
                          if (itr.code === lug.code) {
                            lug.price = lug.price * 2
                          }
                        })
                      } else {


                        this.childLuggageArray.push(Obj)
                        let luggageInfo = {
                          id: childLugArray.length,
                          bagInfo: Obj,
                          segments: this.selectedFlight.legs[0].connections[0].segments
                        };
                        childLugArray.push(luggageInfo)
                      }
                    }
                  })
                }
              });
            });

            if (!this.travellData) {
              _.map(this.adult.value, (loop2, i) => {
                ((this.travellerForm.get("adultArray") as FormArray).at(+i) as FormGroup).get('baggageStyle2')?.patchValue(lugArray);
              });
              _.map(this.child.value, (loop2, i) => {
                ((this.travellerForm.get("childArray") as FormArray).at(+i) as FormGroup).get('baggageStyle2')?.patchValue(childLugArray);
              });
            }
          }
        })
      }
    })
  }

  generateObj(itr: any, itr2: any, itr3: any) {
    let obj = {
      code: itr.code,
      priceId: itr2.priceID,
      currencyCode: itr3.equivalentPrice.currencyCode,
      price: itr3.equivalentPrice.value,
      bookingCode: itr.bookingCode,
      serviceDescription: itr.serviceDescription,
      serviceType: itr.serviceType,
      serviceLocation: itr.serviceLocation,
      extensions: itr.extensions,
      id: itr.id,
      type: itr.type,
      bookingType: itr.bookingType,
      serviceCarrier: itr.serviceCarrier,
      text: itr.text,
      count: 0
    }
    return obj;
  }

  addadultSmallBaggage(i: any) {
    if (this.smallBag < 3)
      this.smallBag = this.smallBag + 1;
  }

  removeadultSmallBaggage(i: any) {
    if (this.smallBag !== 0)
      this.smallBag = this.smallBag - 1;
  }

  openSnackBar(message: string, action: string, status: boolean) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: status === true ? ['success-snackbar'] : ['danger-snackbar']
    });
  }

  // temp code
  onDOBSelection(i: any) {
    let today = new Date()
    let adult = this.travellerForm.get("adultArray") as FormArray;
    let adultDate = adult.value[i].dateOfBirth.endDate._d;

    let dob: any = moment(adultDate).format("DD-MM-YYYY");
    let newDate = dob;
    let dateParts = newDate.split("-");
    let newDOBDate = {
      day: dateParts[0],
      month: dateParts[1],
      year: dateParts[2]
    }
    this.renderAudltDate[i] = newDOBDate;
  }

  onIssuedDateSelection(i: any) {
    let adult = this.travellerForm.get("adultArray") as FormArray;
    let issueDate = adult.value[i].issuedDate.endDate._d
    let issuDate = moment(issueDate).format("DD-MM-YYYY");
    let newDate = issuDate;
    let dateParts = newDate.split("-");
    let newDOBDate = {
      day: dateParts[0],
      month: dateParts[1],
      year: dateParts[2]
    }
    this.renderAudltIssueDate[i] = newDOBDate;
  }

  onValidTillSelection(i: any) {
    let adult = this.travellerForm.get("adultArray") as FormArray;
    let validDate = adult.value[i].validTill.endDate._d
    let vDate: any = moment(validDate).format("DD-MM-YYYY");
    let newDate = vDate;
    let dateParts = newDate.split("-");
    let newDOBDate = {
      day: dateParts[0],
      month: dateParts[1],
      year: dateParts[2]
    }
    this.renderAudltvalidDate[i] = newDOBDate;

  }

  onValidTillSelectionChild(i: any) {
    let child = this.travellerForm.get("childArray") as FormArray;
    let validDate = child.value[i].validTill.endDate._d
    let vDate: any = moment(validDate).format("DD-MM-YYYY");
    let newDate = vDate;
    let dateParts = newDate.split("-");
    let newVDate = {
      day: dateParts[0],
      month: dateParts[1],
      year: dateParts[2]
    }
    this.renderChildvalidDate[i] = newVDate;
  }

  onIssuedDateSelectionChild(i: any) {
    let adult = this.travellerForm.get("childArray") as FormArray;
    let issueDate = adult.value[i].issuedDate.endDate._d
    let issuedDate: any = moment(issueDate).format("DD-MM-YYYY");
    let newDate = issuedDate;
    let dateParts = newDate.split("-");
    let newissuedDate = {
      day: dateParts[0],
      month: dateParts[1],
      year: dateParts[2]
    }
    this.renderChildIssueDate[i] = newissuedDate;
  }

  onDOBSelectionChild(i: any) {
    let today = new Date()
    let child = this.travellerForm.get("childArray") as FormArray;
    let childDate = child.value[i].dateOfBirth.endDate._d
    let dob: any = moment(childDate).format("DD-MM-YYYY");
    let newDate = dob;
    let dateParts = newDate.split("-");
    let newDOBDate = {
      day: dateParts[0],
      month: dateParts[1],
      year: dateParts[2]
    }
    this.renderAudltDate[i] = newDOBDate;
    this.childAge = today.getFullYear() - childDate.year;
  }

  onDOBSelectionInfant(i: any) {
    let today = new Date()
    let Infant = this.travellerForm.get("infantArray") as FormArray;
    let InfantDate = Infant.value[i].dateOfBirth.endDate._d
    let dob: any = moment(InfantDate).format("DD-MM-YYYY");
    let newDate = dob;
    let dateParts = newDate.split("-");
    let newDOBDate = {
      day: dateParts[0],
      month: dateParts[1],
      year: dateParts[2]
    }
    this.infantAge = today.getFullYear() - InfantDate.year;
    this.renderInfantDate[i] = newDOBDate;
  }

  // checkChildAge(age: any) {
  //   let ageInfo: any = undefined;
  //   console.log(age);
  //   if (age > 12 || age < 18 || age == 12) {
  //     ageInfo = true;
  //   } else {
  //     ageInfo = false;
  //   }
  //   return ageInfo;
  // }

  patchSavedTraveller(savedTravellerIndex: any, travellerIndex: any, passengerType: any) {
    savedTravellerIndex = savedTravellerIndex.value;
    let travellerInfo = this.savedTraveller[savedTravellerIndex];
    if (passengerType === 'adult') {
      if (travellerInfo.dateOfBirth) {
        const pastDate = moment(travellerInfo.dateOfBirth.startDate);
        const currentDate = moment();
        let dayDiff = pastDate.diff(currentDate, 'days');
        this.selectedRange.startDate = moment().add(dayDiff, 'days').startOf('day');
        this.selectedRange.endDate = moment().add(dayDiff, 'days').startOf('day');
        ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('dateOfBirth')?.patchValue({
          endDate: this.selectedRange.endDate,
          startDate: this.selectedRange.startDate
        });
      }


      if (travellerInfo.passportExpiry) {
        const pastDate = moment(travellerInfo.passportExpiry.startDate);
        const currentDate = moment();
        let dayDiff = pastDate.diff(currentDate, 'days');
        this.selectedRange1.startDate = moment().add(dayDiff, 'days').startOf('day');
        this.selectedRange1.endDate = moment().add(dayDiff, 'days').startOf('day');
        // let validTillDate = `${travellerInfo.passportExpiry?.day}-${travellerInfo.passportExpiry?.month}-${travellerInfo.passportExpiry.year}`;
        // this.renderAudltvalidDate[travellerIndex] = validTillDate;
        ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('validTill')?.patchValue(travellerInfo.passportExpiry);
      }

      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('prefix')?.patchValue(travellerInfo.prefix);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('firstName')?.patchValue(travellerInfo.firstName);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('middleName')?.patchValue(travellerInfo.middleName);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('lastName')?.patchValue(travellerInfo.lastName);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('email')?.patchValue(travellerInfo.email);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('documentType')?.patchValue(travellerInfo.passportNo ? 'Passport' : null);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('documentId')?.patchValue(travellerInfo.passportNo);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('country')?.patchValue(travellerInfo.passportIssuingCountry.name);
      ((this.travellerForm.get("adultArray") as FormArray).at(travellerIndex) as FormGroup).get('phone')?.patchValue(travellerInfo.phone);
    } else if (passengerType === 'child') {
      if (travellerInfo.dateOfBirth) {
        // console.log("travellerInfo.dateOfBirth",travellerInfo.dateOfBirth);
        let birthDate = `${travellerInfo.dateOfBirth}`;
        this.renderAudltDate[travellerIndex] = birthDate;
        ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('dateOfBirth')?.patchValue(travellerInfo.dateOfBirth);
      }

      if (travellerInfo.passportExpiry) {
        let validTillDate = `${travellerInfo.passportExpiry?.day}-${travellerInfo.passportExpiry?.month}-${travellerInfo.passportExpiry.year}`;
        this.renderAudltvalidDate[travellerIndex] = validTillDate;
        ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('validTill')?.patchValue(travellerInfo.passportExpiry);
      }

      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('prefix')?.patchValue(travellerInfo.prefix);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('firstName')?.patchValue(travellerInfo.firstName);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('middleName')?.patchValue(travellerInfo.middleName);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('lastName')?.patchValue(travellerInfo.lastName);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('email')?.patchValue(travellerInfo.email);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('documentType')?.patchValue(travellerInfo.passportNo ? 'Passport' : null);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('documentId')?.patchValue(travellerInfo.passportNo);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('country')?.patchValue(travellerInfo.passportIssuingCountry.name);
      ((this.travellerForm.get("childArray") as FormArray).at(travellerIndex) as FormGroup).get('phone')?.patchValue(travellerInfo.phone);
    } else {
      if (travellerInfo.dateOfBirth) {
        let birthDate = `${travellerInfo.dateOfBirth?.day}-${travellerInfo.dateOfBirth?.month}-${travellerInfo.dateOfBirth.year}`;
        this.renderAudltDate[travellerIndex] = birthDate;
        ((this.travellerForm.get("infantArray") as FormArray).at(travellerIndex) as FormGroup).get('dateOfBirth')?.patchValue(travellerInfo.dateOfBirth);
      }

      ((this.travellerForm.get("infantArray") as FormArray).at(travellerIndex) as FormGroup).get('prefix')?.patchValue(travellerInfo.prefix);
      ((this.travellerForm.get("infantArray") as FormArray).at(travellerIndex) as FormGroup).get('firstName')?.patchValue(travellerInfo.firstName);
      ((this.travellerForm.get("infantArray") as FormArray).at(travellerIndex) as FormGroup).get('middleName')?.patchValue(travellerInfo.middleName);
      ((this.travellerForm.get("infantArray") as FormArray).at(travellerIndex) as FormGroup).get('lastName')?.patchValue(travellerInfo.lastName);
    }
  }

  checkBag(info: string) {
    if (info.includes('CARRY')) {
      return "carryON"
    } else if (info.includes("CABIN")) {
      return "cabin"
    } else {
      return "other"
    }
  }

  getCabinCount() {
    let count = _.find(this.freeAdultBaggageArray, itr => {
      let cabin: string = itr.text;
      if (cabin.includes("CABIN")) {
        return itr;
      }

    })
    return isObject(count) ? 1 : 0
  }
}