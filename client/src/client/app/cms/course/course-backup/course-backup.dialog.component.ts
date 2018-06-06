import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../../../shared/services/api.service';
import { SyllabusUtils } from '../../../shared/helpers/syllabus.utils';
import { WebSocketService } from '../../../shared/services/socket.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { User } from '../../../shared/models/elearning/user.model';
import { Course } from '../../../shared/models/elearning/course.model';
import { CourseUnit } from '../../../shared/models/elearning/course-unit.model';
import { CourseSyllabus } from '../../../shared/models/elearning/course-syllabus.model';
import { TreeNode, MenuItem, SelectItem } from 'primeng/api';
import { COURSE_UNIT_TYPE, COURSE_UNIT_ICON, COURSE_STATUS } from '../../../shared/models/constants';
import { CourseUnitDialog } from '../course-unit-dialog/course-unit-dialog.component';
import { CourseUnitPreviewDialog } from '../course-unit-preview-dialog/course-unit-preview-dialog.component';
import { CourseSyllabusSettingDialog } from '../syllabus-setting/syllabus-setting.dialog.component';
import * as _ from 'underscore';
import { Ticket } from '../../../shared/models/ticket/ticket.model';
import { WorkflowService } from '../../../shared/services/workflow.service';
import { CourseCertificateDialog } from '../../../lms/course/course-certificate/course-certificate.dialog.component';

@Component({
	moduleId: module.id,
	selector: 'course-backup-dialog',
	templateUrl: 'course-backup.dialog.component.html',
	styleUrls: ['course-backup.dialog.component.css'],
})
export class CourseBackupDialog extends BaseComponent {

	private display: boolean;
	private tree: TreeNode[];
	private syl: CourseSyllabus;
	private selectedNode: TreeNode;
	private items: MenuItem[];
	private units: CourseUnit[];
	private electedUnit: CourseUnit;
	private sylUtils: SyllabusUtils;
	private course: Course;
	private user: User;
	private output: String;
	private courseStatus: SelectItem[];
	COURSE_UNIT_TYPE = COURSE_UNIT_TYPE;

	private onShowReceiver: Subject<any> = new Subject();
	private onHideReceiver: Subject<any> = new Subject();
	onShow: Observable<any> = this.onShowReceiver.asObservable();
	onHide: Observable<any> = this.onHideReceiver.asObservable();

	constructor(private socketService: WebSocketService, private workflowService: WorkflowService) {
		super();
		this.sylUtils = new SyllabusUtils();
		this.items = [
			{ label: this.translateService.instant(COURSE_UNIT_TYPE['folder']), command: () => { this.addUnit('folder') } },
			{ label: this.translateService.instant(COURSE_UNIT_TYPE['html']), command: () => { this.addUnit('html') } },
			{ label: this.translateService.instant(COURSE_UNIT_TYPE['slide']), command: () => { this.addUnit('slide') } },
			{ label: this.translateService.instant(COURSE_UNIT_TYPE['video']), command: () => { this.addUnit('video') } },
			{ label: this.translateService.instant(COURSE_UNIT_TYPE['exercise']), command: () => { this.addUnit('exercise') } },
			{ label: this.translateService.instant(COURSE_UNIT_TYPE['scorm']), command: () => { this.addUnit('scorm') } },

		];
		this.syl = new CourseSyllabus();
		this.course = new Course();
		this.courseStatus = _.map(COURSE_STATUS, (val, key) => {
			return {
				label: this.translateService.instant(val),
				value: key
			}
		});
		this.user = this.authService.UserProfile;
	}

	show(syl: CourseSyllabus) {
		this.onShowReceiver.next();
		this.display = true;
		this.syl = syl;
		this.buildCourseTree();
	}

	buildCourseTree() {
		if (this.syl) {
			this.startTransaction();
			CourseUnit.listBySyllabus(this, this.syl.id).subscribe(units => {
				this.units = units;
				this.tree = this.sylUtils.buildGroupTree(units);
				this.output = '"course-syllabus"', this.sylUtils.buildGroupTree(units);
				this.closeTransaction();
			});
		}
	}

	hide() {
		this.display = false;
		this.onHideReceiver.next();
	}


	nodeSelect(event: any) {
		if (this.selectedNode) {
		}
	}

	backupCourse() {
		if (this.selectedNode) {
			console.log('output: ', this.output);
			console.log('tree: ', this.tree);
		}
	}
}

