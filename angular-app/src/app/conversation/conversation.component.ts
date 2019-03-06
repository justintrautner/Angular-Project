import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  dbUser;
  message;
  @Input() openMsg: any;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._httpService.dbUser.subscribe((dbUser) => {
      if (dbUser) {
        this.dbUser = dbUser
      }
      else if (!dbUser) {
        let observable = this._httpService.getUserConvo()
        observable.subscribe((data) => {
          this.dbUser = data['user']
        })
      }
    })

    this.message = { content: "" }

  }

  ngOnInit() {
  }

  replyMsg(convoId) {
    let observable=this._httpService.replyMsg(convoId, this.message)
    observable.subscribe((data)=>{
      this.openMsg=data['data']
      this.message = { content: "" }
    })
  }
  


}
