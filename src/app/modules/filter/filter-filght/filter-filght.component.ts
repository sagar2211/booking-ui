import { Component, Inject, OnInit, Optional } from "@angular/core";
import { faRoute, faCloudSun, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { AvailableFaresService } from "../../../services/available-fares.service";
import { Options, LabelType } from "@angular-slider/ngx-slider";
import * as _ from "lodash";
import { HITCH_HIKER_URL } from "src/environments/environment";
import { FilterSort } from "../../../models/filter-sort-model";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DailogBoxComponent } from "../../search/dailog-box/dailog-box.component";
@Component({
  selector: "app-filter-filght",
  templateUrl: "./filter-filght.component.html",
  styleUrls: ["./filter-filght.component.scss"],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ]
})
export class FilterFilghtComponent implements OnInit {

  dialogFilterData: any = {
    "stopArray": [],
    "cabinArray": [],
    "departAirPortArray": [],
    "arivalairPortArray": [],
    "departStartArray": [],
    "departEndArray": [],
    "ArivalStartArray": [],
    "ArivalEndArray": [],
    "airlineArray": [],
    "price": {}
  };

  sliderForm!: FormGroup
  H_URL = HITCH_HIKER_URL;

  morning = faCloudSun;
  afternoon = faSun;
  night = faMoon;

  stopExpPanel = true;
  dtExpPanel = true;
  priceExpPanel = true;
  atExpPanel = true;
  alExpPanel = true;
  cabinExpPanel = true;
  airportExpPanel = true;
  retDtExpPanel = true;
  retAtExpPanel = true;
  arrivalFilterFlag = true;
  cabinFilterFlag = true;

  minValue: any = 0;
  maxValue: any = 100;
  changeMaxVal: any = 0;
  changeMinVal: any = 0;
  arrivalCityName = "";
  departureCityName = "";

  cabinArray: Array<any> = [];
  newData = [];
  stopValues: Array<any> = [];
  cabinValues: Array<any> = [];
  includeAirline: Array<any> = [];
  departureStartTimeValues: Array<any> = [];
  departureEndTimeValues: Array<any> = [];
  arrivalStartTimeValues: Array<any> = [];
  arrivalEndTimeValues: Array<any> = [];
  stopArray: Array<any> = [];
  departEndArray: Array<any> = [];
  departStartArray: Array<any> = [];
  ArivalStartArray: Array<any> = [];
  ArivalEndArray: Array<any> = [];
  airlineArray: Array<any> = [];
  airportArivalValues: Array<any> = [];
  airportDepartValues: Array<any> = [];
  departAirPortArray: Array<any> = [];
  arivalairPortArray: Array<any> = [];
  flightList: any = [];

