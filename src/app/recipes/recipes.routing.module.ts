import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { AuthGuard } from '../auth/auth.guard';

export const appRoutes: Routes = [
    {
        // path: 'recipes', component: RecipesComponent,
        // removed recipe path to implement lazy loading
        path: '',
        component: RecipesComponent,
        // resolve: [RecipesResolverService],
        canActivate: [AuthGuard],
        children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            {
                path: ':id', component: RecipeDetailComponent,
                resolve: [RecipesResolverService]
            },
            {
                path: ':id/edit', component: RecipeEditComponent,
                resolve: [RecipesResolverService]
            }
        ]
    }
];

@NgModule({
    imports: [
        // forRoot can only be used once in the root module
        RouterModule.forChild(appRoutes)
    ],
    exports: [RouterModule]
})
export class RecipesRoutingModule { }
