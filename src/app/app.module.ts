import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app.routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    HttpClientModule,
    // now this import should be removed from here
    // as we are now lazy loading this module
    // because here we are eagerly loading it
    // RecipesModule,
    // ShoppingListModule,
    SharedModule,
    // in core module we define all the services and interceptors
    // if we are using providedIn: root in any service class
    // then we do not need to create a core module and add service there
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
