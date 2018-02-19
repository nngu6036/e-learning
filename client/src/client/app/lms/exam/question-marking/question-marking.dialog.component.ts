import { Component, Input, OnInit, ViewChild,ComponentFactoryResolver } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import * as _ from 'underscore';
import { GROUP_CATEGORY, EXAM_STATUS } from '../../../shared/models/constants'
import { Exam } from '../../../shared/models/exam.model';
import { Submission } from '../../../shared/models/submission.model';
import { Question } from '../../../shared/models/question.model';
import { Answer } from '../../../shared/models/answer.model';
import { ExamQuestion } from '../../../shared/models/exam-question.model';
import { ExamMember } from '../../../shared/models/exam-member.model';
import { Group } from '../../../shared/models/group.model';


@Component({
	moduleId: module.id,
	selector: 'etraining-question-marking-dialog',
	templateUrl: 'question-marking.dialog.component.html',
})
export class QuestionMarkingDialog extends BaseComponent {

	display: boolean;
	answers: Answer[];
	questions: ExamQuestion[];
	member: ExamMember;
	private onMarkCompleteReceiver: Subject<any> = new Subject();
    onMarkComplete:Observable<any> =  this.onMarkCompleteReceiver.asObservable();


	constructor() {
		super();
		this.display = false;
		this.answers = [];
		this.questions = {};
		this.member =  new ExamMember();
	}

	show(member: ExamMember, answers: Answer[]) {
		var self = this;
		this.display = true;
		ExamQuestion.listByExam(this, member.exam_id).subscribe(questions => {
			self.questions = {};
			_.each(questions, function(question) {
				self.questions[question.question_id] =  question;
			});
			self.member = member;
			self.answers = answers;
		});
	}

	hide() {
		this.display = false;
	}

	save() {
		var self = this;
		var subscrptions = _.map(this.answers, function(answer) {
			return answer.save(self);
		});
		Observable.forkJoin(...subscrptions).subscribe(()=> {
			this.messageService.add({severity:'success', summary:'Marking', detail: 'Marking saved sucessfully'});
			this.onMarkCompleteReceiver.next();
			this.hide();
		});
	}
}