import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// import { AuthService } from './auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
    // private authService: AuthService,
    private store: Store<fromApp.AppState>,
    @Inject(PLATFORM_ID) private platFormId // needed to work with angular univeral
  ) { }

  ngOnInit(): void{
    // this.authService.autoLogin();
    // below we check if the code is running on browser
    // bcoz first load will happen on server with angular universal
    // and on server we cant use localstorage service
    if (isPlatformBrowser(this.platFormId)) {
      this.store.dispatch(new AuthActions.AutoLogin());
    }
  }

}
