import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.modl';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  // providers: [RecipeService] // this would now be available to all the child component of   RecipesComponent
})
export class RecipesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
