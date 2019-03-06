import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { Router } from '@angular/router';
import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any;
  userinfo: any;
  dbUser: any;
  invalidLogin: boolean;
  private fbUser: SocialUser;
  private loggedIn: boolean;
  staticAlertClosed = false;

  constructor(
    private _httpService: HttpService,
    private _router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = { email: "", password: "" }
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
          this.staticAlertClosed = true;
          setTimeout(() => this.staticAlertClosed = false, 2000);
          this.user = { email: "", password: "" }
          this.invalidLogin = true;
        }
      });
  }

  onLogin() {
    let observable = this._httpService.loginUser(this.user);
    observable.subscribe((data) => {
      if (data['result']) {
        this.dbUser = data['user']
        this._httpService.dbUser.next(this.dbUser)
        this._router.navigate(['/home']);
      } else {
        this.staticAlertClosed = true;
        setTimeout(() => this.staticAlertClosed = false, 2000);
        this.user = { email: "", password: "" }
        this.invalidLogin = true;
      }
    })
  }
  
}
