import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  dbUser;
  profUser;
  photos;
  noUser: boolean;
  follows: boolean;
  message;
  unread: number = 0;
  search;


  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: NgbModal) {


    this._httpService.dbUser.subscribe((dbUser) => {
      if (!this.dbUser) {
        // get user from session
        let observable = this._httpService.getUser()
        observable.subscribe((data) => {
          // if user in session
          if (data['result']) {
            this.dbUser = data['user']
            // unread messages
            for (var idx in this.dbUser['recipient']) {
              if (this.dbUser['recipient'][idx]['isRead'] == false) {
                this.unread++
              }
            }
            // get user profile id
            this._route.params.subscribe((data) => {
              let observable = this._httpService.getUserById(data.id)
              observable.subscribe((data) => {
                if (data['result']) {
                  this.profUser = data['user'];
                  // IF FOLLOWS
                  for (let user in this.profUser['followed']) {
                    if (this.profUser['followed'][user]['id'] == this.dbUser['id']) {
                      this.follows = true;
                      return
                    }
                  }
                } else {
                  // USER NOT FOUND
                  this.noUser = true;
                }
              })
            })
          } else {
            // user not in session
            this._router.navigate(['/'])
          }
        })
      } else {
        this.dbUser = dbUser;
      }
    })

  }

  ngOnInit() {
    this.search = { name: "" }
  }

  // SEARCH USERS
  searchUsers() {
    this._router.navigate(['/results/', this.search['name']])
  }

  followUser() {
    let observable = this._httpService.followUser(this.dbUser.id, this.profUser.id)
    observable.subscribe((data) => {
      if (data['result']) {
        this.follows = true;
      }
    })
  }
  unFollowUser() {
    let observable = this._httpService.unFollowUser(this.dbUser.id, this.profUser.id)
    observable.subscribe((data) => {
      if (data['result']) {
        this.follows = false;
      }
    })
  }

  openMsg(content) {
    this.modalService.open(content, { centered: true })
    this.message = { content: "" }
  }

  sendMsg() {
    let observable = this._httpService.sendMsg(this.message, this.profUser.id)
    observable.subscribe((data) => {
      if (data['result']) {
        this.modalService.dismissAll();
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
