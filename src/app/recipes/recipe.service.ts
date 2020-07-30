import { Injectable } from '@angular/core';
import { Recipe } from './recipe.modl';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super tasty schnitzel - just awesome!',
  //     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20)
  //     ]
  //   ),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'A giant burger with a meat paty.',
  //     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ])
  // ];

  private recipes: Recipe[] = [];

  recipesChanged = new Subject<Recipe[]>();
  constructor(
    // private slService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }

  setRecipes(recipes: Recipe[]): void{
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(): Recipe[] {
    // this would now return a new array as exact copy of the recipe array
    // we do this because returnig the recipe directly would result in returning
    // a referene to this recipe array and if any component modifies it then it
    // would directly get modified
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  getRecipeById(id: number): Recipe {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe): void {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
