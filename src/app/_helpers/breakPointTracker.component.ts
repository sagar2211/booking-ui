import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakPointTracker {

    constructor(private observer: BreakpointObserver) {
    }


    isBelowSm(): Observable<BreakpointState> {
        return this.observer.observe(['(max-width: 575px)']);
      }
    
      isBelowMd(): Observable<BreakpointState> {
        return this.observer.observe(['(max-width: 767px)']);
      }
    
      isBelowLg(): Observable<BreakpointState> {
        return this.observer.observe(['(max-width: 991px)']);
      }
    
      isBelowXl(): Observable<BreakpointState> {
        return this.observer.observe(['(max-width: 1199px)']);
      }

      isGreatLg(): Observable<BreakpointState> {
        return this.observer.observe(['(max-width:1299px)']);
      }
}