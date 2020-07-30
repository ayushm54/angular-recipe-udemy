import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  // ingredients: Ingredient[] ;
  // with ngrx store the object which we want is wrapped as an observable
  // the observable return type should exactly match with the store date type
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // private ingredientsUpdatedSubscription: Subscription;

  // here shoppingList is a store and the value for this property is the
  // type of data retured by our reducer which in this case is a js object
  constructor(
    // private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    // this subscription would be managed by angular and ngrx
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientsUpdatedSubscription = this.shoppingListService.ingredientsUpdated.subscribe((ingredients: Ingredient[]) => {
    //   this.ingredients = ingredients;
    // });
  }

  ngOnDestroy(): void {
   //  this.ingredientsUpdatedSubscription.unsubscribe();
  }

  // method to edit the selected ingredient
  onEditItem(index: number): void{
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
