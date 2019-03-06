import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user;
  dbUser: any;
  userinfo:any;
  errorMsg: String;
  staticAlertClosed = false;
  
  private fbUser: SocialUser;
  private loggedIn: boolean;
  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.user={email:"", username:"", password:""}

    this.authService.authState.subscribe((fbUser) => {
      this.fbUser = fbUser;
      this.loggedIn = (fbUser != null);
    });
  }

  signInWithFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((fbUser) => {
        if (fbUser) {
          this.userinfo = {
            email: fbUser.facebook.email,
              first_name: fbUser.facebook.first_name, 
              last_name: fbUser.facebook.last_name, 
              username: fbUser.facebook.first_name,
              secret: fbUser.facebook.id,
              avatar_url:"//graph.facebook.com/"+fbUser.facebook.id+"/picture?type=large"
          }
          let observable = this._httpService.loginFbUser(this.userinfo);
          observable.subscribe((data) => {
            if (data['result']) {
              this.dbUser = data['user']
              this._httpService.dbUser.next(this.dbUser)
              this._router.navigate(['/home']);
            }
          })
        } else {

        }
      });
  }

  onRegister(){
    let observable = this._httpService.registerUser(this.user);
    observable.subscribe((data)=>{
      if(data['result']){
        this.dbUser = data['user']
        this._httpService.dbUser.next(this.dbUser)
        this._router.navigate(['/home']);
      }else{
        this.user={email:"", username:"", password:""}
        if(data['error']['errors'][0]['message']){
          this.staticAlertClosed = true;
          this.errorMsg=data['error']['errors'][0]['message']
          setTimeout(() => this.staticAlertClosed = false, 2000);
        }
      }
    })
  }

}
