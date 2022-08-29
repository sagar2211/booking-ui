import { Component, Input, Optional, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {LocalService} from '../../../services/local.service'
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-dailog-box',
  templateUrl: './dailog-box.component.html',
  styleUrls: ['./dailog-box.component.scss']
})

export class DailogBoxComponent {
  constructor(public dialog: MatDialog,
    private local : LocalService,
    public dialogRef: MatDialogRef<DailogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ){
  }
  myFormGroup = new FormGroup({
    formField: new FormControl()
  });

  adult: number = +this.data.Adult;
  child: number = +this.data.Child;
  infant: number = +this.data.Infant;
  _step: number = 1;
  _min: number = 0;
  _adultMin: number = 1;
  _max: number = Infinity;
  _wrap: boolean = false;
  color: string = 'default';

  @Input('value')
  set inputValue(adult: number) {
    this.adult = this.parseNumber(adult);
  }

  @Input()
  set step(_step: number) {
    this._step = this.parseNumber(_step);
  }

  @Input()
  set min(_min: number) {
    this._min = this.parseNumber(_min);
  }

  @Input()
  set max(_max: number) {
    this._max = this.parseNumber(_max);
  }

  @Input()
  set wrap(_wrap: boolean) {
    this._wrap = this.parseBoolean(_wrap);
  }

  private parseNumber(num: any): number {
    return +num;
  }

  private parseBoolean(bool: any): boolean {
    return !!bool;
  }

  setColor(color: string): void {
    this.color = color;
  }

  getColor(): string {
    return this.color
  }

  incrementValue(step: number = 1, passengerType : string): void {
    if(passengerType === 'adult' && this.adult < 9){
      let inputValue = +this.adult + step;
      if (this._wrap) {
        console.log(this._wrap);
        inputValue = this.wrappedValue(inputValue);
      }
      this.adult = inputValue;
    } else if(passengerType === 'child' && this.adult > 0 && this.child < 8){
      let inputValue = +this.child + step;
      if (this._wrap) {
        inputValue = this.wrappedValue(inputValue);
      }
      this.child = inputValue;
    } else if(passengerType === 'infant' && this.adult > 0 && this.infant < 2){
      let inputValue = +this.infant + step;
      if (this._wrap) {
        inputValue = this.wrappedValue(inputValue);
      }
      this.infant = inputValue;
    }
  }

  decrementValue(step: number = 1, passengerType : string): void {
    if(passengerType === 'adult'){
      let inputValue = this.adult + step;
      if (this._wrap) {
        console.log(this._wrap);
        inputValue = this.wrappedValue(inputValue);
      }
      this.adult = inputValue;
    } else if(passengerType === 'child'){
      let inputValue = +this.child + step;
      if (this._wrap) {
        inputValue = this.wrappedValue(inputValue);
      }
      this.child = inputValue;
    } else if(passengerType === 'infant'){
      let inputValue = +this.infant + step;
      if (this._wrap) {
        inputValue = this.wrappedValue(inputValue);
      }
      this.infant = inputValue;
    }
    
  }

  private wrappedValue(inputValue:any): number {
    if (inputValue > this._max) {
      return this._min + inputValue - this._max;
    }

    if (inputValue < this._min) {

      if (this._max === Infinity) {
        return 0;
      }

      return this._max + inputValue;
    }

    return inputValue;
  }

  shouldDisableDecrementAdult(inputValue: number): boolean {
    return !this._wrap && inputValue <= this._adultMin;
  }

  shouldDisableDecrement(inputValue: number): boolean {
    return !this._wrap && inputValue <= this._min;
  }

  shouldDisableIncrement(inputValue: number): boolean {
    return !this._wrap && inputValue >= this._max;
  }

  addValue(){
    let obj = {
      Adult : this.adult,
      Child : this.child,
      Infant : this.infant,
    }
    this.dialogRef.close({data: obj });
  }
}
