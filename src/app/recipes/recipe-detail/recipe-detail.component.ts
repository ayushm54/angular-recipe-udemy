import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.modl';
// import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(
    // private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => +params['id']),
      // using switchMap to change the observable
      // from route params to store selection
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => recipesState.recipes[this.id])
    ).subscribe(
      recipe => {
        this.recipe = recipe;
      }
    );
  }

  addToShoppingList(): void {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe(): void {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(
      new RecipesActions.DeleteRecipe(this.id)
    );
    this.router.navigate(['/recipes']);
  }
}
