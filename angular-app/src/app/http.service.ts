import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  dbUser = new BehaviorSubject(null);


  constructor(private _http: HttpClient) { }

  // LOGIN
  loginUser(user){
  return this._http.post("/db/login", user)
  }
  // LOGIN FB USER
  loginFbUser(user){
    return this._http.post("/db/fb/login", user)
  }
  // REGISTER
  registerUser(user){
    return this._http.post("/db/register", user)
  }
  // SESSION CHECK -- RETRIEVE INFO FOR HOME PAGE
  getUserHome(){
    return this._http.get("/db/user/home")
  }
  // SESSION CHECK -- PROFILE COMPONENT
  getUser(){
    return this._http.get("/db/user/profile")
  }
  // LOGOUT USER
  logout(){
    return this._http.get("/db/logout")
  }
  // GET USER BY ID
  getUserById(id){
    return this._http.get("/db/user/"+id);
  }
  // EDIT ABOUT
  editAbout(id, about){
    return this._http.put("/db/user/"+id, about);
  }
  // FOLLOW USER
  followUser(followerId, followedId){
    return this._http.get("/db/user/follow/"+followerId+"/"+followedId)
  }
  // UNFOLLOW USER
  unFollowUser(followerId, followedId){
    return this._http.get("/db/user/unfollow/"+followerId+"/"+followedId)
  }
  // SEND MESSAGE
  sendMsg(content, recipientId){
    return this._http.post("/db/user/message/send/"+recipientId, content)
  }
  // RETRIEVE INFO FOR MESSAGE COMPONENT
  getUserMsg(){
    return this._http.get("/db/user/message/retrieve")
  }
  // RETRIEVE SINGLE CONVERSATION
  getConvoById(id){
    return this._http.get("/db/user/message/retrieve/"+id)
  }
  // RETRIEVE USER CONV COMP
  getUserConvo(){
  return this._http.get("/db/user/conversation/retrieve")
  }
  // SEND MESSAGE--MESSAGE COMPONENT
  replyMsg(convoId,content){
    return this._http.post("/db/user/message/reply/"+convoId, content)
  }
  // GET USER INFO--EDIT COMPONENT
  getUserEdit(){
    return this._http.get("/db/user/edit/info")
  }
  // UPDATE USER--EDIT COMPONENT
  updateUser(edit){
    return this._http.put("/db/user/edit/info/"+edit.id, edit)
  }
  // GET USER SEARCH
  getUserSearch(query){
    return this._http.get("/db/user/search/"+query)
  }
  // POST PICTURE
  postPicture(pic){
    return this._http.post("/db/user/post/img",pic)
  }
  // FIND PHOTO BY ID
  findPhotoById(id){
    return this._http.get("/db/user/photo/"+id)
  }
  // SEND RESET EMAIL
  sendReset(info){
    return this._http.post("/db/user/password/forgot", info)
  }
  // VERIFY TOKEN
  verifyToken(token){
    return this._http.get("/db/user/password/reset/"+token)
  }
  // RESET PASSWORD
  resetPassword(password, token){
    return this._http.post("/db/user/password/reset/"+token, password)
  }
  // LIKE PHOTO
  likePhoto(id){
    return this._http.get("/db/user/photo/"+id+"/like")
  }
  // UNLIKE PHOTO
  unlikePhoto(id){
    return this._http.get("/db/user/photo/"+id+"/unlike")
  }
  // ADD COMMENT
  addComment(id, content){
    return this._http.post("/db/user/photo/"+id, content)
  }
  // DELETE COMMENT
  deleteComment(id, photoId){
    return this._http.delete("/db/user/comment/"+id+"/"+photoId)
  }
}
