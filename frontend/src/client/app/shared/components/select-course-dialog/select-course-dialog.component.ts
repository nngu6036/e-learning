import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ModelAPIService } from '../../services/api/model-api.service';
import { AuthService } from '../../services/auth.service';
import { Group } from '../../models/elearning/group.model';
import { BaseComponent } from '../base/base.component';
import { Course } from '../../../shared/models/elearning/course.model';
import * as _ from 'underscore';
import { TreeUtils } from '../../../shared/helpers/tree.utils';
import { TreeNode } from 'primeng/api';
import { GROUP_CATEGORY, CONTENT_STATUS } from '../../../shared/models/constants'
import { SelectItem } from 'primeng/api';

const COURSE_FIELDS = ['name', 'code'];

@Component({
	moduleId: module.id,
	selector: 'select-course-dialog',
	templateUrl: 'select-course-dialog.component.html',
	styleUrls: ['select-course-dialog.component.css'],
})
export class SelectCoursesDialog extends BaseComponent {

	private tree: TreeNode[];
	private selectedNode: TreeNode;
	private selectedCourses: Course[];
	private courses: Course[];
	private display: boolean;
	private treeUtils: TreeUtils;

	private onSelectCoursesReceiver: Subject<any> = new Subject();
	onSelectCourses: Observable<any> = this.onSelectCoursesReceiver.asObservable();

	constructor() {
		super();
		this.display = false;
		this.selectedCourses = [];
		this.treeUtils = new TreeUtils();
	}

	hide() {
		this.display = false;
	}

	nodeSelect(event: any) {
		if (this.selectedNode) {
			this.selectedNode.data.listCourses(this,COURSE_FIELDS).subscribe(courses => {
				this.courses = courses;
			});
		}
	}

	show() {
		this.display = true;
		this.selectedCourses = [];
		// , GROUP_CATEGORY.COURSE
		Group.listCourseGroup(this).subscribe(groups => {
			this.tree = this.treeUtils.buildGroupTree(groups);
		});
	}

	selectCourse() {
		this.onSelectCoursesReceiver.next(this.selectedCourses);
		this.selectedCourses = [];
		this.hide();
	}


}

