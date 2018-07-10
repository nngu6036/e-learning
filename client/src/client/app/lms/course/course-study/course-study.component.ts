import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { Course } from '../../../shared/models/elearning/course.model';
import { User } from '../../../shared/models/elearning/user.model';
import { CourseMember } from '../../../shared/models/elearning/course-member.model';
import * as _ from 'underscore';
import { TreeUtils } from '../../../shared/helpers/tree.utils';
import { TreeNode } from 'primeng/api';
import { ConferenceMember } from '../../../shared/models/elearning/conference-member.model';
import { Conference } from '../../../shared/models/elearning/conference.model'; import {
	SURVEY_STATUS, CONTENT_STATUS, COURSE_MODE, COURSE_MEMBER_ROLE, PROJECT_STATUS,
	COURSE_MEMBER_STATUS, COURSE_MEMBER_ENROLL_STATUS, COURSE_UNIT_TYPE, EXAM_STATUS
} from '../../../shared/models/constants'
import { SelectUsersDialog } from '../../../shared/components/select-user-dialog/select-user-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { CourseFaq } from '../../../shared/models/elearning/course-faq.model';
import { CourseFaqDialog } from '../course-faq/course-faq.dialog.component';
import { CourseMaterial } from '../../../shared/models/elearning/course-material.model';
import { CourseMaterialDialog } from '../course-material/course-material.dialog.component';
import { CourseSyllabus } from '../../../shared/models/elearning/course-syllabus.model';
import { SyllabusUtils } from '../../../shared/helpers/syllabus.utils';
import { CourseUnit } from '../../../shared/models/elearning/course-unit.model';
import { Submission } from '../../../shared/models/elearning/submission.model';
import { CourseLog } from '../../../shared/models/elearning/log.model';
import { SelectItem } from 'primeng/api';
import { Exam } from '../../../shared/models/elearning/exam.model';
import { ExamMember } from '../../../shared/models/elearning/exam-member.model';
import { ExamQuestion } from '../../../shared/models/elearning/exam-question.model';
import { Group } from '../../../shared/models/elearning/group.model';
import { ExamContentDialog } from '../../../cms/exam/content-dialog/exam-content.dialog.component';
import { ExamStudyDialog } from '../../exam/exam-study/exam-study.dialog.component';
import { ReportUtils } from '../../../shared/helpers/report.utils';
import { Route, } from '@angular/router';
import { Certificate } from '../../../shared/models/elearning/course-certificate.model';
import { CertificatePrintDialog } from '../certificate-print/certificate-print.dialog.component';
import { AnswerPrintDialog } from '../../exam/answer-print/answer-print.dialog.component';
import { MeetingService } from '../../../shared/services/meeting.service';
import { CourseUnitRegister } from '../../../cms/course/course-unit-template/unit.decorator';
import { CourseUnitContainerDirective } from '../../../cms/course/course-unit-template/unit-container.directive';
import { ICourseUnit } from '../../../cms/course/course-unit-template/unit.interface';
import { Project } from '../../../shared/models/elearning/project.model';
import { ProjectSubmission } from '../../../shared/models/elearning/project-submission.model';
import { ProjectSubmissionDialog } from '../../class/project-submit/project-submission.dialog.component';
import { CourseClass } from '../../../shared/models/elearning/course-class.model';
import { BaseModel } from '../../../shared/models/base.model';
import { Survey } from '../../../shared/models/elearning/survey.model';
import { SurveyMember } from '../../../shared/models/elearning/survey-member.model';
import { SurveyStudyDialog } from '../../survey/survey-study/survey-study.dialog.component';
import { ExamGrade } from '../../../shared/models/elearning/exam-grade.model';
import { ExamRecord } from '../../../shared/models/elearning/exam-record.model';
import { GradebookDialog } from '../../class/gradebook/gradebook.dialog.component';

@Component({
	moduleId: module.id,
	selector: 'course-study',
	templateUrl: 'course-study.component.html',
	styleUrls: ['course-study.component.css'],
})
export class CourseStudyComponent extends BaseComponent implements OnInit {

	COURSE_UNIT_TYPE = COURSE_UNIT_TYPE;
	EXAM_STATUS = EXAM_STATUS;
	PROJECT_STATUS = PROJECT_STATUS;
	SURVEY_STATUS = SURVEY_STATUS;

	private course: Course;
	private courseClass: CourseClass;
	private member: CourseMember;
	private faqs: CourseFaq[];
	private materials: CourseMaterial[];
	private tree: TreeNode[];
	private syl: CourseSyllabus;
	private selectedNode: TreeNode;
	private units: CourseUnit[];
	private selectedUnit: CourseUnit;
	private examMembers: ExamMember[];
	private completedMembers: ExamMember[];
	private certificate: Certificate;
	private conference: Conference;
	private conferenceMember: ConferenceMember;
	private treeList: TreeNode[];
	private sylUtils: SyllabusUtils;
	private reportUtils: ReportUtils;
	private projects: Project[];
	private componentRef: any;
	private studyMode: boolean;
	private enableLogging: boolean;
	private logs: CourseLog[];
	private surveys: Survey[];
	private completedUnitIds = [];
	private projectSubmits: ProjectSubmission[];
	private exams: Exam[];
	private examRecords: ExamRecord[];

