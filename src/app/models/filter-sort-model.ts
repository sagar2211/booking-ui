import * as _ from "lodash";
import { isEmpty } from "lodash";
export class FilterSort {

  stopValues: Array<any> = [];
  includeAirline: Array<any> = [];
  departureStartTimeValues: Array<any> = [];
  departureEndTimeValues: Array<any> = [];
  arrivalStartTimeValues: Array<any> = [];
  arrivalEndTimeValues: Array<any> = [];
  flightData: any;

  sortDataByStop(data: any) {
    data.map((flight: any) => {
      flight.legs.map((singleFlight: any) => {
        //for stop filter
        if (singleFlight.connections[0].connectionHeader.travelStopps == 0) {
          if (!this.stopValues.some((value) => value.name === "Non-Stop"))
            this.stopValues.push({
              name: "Non-Stop",
              value: 0,
              checked: false,
            });
        } else if (
          singleFlight.connections[0].connectionHeader.travelStopps == 1
        ) {
          if (!this.stopValues.some((value) => value.name === "1+ stop"))
            this.stopValues.push({
              name: "1+ stop",
              value: 1,
              checked: false,
            });
        } else if (
          singleFlight.connections[0].connectionHeader.travelStopps > 1
        ) {
          if (!this.stopValues.some((value) => value.name === "2+ Stops"))
            this.stopValues.push({
              name: "2+ Stops",
              value: 2,
              checked: false,
            });

        }
        if (
          !this.includeAirline.some(
            (value) => value.airlineCode === singleFlight.platingCarrier.code
          )
        ) {
          this.includeAirline.push({
            airlineCode: singleFlight.platingCarrier.code,
            airline: singleFlight.platingCarrier.hint,
            checked: false,
            currency: flight.currency,
            price: null
          });
        }
      });
    });
  }

