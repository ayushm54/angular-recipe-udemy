import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        // private authService: AuthService,
        private store: Store<fromApp.AppState>
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // return this.authService.user.pipe(take(1), exhaustMap(user => {
        //     if (!user) {
        //         return next.handle(req);
        //     }
        //     const modifiedReq = req.clone({
        //         params: new HttpParams().set('auth', user.token)
        //     });
        //     return next.handle(modifiedReq);
        // }));

        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                // since select return the whole authState object
                // we are using map to return the user property to exhaustMap
                return authState.user;
            }),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedReq);
            }));

    }
}
