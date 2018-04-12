import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import * as _ from 'underscore';
import { USER_STATUS, GROUP_CATEGORY, COURSE_MODE, COURSE_STATUS } from '../../../shared/models/constants'
import { Course } from '../../../shared/models/elearning/course.model';
import { Group } from '../../../shared/models/elearning/group.model';
import { CourseDialog } from '../course-dialog/course-dialog.component';
import { ClassListDialog } from '../../class/class-list/class-list-dialog.component';
import { TreeUtils } from '../../../shared/helpers/tree.utils';
import { TreeNode } from 'primeng/api';

@Component({
    moduleId: module.id,
    selector: 'course-list',
    templateUrl: 'course-list.component.html',
    styleUrls: ['course-list.component.css'],
})
export class CourseListComponent extends BaseComponent {

    @ViewChild(CourseDialog) courseDialog: CourseDialog;
    @ViewChild(ClassListDialog) classListDialog: ClassListDialog;

    tree: TreeNode[];
    courses: Course[];
    selectedNode: TreeNode;
    selectedCourse: any;
    COURSE_MODE = COURSE_MODE;
    COURSE_STATUS = COURSE_STATUS;

    constructor(private treeUtils: TreeUtils) {
        super();
    }

    ngOnInit() {
        Group.listByCategory(this,GROUP_CATEGORY.COURSE).subscribe(groups => {
            this.tree = this.treeUtils.buildTree(groups);
        });
        this.loadCourses();
    }

    add() {
        var course = new Course();
        this.courseDialog.show(course);
        this.courseDialog.onCreateComplete.subscribe(() => {
            this.loadCourses();
        });
    }

    edit() {
        if (this.selectedCourse)
            this.courseDialog.show(this.selectedCourse);
        this.courseDialog.onUpdateComplete.subscribe(() => {
            this.loadCourses();
        });
    }

    enroll() {
        if (this.selectedCourse)
            this.classListDialog.show(this.selectedCourse);
    }

    loadCourses() {
        if (this.selectedNode)
            Course.listByGroup(this, this.selectedNode.data.id).subscribe(courses => {
                this.courses = courses;
            });
        else
            Course.all(this).subscribe(courses => {
                this.courses = courses;
            });
    }

    nodeSelect(event:any) {
        this.loadCourses();
    }

}
