import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as AuthActions from './auth.actions';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // this would be returned only in login call
}

const handleAuthentication = (resData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    // we return a action object as observable from a effect
    // which is automatically dispached by ngrx effects
    // we do not need to call of because map implicitly
    // creates a new observable with returned value
    const user = new User(
        resData.email,
        resData.localId,
        resData.idToken,
        expirationDate
    );

    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthenticateSuccess({
        email: resData.email,
        userId: resData.localId,
        token: resData.idToken,
        expirationDate,
        redirect: true
    });
};

const handleError = (errorRes: HttpErrorResponse): string => {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
        return errorMessage;
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'Email could not be found!';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'Invalid Credentials!';
            break;
        case 'EMAIL_EXISTS':
            errorMessage = 'Account already exists. Please sign in to continue!';
            break;
    }
    // even if we get an error we should return
    // a non-error observable, bcoz if we throw
    // throw error in here, the effect observable would die
    // which should not as it is to run till the application is up
    // to continuously listen for any login event
    // here we are using of utility from rxjs to create a new observable
    return errorMessage;
};

// A side effect should not modify state in any case
// It can dispach a new action
// we need injectabe, so that things could be injected in this class
// Note: do not add providedIn in any effect class
@Injectable()
export class AuthEffects {

    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthActions.SIGN_UP_START),
        switchMap((signUpStartAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
                {
                    email: signUpStartAction.payload.email,
                    password: signUpStartAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(
                    (resData) => this.authService.autoLogout(+resData.expiresIn * 1000)
                ),
                // if any error occurs map would not execute
                // instead catchError woul execute skipping map
                map(resData => {
                    return handleAuthentication(resData);
                }),
                catchError((errorRes: HttpErrorResponse) => {
                    return of(new AuthActions.AuthenticateFail(handleError(errorRes)));
                }));
        })
    );

    // We do not need to explicitly dispatch action from effects
    // ngrx automaticall dispatches the returned value from effect as actions
    @Effect()
    authLogin = this.actions$.pipe(
        // ofType is a rxjs operator by ngrx-effects
        // it allows us to define what type of effects
        // we want to run this observable for, it just filters actions
        // note: this observable would be subscribed by ngrx
        ofType(AuthActions.LOGIN_START),
        // after the above ofType filter runs, we receive the
        // payload of the filtered action in next operator
        // where we could now write our logic for any side effect
        switchMap((loginStartAction: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
                {
                    email: loginStartAction.payload.email,
                    password: loginStartAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(
                    (resData) => this.authService.autoLogout(+resData.expiresIn * 1000)
                ),
                // if any error occurs map would not execute
                // instead catchError woul execute skipping map
                map(resData => {
                    return handleAuthentication(resData);
                }),
                catchError((errorRes: HttpErrorResponse) => {
                    return of(new AuthActions.AuthenticateFail(handleError(errorRes)));
                }));
        })
    );

    // here we are not dispatching new action
    // we are just navigating away after successful login
    // to indicate this we pass a object to decorator with dispatch set to false
    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if (authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        })
    );

    @Effect()
    authAutoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'));

            if (!userData) {
                return {type: 'DUMMY'};
            }

            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );
            if (loadedUser.token) {
                const expirationDuration =
                new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.autoLogout(expirationDuration);
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    // we do not want to redirect when autologin
                    redirect: false
                });
            }

            // if we do not have a loaded user then thi effect
            // would fail as no action would be dispached
            // so we dispatch a new action if there is no  loaded user
            return {type: 'DUMMY'};
        })
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            localStorage.removeItem('userData');
            this.authService.clearAutoLogOutTimer();
            this.router.navigate(['/auth']);
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) { }
}
