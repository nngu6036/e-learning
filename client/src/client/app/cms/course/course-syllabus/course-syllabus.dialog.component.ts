import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../../../shared/services/api.service';
import { SyllabusUtils } from '../../../shared/helpers/syllabus.utils';
import { WebSocketService } from '../../../shared/services/socket.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { User } from '../../../shared/models/elearning/user.model';
import { Course } from '../../../shared/models/elearning/course.model';
import { CourseUnit } from '../../../shared/models/elearning/course-unit.model';
import { CourseSyllabus }  from '../../../shared/models/elearning/course-syllabus.model';
import { TreeNode, MenuItem, SelectItem } from 'primeng/api';
import { COURSE_UNIT_TYPE, COURSE_UNIT_ICON, CONTENT_STATUS } from '../../../shared/models/constants';
import { CourseUnitDialog } from '../course-unit-dialog/course-unit-dialog.component';
import { CourseUnitPreviewDialog } from '../course-unit-preview-dialog/course-unit-preview-dialog.component';
import { CourseSettingDialog } from '../course-setting/course-setting.dialog.component';
import * as _ from 'underscore';
import { Ticket } from '../../../shared/models/ticket/ticket.model';
import { WorkflowService } from '../../../shared/services/workflow.service';

@Component({
    moduleId: module.id,
    selector: 'course-syllabus-dialog',
    templateUrl: 'course-syllabus.dialog.component.html',
    styleUrls: ['course-syllabus.dialog.component.css'],
})
export class CourseSyllabusDialog extends BaseComponent {

	COURSE_UNIT_TYPE = COURSE_UNIT_TYPE;

	private display: boolean;
	private tree: TreeNode[];
	private syl: CourseSyllabus;
	private selectedNode: TreeNode;
	private items: MenuItem[];
	private units: CourseUnit[];
	private selectedUnit:CourseUnit;
	private sylUtils : SyllabusUtils;
	private course: Course;
	private user: User;
	private courseStatus: SelectItem[];
	private allowToChangeState : boolean;
	private openTicket: Ticket;
	private onShowReceiver: Subject<any> = new Subject();
    private onHideReceiver: Subject<any> = new Subject();
    onShow: Observable<any> = this.onShowReceiver.asObservable();
    onHide: Observable<any> = this.onHideReceiver.asObservable();

	@ViewChild(CourseUnitDialog) unitDialog: CourseUnitDialog;
	@ViewChild(CourseUnitPreviewDialog) unitPreviewDialog: CourseUnitPreviewDialog;
	@ViewChild(CourseSettingDialog) settingDialog: CourseSettingDialog;

    constructor(private socketService:WebSocketService, private workflowService: WorkflowService) {
        super();
        this.sylUtils = new SyllabusUtils();
        this.items = [
            {label: this.translateService.instant(COURSE_UNIT_TYPE['folder']), command: ()=> { this.addUnit('folder')}},
            {label: this.translateService.instant(COURSE_UNIT_TYPE['html']), command: ()=> { this.addUnit('html')}},
            {label: this.translateService.instant(COURSE_UNIT_TYPE['slide']), command: ()=> { this.addUnit('slide')}},
            {label: this.translateService.instant(COURSE_UNIT_TYPE['video']), command: ()=> { this.addUnit('video')}},
            {label: this.translateService.instant(COURSE_UNIT_TYPE['exercise']), command: ()=> { this.addUnit('exercise')}},
            {label: this.translateService.instant(COURSE_UNIT_TYPE['scorm']), command: ()=> { this.addUnit('scorm')}},

        ];
        this.syl = new CourseSyllabus();
        this.course = new Course();
        this.courseStatus = _.map(CONTENT_STATUS, (val, key)=> {
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
		//this.checkWorkflow();
	}

	checkWorkflow() {
		Course.get(this, this.syl.course_id).subscribe(course => {
			this.course = course;
				this.allowToChangeState = !this.course.supervisor_id || 
				this.user.IsSuperAdmin ;
			
		});
		Ticket.byWorkflowObject(this, this.syl.id, CourseSyllabus.Model).subscribe((ticket)=> {
			this.openTicket =  ticket;
		});
	}

	clearSelection() {
		this.selectedNode = null;
		this.selectedUnit = null;
	}

	buildCourseTree() {
		if (this.syl) {
			CourseUnit.listBySyllabus(this,this.syl.id).subscribe(units => {
				this.units = units;
				this.tree = this.sylUtils.buildGroupTree(units);
	        });
		}
	}

	showSetting() {
		this.settingDialog.show(this.course);
	}

	addUnit(type:string) {
		if (type!='folder' && (!this.selectedNode || this.selectedNode.data.type != 'folder')) {
			this.error(this.translateService.instant('You need to select a folder.')) ;
			return;
		}
		var maxOrder = this.selectedNode ? this.selectedNode.children.length : this.tree.length; 
		var unit = new CourseUnit();
		unit.syllabus_id =  this.syl.id;
		unit.icon = COURSE_UNIT_ICON[type];
		unit.type =  type;
		unit.name = 'New unit';
		unit.parent_id = this.selectedNode ? this.selectedNode.data.id : null;
		unit.order = maxOrder;
		unit.save(this).subscribe(()=> {
			if (this.selectedNode)
				this.sylUtils.addChildNode(this.selectedNode, unit);
			else
				this.sylUtils.addRootNode(this.tree, unit);
		});
	}

	editUnit() {
		if (this.selectedNode) {
			this.unitDialog.show(this.selectedNode.data);
			this.unitDialog.onUpdateComplete.subscribe(()=> {
				this.buildCourseTree();
			});
		}
	}

	deleteUnit() {
		if (this.selectedNode) {
			if (this.selectedNode.children.length) {
				this.error(this.translateService.instant('Cannot delete non-empty folder'));
				return;
			}
            this.confirm(this.translateService.instant('Are you sure to delete?'), () => {
                this.selectedNode.data.delete(this).subscribe(() => {
                    this.buildCourseTree();
                    this.selectedNode = null;
                })
             });
		}
	}

	hide() {
		this.clearSelection();
		this.display = false;
		this.onHideReceiver.next();
	}

	moveUp() {
		if (this.selectedNode) {
			var unit =  this.selectedNode.data;
			this.sylUtils.moveUp(this.tree,this.selectedNode);
			CourseUnit.updateArray(this, this.units).subscribe(()=> {
				this.success('Move sucessfully');
			});
		}
	}

	moveDown() {
		if (this.selectedNode) {
			var unit =  this.selectedNode.data;
			this.sylUtils.moveDown(this.tree,this.selectedNode);
			CourseUnit.updateArray(this, this.units).subscribe(()=> {
				this.success('Move sucessfully');
			});
		}
	}

	nodeSelect(event:any) {
		if (this.selectedNode) {
			if (this.selectedUnit && this.selectedUnit.id == this.selectedNode.data.id) {
				this.clearSelection();
			} 
			else
				this.selectedUnit =  this.selectedNode.data;
		}
	}

	previewUnit() {
		if (this.selectedNode) {
			this.selectedNode.data.course_id = this.course.id;
			this.unitPreviewDialog.show(this.selectedNode.data);
		}
	}

	submitForReview() {
		this.workflowService.createCourseSyllabusPublishTicket(this, this.syl).subscribe(ticket=> {
		});
	}

	updateStatus() {
		this.syl.save(this).subscribe(()=> {
			this.success(this.translateService.instant('Syllabus status updated'));
		});
	}

}

