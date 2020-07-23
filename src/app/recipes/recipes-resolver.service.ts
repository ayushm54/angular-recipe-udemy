import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.modl';
import { DatStorageService } from '../shared/data-storage.service';
import { Observable } from 'rxjs';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {

    constructor(private dataStorage: DatStorageService,
                private recipeService: RecipeService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        // we can drectlu return the observable as it would be
        // resolved by angular after this guard returns it
        const recipes = this.recipeService.getRecipes();
        if (recipes.length === 0){
            return this.dataStorage.fetchRecipes();
        }
        return recipes;
    }
}
