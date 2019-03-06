import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  reset;
  invalidAlert: boolean = false;
  validAlert: boolean = false;


  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.reset = { email: "" }
  }

  sendReset() {
    let observable = this._httpService.sendReset(this.reset)
    observable.subscribe((data) => {
      if (data['result']) {
        this.validAlert = true
        setTimeout(() => this.validAlert = false, 3000);
      } else {
        this.invalidAlert = true
        setTimeout(() => this.invalidAlert = false, 3000);
      }
    })
  }

}
