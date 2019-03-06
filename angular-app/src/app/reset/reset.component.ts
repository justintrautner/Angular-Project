import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  invalidToken: boolean = false;
  reset;
  tokenId;
  changed: boolean = false;
  mismatch: boolean = false;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) {

    this._route.params.subscribe((data) => {
      let observable = this._httpService.verifyToken(data.token)
      observable.subscribe((info) => {
        if (info['result']) {
          this.tokenId = data.token
          this.reset = { password: "", c_password: "" }
        } else {
          this.invalidToken = true;
        }
      })
    })
  }

  ngOnInit() {
  }

  resetPassword() {
    if (this.reset['password'] === this.reset['c_password']) {
      let observable = this._httpService.resetPassword(this.reset, this.tokenId)
      observable.subscribe((data) => {
        if (data['result']) {
          this.changed = true;
        } else {

        }
      })
    }else{
      this.mismatch=true;
      setTimeout(() => this.mismatch = false, 3000);
    }
  }

}