  sortDataByTime(data: any) {
    //for departure in one way
    _.map(data, (itr) => {
      _.map(itr.legs, (itr2, indx) => {
        if (+indx === 0) {
          if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "00:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "06:59"
          ) {
            if (
              !_.find(this.departureStartTimeValues, {
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              })
            )
              this.departureStartTimeValues.push({
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "07:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "11:59"
          ) {
            if (
              !_.find(this.departureStartTimeValues, {
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              })
            )
              this.departureStartTimeValues.push({
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "12:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "18:59"
          ) {
            if (
              !_.find(this.departureStartTimeValues, {
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              })
            )
              this.departureStartTimeValues.push({
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "19:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "23:59"
          ) {
            if (
              !_.find(this.departureStartTimeValues, {
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              })
            )
              this.departureStartTimeValues.push({
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              });
          }

          if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "00:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "06:59"
          ) {
            if (
              !_.find(this.departureEndTimeValues, {
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              })
            )
              this.departureEndTimeValues.push({
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "07:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "11:59"
          ) {
            if (
              !_.find(this.departureEndTimeValues, {
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              })
            )
              this.departureEndTimeValues.push({
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "12:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "18:59"
          ) {
            if (
              !_.find(this.departureEndTimeValues, {
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              })
            )
              this.departureEndTimeValues.push({
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "19:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "23:59"
          ) {
            if (
              !_.find(this.departureEndTimeValues, {
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              })
            )
              this.departureEndTimeValues.push({
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              });
          }
        }
        if (+indx === 1) {
          if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "00:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "06:59"
          ) {
            if (
              !_.find(this.arrivalStartTimeValues, {
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              })
            )
              this.arrivalStartTimeValues.push({
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "07:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "11:59"
          ) {
            if (
              !_.find(this.arrivalStartTimeValues, {
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              })
            )
              this.arrivalStartTimeValues.push({
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "12:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "18:59"
          ) {
            if (
              !_.find(this.arrivalStartTimeValues, {
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              })
            )
              this.arrivalStartTimeValues.push({
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.departureDisplayTime >
            "19:00" &&
            itr2.connections[0].connectionHeader.departureDisplayTime < "23:59"
          ) {
            if (
              !_.find(this.arrivalStartTimeValues, {
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              })
            )
              this.arrivalStartTimeValues.push({
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              });
          }

          if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "00:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "06:59"
          ) {
            if (
              !_.find(this.arrivalEndTimeValues, {
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              })
            )
              this.arrivalEndTimeValues.push({
                minValue: "00:00",
                maxValue: "06:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "07:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "11:59"
          ) {
            if (
              !_.find(this.arrivalEndTimeValues, {
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              })
            )
              this.arrivalEndTimeValues.push({
                minValue: "07:00",
                maxValue: "11:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "12:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "18:59"
          ) {
            if (
              !_.find(this.arrivalEndTimeValues, {
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              })
            )
              this.arrivalEndTimeValues.push({
                minValue: "12:00",
                maxValue: "18:59",
                checked: false,
              });
          } else if (
            itr2.connections[0].connectionHeader.arrivalDisplayTime > "19:00" &&
            itr2.connections[0].connectionHeader.arrivalDisplayTime < "23:59"
          ) {
            if (
              !_.find(this.arrivalEndTimeValues, {
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              })
            )
              this.arrivalEndTimeValues.push({
                minValue: "19:00",
                maxValue: "23:59",
                checked: false,
              });
          }
        }

        // Sort time according to asccending order
        this.departureStartTimeValues = _.orderBy(
          this.departureStartTimeValues,
          "minValue",
          "asc"
        );
        this.departureEndTimeValues = _.orderBy(
          this.departureEndTimeValues,
          "minValue",
          "asc"
        );
        this.arrivalStartTimeValues = _.orderBy(
          this.arrivalStartTimeValues,
          "minValue",
          "asc"
        );
        this.arrivalEndTimeValues = _.orderBy(
          this.arrivalEndTimeValues,
          "minValue",
          "asc"
        );
      });
    });
  }

  filterFlightsStops(stops: Array<any>, data: any, flightDataClone: any) {
    let filteredData: Array<any> = [];
    if (stops.length) {
      let newData = data.filter((val: any, index: number) => {
        _.map(val.legs, (itr) => {
          let travelStops = itr.connections[0].connectionHeader.travelStopps;
          if (stops.includes(travelStops)) {
            if (!filteredData.includes(val)) {
              filteredData.push(val);
            }
          }
        });
      });

      return filteredData;
    } else {
      return flightDataClone;
    }
  }

  filterDepartStart(depart: Array<any>, data: any) {
    let filteredData: Array<any> = [];
    if (depart.length) {
      let newData: any = data.filter((val: any) => {
        _.map(val.legs, (itr) => {
          let departStartTime =
            itr.connections[0].connectionHeader.departureDisplayTime;
          depart.forEach((element: any) => {
            if (
              departStartTime >= element.minValue &&
              departStartTime <= element.maxValue
            ) {
              if (!filteredData.includes(val)) {
                filteredData.push(val);
              }
            }
          });
        });
      });
      return filteredData;
    } else {
      return data;
    }
  }

  filterDepartEnd(depart: Array<any>, data: any) {
    let filteredData: Array<any> = [];
    if (depart.length) {
      let newData: any = data.filter((val: any) => {
        _.map(val.legs, (itr) => {
          let departStartTime =
            itr.connections[0].connectionHeader.arrivalDisplayTime;
          depart.forEach((element: any) => {
            if (
              departStartTime >= element.minValue &&
              departStartTime <= element.maxValue
            ) {
              if (!filteredData.includes(val)) {
                filteredData.push(val);
              }
            }
          });
        });
      });
      return filteredData;
    } else {
      return data;
    }
  }

  filterArivalStart(depart: Array<any>, data: any) {
    let filteredData: Array<any> = [];
    if (depart.length) {
      let newData: any = data.filter((val: any) => {
        _.map(val.legs, (itr) => {
          let departStartTime =
            itr.connections[0].connectionHeader.departureDisplayTime;
          depart.forEach((element: any) => {
            if (
              departStartTime >= element.minValue &&
              departStartTime <= element.maxValue
            ) {
              if (!filteredData.includes(val)) {
                filteredData.push(val);
              }
            }
          });
        });
      });
      return filteredData;
    } else {
      return data;
    }
  }

  filterArivalEnd(depart: Array<any>, data: any) {
    let filteredData: Array<any> = [];
    if (depart.length) {
      let newData: any = data.filter((val: any) => {
        _.map(val.legs, (itr) => {
          let departStartTime =
            itr.connections[0].connectionHeader.departureDisplayTime;
          depart.forEach((element: any) => {
            if (
              departStartTime >= element.minValue &&
              departStartTime <= element.maxValue
            ) {
              if (!filteredData.includes(val)) {
                filteredData.push(val);
              }
            }
          });
        });
      });
      return filteredData;
    } else {
      return data;
    }
  }

  filterAirline(airline: Array<any>, data: any) {
    let filteredData: Array<any> = [];
    if (airline.length) {
      let newData: any = data.filter((val: any) => {
        airline.forEach((element: any) => {
          _.map(val.legs, (itr) => {
            let airlineCode1 = itr.platingCarrier.code;
            if (element == airlineCode1) {
              if (!filteredData.includes(val)) {
                filteredData.push(val);
              }
            }
          });
        });
      });
      // filteredData = _.orderBy(filteredData,["customObj.price"], ["asc"]);
      return filteredData;
    } else {
      return data;
    }
  }

  filterPrice(price: any, data: any) {
    if (!isEmpty(price)) {
      let filteredData: Array<any> = [];
      data.filter((val: any) => {
        let airlinePrice = val.totalPrice + val.totalTax;
        if (airlinePrice >= price.minPrice && airlinePrice <= price.maxPrice) {
          filteredData.push(val);
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }

  filterCabinClass(cabinClass: Array<any>, data: any) {
    let filteredData: Array<any> = [];
    if (cabinClass[0]?.includes("/")) {
      let cab = cabinClass[0].split("/");
      if (cabinClass.length) {
        data.filter((val: any) => {
          let cabin = val.fareHeader.cabinClassCombined;
          if (cabin.includes(cab[0]) && cabin.includes(cab[1])) {
            if (!filteredData.includes(val)) {
              filteredData.push(val);
            }
          }
        });
        // filteredData = _.orderBy(filteredData,["customObj.price"], ["asc"]);
        return filteredData;
      } else {
        return data;
      }
    } else {
      if (cabinClass.length) {
        data.filter((val: any) => {
          let cabin = val.fareHeader.cabinClassCombined[0];
          if (cabinClass.includes(cabin)) {
            if (!filteredData.includes(val)) {
              filteredData.push(val);
            }
          }
        });
        // filteredData = _.orderBy(filteredData,["customObj.price"], ["asc"]);
        return filteredData;
      } else {
        return data;
      }
    }
  }

  filterDepartAirport(depart: Array<any>, data: any) {
    let filteredData: Array<any> = []
    if (depart.length) {
      data.filter((val: any) => {
        _.map(val.legs, (itr) => {
          let airPort = itr.connections[0].segments[0].departureAirport.name;
          if (depart.includes(airPort)) {
            if (!filteredData.includes(val)) {
              filteredData.push(val);
            }
          }
        })
      })
      return filteredData;
    } else {
      return data;
    }
  }

  filterArivalAirport(arival: Array<any>, data: any) {
    let filteredData: Array<any> = []
    if (arival.length) {
      data.filter((val: any) => {
        _.map(val.legs, (itr) => {
          let airPort = itr.connections[0].segments[0].arrivalAirport.name;
          if (arival.includes(airPort)) {
            if (!filteredData.includes(val)) {
              filteredData.push(val);
            }
          }
        })
      })
      return filteredData;
    } else {
      return data;
    }
  }

  getActiveSort(val: any, data: any) {
    this.flightData = data;
    var sortedData;
    if (val === "cheapest") {
      sortedData = this.sortByAscCheapest(data);
    } else if (val === "recommended") {
      sortedData = this.sortByRecommended(data);
    } else if (val === "fastest") {
      sortedData = this.sortByFastestFlight(data);
    }
    return sortedData;
  }

  sortByRecommended(flightData: any) {
    this.flightData = _.orderBy(
      flightData,
      [
        "legs[0].connections[0].connectionHeader.legTravelTime.addHours",
        "legs[0].connections[0].connectionHeader.legTravelTime.minutes",
        "customObj.price",
      ],
      ["asc", "asc", "asc"]
    );
    return this.flightData;
  }

  sortByAscCheapest(flightData: any) {
    let cloneFlightData = _.cloneDeep(flightData)
    _.map(cloneFlightData, (itr) => {
      let genratedObj = {
        currency: itr.currency,
        time: itr.legs[0].connections[0].connectionHeader.legTravelTime,
        price: itr.totalPrice + itr.totalTax,
      };
      itr.customObj = genratedObj;
    });
    return this.flightData = _.orderBy(cloneFlightData, ["customObj.price"], ["asc"]);
  }

  sortByFastestFlight(flightData: any) {
    return this.flightData = flightData.sort(
      (a: any, b: any) =>
        a.legs[0].connections[0].connectionHeader.legTravelTime.addHours -
        b.legs[0].connections[0].connectionHeader.legTravelTime.addHours ||
        a.legs[0].connections[0].connectionHeader.legTravelTime.minutes -
        b.legs[0].connections[0].connectionHeader.legTravelTime.minutes
    );
  }


}
