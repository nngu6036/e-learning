import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { APIService } from '../../services/api.service';
import { CloudAPIService } from '../../services/cloud-api.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { APIContext } from '../../models/context';
import { ServiceLocator } from "../../../service.locator";
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { SettingService } from '../../services/setting.service';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';
import { SelectItem } from 'primeng/api';
import { ReportRegister } from '../../../analysis/report/report.decorator';
import { REPORT_CATEGORY } from '../../models/constants'

export abstract class BaseComponent implements APIContext {
	apiService: APIService;
	cloudApiService: CloudAPIService;
	authService: AuthService;
	messageService: MessageService;
	confirmationService: ConfirmationService;
	translateService: TranslateService;
	settingService: SettingService;
	public items: SelectItem[];

	constructor() {
		this.apiService = ServiceLocator.injector.get(APIService);
		this.cloudApiService = ServiceLocator.injector.get(CloudAPIService);
		this.authService = ServiceLocator.injector.get(AuthService);
		this.messageService = ServiceLocator.injector.get(MessageService);
		this.confirmationService = ServiceLocator.injector.get(ConfirmationService);
		this.translateService = ServiceLocator.injector.get(TranslateService);
		this.settingService = ServiceLocator.injector.get(SettingService);
	}

	error(msg: string) {
		this.messageService.add({ severity: 'error', summary: this.translateService.instant('Error'), detail: this.translateService.instant(msg) });
	}

	info(msg: string) {
		this.messageService.add({ severity: 'info', summary: this.translateService.instant('Info'), detail: this.translateService.instant(msg) });
	}

	success(msg: string) {
		this.messageService.add({ severity: 'success', summary: this.translateService.instant('Success'), detail: this.translateService.instant(msg) });
	}

	warn(msg: string) {
		this.messageService.add({ severity: 'warn', summary: this.translateService.instant('Warn'), detail: this.translateService.instant(msg) });
	}

	confirm(prompt: string, callback: () => any) {
		this.confirmationService.confirm({
			message: this.translateService.instant(prompt),
			accept: () => {
				callback();
			}
		});
	}

	chooseTypeReport() {
		this.items = [];
		_.each(REPORT_CATEGORY, (val, key) => {
			console.log(val);
			this.items.push({
				label: '--' + this.translateService.instant(val) + '--',
				value: null
			});
			this.items = this.items.concat(_.map(ReportRegister.Instance.lookup(key), (report) => {
				return {
					label: this.translateService.instant(report["title"]),
					value: report["component"]
				}
			}));
		});
	}
}
