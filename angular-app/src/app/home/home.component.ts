import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dbUser;
  about;
  unread: number = 0;
  search;
  photos;
  imgPost;
  openPost: boolean = false;
  failedAlert: boolean = false;
  failedMsg;
  rec_photos;
  photo;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private modalService: NgbModal) {

    this._httpService.dbUser.subscribe((dbUser) => {
      if (!this.dbUser) {
        // get user from session
        let observable = this._httpService.getUserHome()
        observable.subscribe((data) => {
          // if user in session
          if (data['result']) {
            this.dbUser = data['user']
            this.photos = data['photos']
            this.rec_photos = data['rec_photos']
            this.about = { livesIn: this.dbUser['livesIn'], from: this.dbUser['from'] }
            // unread messages
            for (var idx in this.dbUser['recipient']) {
              if (this.dbUser['recipient'][idx]['isRead'] == false) {
                this.unread++
              }
            }
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
  // POST PICTURE
  postPicture() {
    let observable = this._httpService.postPicture(this.imgPost)
    observable.subscribe((data) => {
      if (data['result']) {
        this.dbUser = data['user']
        this.photos = data['photos']
        this.rec_photos = data['rec_photos']
        this.openPost = false
      } else {
        this.failedMsg = data['error']
        this.failedAlert = true
        setTimeout(() => this.failedAlert = false, 2000);
      }
    })
  }
  // CLOSE PREVIEW
  closePreview() {
    this.openPost = false;
  }
  // PREVIEW IMAGE
  openPreview() {
    this.openPost = true;
    this.imgPost = { url: "", caption: "" }
  }
  // SEARCH USERS
  searchUsers() {
    this._router.navigate(['/results/', this.search['name']])
  }
  // FOLLOWERS MODAL
  openFollowers(followers) {
    this.modalService.open(followers, { centered: true });
  }
  // FOLLOWING MODAL
  openFollowing(following) {
    this.modalService.open(following, { centered: true })
  }

  // MODAL EDIT
  openEdit(edit) {
    this.modalService.open(edit);
  }
  // LOOUT
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
  // EDIT ABOUT
  editAbout() {
    let observable = this._httpService.editAbout(this.dbUser.id, this.about)
    this.modalService.dismissAll()
    observable.subscribe((data) => {
      this.dbUser = data['user']
    })
  }

}
