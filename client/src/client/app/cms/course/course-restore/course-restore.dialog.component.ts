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
import { TreeNode, MenuItem, SelectItem, Message } from 'primeng/api';
import { COURSE_UNIT_TYPE, COURSE_UNIT_ICON, COURSE_STATUS } from '../../../shared/models/constants';
import { CourseUnitDialog } from '../course-unit-dialog/course-unit-dialog.component';
import { CourseUnitPreviewDialog } from '../course-unit-preview-dialog/course-unit-preview-dialog.component';
import { CourseSyllabusSettingDialog } from '../syllabus-setting/syllabus-setting.dialog.component';
import * as _ from 'underscore';
import { Ticket } from '../../../shared/models/ticket/ticket.model';
import { WorkflowService } from '../../../shared/services/workflow.service';
import { CourseCertificateDialog } from '../../../lms/course/course-certificate/course-certificate.dialog.component';
import { Jsonp } from '@angular/http';
import { CourseFaq } from '../../../shared/models/elearning/course-faq.model';
import { CourseMaterial } from '../../../shared/models/elearning/course-material.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	moduleId: module.id,
	selector: 'course-restore-dialog',
	templateUrl: 'course-restore.dialog.component.html',
	styleUrls: ['course-restore.dialog.component.css'],
})
export class CourseRestoreDialog extends BaseComponent {

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
	private faqs: CourseFaq[];
	private downloadJsonHref;
	private materials: CourseMaterial[];
	private output: String;
	private courseStatus: SelectItem[];
	private msgs: Message[];
    private uploadedFiles: any[] = [];
	COURSE_UNIT_TYPE = COURSE_UNIT_TYPE;

	private onShowReceiver: Subject<any> = new Subject();
	private onHideReceiver: Subject<any> = new Subject();
	onShow: Observable<any> = this.onShowReceiver.asObservable();
	onHide: Observable<any> = this.onHideReceiver.asObservable();

	constructor(private socketService: WebSocketService, private workflowService: WorkflowService, private sanitizer: DomSanitizer) {
		super();
		this.sylUtils = new SyllabusUtils();
		this.syl = new CourseSyllabus();
		this.course = new Course();
		this.courseStatus = _.map(COURSE_STATUS, (val, key) => {
			return {
				label: this.translateService.instant(val),
				value: key
			}
		});
		this.user = this.authService.UserProfile;
		this.faqs = [];
		this.materials = [];
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

	onUpload(event) {
		for (let file of event.files) {
			this.uploadedFiles.push(file);
		}

		this.msgs = [];
		this.msgs.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
	}
}

