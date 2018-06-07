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
	GROUP_CATEGORY, CONTENT_STATUS, COURSE_MODE, COURSE_MEMBER_ROLE, PROJECT_STATUS,
	COURSE_MEMBER_STATUS, COURSE_MEMBER_ENROLL_STATUS, COURSE_UNIT_TYPE, EXAM_STATUS
} from '../../../shared/models/constants'
import { SelectUsersDialog } from '../../../shared/components/select-user-dialog/select-user-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { ClassConferenceDialog } from '../class-conference/class-conference.dialog.component';
import { ClassExamListDialog } from '../class-exam-list/class-exam-list.dialog.component';
import { GradebookListDialog } from '../gradebook-list/gradebook-list.component';
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
import { ClassExam } from '../../../shared/models/elearning/class-exam.model';
import { Certificate } from '../../../shared/models/elearning/course-certificate.model';
import { CertificatePrintDialog } from '../certificate-print/certificate-print.dialog.component';
import { AnswerPrintDialog } from '../../exam/answer-print/answer-print.dialog.component';
import { MeetingService } from '../../../shared/services/meeting.service';
import { CourseUnitRegister } from '../../../cms/course/course-unit-template/unit.decorator';
import { CourseUnitContainerDirective } from '../../../cms/course/course-unit-template/unit-container.directive';
import { ICourseUnit } from '../../../cms/course/course-unit-template/unit.interface';
import { Project } from '../../../shared/models/elearning/project.model';
import { ProjectSubmission } from '../../../shared/models/elearning/project-submission.model';
import { ProjectSubmissionDialog } from '../project-submit/project-submission.dialog.component';
import { CourseClass } from '../../../shared/models/elearning/course-class.model';

@Component({
	moduleId: module.id,
	selector: 'course-study',
	templateUrl: 'course-study.component.html',
	styleUrls: ['course-study.component.css'],
})
export class CourseStudyComponent extends BaseComponent implements OnInit {

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
	private exams: Exam[];
	private completedExams: Exam[];
	private certificate: Certificate;
	private conference: Conference;
	private conferenceMember: ConferenceMember;
	private treeList: TreeNode[];
	private sylUtils: SyllabusUtils;
	private reportUtils: ReportUtils;
	private projects: Project[];

	@ViewChild(CourseMaterialDialog) materialDialog: CourseMaterialDialog;
	@ViewChild(CourseFaqDialog) faqDialog: CourseFaqDialog;
	@ViewChild(ExamStudyDialog) examStudyDialog: ExamStudyDialog;
	@ViewChild(AnswerPrintDialog) answerSheetDialog: AnswerPrintDialog;
	@ViewChild(CertificatePrintDialog) certPrintDialog: CertificatePrintDialog;
	@ViewChild(CourseUnitContainerDirective) unitHost: CourseUnitContainerDirective;
	@ViewChild(ProjectSubmissionDialog) projectSubmitDialog: ProjectSubmissionDialog;
	private componentRef: any;

