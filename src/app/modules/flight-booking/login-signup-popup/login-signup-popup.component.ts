import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-signup-popup',
  templateUrl: './login-signup-popup.component.html',
  styleUrls: ['./login-signup-popup.component.scss']
})
export class LoginSignupPopupComponent implements OnInit {
  selectedTabIndex = 0;
  constructor(
    public dialogRef: MatDialogRef<LoginSignupPopupComponent>) { }

  ngOnInit(): void {
  }

  getResponse(response: any) {
    this.dialogRef.close({ data: response });
  }

  getSignUpResponse(response: any) {
    if (response.status) {
      const tabCount = 2;
      this.selectedTabIndex = (this.selectedTabIndex + 1) % tabCount;
    }
  }

}
