import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.modl';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  recipesChangeSubscription: Subscription;

  constructor(private recipeService: RecipeService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // to get updated recipes if we add a new recipe or edit am existing one
    this.recipesChangeSubscription = this.recipeService.recipesChanged.subscribe(
      (updatedRecipes: Recipe[]) => {
        this.recipes = updatedRecipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(): void{
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void{
    this.recipesChangeSubscription.unsubscribe();
  }
}
