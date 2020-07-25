import { NgModule } from '@angular/core';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        SharedModule,
        RouterModule.forChild([
            { path: '', component: AuthComponent }
        ])
    ]
})
export class AuthModule{ }
