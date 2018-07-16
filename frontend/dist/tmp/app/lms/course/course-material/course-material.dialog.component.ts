import { Component, OnInit, Input, NgZone} from '@angular/core';
import { Observable}     from 'rxjs/Observable';
import { ModelAPIService } from '../../../shared/services/api/model-api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseDialog } from '../../../shared/components/base/base.dialog';
import { CourseMaterial } from '../../../shared/models/elearning/course-material.model';
import * as _ from 'underscore';



@Component({
    moduleId: module.id,
    selector: 'course-material-dialog',
    templateUrl: 'course-material.dialog.component.html',
})
export class CourseMaterialDialog extends BaseDialog<CourseMaterial> {

	private uploadInprogress: boolean;

	constructor(private ngZone: NgZone) {
		super();
	}


	ngOnInit() {
	}

	uploadFile(file) {
		this.fileApiService.upload(file, this.authService.LoginToken.cloud_id).subscribe(
			data => {
				if (data["result"]) {
					this.ngZone.run(()=> {
						this.object.url = data["url"];
						this.object.filename = file.name;
					});
				}
			},
			() => {
			}
		);
	}

	changeFile(event: any) {
		let file = event.files[0];
		this.uploadFile(file);
	}





}
