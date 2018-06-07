import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { DatePipe } from '@angular/common';
import * as _ from 'underscore';
import { EXPORT_DATETIME_FORMAT, COURSE_MEMBER_ENROLL_STATUS } from '../../../shared/models/constants'
import { CourseMember } from '../../../shared/models/elearning/course-member.model';
import { CourseClass } from '../../../shared/models/elearning/course-class.model';
import { CourseUnit } from '../../../shared/models/elearning/course-unit.model';
import { Certificate } from '../../../shared/models/elearning/course-certificate.model';
import { CourseSyllabus } from '../../../shared/models/elearning/course-syllabus.model';
import { CourseLog } from '../../../shared/models/elearning/log.model';
import { ReportUtils } from '../../../shared/helpers/report.utils';
import { SelectItem } from 'primeng/api';
import { TimeConvertPipe } from '../../../shared/pipes/time.pipe';
import { GradebookDialog } from '../gradebook/gradebook.dialog.component';

@Component({
	moduleId: module.id,
	selector: 'gradebook-list-dialog',
	templateUrl: 'gradebook-list.component.html',
})
export class GradebookListDialog extends BaseComponent {

	COURSE_MEMBER_ENROLL_STATUS = COURSE_MEMBER_ENROLL_STATUS;
	private records: any;
	private selectedRecord: any;
	private display: boolean;
	private courseClass: CourseClass;
	private reportUtils: ReportUtils;
	private viewModes: SelectItem[];
	private viewMode: any;
	private courseUnits: CourseUnit[];
	@ViewChild(GradebookDialog) gradebookDialog: GradebookDialog;

	constructor(private datePipe: DatePipe, private timePipe: TimeConvertPipe) {
		super();
		this.reportUtils = new ReportUtils();
		this.viewModes = [
			{ value: 'outline', title: 'Outline', icon: 'ui-icon-dehaze' },
			{ value: 'detail', title: 'Detail', icon: 'ui-icon-apps' },
		];
		this.viewModes = this.viewModes.map(viewMode => {
			return {
				label: viewMode.title,
				value: viewMode.value,
			}
		});
	}

	ngOnInit() {

	}

	hide() {
		this.display = false;
	}

	viewGradebook() {
		if (this.selectedRecord)
			this.gradebookDialog.show(this.selectedRecord);
	}

	loadMemberStats() {
		this.startTransaction();
		CourseMember.listByClass(this, this.courseClass.id).subscribe(members => {
			this.records = _.filter(members, (member) => {
				return member.role == 'student';
			});
			CourseSyllabus.byCourse(this, this.courseClass.course_id).subscribe(syllabus => {
				CourseUnit.listBySyllabus(this, syllabus.id).subscribe(courseUnits => {
					this.courseUnits = _.filter(courseUnits, unit => {
						return unit.type != 'folder';
					});
					var totalUnit = this.courseUnits.length;
					_.each(this.records, (record => {
						Certificate.byMember(this, record["id"]).subscribe(certificate => {
							if (certificate)
								record["certificate"] = certificate["name"];
							else
								record["certificate"] = '';
						});
						CourseLog.userStudyActivity(this, record["user_id"], this.courseClass.id).subscribe(logs => {
							var result = this.reportUtils.analyzeCourseMemberActivity(logs);
							if (result[0] != Infinity)
								record["first_attempt"] = this.datePipe.transform(result[0], EXPORT_DATETIME_FORMAT);
							if (result[1] != Infinity)
								record["last_attempt"] = this.datePipe.transform(result[1], EXPORT_DATETIME_FORMAT);
							record["time_spent"] = this.timePipe.transform(+result[2], 'min');
							if (totalUnit)
								record["completion"] = Math.floor(+result[3] * 100 / +totalUnit);
							else
								record["completion"] = 0;
							record["logs"] = logs;
						});
					}));
					this.closeTransaction();
				});
			});
		});
	}

	checkUnitComplete(record, unit) {
		let log: CourseLog = _.find(record["logs"], log => {
			return log.res_model == CourseUnit.Model && log.res_id == unit.id && log.code == 'COMPLETE_COURSE_UNIT';
		});
		if (log)
			return 1;
		else
			return 0;
	}

	show(courseClass: CourseClass) {
		this.display = true;
		this.viewMode = "outline";
		this.courseClass = courseClass;
		this.loadMemberStats();
	}
}
