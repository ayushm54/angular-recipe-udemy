import { Recipe } from '../recipe.modl';
import * as fromRecipes from './recipes.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

export function recipeReducer(
    state: State = initialState,
    action: fromRecipes.RecipesActions
): any {
    switch (action.type) {
        case fromRecipes.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };

        case fromRecipes.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };

        case fromRecipes.UPDATE_RECIPE:
            // creating a copy with spread operator
            // and merge the new content from payload
            const updateRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.recipe
            };

            const updateRecipes = [...state.recipes];

            updateRecipes[action.payload.index] = updateRecipe;

            return {
                ...state,
                recipes: updateRecipes
            };
        case fromRecipes.DELETE_RECIPE:
            const recipesAfterDelete = [...state.recipes];
            recipesAfterDelete.splice(action.payload, 1);
            return {
                ...state,
                recipes: recipesAfterDelete
            };

        default:
            return state;
    }
}
