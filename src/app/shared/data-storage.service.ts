import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.modl';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatStorageService {

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService
    ) { }

    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();

        // to overide all data firebase exposes the put request
        this.http.put(
            'https://angular-recipe-87935.firebaseio.com/recipes.json',
            recipes
        ).subscribe((response) => {
            console.log(response);
        });
    }

    fetchRecipes(): Observable<any> {
        // take tells observable that it would need only one value from it
        // and after taking this value it automatically unscubscribes
        // exhaustMap is used to chin two observables
        // it takes the data from one observable once that observable is complete
        // it then passes the data from 1st observable and pass it to
        // the second observable and returns the second observable
        return this.http.get<Recipe[]>(
            'https://angular-recipe-87935.firebaseio.com/recipes.json'
            ).pipe(map(responseData => {
            return responseData.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        tap(responseData => {
            this.recipeService.setRecipes(responseData);
        }));
    }
}
