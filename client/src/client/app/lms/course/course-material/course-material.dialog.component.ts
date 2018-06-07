import { Component, OnInit, Input, NgZone} from '@angular/core';
import { Observable}     from 'rxjs/Observable';
import { APIService } from '../../../shared/services/api.service';
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
		this.uploadInprogress =  false;
	}

	uploadFile(file) {
		this.uploadInprogress = true;
		this.cloudApiService.upload(file, this.authService.CloudAcc.id).subscribe(
			data => {
				this.uploadInprogress = false;
				if (data["result"]) {
					this.ngZone.run(()=> {
						this.object.url = data["url"];
						this.object.filename = file.name;
					});
				}
			},
			() => {
				this.uploadInprogress = false;
			}
		);
	}

	changeFile(event: any) {
		let file = event.files[0];
		this.uploadFile(file);
	}





}

