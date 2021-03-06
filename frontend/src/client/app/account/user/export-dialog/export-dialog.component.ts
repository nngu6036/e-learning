import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ModelAPIService } from '../../../shared/services/api/model-api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { User } from '../../../shared/models/elearning/user.model';
import * as _ from 'underscore';
import { ExcelService } from '../../../shared/services/excel.service';
import { SelectItem } from 'primeng/api';
import { GROUP_CATEGORY } from '../../../shared/models/constants';

@Component({
	moduleId: module.id,
	selector: 'user-export-dialog',
	templateUrl: 'export-dialog.component.html',
})
export class UserExportDialog extends BaseComponent {

	private userIds: number[];
	private fields: SelectItem[];
	private selectedFields: string[];
	private display: boolean;
	private users;

	constructor(private excelService: ExcelService) {
		super();
		this.userIds = [];
		this.fields = [
			{ value: 'name', label: this.translateService.instant('Name') },
			{ value: 'email', label: this.translateService.instant('Email') },
			{ value: 'login', label: this.translateService.instant('Login') },
			{ value: 'banned', label: this.translateService.instant('Banned') },
			{ value: 'group_code', label: this.translateService.instant('Group') }
		];
		this.display = false;
	}

	show(userIds: number[]) {
		this.selectedFields = [];
		this.userIds = userIds;
		this.display = true;
	}

	hide() {
		this.display = false;
	}

	export() {
		User.array(this, this.userIds, this.selectedFields).subscribe(users => {
			var data = _.map(users, (user) => {
				var userData = {};
				_.each(this.selectedFields, (field) => {
					userData[field] = user[field];
				});
				return userData;
			});
			this.excelService.exportAsExcelFile(data, 'user_export');
			this.hide();
	});

	}

}