	COURSE_UNIT_TYPE = COURSE_UNIT_TYPE;
	EXAM_STATUS = EXAM_STATUS;
	PROJECT_STATUS = PROJECT_STATUS;
	private studyMode: boolean;
	private enableLogging: boolean;

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
		this.enableLogging =  false;
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			var memberId = +params['memberId'];
			var courseId = +params['courseId'];
			Course.get(this, courseId).subscribe(course => {
				CourseMember.get(this, memberId).subscribe((member:CourseMember) => {
					this.member = member;
					this.course = course;
					this.loadFaqs();
					this.loadMaterials();
					this.loadExam();
					this.loadProject();
					this.loadCertificate();
					this.loadConference();
					this.loadCouseSyllabus();
					if (course.mode=='group')
						CourseClass.get(this,member.class_id).subscribe(courseClass=> {
							this.courseClass = courseClass;
							if (this.courseClass.IsAvailable)
								this.enableLogging = true;
						});
				});
			});
		});
	}

	loadCouseSyllabus() {
		this.startTransaction();
		CourseSyllabus.byCourse(this, this.course.id).subscribe(syl => {
			CourseUnit.listBySyllabus(this, syl.id).subscribe(units => {
				this.syl = syl;
				this.units = _.filter(units, (unit:CourseUnit)=> {
					return unit.status == 'published';
				});
				this.tree = this.sylUtils.buildGroupTree(units);
				this.treeList = this.sylUtils.flattenTree(this.tree);
				CourseLog.lastUserAttempt(this, this.authService.UserProfile.id, this.course.id).subscribe((attempt: CourseLog) => {
					if (attempt) {
						this.selectedNode = this.sylUtils.findTreeNode(this.tree, attempt.res_id);
					}
				});
				this.closeTransaction();
			});
		});
	}

	nodeSelect(event: any) {
		if (this.selectedNode) {
			this.selectedUnit = this.selectedNode.data;
			this.selectedUnit.completedByUser(this, this.authService.UserProfile.id).subscribe(success => {
				this.selectedUnit["completed"] = success;
			});
			if (this.studyMode == true) {
				this.studyMode = false;
				this.unloadCurrentUnit();
			}
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
				CourseLog.finishCourseUnit(this, this.authService.UserProfile.id, this.course.id, this.selectedUnit).subscribe();
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
				CourseLog.finishCourseUnit(this, this.authService.UserProfile.id, this.course.id, this.selectedUnit).subscribe();
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
				CourseLog.completeCourseUnit(this, this.authService.UserProfile.id, this.course.id, this.selectedUnit).subscribe();
			this.selectedUnit["completed"] = true;
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
			if (this.syl.complete_unit_by_order) {
				let prevUnit: CourseUnit = this.computedPrevUnit(this.selectedUnit.id);
				if (prevUnit)
					prevUnit.completedByUser(this, this.authService.UserProfile.id).subscribe(success => {
						if (success) {
							this.openUnit(this.selectedUnit);
							if (this.enableLogging)
								CourseLog.startCourseUnit(this, this.authService.UserProfile.id, this.course.id, this.selectedUnit).subscribe();
						}
						else
							this.error(this.translateService.instant('You have not completed previous unit'));
					});
				else {
					this.openUnit(this.selectedUnit);
					CourseLog.startCourseUnit(this, this.authService.UserProfile.id, this.course.id, this.selectedUnit).subscribe();
				}
			}
			else {
				this.openUnit(this.selectedUnit);
				if (this.enableLogging)
					CourseLog.startCourseUnit(this, this.authService.UserProfile.id, this.course.id, this.selectedUnit).subscribe();
			}
		}
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

	loadCertificate() {
		this.startTransaction();
		Certificate.byMember(this, this.member.id).subscribe((certificate: any) => {
			this.certificate = certificate;
			this.closeTransaction();
		});
	}

	loadConference() {
		this.startTransaction();
		ConferenceMember.byCourseMember(this, this.member.id)
			.subscribe(member => {
				this.conferenceMember = member;
				if (member)
					Conference.get(this, member.conference_id).subscribe(conference => {
						this.conference = conference;
					});
				this.closeTransaction();
			});
	}

	loadExam() {
		if (this.member.class_id) {
			this.startTransaction();
			ClassExam.listByClass(this, this.member.class_id).subscribe(classExams => {
				var examIds = _.pluck(classExams, 'exam_id');
				ExamMember.listByUser(this, this.authService.UserProfile.id).subscribe(members => {
					members = _.filter(members, member => {
						return member.enroll_status != 'completed' && _.contains(examIds, member.exam_id);
					});
					Submission.listByUser(this, this.authService.UserProfile.id).subscribe(submits => {
						var examIds = _.pluck(members, 'exam_id');
						Exam.array(this, examIds)
							.subscribe(exams => {
								_.each(exams, (exam) => {
									exam.member = _.find(members, (member: ExamMember) => {
										return member.exam_id == exam.id;
									});
									exam.submit = _.find(submits, (submit: Submission) => {
										return submit.member_id == exam.member.id && submit.exam_id == exam.id;
									});
									if (exam.submit) {
										if (exam.submit.score != null)
											exam.score = exam.submit.score;
										else
											exam.score = '';
									}
									ExamQuestion.countByExam(this, exam.id).subscribe(count => {
										exam.question_count = count;
									});
									exam.examMemberData = {};
									ExamMember.listByExam(this, exam.id).subscribe(members => {
										exam.examMemberData = this.reportUtils.analyseExamMember(exam, members);
									});
								});
								this.exams = _.filter(exams, (exam) => {
									return exam.member.role == 'supervisor' || (exam.member.role == 'candidate' && exam.status == 'published');
								});

								this.exams.sort((exam1, exam2): any => {
									if (exam1.create_date > exam2.create_date)
										return -1;
									else if (exam1.create_date < exam2.create_date)
										return 1;
									else
										return 0;
								});

								this.completedExams = _.filter(exams, (exam) => {
									return exam.member.role == 'supervisor' || (exam.member.role == 'candidate' && exam.member.enroll_status == 'completed');
								});

								this.completedExams.sort((exam1, exam2): any => {
									if (exam1.create_date > exam2.create_date)
										return -1;
									else if (exam1.create_date < exam2.create_date)
										return 1;
									else
										return 0;
								});
							});

					});

				});
				this.closeTransaction();
			});
		}
	}


	loadProject() {
		if (this.member.class_id) {
			this.startTransaction();
			Project.listByClass(this, this.member.class_id).subscribe(projects => {
				ProjectSubmission.listByMember(this, this.member.id).subscribe(submits => {
					this.projects =  projects;
					_.each(projects, (project) => {
						project["submit"] = _.find(submits, (submit: ProjectSubmission) => {
							return submit.project_id == projects.id;
						});
						if (project["submit"]) {
							if (project["submit"].score != null)
								project["score"] = project["submit"].score;
							else
								project["score"] = '';
						}
					});

				});
			});
			this.closeTransaction();
		}
	}


	loadFaqs() {
		this.startTransaction();
		CourseFaq.listByCourse(this, this.course.id)
			.subscribe(faqs => {
				this.faqs = faqs;
				this.closeTransaction();
			})
	}

	loadMaterials() {
		this.startTransaction();
		CourseMaterial.listByCourse(this, this.course.id)
			.subscribe(materials => {
				this.materials = materials;
				this.closeTransaction();
			});
	}

	startExam(exam: Exam, member: ExamMember) {
		var now = new Date();
		if (exam.start && exam.start.getTime() > now.getTime()) {
			this.warn(this.translateService.instant('Exam has not been started'));
			return;
		}
		if (exam.end && exam.end.getTime() < now.getTime()) {
			this.warn(this.translateService.instant('Exam has ended'));
			return;
		}
		this.confirm(this.translateService.instant('Are you sure to start?'), () => {
			this.examStudyDialog.show(exam, member);
		}
		);
	}

	joinConference() {
		if (this.conference.id && this.conferenceMember.id)
			this.meetingSerivce.join(this.conference.room_ref, this.conferenceMember.room_member_ref)
	}

	submitProject(project: Project) {
		var now = new Date();
		if (project.start && project.start.getTime() > now.getTime()) {
			this.warn(this.translateService.instant('Project has not been started'));
			return;
		}
		if (project.end && project.end.getTime() < now.getTime()) {
			this.warn(this.translateService.instant('Project has ended'));
			return;
		}
		this.projectSubmitDialog.show(project, this.member);
	}
}
