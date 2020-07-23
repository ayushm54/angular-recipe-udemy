import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  ingredientsUpdated = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  constructor() { }

  getIngredients(): Ingredient[]{
    return this.ingredients.slice();
  }
  getIngredient(index: number): Ingredient{
    return this.ingredients[index];
  }

  addNewIngredient(newIngredient: Ingredient): void {
    this.ingredients.push(newIngredient);
    this.ingredientsUpdated.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]): void {
    // using es6 spread operator to add all the items of array in one push
    this.ingredients.push(...ingredients);
    this.ingredientsUpdated.next(this.ingredients.slice());
  }

  updateIngredient(index: number, ingredient: Ingredient): void {
    this.ingredients[index] = ingredient;
    this.ingredientsUpdated.next(this.ingredients.slice());
  }

  deleteIngredient(index: number): void {
    // start at the given index and remove 1 element
    this.ingredients.splice(index, 1);
    this.ingredientsUpdated.next(this.ingredients.slice());
  }
}
