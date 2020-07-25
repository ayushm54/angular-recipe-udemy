import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    exports: [
    ],
    imports: [
        // we can use browse module only once hence we use common module here
        // this is same as using browser module
        // here we moved the commonmodule to shared module
        // CommonModule,
        SharedModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        RouterModule.forChild([
            { path: '', component: ShoppingListComponent }
        ])
    ]
})
export class ShoppingListModule{ }
