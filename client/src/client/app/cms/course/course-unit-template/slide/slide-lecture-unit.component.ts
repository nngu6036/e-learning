import { Component, OnInit, Input, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Question } from '../../../../shared/models/elearning/question.model';
import { QuestionOption } from '../../../../shared/models/elearning/option.model';
import { SlideLecture } from '../../../../shared/models/elearning/lecture_slide.model';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import * as _ from 'underscore';
import { DEFAULT_PASSWORD, GROUP_CATEGORY } from '../../../../shared/models/constants';
import { TreeNode } from 'primeng/api';
import { CourseUnitTemplate } from '../unit.decorator';
import { ICourseUnit } from '../unit.interface';
import { CourseUnit } from '../../../../shared/models/elearning/course-unit.model';
import * as RecordRTC from 'recordrtc';
import { VideoLecture } from '../../../../shared/models/elearning/lecture-video.model';


@Component({
	moduleId: module.id,
	selector: 'slide-lecture-course-unit',
	templateUrl: 'slide-lecture-unit.component.html',
})
@CourseUnitTemplate({
	type: 'slide'
})
export class SlideLectureCourseUnitComponent extends BaseComponent implements ICourseUnit {

	@Input() mode;
	unit: CourseUnit;
	lecture: SlideLecture;
	uploadInprogress: boolean;


	constructor(private ngZone: NgZone) {
		super();
		this.lecture = new SlideLecture();
	}


	render(unit: CourseUnit) {
		this.unit = unit;
		SlideLecture.byCourseUnit(this, unit.id).subscribe((lecture: SlideLecture) => {
			if (lecture)
				this.lecture = lecture;
			else {
				var lecture = new SlideLecture();
				lecture.unit_id = this.unit.id;
				this.lecture = lecture;
			}
		});
	}

	saveEditor(): Observable<any> {
		return Observable.forkJoin(this.unit.save(this), this.lecture.save(this));
	}

	uploadFile(file) {
		this.uploadInprogress = true;
		this.lecture.filename = file.filename;
		this.apiService.upload(file, this.authService.CloudAcc.id).subscribe(
			data => {
				this.uploadInprogress = false;
				if (data["result"]) {
					this.ngZone.run(()=> {
						if (file.filename.endsWith('pdf'))
							this.lecture.slide_url = data["url"];
						else {
							var serverFile = data["filename"]
							this.apiService.convert2Pdf(serverFile, this.authService.CloudAcc.id).subscribe((data)=> {
								this.lecture.slide_url = data["url"];
							});
						}
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
