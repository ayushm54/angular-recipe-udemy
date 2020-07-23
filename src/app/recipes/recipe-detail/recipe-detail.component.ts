import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.modl';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipeById(this.id);
      }
    );
  }

  addToShoppingList(): void {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void{
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  deleteRecipe(): void{
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
