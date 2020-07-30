import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.modl';
// import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    // private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    // to get updated recipes if we add a new recipe or edit am existing one
    // this.recipesChangeSubscription = this.recipeService.recipesChanged.subscribe(
    //   (updatedRecipes: Recipe[]) => {
    //     this.recipes = updatedRecipes;
    //   }
    // );
    this.subscription = this.store.select('recipes').pipe(
      map(recipesState => recipesState.recipes)
    ).subscribe(recipes => {
      this.recipes = recipes;
    });
    // this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(): void{
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
  }
}
