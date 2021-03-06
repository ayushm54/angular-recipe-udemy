import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { AuthService, AuthResponseData } from '../auth.service';
// import { Observable, Subscription } from 'rxjs';
import { Subscription } from 'rxjs';
// import { Router } from '@angular/router';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from '../../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  // error: string = null;

  // angular would automatically detect the first occurence of
  // the directive based on its type
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private alertCLoseSub: Subscription;
  private storeSubscription: Subscription;

  constructor(
    // private authService: AuthService,
    // private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      if (authState.authError) {
        this.showAlert(authState.authError);
      }
    });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    // this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;

    // let authObs: Observable<AuthResponseData>;

    if (!this.isLoginMode) {
      // authObs = this.authService.signUp(email, password);
      this.store.dispatch(
        new AuthActions.SignupStart({
          email,
          password
        })
      );
    } else {
      // authObs = this.authService.login(email, password);
      // using ngrx effects to login
      this.store.dispatch(
        new AuthActions.LoginStart({
          email,
          password
        })
      );
    }
    // authObs.subscribe(
    //   (response) => {
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   (errorRes) => {
    //     // this.error = errorRes;
    //     this.isLoading = false;
    //     this.showAlert(errorRes);
    //   }
    // );

    // instead of subscribing to subject from service
    // we would now interact with store to check the login status
    form.reset();
  }

  // onCloseAlert(): void{
  //   this.error = null;
  // }

  private showAlert(errorMessage: string): void{
    // this wont work if u instantiate manually
    // as angular would not know about it
    // const alertComp = new AlertComponent();

    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    // clearing already rendered components in this container
    hostViewContainerRef.clear();

    const componentRef =
      hostViewContainerRef.createComponent(alertComponentFactory);

    componentRef.instance.message = errorMessage;
    this.alertCLoseSub = componentRef.instance.closeAlert.subscribe(() => {
      hostViewContainerRef.clear();
      // unsubscribing here because on closing the alert
      // the alert component is no more and
      // the subscription is not needed
      this.alertCLoseSub.unsubscribe();
    });
  }

  ngOnDestroy(): void{
    if (this.alertCLoseSub) {
      this.alertCLoseSub.unsubscribe();
    }
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }
}
