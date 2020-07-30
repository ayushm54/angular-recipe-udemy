import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.modl';
// import { DatStorageService } from '../shared/data-storage.service';
import { Observable, of } from 'rxjs';
// import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from './store/recipes.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(
        // private dataStorage: DatStorageService,
        // private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
        private actions$: Actions
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        // we can drectlu return the observable as it would be
        // resolved by angular after this guard returns it
        // const recipes = this.recipeService.getRecipes();
        // if (recipes.length === 0){
        //     return this.dataStorage.fetchRecipes();
        // }

        // first we dispatch the action to fetch recipes
        // and wait for the set recipes action to be called

        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => recipesState.recipes),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipesActions.FetchRecipes());
                    return this.actions$.pipe(
                        ofType(RecipesActions.SET_RECIPES),
                        take(1)
                    );
                } else {
                    return of(recipes);
                }
            })
        );
    }
}
