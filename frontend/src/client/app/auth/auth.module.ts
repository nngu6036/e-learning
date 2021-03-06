import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover/recover-password.component';
import { ErpSharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthComponent } from './auth.component';
import { ResetPasswordComponent } from './reset/reset-password.component';

@NgModule({
	imports: [
		CommonModule,
		AuthRoutingModule,
		ErpSharedModule
	],
	declarations: [
		LoginComponent,
		RecoverPasswordComponent,
		ResetPasswordComponent,
		AuthComponent],
	exports: []
})
export class AuthModule {

}
