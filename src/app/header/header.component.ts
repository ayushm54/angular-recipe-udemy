import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatStorageService } from '../shared/data-storage.service';
// import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
// import { User } from '../auth/user.model';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  isAuthenticated = false;

  constructor(
    private dataStorage: DatStorageService,
    // private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    // this.authSubscription = this.authService.user.subscribe((user: User) => {
    //     this.isAuthenticated = !user ? false : true;
    // });
    this.authSubscription = this.store.select('auth').pipe(
      map(userData => userData.user)
    ).subscribe(user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  onSaveData(): void {
    // this.dataStorage.storeRecipes();
    this.store.dispatch(new RecipesActions.SaveRecipes());
  }

  onFetchData(): void {
    // this.dataStorage.fetchRecipes().subscribe();
    this.store.dispatch(
      new RecipesActions.FetchRecipes()
    );
  }

  onLogout(): void {
    // this.authService.logout();
    // now we can use store to logout user
    this.store.dispatch(
      new AuthActions.Logout()
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
