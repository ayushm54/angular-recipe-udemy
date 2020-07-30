import { Ingredient } from '../../shared/ingredient.model';
// importing everything exported from a file with *
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(
    state: State = initialState,
    action: ShoppingListActions.ShoppingListActionTypes
): any {
    // here state is the current state in the store
    // is the current state is not defined
    // when ngrx would initiallize the application
    // then the default value of initialState would be assigned
    // and the action is what needs to be done on store

    // state is immutable so always create a new state
    // copy the existing state to it and then add the new data
    // finally save this new state to the store
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                // copying the current state to this new object
                ...state,
                // modifying the ingredients array in copied state by
                // first copying the ingredients array property
                // and adding new ingedient to it
                ingredients: [...state.ingredients, action.payload]
            };

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };

        case ShoppingListActions.UPDATE_INGREDIENT:
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = action.payload;
            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };

        case ShoppingListActions.DELETE_INGREDIENT:
            const ingredientToRetain = [...state.ingredients];
            ingredientToRetain.splice(state.editedIngredientIndex, 1);
            return {
                ...state,
                ingredients: ingredientToRetain,
                editedIngredientIndex: -1,
                editedIngredient: null
            };

        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                // copying the ingredient first to new object and then send it
                editedIngredient: { ...state.ingredients[action.payload] }
            };

        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };

        default: // to hanlde initialization when reducer is just loaded by ngrx
            return state;
    }
}
