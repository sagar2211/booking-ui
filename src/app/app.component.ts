import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'wadiia-frontend';
  @ViewChild('ipAddress', {static: false}) ipAddress!: ElementRef;
  constructor(){
  }
  
  ngAfterViewInit(): void {
    // alert(this.ipAddress)
  }
}
