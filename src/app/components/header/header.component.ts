import { Component, OnInit, OnChanges, DoCheck, ChangeDetectorRef } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { LocalService } from "src/app/services/local.service";
import * as AllRoutes from "../../../assets/json/routes.json";
import * as _ from 'lodash';
import { isEmpty } from "lodash";
import { BreakPointTracker } from "src/app/_helpers/breakPointTracker.component";
import { BreakpointState } from "@angular/cdk/layout";


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})

export class HeaderComponent implements OnInit, DoCheck {
  selection: string = "";
  token: any;
  userInfo: any;
  isAuthenticated = false;
  isSpinner = true;
  isUserExists: boolean = false;
  isSearchExists: boolean = false;
  isFlightListExists: boolean = false;
  isFlightBooking: boolean = false;
  ischangePassword: boolean = false;
  isancillaries: boolean = false;
  isPayment: boolean = false;
  isPofile: boolean = false;
  currentTheme: any;
  exprireTime = localStorage.getItem("exprireTime");

  isBelowLg: boolean = false;
  isGreatLg: boolean = false;
  isHistory: boolean = false;

  constructor(private authService: AuthenticationService, private route: ActivatedRoute,
    private router: Router, private local: LocalService, private BTracker: BreakPointTracker, private changeDetector: ChangeDetectorRef) {
    this.token = this.authService.token;
    router.events.subscribe((val) => {
      this.getBgTheme();
    });
  }

  ngOnInit(): void {

    this.getUserInfo();
    this.local.spinner$.subscribe({
      next: ((spinner: boolean) => {
        this.isSpinner = spinner;
      })
    })
    const getTokenInterval = setInterval(() => {
      this.token = localStorage.getItem("authToken");
      if (this.token) {
        this.autoLogoutFun();
        clearInterval(getTokenInterval);
      }
    }, 1000)
    // this.getExtraServices();

  }

  ngAfterViewInit(): void {
    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });

    this.BTracker.isGreatLg().subscribe((isGreatLg: BreakpointState) => {
      this.isGreatLg = isGreatLg.matches;
    });

    this.changeDetector.detectChanges()
  }


  autoLogoutFun() {
    let i: any = 0;
    const logoutInterval = setInterval(() => {
      if (i == this.exprireTime) {
        this.authService.autoLogout();
        clearInterval(logoutInterval);
      }
    }, 1000)
  }

  // getExtraServices(){
  //   this.local.updateExtraServices();
  // }

  gotoStep(step: number) {
    let stepper: any = localStorage.getItem('stepper');
    stepper = stepper ? JSON.parse(stepper) : null;
    if (step === 1) {
      if (!isEmpty(stepper.step1)) {
        if (stepper.departCode === stepper.arrivalCode) {
          this.router.navigate([`/flight-list/dom-flights`], stepper.step1.navigationExtras);
        } else {
          this.router.navigate([`/flight-list/int-flights`], stepper.step1.navigationExtras);
        }
      }
    } else if (step === 2) {
      if (!isEmpty(stepper.step2.navigationExtras)) {
        this.router.navigate(['/flight-booking/review-booking'], stepper.step2.navigationExtras);
      }
    } else if (step === 3) {
      if (!isEmpty(stepper.step3.navigationExtras)) {
        this.router.navigate(['/flight-booking/ancillaries-info'], stepper.step3.navigationExtras);
      }
    } else if (step === 4) {
      if (stepper.step1.navigationExtras !== '' && stepper.step2.navigationExtras !== '' && stepper.step3.navigationExtras !== '') {
        this.router.navigate(['/payment/payment-form']);
      }
    }
  }

  getBgTheme() {
    let url = window.location.href;
    _.map(AllRoutes, (val, key) => {
      if (url.includes(key)) {
        _.map(val, (subroute: any) => {
          if (url.includes(subroute.path)) {
            this.currentTheme = subroute.class;
          }
        })
      }
    })
  }

  getUserInfo() {
    let data: any = localStorage.getItem("authUser")
    if (data) {
      this.isAuthenticated = true;
      this.userInfo = JSON.parse(data)
    }
  }

  ngDoCheck() {
    this.token = localStorage.getItem("authToken");
    let url = window.location.href;
    this.isUserExists = url.includes("user");
    this.isSearchExists = url.includes("searchFlight");
    this.isFlightListExists = url.includes("flight-list");
    this.isFlightBooking = url.includes("review-booking");
    this.ischangePassword = url.includes("changePassword");
    this.isancillaries = url.includes("ancillaries-info");
    this.isPofile = url.includes("updateProfile");
    this.isPayment = url.includes("payment");
    this.isHistory = url.includes("travel-history");
    this.token = localStorage.getItem("authToken");
    this.getUserInfo();
    this.local.spinner$.subscribe({
      next: ((spinner: boolean) => {
        this.isSpinner = spinner;
      })
    })
  }

  onSelectionChange(selection: string) {
    if (selection == "logout") {
      this.logout();
    } else if (selection == "login") {
      this.router.navigate(["/user/login"], { relativeTo: this.route });
    } else if (selection == "changePassword") {
      this.router.navigate(["/user/changePassword"], { relativeTo: this.route });
    } else if (selection == "updateProfile") {
      this.router.navigate(["/user/updateProfile"]);
    } else if (selection == 'travelHistory') {
      this.router.navigate(["/traveller/travel-history"]);
    }
  }

  logout() {
    this.authService.doLogout();
    localStorage.clear();
    this.token = localStorage.getItem("authToken");
    this.router.navigate(["/"]);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}