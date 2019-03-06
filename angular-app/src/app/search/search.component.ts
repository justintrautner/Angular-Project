import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  dbUser;
  unread: number;
  results;
  search

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this._route.params.subscribe((query) => {
      let observable = this._httpService.getUserSearch(query['search'])
      observable.subscribe((data) => {
        if (data['result']) {
          this.dbUser = data['user']
          this.unread = data['unread']
          this.results = data['data']
        } else if (!data['result']) {
          this._router.navigate(['/'])
        }
      })
    })

  }

  ngOnInit() {
    this.search = { name: "" }
  }
  // SEARCH
  searchUsers() {
    this._router.navigate(['/results/', this.search['name']])
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

}
