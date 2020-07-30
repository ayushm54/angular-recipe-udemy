import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
// import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        // private authService: AuthService,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
        // return this.authService.user.pipe(
        //     take(1),
        //     map(user => {
        //         const isAuthenticated = user ? true : false;
        //         if (isAuthenticated) {
        //             return true;
        //         }
        //         return this.router.createUrlTree(['/auth']);
        //     }));

        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                const isAuthenticated = authState.user ? true : false;
                if (isAuthenticated) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            }));
    }
}