	@ViewChild(CourseMaterialDialog) materialDialog: CourseMaterialDialog;
	@ViewChild(CourseFaqDialog) faqDialog: CourseFaqDialog;
	@ViewChild(ExamStudyDialog) examStudyDialog: ExamStudyDialog;
	@ViewChild(AnswerPrintDialog) answerSheetDialog: AnswerPrintDialog;
	@ViewChild(CertificatePrintDialog) certPrintDialog: CertificatePrintDialog;
	@ViewChild(CourseUnitContainerDirective) unitHost: CourseUnitContainerDirective;
	@ViewChild(ProjectSubmissionDialog) projectSubmitDialog: ProjectSubmissionDialog;
	@ViewChild(GradebookDialog) gradebookDialog: GradebookDialog;

	constructor(private router: Router, private route: ActivatedRoute,
		private meetingSerivce: MeetingService, private componentFactoryResolver: ComponentFactoryResolver) {
		super();
		this.reportUtils = new ReportUtils();
		this.sylUtils = new SyllabusUtils();
		this.course = new Course();
		this.member = new CourseMember();
		this.certificate = new Certificate();
		this.conference = new Conference();
		this.conferenceMember = new ConferenceMember();
		this.studyMode = false;
		this.enableLogging = true;
		this.syl = new CourseSyllabus();
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			var memberId = +params['memberId'];
			var courseId = +params['courseId'];
			this.lmsProfileService.init(this).subscribe(() => {
				this.course = this.lmsProfileService.courseById(courseId);
				if (this.course.syllabus_status != 'published') {
					this.error('Syllabus has not been published');
					return;
				}
				this.member = this.lmsProfileService.courseMemberById(memberId);
				this.certificate = this.lmsProfileService.certificateByMember(memberId);
				this.lmsProfileService.getCourseContent(this, courseId).subscribe(content => {
					this.syl = content["syllabus"];
					this.faqs = content["faqs"];
					this.materials = content["materials"];
					this.units = content["units"];
					CourseLog.memberStudyActivity(this, memberId, courseId).subscribe(logs => {
						this.logs = logs;
						this.displayCouseSyllabus();
						if (this.member.class_id) {
							this.examMembers = this.lmsProfileService.examMembersByClassId(this.member.class_id);
							this.conferenceMember = this.lmsProfileService.conferenceMemberByClass(this.member.class_id);
							if (this.conferenceMember)
								this.conference = this.conferenceMember.conference;
							this.projectSubmits = this.lmsProfileService.projectSubmitsByMember(this.member.id);
							this.lmsProfileService.getClassContent(this, this.member.class_id).subscribe(content => {
								this.projects = content["projects"];
							});
						}
					})
				});
			});
		});
	}

	displayCouseSyllabus() {
		this.units = _.filter(this.units, (unit: CourseUnit) => {
			return unit.status == 'published';
		});
		_.each(this.units, (unit: CourseUnit) => {
			var log = _.find(this.logs, (obj: CourseLog) => {
				return obj.res_id == unit.id && obj.res_model == CourseUnit.Model && obj.code == 'COMPLETE_COURSE_UNIT';
			});
			if (log)
				this.completedUnitIds.push(unit.id);
		});
		this.tree = this.sylUtils.buildGroupTree(this.units);
		this.treeList = this.sylUtils.flattenTree(this.tree);
		var last_attempt = _.max(this.logs, (log: CourseLog) => {
			return log.start.getTime();
		});
		if (last_attempt) {
			this.selectedNode = this.sylUtils.findTreeNode(this.tree, last_attempt.res_id);
		}
		if (this.syl.status != 'published')
			this.warn('Cours syllabus is not published');
	}

	nodeSelect(event: any) {
		if (this.selectedNode) {
			this.selectedUnit = this.selectedNode.data;
			if (this.studyMode == true) {
				this.studyMode = false;
			}
			this.unloadCurrentUnit();
		}
	}

	unloadCurrentUnit() {
		let viewContainerRef = this.unitHost.viewContainerRef;
		if (viewContainerRef)
			viewContainerRef.clear();
	}

	prevUnit() {
		if (this.selectedUnit) {
			if (this.enableLogging)
				CourseLog.stopCourseUnit(this, this.member.id, this.selectedUnit.id).subscribe();
			var prevUnit = this.computedPrevUnit(this.selectedUnit.id);
			this.selectedNode = this.sylUtils.findTreeNode(this.tree, prevUnit.id);
			this.selectedUnit = this.selectedNode.data;
			this.studyMode = false;
			this.unloadCurrentUnit();
		}
	}

	nextUnit() {
		if (this.selectedUnit) {
			if (this.enableLogging)
				CourseLog.stopCourseUnit(this, this.member.id, this.selectedUnit.id).subscribe();
			var nextUnit = this.computedNextUnit(this.selectedUnit.id);
			this.selectedNode = this.sylUtils.findTreeNode(this.tree, nextUnit.id);
			this.selectedUnit = this.selectedNode.data;
			this.studyMode = false;
			this.unloadCurrentUnit();
		}
	}

	completeUnit() {
		if (this.selectedUnit) {
			if (this.enableLogging)
				CourseLog.completeCourseUnit(this, this.member.id, this.selectedUnit.id).subscribe();
			this.completedUnitIds.push(this.selectedUnit.id);
			this.studyMode = false;
			this.unloadCurrentUnit();
		}
	}

	computedPrevUnit(currentUnitId: number): CourseUnit {
		var currentNodeIndex = 0;
		for (; currentNodeIndex < this.treeList.length; currentNodeIndex++) {
			var node = this.treeList[currentNodeIndex];
			if (node.data.id == currentUnitId)
				break;
		}
		currentNodeIndex--;
		while (currentNodeIndex >= 0) {
			var node = this.treeList[currentNodeIndex];
			if (node.data.type != 'folder')
				break;
			currentNodeIndex--;
		}
		return (currentNodeIndex >= 0 ? this.treeList[currentNodeIndex].data : null);
	}

	computedNextUnit(currentUnitId: number): CourseUnit {
		var currentNodeIndex = 0;
		for (; currentNodeIndex < this.treeList.length; currentNodeIndex++) {
			var node = this.treeList[currentNodeIndex];
			if (node.data.id == currentUnitId)
				break;
		}
		currentNodeIndex++;
		while (currentNodeIndex < this.treeList.length) {
			var node = this.treeList[currentNodeIndex];
			if (node.data.type != 'folder')
				break;
			currentNodeIndex++;
		}
		return (currentNodeIndex < this.treeList.length ? this.treeList[currentNodeIndex].data : null);
	}

	studyUnit() {
		if (this.selectedUnit) {
			if (this.course.complete_unit_by_order) {
				let prevUnit: CourseUnit = this.computedPrevUnit(this.selectedUnit.id);
				if (prevUnit) {
					if (this.completedUnitIds.includes(prevUnit.id)) {
						this.openUnit(this.selectedUnit);
						if (this.enableLogging)
							CourseLog.startCourseUnit(this, this.member.id, this.selectedUnit.id).subscribe();
					}
					else
						this.error(this.translateService.instant('You have not completed previous unit'));
				}
				else {
					this.openUnit(this.selectedUnit);
					CourseLog.startCourseUnit(this, this.member.id, this.selectedUnit.id).subscribe();
				}
			}
			else {
				this.openUnit(this.selectedUnit);
				if (this.enableLogging)
					CourseLog.startCourseUnit(this, this.member.id, this.selectedUnit.id).subscribe();
			}
		}
	}

	viewGradebook() {
		this.gradebookDialog.show(this.member);
	}

	openUnit(unit: CourseUnit) {
		var detailComponent = CourseUnitRegister.Instance.lookup(unit.type);
		let viewContainerRef = this.unitHost.viewContainerRef;
		if (detailComponent) {
			let componentFactory = this.componentFactoryResolver.resolveComponentFactory(detailComponent);
			viewContainerRef.clear();
			this.componentRef = viewContainerRef.createComponent(componentFactory);
			(<ICourseUnit>this.componentRef.instance).mode = 'study';
			(<ICourseUnit>this.componentRef.instance).render(unit);
			this.studyMode = true;
		} else {
			viewContainerRef.clear();
			this.componentRef = null;
		}
	}

	getProjectSubmit(project: Project) {
		return _.find(this.projectSubmits, (submit: ProjectSubmission) => {
			return submit.project_id == project.id;
		}) || new ProjectSubmission();
	}

	joinConference() {
		if (this.conference.id && this.conferenceMember.id && this.conferenceMember.is_active)
			this.meetingSerivce.join(this.conference.room_ref, this.conferenceMember.room_member_ref)
		else
			this.error('You are  not allowed to join the conference');
	}

	submitProject(project: Project) {
		this.projectSubmitDialog.show(project, this.member);
	}

	startExam(exam: Exam, member: ExamMember) {
		this.confirmationService.confirm({
			message: this.translateService.instant('Are you sure to start?'),
			accept: () => {
				this.examStudyDialog.show(exam, member);
			}
		});
	}

}
