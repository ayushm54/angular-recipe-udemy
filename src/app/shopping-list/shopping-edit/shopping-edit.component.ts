import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') shoppingListForm: NgForm;
  // ingredientEditSubscription: Subscription;
  editMode = false;
  // editedItemIndex: number;
  editedItem: Ingredient;
  storeSubscription: Subscription;

  constructor(
    // private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('shoppingList').subscribe((stateData) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        // this.editedItemIndex = stateData.editedIngredientIndex;
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });

    // this.ingredientEditSubscription = this.shoppingListService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editedItemIndex = index;
    //     this.editedItem = this.shoppingListService.getIngredient(index);
    //     this.shoppingListForm.setValue({
    //       name: this.editedItem.name,
    //       amount: this.editedItem.amount
    //     });
    //   }
    // );
  }

  onSubmit(form: NgForm): void {
    const newIngredient = new Ingredient(form.value.name,
      form.value.amount);
    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      // this.shoppingListService.addNewIngredient(newIngredient);
      // dispatching a new action to reducer to add new ingredient
      this.store.dispatch(
        new ShoppingListActions.AddIngredient(newIngredient)
      );
    }

    this.onClear();
  }

  onClear(): void {
    this.editMode = false;
    this.shoppingListForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDeleteItem(): void {
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient()
    );
    this.onClear();
  }

  ngOnDestroy(): void {
    // this.ingredientEditSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
    this.storeSubscription.unsubscribe();
  }
}
