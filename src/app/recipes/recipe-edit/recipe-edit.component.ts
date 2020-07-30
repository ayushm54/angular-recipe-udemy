import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import * as RecipesActions from '../store/recipes.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.editMode = params['id'] != null ? true : false;
        this.initForm();
      }
    );
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDesc = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipeById(this.id);
      this.storeSub = this.store.select('recipes').pipe(
        map(recipesState => {
          return recipesState.recipes[this.id];
        })
      ).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDesc = recipe.description;
        if (recipe['ingredients']) {
          for (const ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              name: new FormControl(ingredient.name, [Validators.required]),
              amount: new FormControl(ingredient.amount,
                [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            }));
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, [Validators.required]),
      imagePath: new FormControl(recipeImagePath, [Validators.required]),
      description: new FormControl(recipeDesc, [Validators.required]),
      ingredients: recipeIngredients
    });
  }

  get ingredientControls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onAddIngredient(): void {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, [Validators.required]),
        amount: new FormControl(null,
          [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }

  onSubmit(): void {
    // const newRecipe = new Recipe(this.recipeForm.value.name, this.recipeForm.value.description,
    //   this.recipeForm.value.imagePath, this.recipeForm.value.ingredients);

    // Since our form has the same structure as the Recipe model
    // we can directly pass the value of the form to service
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(
        new RecipesActions.UpdateRecipe({
          index: this.id,
          recipe: this.recipeForm.value
        })
      );
    } else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(
        new RecipesActions.AddRecipe(this.recipeForm.value)
      );
    }
    this.onCancel();
  }

  onCancel(): void {
    // navigating to last page
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // this receives the index of the ingredient to delete
  onDeleteIngredient(idx: number): void {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(idx);
  }

  ngOnDestroy(): void{
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

}
