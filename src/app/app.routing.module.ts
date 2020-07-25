import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    // loadChildren is used to implement lazy loading
    // it would tell angular to load the recipes module
    // only when we visit the recipes path
    // the syntax for loadChildren property is
    // first we point to the module file then
    // we add a # and the Module class name
    //{ path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'}

    // in new versions of angular we could use the below syntax
    {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then(
            importedModule => importedModule.RecipesModule
        )
    },
    {
        path: 'shopping-list',
        loadChildren: () => import('./shopping-list/shopping-list.module').then(
            importedModule => importedModule.ShoppingListModule
        )
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(
            importedModule => importedModule.AuthModule
        )
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
