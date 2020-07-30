import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as fromAuth from './store/auth.actions';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // this would be returned only in login call
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    // BehaviorSubject gives user access to previously emmited value as well
    // user = new BehaviorSubject<User>(null);
    private sessionTimeOutTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) { }

    signUp(email: string, password: string): Observable<any> {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseAPIKey,
            {
                email, password, returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn);
        }));
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseAPIKey,
            {
                email, password, returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email,
                resData.localId,
                resData.idToken,
                +resData.expiresIn);
        }));
    }

    logout(): void{
        // this.user.next(null);
        this.store.dispatch(new fromAuth.Logout());
        localStorage.removeItem('userData');
        if (this.sessionTimeOutTimer) {
            clearTimeout(this.sessionTimeOutTimer);
        }
        // this.router.navigate(['/auth']);
    }

    autoLogin(): void{
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            // this.user.next(loadedUser);
            this.store.dispatch(new fromAuth.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate),
                redirect: false
            }));
            // as soon as user logs in we initiate a auto log out timer
            const expirationDuration =
                new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number): void{
        // expirationDuration is the session timeout time in miliseconds
        // the setTimeout method initiates a timer
        this.sessionTimeOutTimer = setTimeout(() => {
            // this.logout();
            this.store.dispatch(new fromAuth.Logout());
        }, expirationDuration);
    }

    clearAutoLogOutTimer(): void {
        if (this.sessionTimeOutTimer) {
            clearTimeout(this.sessionTimeOutTimer);
            this.sessionTimeOutTimer = null;
        }
    }

    private handleAuthentication(
        email: string, id: string,
        token: string, expiresIn: number): void
    {
        const expiratioDate = new Date(new Date().getTime() + expiresIn * 1000);

        const user = new User(email, id, token, expiratioDate);

        localStorage.setItem('userData', JSON.stringify(user));

        // this.user.next(user);
        this.store.dispatch(new fromAuth.AuthenticateSuccess({
            email,
            userId: id,
            token,
            expirationDate: expiratioDate,
            redirect: true
        }));
        // as soon as user logs in we initiate a auto log out timer
        this.autoLogout(expiresIn * 1000);
    }

    private handleError(errorRes: HttpErrorResponse): Observable<any> {
        let errorMessage = 'An unknown error occured!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
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
        return throwError(errorMessage);
    }
}
