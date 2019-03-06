import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  dbUser;
  unread = 0;
  edit;
  staticAlertClosed = false;
  failedAlert= false;
  failedMsg;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) {

    let observable = this._httpService.getUserEdit()
    observable.subscribe((data) => {
      if (data['result']) {
        this.dbUser = data['user']
        this.unread = data['unread']
        // EDIT
        this.edit={
          id:this.dbUser['id'],
          first_name:this.dbUser['first_name'],
          last_name: this.dbUser['last_name'],
          username: this.dbUser['username'],
          description: this.dbUser['description'],
          avatar_url: this.dbUser['avatar_url'],
          cover_photo_url: this.dbUser['cover_photo_url'],
          livesIn: this.dbUser['livesIn'],
          from: this.dbUser['from']
        }
      } else {
        this._router.navigate(['/'])
      }
    })

  }

  ngOnInit() {
  }

  updateUser(){
    let observable=this._httpService.updateUser(this.edit)
    observable.subscribe((data)=>{
      if(data['result']){
        this.staticAlertClosed = true;
        setTimeout(() => this.staticAlertClosed = false, 2000);
      }
      if(data['error']){
        this.failedMsg=data['error'][0]['message']
        this.failedAlert=true
        setTimeout(() => this.failedAlert = false, 2000);
      }
    })
  }


  logout() {
    let observable = this._httpService.logout()
    observable.subscribe((data) => {
      // delete session
      // delete user from angular
      this.dbUser = null;
      // redirect
      this._router.navigate(['/'])
    })
  }

}
