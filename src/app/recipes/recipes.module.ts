import { NgModule } from '@angular/core';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from './recipes.routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipeStartComponent,
        RecipeEditComponent
    ],
    exports: [
        // there is no need to export these components as
        // these are only used within the recipes module
        // RecipesComponent,
        // RecipeListComponent,
        // RecipeDetailComponent,
        // RecipeItemComponent,
        // RecipeStartComponent,
        // RecipeEditComponent
    ],
    imports: [
        // we can use browse module only once hence we use common module here
        // this is same as using browser module
        // here we moved the commonmodule to shared module
        //CommonModule,
        SharedModule,
        RecipesRoutingModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class RecipesModule{}
