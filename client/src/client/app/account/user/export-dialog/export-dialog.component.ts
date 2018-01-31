import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Group } from '../../../shared/models/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { User } from '../../../shared/models/user.model';
import * as _ from 'underscore';
import { ExcelService } from '../../../shared/services/excel.service';
import { SelectItem } from 'primeng/api';

@Component({
	moduleId: module.id,
	selector: 'etraining-user-export-dialog',
	templateUrl: 'export-dialog.component.html',
})
export class UserExportDialog extends BaseComponent implements OnInit {

	users: User[];
	fields: SelectItem[];
	selectedFields: string[];
	display:boolean;

	constructor(private excelService: ExcelService) {
		super();
		this.users = [];
		this.fields = [
			{ value: 'name', label: this.translateService.instant('Name') },
			{ value: 'email', label: this.translateService.instant('Email') },
			{ value: 'login', label: this.translateService.instant('Login') },
			{ value: 'group_code', label: this.translateService.instant('Group') }
		];
		this.selectedFields = [];
		this.display = false;
	}

	show(users:any) {
        this.users = users;
        this.display = true;
        Group.listUserGroup(this).subscribe(groups => {
			_.each(this.users, function(user) {
				if (user.etraining_group_id) {
					var group = _.find(groups, function(obj:Group) {
					return obj.id == user.etraining_group_id;
					});
					if (group)
						user['group_code'] = group.code;
				}
			});
		});
    }

    hide() {
        this.display = false;
    }

	export() {
		var self = this;
		var data = _.map(this.users, function(user) {
			var userData = {};
			_.each(self.selectedFields, function(field) {
				userData[field] = user[field];
			});
			return userData;
		});
		this.excelService.exportAsExcelFile(data, 'users');
		this.hide();
	}

}

