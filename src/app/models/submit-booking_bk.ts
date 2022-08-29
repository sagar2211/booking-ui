import _ from "lodash";
import moment from "moment";

export class SubmitBooking{
    
    legIdentifiers : Array<any> = [];
    passengers : Array<any> = [];
    ticketGroupOptions : Array<any> = [];
    generatePassengerObj(data : any){
      _.map(data,(itr,indx)=>{
        let obj = {};
        obj = {
          passengerType : itr.type,
          assistanceRequired : false,
          title : itr.prefix ? itr.prefix : '',
          firstName : itr.firstName ? itr.firstName : '',
          middleName : itr.middleName?itr.middleName:'',
          lastName : itr.lastName ? itr.lastName : '',
          gender : itr.prefix === 'Mr' ? 1 : 2,
          optionalDateOfBirth : {
            day: itr.dateOfBirth ? moment(itr.dateOfBirth).date() : 0,
            month: itr.dateOfBirth ? moment(itr.dateOfBirth).month() + 1 : 0,
            year: itr.dateOfBirth ? +moment(itr.dateOfBirth).format("YYYY") : 0
          },
          familyCertification: 'abc',
          isMainPassenger: +indx === 0 && itr.type === 'ADT' ? true : false,
          formOfIdentification: {
            documentType : itr.documentType,
            documentID : itr.documentId ? itr.documentId : '12345',
            issuer : itr.country ? itr.country : 'South Africa',
            carrierCode : 'abc'
          },
          apis : {
            passport: {
              passportType : 1,
              nationality : 'abc',
              country : 'abc',
              expiryDate : {
                  day: 0,
                  month: 0,
                  year: 0
              },
              issueDate : {
                day : 0,
                month : 0,
                year : 0
              },
              number : 'abc',
              placeOfBirth : 'abc',
              holder: false
            },
            visa: {
              visaType : 0,
              appliedCountry : 'st',
              dateOfIssue : {
                day : 0,
                month : 0,
                year : 0
              },
              Number : 'abc',
              placeOfIssue : 'abc'
            },
            address : {
              addresstype : 0,
              street : 'abc',
              zip : 'abc',
              city : 'abc',
              state : 'abc',
              country : 'st',
              municipality : 'abc'
            }
          },
          ancillaries: [
            {
              segments: [
                {
                  departure : 'abc',
                  arrival: 'abc'
                }
              ],
              bookingCode : 'abc',
              carrierCode : 'abc',
              date : "2022-04-13T19:27:51.754Z",
              location : 'abc',
              text : 'abc',
              bookingType : 0,
              id : 'abc',
              extensions : 'abc',
              serviceType : 1
            }
          ],
          frequentFlyerCards : [
            {
              carrierCodes : [
                'abc'
              ],
              extensions : 'abc',
              holderFirstName : 'abc',
              holderLastName : 'abc',
              holderTitle : 'abc',
              programNumber : 'abc',
              programType : 'abc'
            }
          ]
        };
        this.passengers.push(obj);
      })
    }

    finalObj(flightObj : any, authUser : any){
      let obj = {
        isLiveBooking : true,
        fareResultID : flightObj.identifier.fareResultID,
        fareIndex : flightObj.identifier.fareIndex,
        adress : {
          firstName : authUser ? authUser.firstName : null,
          lastName : authUser ? authUser.lastName : null,
          title : authUser ? authUser.prefix : null,
          street : 'Ack Garden House',
          zip : '00100',
          city : 'Nairobi',
          country : 'KE'
        },
        invoiceAdress : {
          firstName : 'Issah',
          lastName : 'K',
          title : 'Mr',
          street : 'Ack Garden House',
          zip : '00100',
          city : 'Nairobi',
          country : 'KE'
        },
        legIdentifiers : [
          {
            legIndex : flightObj.legs[0].index,
            connectionIndex: flightObj.legs[0].connections[0].index
          }
        ],
        passengers : this.passengers,
        ticketGroupOptions : [
          {
            ticketGroupID : flightObj.ticketGroupOptions[0].ticketGroupID,
            bookingOnHoldSelection : 0
          }
        ],
        otherInput! : {
          emergencyPhone : '9766006690',
          webfarePassword : ''
        },
        id : authUser._id
      }
      return obj;
    }
}