  value: any = { min: 0, max: 0 };
  options: Options = {
    floor: 1,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.changeMinVal = value;
          return `<span> ${this.flightData[0]?.currency}: ${value} <span>`;
        case LabelType.High:
          this.changeMaxVal = value;
          return `<span">${this.flightData[this.flightData.length - 1]?.currency
            }: ${value} <span>`;
        default:
          return ``;
      }
    },
  };
  price: any = {};
  faCoffee: any;
  flightData: any;
  filterData: any;
  flightDataClone: any;
  economyObj: any;
  airPortObj: any;
  primumEconomyObj: any;
  businessObj: any;
  combainCabObj: any = [];
  activeSort: any;
  changeMinValClone: any;
  changeMaxValClone: any;
  sortSubscription!: Subscription;
  dialogData: any;

  // constructor(
  //   @Inject(MAT_DIALOG_DATA) public dialogData11: any,
  //   private afService: AvailableFaresService) {
  //   this.faCoffee = faRoute;
  // }

  constructor(
    private afService: AvailableFaresService) {
    this.faCoffee = faRoute;
  }

  ngOnInit(): void {

    this.getFlightData();
    const sort = new FilterSort();
    sort.sortDataByStop(this.filterData);
    this.includeAirline = sort.includeAirline;
    this.stopValues = sort.stopValues;
    this.stopValues = _.orderBy(this.stopValues, "value", "asc");

    sort.sortDataByTime(this.filterData);
    this.departureStartTimeValues = sort.departureStartTimeValues;
    this.departureEndTimeValues = sort.departureEndTimeValues;
    this.arrivalStartTimeValues = sort.arrivalStartTimeValues;
    this.arrivalEndTimeValues = sort.arrivalEndTimeValues;

    this.sortByCabin(this.filterData);
    this.sortByArivalAirport(this.filterData);
    this.sortByDepartureAirport(this.filterData);
    this.sortByPrice(this.filterData);
    this.getCabinClassPrice();
    this.getAllAirlinePrice();
    this.getActiveSort();
    setTimeout(() => {
      this.changeMinValClone = _.cloneDeep(this.changeMinVal);
      this.changeMaxValClone = _.cloneDeep(this.changeMaxVal);
    }, 100);


    let result = this.afService.getDialogData();

    if (result !== undefined && (result.stopArray.length || result.cabinArray.length ||
      result.departAirPortArray.length ||
      result.arivalairPortArray.length ||
      result.departStartArray.length ||
      result.departEndArray.length ||
      result.ArivalStartArray.length ||
      result.ArivalEndArray.length ||
      result.airlineArray.length)) {
      this.dialogData = result;
      if (result.stopArray.length)
        this.stopValues = result.stopArray;

      if (result.cabinArray.length)
        this.cabinValues = result.cabinArray;

      if (result.departAirPortArray.length)
        this.airportDepartValues = result.departAirPortArray;

      if (result.arivalairPortArray.length)
        this.airportArivalValues = result.arivalairPortArray;

      if (result.departStartArray.length)
        this.departureStartTimeValues = result.departStartArray;

      if (result.departEndArray.length)
        this.departureEndTimeValues = result.departEndArray;

      if (result.ArivalStartArray.length)
        this.arrivalStartTimeValues = result.ArivalStartArray;

      if (result.ArivalEndArray.length)
        this.arrivalEndTimeValues = result.ArivalEndArray;

      if (result.airlineArray.length)
        this.includeAirline = result.airlineArray;

      this.price = result.price;

      this.applyFilter();
    }
  }

  applyFilter() {
    this.getSelectedStops();
    this.getSelectedCabin();
    this.getdepartAirPort();
    this.getarivalAirport();
    this.getDepartsStart();
    this.getDepartsEnd();
    this.getArivalStart();
    this.getArivalsEnd();
    this.getAirlines();
    this.getAirlinePrice();
  }

  getFlightData() {
    this.flightData = this.afService.flightData;
    this.flightData = this.flightData.Result.result.fareSearchResult.fares.sort(
      (a: any, b: any) =>
        a.legs[0].connections[0].connectionHeader.departureDisplayTime >
          b.legs[0].connections[0].connectionHeader.departureDisplayTime
          ? 1
          : -1
    );

    this.addCustomObj();
    this.flightDataClone = _.cloneDeep(this.flightData);
    this.filterData = this.flightData;
  }

  addCustomObj() {
    _.map(this.flightData, (itr) => {
      let genratedObj = {
        currency: itr.currency,
        time: itr.legs[0].connections[0].connectionHeader.legTravelTime,
        price: itr.totalPrice + itr.totalTax,
      };
      itr.customObj = genratedObj;
    });
  }

  getActiveSort() {
    this.sortSubscription = this.afService.currentSort$.subscribe({
      next: (sort: any) => {
        this.activeSort = sort;
      }
    });
  }

  // Cabin class prise for filter
  getCabinClassPrice() {
    var cabinArray: any = [];
    var premiumEconomyArray: any = [];
    var businessArray: any = [];
    var economyMinPrice = 0;
    var premiumEconomyMinPrice = 0;
    var businessMinPrice = 0;
    var cambainCabinArray: any = [];
    let cambainEcoMinPrice = 0;
    let cambainBusMinPrice = 0;
    let cambainPriMinPrice = 0;

    _.map(this.filterData, (itr) => {
      let cabin = itr.fareHeader.cabinClassCombined[0];
      var cabin1 = itr.fareHeader.cabinClassCombined;
      // start for single cabin class prise
      if (cabin1.length === 1) {
        if (cabin === "economy") {
          cabinArray.push(itr);
          let finalPrice = itr.totalPrice + itr.totalTax;
          if (!economyMinPrice) {
            economyMinPrice = finalPrice;
            this.economyObj = {
              class: cabin,
              price: economyMinPrice,
            };
          } else if (economyMinPrice > finalPrice) {
            economyMinPrice = finalPrice;
            this.economyObj = {
              class: cabin,
              price: economyMinPrice,
            };
          }
        } else if (cabin === "premiumeconomy") {
          premiumEconomyArray.push(itr);
          let finalPrice = itr.totalPrice + itr.totalTax;
          if (!premiumEconomyMinPrice) {
            premiumEconomyMinPrice = finalPrice;
            this.primumEconomyObj = {
              class: cabin,
              price: premiumEconomyMinPrice,
            };
          } else if (premiumEconomyMinPrice > finalPrice) {
            premiumEconomyMinPrice = finalPrice;
            this.primumEconomyObj = {
              class: cabin,
              price: premiumEconomyMinPrice,
            };
          }
        } else if (cabin === "business") {
          businessArray.push(itr);
          let finalPrice = itr.totalPrice + itr.totalTax;
          if (!businessMinPrice) {
            businessMinPrice = finalPrice;
            this.businessObj = {
              class: cabin,
              price: businessMinPrice,
            };
          } else if (businessMinPrice > finalPrice) {
            businessMinPrice = finalPrice;
            this.businessObj = {
              class: cabin,
              price: businessMinPrice,
            };
          }
        }
        // end for single cabin class proce
      } else if (cabin1.length > 1) {
        // start code for multi cabin class
        _.map(cabin1, cab => {
          let newCabinObj = {
            class: '',
          };
          let finalPrice = itr.totalPrice + itr.totalTax;
          if (cab === "economy") {
            if (!cambainEcoMinPrice) {
              cambainEcoMinPrice = finalPrice;
              if (!cambainCabinArray.some((cabin: any) => cabin.name === "economy")) {
                cambainCabinArray.push({
                  cabin: cab,
                  price: cambainEcoMinPrice
                })
              }
            } else if (cambainEcoMinPrice > finalPrice) {
              cambainEcoMinPrice = finalPrice;
              if (!cambainCabinArray.some((cabin: any) => cabin.name === "economy")) {
                cambainCabinArray.push({
                  cabin: cab,
                  price: cambainEcoMinPrice
                })
              }
            }
          } else if (cab === "business") {
            if (!cambainBusMinPrice) {
              cambainBusMinPrice = finalPrice;
              if (!cambainCabinArray.some((cabin: any) => cabin.name === "business")) {
                cambainCabinArray.push({
                  cabin: cab,
                  price: cambainBusMinPrice
                })
              }
            } else if (cambainBusMinPrice > finalPrice) {
              cambainBusMinPrice = finalPrice;
              if (!cambainCabinArray.some((cabin: any) => cabin.name === "business")) {
                cambainCabinArray.push({
                  cabin: cab,
                  price: cambainBusMinPrice
                })
              }
            }
          } else if (cab === "premiumeconomy") {
            if (!cambainPriMinPrice) {
              cambainPriMinPrice = finalPrice;
              if (!cambainCabinArray.some((cabin: any) => cabin.name === "premiumeconomy")) {
                cambainCabinArray.push({
                  cabin: cab,
                  price: cambainPriMinPrice
                })
              }
            } else if (cambainPriMinPrice > finalPrice) {
              cambainPriMinPrice = finalPrice;
              if (!cambainCabinArray.some((cabin: any) => cabin.name === "premiumeconomy")) {
                cambainCabinArray.push({
                  cabin: cab,
                  price: cambainPriMinPrice
                })
              }
            }
          }
        })

        cambainCabinArray = _.orderBy(cambainCabinArray, ["price"], ["asc"]);
        if (cambainCabinArray[0].cabin !== cambainCabinArray[1].cabin) {
          let combainObj = {
            class: cambainCabinArray[0].cabin + "/" + cambainCabinArray[1].cabin,
            price: cambainCabinArray[0].price
          }
          this.combainCabObj.push(combainObj)
        } else if (cambainCabinArray[0].cabin !== cambainCabinArray[2].cabin && cambainCabinArray[1].cabin !== cambainCabinArray[2].cabin) {
          let combainObj = {
            class: cambainCabinArray[0].cabin + "/" + cambainCabinArray[1].cabin + "/" + cambainCabinArray[2].cabin,
            price: cambainCabinArray[0].price
          }
          this.combainCabObj.push(combainObj)
        }

        if (this.combainCabObj.price != 0)
          this.combainCabObj = _.orderBy(this.combainCabObj, ["price", "asc"])
      }
      // end code for multi cabin class
    });
  }

  getAllAirlinePrice() {
    _.map(this.includeAirline, (airlineObj) => {
      _.map(this.flightData, (itr) => {
        _.map(itr.legs, (itr2) => {
          let airline = itr2.platingCarrier.code;
          if (airlineObj.airlineCode === airline) {
            if (airlineObj.price === null) {
              airlineObj.price = itr.totalPrice + itr.totalTax;
            } else if (airlineObj.price > (itr.totalPrice + itr.totalTax)) {
              airlineObj.price = itr.totalPrice + itr.totalTax;
            }
          }
        })
      })
    })
  }

  sortByCabin(data: any) {
    _.map(data, (itr) => {
      let cabin1 = itr.fareHeader.cabinClassCombined[0];
      let cabin2 = itr.fareHeader.cabinClassCombined[1];
      let cabin3 = itr.fareHeader.cabinClassCombined[2];
      let cabin = itr.fareHeader.cabinClassCombined[0]
      if (itr.fareHeader.cabinClassCombined.length > 1) {
        cabin = `${cabin1}/${cabin2}`
      } else if (itr.fareHeader.cabinClassCombined.length > 2) {
        cabin = `${cabin1}/${cabin2}/${cabin3}`
      }
      if (!this.cabinValues.some((value) => value.name === cabin))
        this.cabinValues.push({
          name: cabin,
          value: 0,
          checked: false,
        });
    });
  }

  sortByArivalAirport(data: any) {
    _.map(data, (itr) => {
      let segmentLength = itr.legs[0].connections[0].segments.length;
      let airport = itr.legs[0].connections[0].segments[segmentLength - 1].arrivalAirport.name;
      this.arrivalCityName = itr.legs[0].connections[0].segments[segmentLength - 1].arrivalAirport.cityName;
      if (!this.airportArivalValues.some((value) => value.name === airport)) {
        this.airportArivalValues.push({
          name: airport,
          value: 0,
          checked: false,
        });
      }
    });
  }

  sortByDepartureAirport(data: any) {
    _.map(data, (itr) => {
      let airport = itr.legs[0].connections[0].segments[0].departureAirport.name;
      this.departureCityName = itr.legs[0].connections[0].segments[0].departureAirport.cityName;
      if (!this.airportDepartValues.some((value) => value.name === airport)) {
        this.airportDepartValues.push({
          name: airport,
          value: 0,
          checked: false,
        });
      }
    });
  }

  sortByPrice(data: any) {
    const minPrice: any = _.min(
      data.map((price: any) => price.totalPrice + price.totalTax)
    );
    const maxPrice: any = _.max(
      data.map((price: any) => price.totalPrice + price.totalTax)
    );

    if (this.value.min === 0 && this.value.max === 0) {
      this.value = { min: minPrice, max: maxPrice };
      this.minValue = minPrice - 10;
      this.maxValue = maxPrice + 10;
      this.options.floor = minPrice;
      this.options.ceil = maxPrice;
      this.changeMinVal = minPrice;
    }
  }

  getSelectedStops() {
    this.stopArray = [];
    console.log("this.stopValues", this.stopValues);
    for (let value of Object.values(this.stopValues)) {
      if (value.checked) {
        this.stopArray.push(value.value);
      }
    }
    this.dialogFilterData.stopArray = this.stopValues;
    this.filterFlightList();
  }
  getSelectedCabin() {
    this.cabinArray = [];
    for (let value of Object.values(this.cabinValues)) {
      if (value.checked) {
        this.cabinArray.push(value.name);
      }
    }
    console.log(this.cabinValues);
    this.dialogFilterData.cabinArray = this.cabinValues;
    this.filterFlightList();
  }

  getdepartAirPort() {
    this.departAirPortArray = [];
    for (let value of Object.values(this.airportDepartValues)) {
      if (value.checked) {
        this.departAirPortArray.push(value.name);
      }
    }
    this.dialogFilterData.departAirPortArray = this.airportDepartValues;
    this.filterFlightList();
  }

  getarivalAirport() {
    this.arivalairPortArray = [];
    for (let value of Object.values(this.airportArivalValues)) {
      if (value.checked) {
        this.arivalairPortArray.push(value.name);
      }
    }
    this.dialogFilterData.arivalairPortArray = this.airportArivalValues;
    this.filterFlightList();
  }

  getDepartsStart() {
    this.departStartArray = [];
    for (let value of Object.values(this.departureStartTimeValues)) {
      if (value.checked) {
        this.departStartArray.push({
          minValue: value.minValue,
          maxValue: value.maxValue,
        });
      }
    }
    this.dialogFilterData.departStartArray = this.departureStartTimeValues;
    this.filterFlightList();
  }

  getDepartsEnd() {
    this.departEndArray = [];
    for (let value of Object.values(this.departureEndTimeValues)) {
      if (value.checked) {
        this.departEndArray.push({
          minValue: value.minValue,
          maxValue: value.maxValue,
        });
      }
    }
    this.dialogFilterData.departEndArray = this.departureEndTimeValues;
    this.filterFlightList();
  }

  getArivalStart() {
    this.ArivalStartArray = [];
    for (let value of Object.values(this.arrivalStartTimeValues)) {
      if (value.checked) {
        this.ArivalStartArray.push({
          minValue: value.minValue,
          maxValue: value.maxValue,
        });
      }
    }
    this.dialogFilterData.ArivalStartArray = this.arrivalStartTimeValues;
    this.filterFlightList();
  }

  getArivalsEnd() {
    this.ArivalEndArray = [];
    for (let value of Object.values(this.arrivalEndTimeValues)) {
      if (value.checked) {
        this.ArivalEndArray.push({
          minValue: value.minValue,
          maxValue: value.maxValue,
        });
      }
    }
    this.dialogFilterData.ArivalEndArray = this.arrivalEndTimeValues;
    this.filterFlightList();
  }

  getAirlines() {
    this.airlineArray = [];
    for (let value of Object.values(this.includeAirline)) {
      if (value.checked) {
        this.airlineArray.push(value.airlineCode);
      }
    }
    this.dialogFilterData.airlineArray = this.includeAirline;
    this.filterFlightList();
  }

  getAirlinePrice() {
    this.price = {};
    this.price = {
      minPrice: this.changeMinVal,
      maxPrice: this.changeMaxVal,
    };
    this.dialogFilterData.price = this.price
    this.filterFlightList();
  }

  filterFlightList() {
    const sort = new FilterSort();

    let data: any = sort.filterFlightsStops(this.stopArray, this.filterData, this.flightDataClone);

    data = sort.filterDepartStart(this.departStartArray, data);

    data = sort.filterDepartEnd(this.departEndArray, data);

    data = sort.filterArivalStart(this.ArivalStartArray, data);

    data = sort.filterArivalEnd(this.ArivalEndArray, data);

    data = sort.filterAirline(this.airlineArray, data);

    data = sort.filterPrice(this.price, data);

    data = sort.filterCabinClass(this.cabinArray, data);

    data = sort.filterDepartAirport(this.departAirPortArray, data);

    data = sort.filterArivalAirport(this.arivalairPortArray, data);

    data = sort.getActiveSort(this.activeSort, data)

    if (data) {
      this.afService.updateFlights(data);
      this.afService.updateDailogData(this.dialogFilterData);
    }
  }

  resetFilter() {
    this.resetStopArray();
    this.resetDepartAirportArray();
    this.resetArrivalAirportArray();
    this.resetDepartStartArray();
    this.resetDepartEndArray();
    this.resetArivalStartArray();
    this.resetArivalEndArray();
    this.resetairlineArray();
    this.resetCabinArray();
    this.resetPriceFilter();

    this.filterFlightList();
  }

  resetStopArray() {
    _.map(this.stopValues, itr => {
      itr.checked = false;
    })
    this.stopArray = []
  }

  resetCabinArray() {
    _.map(this.cabinValues, itr => {
      itr.checked = false;
    })
    this.cabinArray = []
  }

  resetDepartAirportArray() {
    _.map(this.airportDepartValues, itr => {
      itr.checked = false;
    })
    this.departAirPortArray = []
  }

  resetArrivalAirportArray() {
    _.map(this.airportArivalValues, itr => {
      itr.checked = false;
    })
    this.arivalairPortArray = []
  }

  resetDepartStartArray() {
    _.map(this.departureStartTimeValues, itr => {
      itr.checked = false;
    })
    this.departStartArray = []
  }

  resetDepartEndArray() {
    _.map(this.departureEndTimeValues, itr => {
      itr.checked = false;
    })
    this.departEndArray = []
  }

  resetArivalStartArray() {
    _.map(this.arrivalStartTimeValues, itr => {
      itr.checked = false;
    })
    this.ArivalStartArray = []
  }

  resetArivalEndArray() {
    _.map(this.arrivalEndTimeValues, itr => {
      itr.checked = false;
    })
    this.ArivalEndArray = []
  }

  resetairlineArray() {
    _.map(this.includeAirline, itr => {
      itr.checked = false;
    })
    this.airlineArray = []
  }

  resetPriceFilter() {
    this.price = {
      minPrice: this.changeMinValClone,
      maxPrice: this.changeMaxValClone,
    };
    this.minValue = this.changeMinValClone;
    this.maxValue = this.changeMaxValClone;
  }
}
