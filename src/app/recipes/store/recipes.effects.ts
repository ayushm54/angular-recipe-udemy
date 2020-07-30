import { Recipe } from './../recipe.modl';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as RecipesActions from './recipes.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(
                'https://angular-recipe-87935.firebaseio.com/recipes.json'
            );
        }),
        map(responseData => {
            return responseData.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );

    @Effect({ dispatch: false })
    saveRecipes = this.actions$.pipe(
        ofType(RecipesActions.SAVE_RECIPES),
        // withLatestFrom operator helps merge the output of
        // one observable to the next observable in chain
        withLatestFrom(
            this.store.select('recipes')
        ),
        // the input array is provided to switchmap by rxjs
        // this [] contains the data from withLatestFrom
        switchMap(([actionData, recipesState]) => {
            return this.http.put(
                'https://angular-recipe-87935.firebaseio.com/recipes.json',
                recipesState.recipes
            );
        })
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) { }
}
