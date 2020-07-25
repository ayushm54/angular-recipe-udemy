import { NgModule } from '@angular/core';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor.service';

@NgModule({
    providers: [
        // services are injected by angular automatically
        // hence no need to export anything in this module
        ShoppingListService,
        RecipeService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class CoreModule { }
