import { Component } from '@angular/core';
import { Config } from './env.config';
import './operators';
import { LangService } from './shared/services/lang.service';
import { BaseComponent } from './shared/components/base/base.component';


@Component({
	moduleId: module.id,
	selector: 'etraining-app',
	template: `<router-outlet></router-outlet>`
})
export class AppComponent extends BaseComponent {

	constructor(private langService: LangService) {
		super();
		langService.initSetting();
		console.log('Environment config', Config);
	}


}
