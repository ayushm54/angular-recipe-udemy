import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { AUTHENTICAT_FAIL } from './auth.actions';

export interface State{
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

export function authReducer(
    state: State = initialState,
    action: AuthActions.AuthActionTypes
): any {
    switch (action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS:
            const loggedInUser = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                user: loggedInUser,
                authError: null,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null,
                authError: null,
                loading: false
            };
        case AuthActions.LOGIN_START: // this case would fall back to below case
        case AuthActions.SIGN_UP_START:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AuthActions.AUTHENTICAT_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
