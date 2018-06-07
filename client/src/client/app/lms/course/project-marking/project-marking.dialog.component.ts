import { Component, Input, OnInit, ViewChild,ComponentFactoryResolver } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { BaseDialog } from '../../../shared/components/base/base.dialog';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import * as _ from 'underscore';
import { GROUP_CATEGORY, EXAM_STATUS } from '../../../shared/models/constants'
import { Exam } from '../../../shared/models/elearning/exam.model';
import { ProjectSubmission } from '../../../shared/models/elearning/project-submission.model';
import { Question } from '../../../shared/models/elearning/question.model';
import { Answer } from '../../../shared/models/elearning/answer.model';
import { ExamQuestion } from '../../../shared/models/elearning/exam-question.model';
import { CourseMember } from '../../../shared/models/elearning/course-member.model';
import { Group } from '../../../shared/models/elearning/group.model';
import { QuestionSheet } from '../../../shared/models/elearning/question-sheet.model';
import { ExamSetting } from '../../../shared/models/elearning/exam-setting.model';


@Component({
	moduleId: module.id,
	selector: 'project-marking-dialog',
	templateUrl: 'project-marking.dialog.component.html',
})
export class ProjectMarkingDialog extends BaseDialog<ProjectSubmission>  implements OnInit{

	private member: CourseMember;
	private setting: ExamSetting;
	
	constructor() {
		super();
		this.display = false;
		this.member =  new CourseMember();
		this.setting =  new ExamSetting();
	}

	ngOnInit() {
		this.onShow.subscribe(object=> {
			console.log(object);
			CourseMember.get(this, object.member_id).subscribe(member=> {
				this.member = member;
				ExamSetting.appSetting(this).subscribe(setting=> {
					if (setting)
						this.setting =  setting;
				});
			});
		});
	}

}