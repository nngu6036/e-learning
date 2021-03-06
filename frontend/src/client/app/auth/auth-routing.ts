import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover/recover-password.component';
import { ResetPasswordComponent } from './reset/reset-password.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'auth',
                component: AuthComponent,
                children: [
                    {path: 'login', component: LoginComponent},
                    {path: 'recover-pass', component: RecoverPasswordComponent},
                    {path: 'reset-pass/:token', component: ResetPasswordComponent},
                    {path: '', pathMatch: 'full', component: LoginComponent},
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
