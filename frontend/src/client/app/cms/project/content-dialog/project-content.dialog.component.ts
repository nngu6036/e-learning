import { Component, OnInit, Input,ViewChild, NgZone} from '@angular/core';
import { Observable}     from 'rxjs/Observable';
import { ModelAPIService } from '../../../shared/services/api/model-api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { User } from '../../../shared/models/elearning/user.model';
import { BaseDialog } from '../../../shared/components/base/base.dialog';
import { Project } from '../../../shared/models/elearning/project.model';
import { ProjectSubmission } from '../../../shared/models/elearning/project-submission.model';
import { Http, Response } from '@angular/http';
import { DEFAULT_DATE_LOCALE, EXAM_MEMBER_ROLE, EXAM_MEMBER_STATUS } from '../../../shared/models/constants'
import {SelectItem, MenuItem} from 'primeng/api';
import * as _ from 'underscore';
import { SelectUsersDialog } from '../../../shared/components/select-user-dialog/select-user-dialog.component';

@Component({
    moduleId: module.id,
    selector: 'project-content-dialog',
    templateUrl: 'project-content.dialog.component.html',
})
export class ProjectContentDialog extends BaseDialog<Project> {

    private locale:any;
    private projectStatus: SelectItem[];
    private rangeDates: Date[]; 
    private percentage: number;

    constructor(private http: Http, private ngZone: NgZone) {
        super();
        this.locale = DEFAULT_DATE_LOCALE;
    }

    ngOnInit() {
        this.onShow.subscribe(object => {
            if (object.start && object.end) {
                this.rangeDates = [object.start,object.end];
            }
            var lang = this.translateService.currentLang;
            this.http.get(`/assets/i18n/calendar.${lang}.json`)
            .subscribe((res: Response) => {
                this.locale = res.json();
            });
        });  
    }

    onDateSelect($event) {
        if (this.rangeDates[0] && this.rangeDates[1]) {
            this.object.start = this.rangeDates[0];
            this.object.end = this.rangeDates[1];
        }
    }

    changeFileEvent(event: any) {
        let file = event.files[0];
        this.uploadFile(file);
    }

    uploadFile(file) {
        this.percentage = 0;
        this.fileApiService.upload(file, this.authService.LoginToken).subscribe(
            data => {
                if (data["result"]) {
                    this.ngZone.run(()=> {
                        this.object.file_url = data["url"];
                        this.object.filename = data["filename"];
                    });
                } else {
                    this.ngZone.run(()=> {
                        this.percentage = +data;
                    });
                }
            },
        );
    }

}


