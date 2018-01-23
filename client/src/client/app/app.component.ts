import { Component } from '@angular/core';
import { Config } from './env.config';
import './operators';
import { LangService } from './shared/services/lang.service';

@Component({
	moduleId: module.id,
	selector: 'etraining-app',
	template: `<router-outlet></router-outlet>`
})
export class AppComponent {

	constructor(private langService: LangService) {
		langService.initSetting();
		console.log('Environment config', Config);
	}


}
