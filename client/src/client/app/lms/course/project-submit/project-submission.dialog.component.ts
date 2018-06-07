import { Component, OnInit, Input, ViewChild, ViewChildren, NgZone, ComponentFactoryResolver } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { Exam } from '../../../shared/models/elearning/exam.model';
import { ExamQuestion } from '../../../shared/models/elearning/exam-question.model';
import { Answer } from '../../../shared/models/elearning/answer.model';
import { CloudAccount } from '../../../shared/models/cloud/cloud-account.model';
import { ProjectSubmission } from '../../../shared/models/elearning/project-submission.model';
import { Project } from '../../../shared/models/elearning/project.model';
import { CourseMember } from '../../../shared/models/elearning/course-member.model';
import { Http, Response } from '@angular/http';
import { QuestionContainerDirective } from '../../../assessment/question/question-template/question-container.directive';
import { IQuestion } from '../../../assessment/question/question-template/question.interface';
import { QuestionRegister } from '../../../assessment/question/question-template/question.decorator';
import 'rxjs/add/observable/timer';
import * as _ from 'underscore';
import {WebcamImage} from 'ngx-webcam';

@Component({
    moduleId: module.id,
    selector: 'project-submission-dialog',
    templateUrl: 'project-submission.dialog.component.html',
    styleUrls: ['project-submission.dialog.component.css'],
})
export class ProjectSubmissionDialog extends BaseComponent {
    
    private display: boolean;
    private submit: ProjectSubmission;
    private onConfirmReceiver: Subject<any> = new Subject();
    onConfirm: Observable<any> = this.onConfirmReceiver.asObservable();


    constructor(private ngZone: NgZone) {
        super();
        this.display = false;
        this.submit =  new ProjectSubmission();
    }

    show(project: Project, member: CourseMember) {
        this.display = true;
        this.submit =  new ProjectSubmission();
        this.submit.member_id =  member.id;
        this.submit.project_id = project.id;
    }

    hide() {
        this.display = false;
    }

    confirm(){
        if (!this.submit.file_url)
            this.error('You have not submiited any attachment');
        else {
            this.submit.date_submit =  new Date();
            this.submit.save(this).subscribe(()=> {
                this.onConfirmReceiver.next();
                this.hide();
            });
        }
    }

    changeFile(event) {
        this.startTransaction();
        let file = event.files[0];
        this.cloudApiService.upload(file, this.authService.CloudAcc.id).subscribe(
            data => {
                this.closeTransaction();
                if (data["result"]) {
                    this.ngZone.run(()=> {
                        this.submit.file_url = data["url"];
                        this.submit.filename = file.name;
                    });
                }
            },
            () => {
                this.closeTransaction();
            }
        );
    }

}



