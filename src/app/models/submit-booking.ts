import _ from "lodash";
import moment from "moment";

export class SubmitBooking {
  legIdentifiers: Array<any> = [];
  passengers: Array<any> = [];
  ticketGroupOptions: Array<any> = [];

  generatePassengerObj(data: any) {
    _.map(data, (itr, indx) => {
      let ancillariesArray = itr.baggageStyle2?.length ? this.loadAncillaries(itr.baggageStyle2, itr.baggageStyle2[0].segments) : [];
      let obj = {};
      obj = {
        passengerType: itr.type,
        assistanceRequired: false,
        title: itr.prefix ? itr.prefix : '',
        firstName: itr.firstName ? itr.firstName : '',
        middleName: itr.middleName ? itr.middleName : '',
        lastName: itr.lastName ? itr.lastName : '',
        gender: itr.prefix === 'Mr' ? 1 : 2,
        optionalDateOfBirth: this.changeDate(itr.dateOfBirth),
        familyCertification: '',
        isMainPassenger: +indx === 0 && itr.type === 'ADT' ? true : false,
        formOfIdentification: null,
        apis: null,
        ancillaries: ancillariesArray,
        frequentFlyerCards: null
      };
      this.passengers.push(obj);
    })
  }

  loadAncillaries(luggageArray: any, segments: any) {
    var segmentArray: any = [];
    var ancillariesArray: any = [];
    _.map(segments, itr => {
      let obj = {
        departure: itr.departureAirport.cityCode,
        arrival: itr.arrivalAirport.cityCode
      }
      segmentArray.push(obj);
    })
    _.map(luggageArray, data => {
      if (data.bagInfo.count > 0) {
        let obj = {
          bookingCode: data.bagInfo.bookingCode,
          bookingType: data.bagInfo.bookingType,
          carrierCode: data.bagInfo.serviceCarrier,
          location: data.bagInfo.serviceLocation,
          segments: segmentArray,
          text: data.bagInfo.text,
          id: data.bagInfo.id,
          extensions: data.bagInfo.extensions,
          serviceType: data.bagInfo.serviceType
        }
        ancillariesArray.push(obj);
      }
    })
    return ancillariesArray;
  }

  finalObj(flightObj: any, authUser: any) {

    let obj = {
      isLiveBooking: true,
      fareResultID: flightObj.identifier.fareResultID,
      fareIndex: flightObj.identifier.fareIndex,
      adress: {
        firstName: authUser ? authUser.firstName : null,
        lastName: authUser ? authUser.lastName : null,
        title: authUser ? authUser.prefix : null,
        street: 'Ack Garden House',
        zip: '00100',
        city: 'Nairobi',
        country: 'KE'
      },
      invoiceAdress: {
        firstName: 'Issah',
        lastName: 'K',
        title: 'Mr',
        street: 'Ack Garden House',
        zip: '00100',
        city: 'Nairobi',
        country: 'KE'
      },
      legIdentifiers: this.genratelegIndex(flightObj),
      passengers: this.passengers,
      ticketGroupOptions: [
        {
          ticketGroupID: flightObj.ticketGroupOptions[0].ticketGroupID,
          bookingOnHoldSelection: 0
        }
      ],
      otherInput!: {
        emergencyPhone: '9766006690',
        webfarePassword: ''
      },
      id: authUser._id
    }
    return obj;
  }

  finalGustObj(flightObj: any, passengerArray: any) {

    let obj = {
      isLiveBooking: true,
      fareResultID: flightObj.identifier.fareResultID,
      fareIndex: flightObj.identifier.fareIndex,
      adress: {
        firstName: passengerArray.adultArray[0].firstName ? passengerArray.adultArray[0].firstName : null,
        lastName: passengerArray.adultArray[0].lastName ? passengerArray.adultArray[0].lastName : null,
        title: passengerArray.adultArray[0].prefix ? passengerArray.adultArray[0].prefix : null,
        street: 'Ack Garden House',
        zip: '00100',
        city: 'Nairobi',
        country: 'KE'
      },
      invoiceAdress: {
        firstName: 'Issah',
        lastName: 'K',
        title: 'Mr',
        street: 'Ack Garden House',
        zip: '00100',
        city: 'Nairobi',
        country: 'KE'
      },
      legIdentifiers: this.genratelegIndex(flightObj),
      passengers: this.passengers,
      ticketGroupOptions: [
        {
          ticketGroupID: flightObj.ticketGroupOptions[0].ticketGroupID,
          bookingOnHoldSelection: 0
        }
      ],
      otherInput!: {
        emergencyPhone: '9766006690',
        webfarePassword: ''
      },
    }
    return obj;
  }

  changeDate(date: any) {
    let newDate = date.startDate;
    let day: any = moment(newDate).format("DD-MM-YYYY");
    day = day.split("-");
    let newObj = {
      day: day[0],
      month: day[1],
      year: day[2]
    }
    return newObj;
  }

  genratelegIndex(flightData: any) {
    let tempArr: any = [];
    _.map(flightData.legs, itr => {
      let obj = {
        legIndex: itr.index,
        connectionIndex: itr.connections[0].index
      }
      tempArr.push(obj);
    })
    return tempArr;
  }
}