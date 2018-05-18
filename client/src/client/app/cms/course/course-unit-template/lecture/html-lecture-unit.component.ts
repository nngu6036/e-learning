import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Question } from '../../../../shared/models/elearning/question.model';
import { QuestionOption } from '../../../../shared/models/elearning/option.model';
import { HtmlLecture } from '../../../../shared/models/elearning/lecture-html.model';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import * as _ from 'underscore';
import { DEFAULT_PASSWORD, GROUP_CATEGORY } from '../../../../shared/models/constants';
import { TreeNode } from 'primeng/api';
import { CourseUnitTemplate } from '../unit.decorator';
import { ICourseUnit } from '../unit.interface';
import { CourseUnit } from '../../../../shared/models/elearning/course-unit.model';

@Component({
	moduleId: module.id,
	selector: 'html-lecture-course-unit',
	templateUrl: 'html-lecture-unit.component.html',
})
@CourseUnitTemplate({
	type:'html'
})
export class HtmlLectureCourseUnitComponent extends BaseComponent implements ICourseUnit{

	@Input() mode;
	unit: CourseUnit;
	lecture: HtmlLecture;

	constructor() {
		super();
		this.lecture = new HtmlLecture();
	}

	render(unit:CourseUnit) {
		this.unit = unit;
		this.startTransaction();
		HtmlLecture.byCourseUnit(this, unit.id).subscribe((lecture:HtmlLecture) => {
			if (lecture)
				this.lecture = lecture;
			else {
				var lecture = new HtmlLecture();
				lecture.unit_id = this.unit.id;
				this.lecture =  lecture;
			}
			this.closeTransaction();
		});
	}

	saveEditor():Observable<any> {
		return Observable.forkJoin(this.unit.save(this), this.lecture.save(this));
	}

}

