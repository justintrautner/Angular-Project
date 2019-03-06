import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  unread: number = 0;
  search;
  dbUser;
  photo;
  isLiked: boolean;
  openComment: boolean = false;
  comment;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) {

    this._route.params.subscribe((id) => {
      let observable = this._httpService.findPhotoById(id.id)
      observable.subscribe((data) => {
        if (data['result']) {
          this.dbUser = data['user']
          this.unread = data['unread']
          this.photo = data['photo']
          for (var idx in this.photo['liker']) {
            if (this.photo['liker'][idx]['id'] == this.dbUser.id) {
              this.isLiked = true;
              return;
            }
          }
        } else {
          this._router.navigate(['/'])
        }
      })
    })
  }

  ngOnInit() {
    this.search = { name: "" }
  }

  // SEARCH USERS
  searchUsers() {
    this._router.navigate(['/results/', this.search['name']])
  }
  // LIKE PHOTO
  likePhoto() {
    let observable = this._httpService.likePhoto(this.photo.id)
    observable.subscribe((data) => {
      this.photo['num_of_likes']++
      this.isLiked = true;
    })
  }
  // UNLIKE PHOTO
  unlikePhoto() {
    let observable = this._httpService.unlikePhoto(this.photo.id)
    observable.subscribe((data) => {
      this.photo['num_of_likes']--
      this.isLiked = false
    })
  }
  // OPEN COMMENT
  openBox() {
    this.openComment = true;
    this.comment = { content: "" }
  }
  // CLOSE COMMENT
  closeBox() {
    this.openComment = false
  }
  // ADD COMMENT
  addComment(){
    let observable=this._httpService.addComment(this.photo.id, this.comment)
    observable.subscribe((data)=>{
      if(data['result']){
        this.photo['photo_comments']=data['photo']['photo_comments']
        this.photo['num_of_comments']++
        this.openComment=false;
      }
      
    })
  }
  // DELETE COMMENT
  deleteComment(id){
    let observable=this._httpService.deleteComment(id, this.photo.id)
    observable.subscribe((data)=>{
      if(data['result']){
        this.photo['photo_comments']=data['photo']['photo_comments']
        this.photo['num_of_comments']--
      }
    })
  }

  // LOOUT
  logout() {
    let observable = this._httpService.logout()
    observable.subscribe((data) => {
      this.dbUser = null;
      this._router.navigate(['/'])
    })
  }

}
