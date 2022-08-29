import { BreakpointState } from "@angular/cdk/layout";
import { Component, ViewChild, ChangeDetectorRef, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NguCarousel, NguCarouselConfig } from "@ngu/carousel";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BreakPointTracker } from "src/app/_helpers/breakPointTracker.component";
import { RefundPopupComponent } from "../refund-popup/refund-popup.component";

@Component({
    selector: "app-travel-history",
    templateUrl: "./travel-history.component.html",
    styleUrls: ["./travel-history.component.scss"],
})
export class TravelHistoryComponent implements OnInit {
    name = "Angular";
    slideNo = 0;
    withAnim = true;
    resetAnim = true;

    @ViewChild("myCarousel") myCarousel!: NguCarousel<any>;
    scrollPosition: number = 0;

    isBelowLg: boolean = true;

    carouselConfig: NguCarouselConfig = {
        grid: { xs: 3, sm: 3, md: 3, lg: 3, all: 0 },
        load: 5,
        slide: 1,
        interval: { timing: 4000, initialDelay: 1000 },
        loop: true,
        touch: true,
        velocity: 0.2,
        vertical: {
            enabled: true,
            height: 800,
        },
    };

    carouselConfigMobile: NguCarouselConfig = {
      grid: { xs: 1, sm: 2, md: 2, lg: 3, all: 0 },
      load: 5,
      slide: 1,
      interval: { timing: 4000, initialDelay: 1000 },
      loop: true,
      touch: true,
      velocity: 0.2,
      vertical: {
          enabled: false,
          height: 200,
      },
  };
    carouselItems: any[any] = [
        {
            image: "item_1.png",
            color: "#EF9D12",
            heading: "Auto-Check-In",
            content: "Check in automatically, and collect all your boarding pass at the airport.",
        },
        {
            image: "item_2.png",
            color: "#0057B9",
            heading: "Apply For e-Visa ",
            content: "Need e Visa to travel? Get your online now.",
        },
        {
            image: "item_3.png",
            color: "#208467",
            heading: "Protect Your Luggages",
            content:
                "Protect your bags & get reimbursed for lost, stolen, or damaged luggage and personal items ",
        },
        {
            image: "item_4.png",
            color: "#EB2533",
            heading: "Book Airport Transfer ",
            content: "Avoide long taxi queues at the airport, book your transfer now ",
        },
    ];
    mainItems: any[] = [...this.carouselItems];
    bookingHistory: any;

    constructor(
        private _cdr: ChangeDetectorRef,
        public dialog: MatDialog,
        private router: Router,
        private afService: AuthenticationService,
        private BTracker: BreakPointTracker,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getHistory();
        // let history = localStorage.getItem("bookingHistory");
        // this.bookingHistory = history ? JSON.parse(history) : null;
        this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
          this.isBelowLg = isBelowLg.matches;
        });
        this.changeDetector.detectChanges()
    }

    ngAfterViewInit() {
        this._cdr.detectChanges();
    }

    carouselTileLoad(data: any) {
        let arr = this.carouselItems;
        this.carouselItems = [...this.carouselItems, ...this.mainItems];

        if (this.carouselItems.length > 36) {
            this.carouselItems.splice(4, 36);
        }
    }

    @HostListener("document:scroll", ["$event"])
    onWindowScroll(event: any) {
        this.scrollPosition = window.pageYOffset;
    }

    openRefundPopup() {
        this.router.navigate(["/traveller/refund"]);
    }

    printHistory() {
        window.print();
    }
    getHistory() {
        this.afService.getBookingHistory().subscribe({
            next: (res: any) => {
                if (res.status == 200) {
                    this.bookingHistory = res.data;
                }
            },
            error: (error) => {
                console.log(error);
            },
        });
    }
}
