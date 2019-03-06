import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  dbUser;
  convo;
  unread: number = 0;
  messages;
  chat;
  search;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._httpService.dbUser.subscribe((dbUser) => {
      if (!this.dbUser) {
        let observable = this._httpService.getUserMsg()
        observable.subscribe((data) => {
          if (data['result']) {
            this.convo = data['data']
            this.dbUser = data['user']
            // unread messages
            for (var idx in this.convo) {
              for (var i in this.convo[idx]['messages']) {
                if (this.convo[idx]['messages'][i]['recipientId'] == this.dbUser.id) {
                  if (this.convo[idx]['messages'][i]['isRead'] == false) {
                    this.unread++
                  }
                }
              }
            }
          }
          else if(!data['result']){
            this._router.navigate(['/'])
          }
        })
      }
    })

  }

  ngOnInit() {
    this.search={name: ""}
  }

  logout() {
    let observable = this._httpService.logout()
    observable.subscribe((data) => {
      this.dbUser = null;
      this._router.navigate(['/'])
    })
  }
  // SEARCH USER
  searchUsers() {
    this._router.navigate(['/results/', this.search['name']])
  }

  openMsg(convoId) {
    let observable = this._httpService.getConvoById(convoId);
    observable.subscribe((data) => {
      if (data['result']) {
        this.unread-=data['read']
        this.chat = data['data']
      }
    })
  }
}
