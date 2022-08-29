import { BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, DoCheck, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { LocalService } from 'src/app/services/local.service';
import { BreakPointTracker } from 'src/app/_helpers/breakPointTracker.component';

@Component({
  selector: 'app-middle',
  templateUrl: './middle.component.html',
  styleUrls: ['./middle.component.scss']
})
export class MiddleComponent implements OnInit, DoCheck,AfterViewInit{
  isSearchExists: boolean= false;
  isSpinner=true;
  isBelowLg: boolean = true ;

  constructor(private local:LocalService,private BTracker: BreakPointTracker,private changeDetector:ChangeDetectorRef) {
   
  }
  ngOnInit() {
    this.local.spinner$.subscribe((spinner:any)=>{
      this.isSpinner = spinner;
    });
    this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
    });
    this.changeDetector.detectChanges()
  }
  ngAfterViewInit(): void {
    // this.BTracker.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
    //   this.isBelowLg = isBelowLg.matches;
    // });
  }

  ngDoCheck(){
    let url = window.location.href;
    this.isSearchExists = url.includes("searchFlight");
  }

}
