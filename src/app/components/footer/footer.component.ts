import { Component, OnInit ,OnChanges, DoCheck } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalService } from 'src/app/services/local.service';
import * as _ from 'lodash';
import * as AllRoutes from "../../../assets/json/routes.json";
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnChanges , DoCheck {
isSpinner!:boolean;
subscriptionForm!: FormGroup;
  currentFooter: any;
constructor(private local:LocalService,
  private formbuilder: FormBuilder,
  private _snackBar:MatSnackBar,
  private router: Router) { }
  ngOnInit(): void {
    this.local.spinner$.subscribe({
      next:((spinner:boolean)=>{
        this.isSpinner = spinner;
      })
    })

    this.subscriptionForm = this.formbuilder.group({
      firstname: new FormControl("",Validators.required),
      lastname: new FormControl("",Validators.required),
      email: new FormControl("", [Validators.required]),
      interest: this.formbuilder.array(["Flights","Hotels","Activities"])
    });
    this.router.events.subscribe((val) => {
      this.getBgTheme();
    });
  }

  getBgTheme() {
    let url = window.location.href;
    _.map(AllRoutes, (val, key) => {
      if (url.includes(key)) {
        _.map(val, (subroute: any) => {
          if (url.includes(subroute.path)) {
            this.currentFooter = subroute.footer;
            
          }
        })
      }
    })
  }

  ngOnChanges(){
    this.local.spinner$.subscribe({
      next:((spinner:boolean)=>{
        this.isSpinner = spinner;
      })
    })
  }

  ngDoCheck(){
    this.local.spinner$.subscribe({
      next:((spinner:boolean)=>{
        this.isSpinner = spinner;
      })
    })
  }

  onSubmit(){
    if(!this.subscriptionForm.valid){
      return
    }
    this.local.setSubscription(this.subscriptionForm.value).subscribe(response=>{
      if(response.Result.TYPE === 'success' && response.Result.data){
        this.openSnackBar(response.Result.MESSAGE,'success',true);
      } else {
        this.openSnackBar(response.Result.MESSAGE,'Danger',false);
      }
    })
  }

  openSnackBar(message: string, action: string, status:boolean) {
    this._snackBar.open(message, action,{
      duration: 3000,
      panelClass: status===true?['success-snackbar']:['danger-snackbar']
    });
  }
}
