import { BreakpointState } from "@angular/cdk/layout";
import { Component, EventEmitter, Input, OnInit, Output, DoCheck, ChangeDetectorRef } from "@angular/core";
import _ from "lodash";
import { LocalService } from "src/app/services/local.service";
import { BreakPointTracker } from "src/app/_helpers/breakPointTracker.component";

@Component({
  selector: 'app-price-sidebar',
  templateUrl: './price-sidebar.component.html',
  styleUrls: ['./price-sidebar.component.scss']
})

export class PriceSidebarComponent implements OnInit, DoCheck {
  @Input() public selectedFlight: any;
  @Input() public scrollPosition: any;
  @Input() public baggagePrice: any;
  @Output() checkoutResObj = new EventEmitter<any>();
  ancillariesArray: any = [];
  serviceTotal: any = 0;
  wadiiaSupport: any;

  isBelowLg: boolean = true ;

  isFloatCardActive:boolean = false;

  constructor(private localService: LocalService,private BTracker: BreakPointTracker,private changeDetector:ChangeDetectorRef) { }

  ngDoCheck(): void {
    this.newBagPrice = this.baggagePrice ? this.baggagePrice : 0;
  }

  isancillaries: boolean = false;
  newBagPrice: any = 0;

  ngOnInit(): void {
    let url = window.location.href;
    this.isancillaries = url.includes("ancillaries-info");
    this.localService.serviceArray$.subscribe((res)=>{
      if(res){
        this.ancillariesArray = res.hepstarServices;
        this.wadiiaSupport = res.wadiiaSupport;
        this.serviceTotal = 0;
        _.map(this.ancillariesArray, itr => {
          this.serviceTotal = (+this.serviceTotal) + (+itr.price);
        })
      } else {
        this.getExtraServices()
      }
    })

    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });
    this.changeDetector.detectChanges()
  }
  
  getExtraServices(){
    let serviceData = localStorage.getItem('extraServices');
    if(serviceData){
      serviceData = serviceData ? JSON.parse(serviceData) : null;
      this.serviceTotal = 0;
      _.map(serviceData,(obj :any) =>{
        this.serviceTotal = this.serviceTotal + obj.price;
        this.ancillariesArray.push(obj)
      })
      
    }
  }

  onWindowScroll1() {
    let classOnScroll
    if (this.scrollPosition >= 450) {
      classOnScroll = 'addSticky'
    }
    else {
      classOnScroll = ''
    }
    return classOnScroll
  }

  gotoPayment() {
    this.checkoutResObj.emit()
  }

  btnCardExchange(){
    this.isFloatCardActive = !this.isFloatCardActive
  }

}
