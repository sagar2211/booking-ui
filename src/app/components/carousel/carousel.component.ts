import { Component, OnInit } from '@angular/core';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})


export class CarouselComponent implements OnInit {
  activeSlides!: SlidesOutputData;
  slidesStore!: any[];
  constructor() { }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 600,
    navText: ['<', '>'],
    center: true,
    responsive: {
      0: {
        items: 1 
      },
      600: {
        items: 1
      },
      760: {
        items: 3
      },
      1000: {
        items: 3
      }
    },
    nav: true
  }

      getData(data: SlidesOutputData) {
        this.activeSlides = data;
      }
  ngOnInit(): void {
  }

}
