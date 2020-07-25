import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user: User) => {
        this.isAuthenticated = !user ? false : true;
    });
  }

  onSaveData(): void{
    this.dataStorage.storeRecipes();
  }

  onFetchData(): void{
    this.dataStorage.fetchRecipes().subscribe();
  }

  onLogout(): void{
    this.authService.logout();
  }

  ngOnDestroy(): void{
    this.authSubscription.unsubscribe();
  }
}
