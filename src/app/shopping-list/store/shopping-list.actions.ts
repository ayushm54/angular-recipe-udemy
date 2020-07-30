import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

// export const ADD_INGREDIENT = 'ADD_INGREDIENT';
// export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
// export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
// export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
// export const START_EDIT = 'START_EDIT';
// export const STOP_EDIT = 'STOP_EDIT';

// we could apply a prefix with feature name to ensure uniqueness of
// the action types as every dispatch would go to all the reducers
export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

export class AddIngredient implements Action {

    // readonly ensures that the field should never be changed from outside
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class AddIngredients implements Action {

    // readonly ensures that the field should never be changed from outside
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) { }
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
    readonly type = START_EDIT;

    constructor(public payload: number) { }
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}

export type ShoppingListActionTypes =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEdit
  | StopEdit;
