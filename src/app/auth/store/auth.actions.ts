import { Action } from '@ngrx/store';

export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICAT_FAIL = '[Auth] Login Failed';
export const SIGN_UP_START = '[Auth] Sign Up Start';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess implements Action {

    // readonly ensures that the field should never be changed from outside
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {
        email: string,
        userId: string,
        token: string,
        expirationDate: Date,
        redirect: boolean
    }) { }
}

export class Logout implements Action {

    // readonly ensures that the field should never be changed from outside
    readonly type = LOGOUT;
}

export class LoginStart implements Action {

    readonly type = LOGIN_START;

    constructor(public payload: {
        email: string,
        password: string
    }) { }
}

export class AuthenticateFail implements Action {

    readonly type = AUTHENTICAT_FAIL;

    constructor(public payload: string) { }
}

export class SignupStart implements Action {

    readonly type = SIGN_UP_START;

    constructor(public payload: {
        email: string,
        password: string
    }) { }
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActionTypes =
    | AuthenticateSuccess
    | Logout
    | LoginStart
    | AuthenticateFail
    | SignupStart
    | AutoLogin;
