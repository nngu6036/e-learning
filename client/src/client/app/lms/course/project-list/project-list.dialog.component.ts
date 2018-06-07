import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import * as _ from 'underscore';
import { GROUP_CATEGORY, PROJECT_STATUS } from '../../../shared/models/constants'
import { CourseClass } from '../../../shared/models/elearning/course-class.model';
import { ExamMember } from '../../../shared/models/elearning/exam-member.model';
import { Exam } from '../../../shared/models/elearning/exam.model';
import { Project } from '../../../shared/models/elearning/project.model';
import { SelectItem } from 'primeng/api';
import { ExamDialog } from '../../../assessment/exam/exam-dialog/exam-dialog.component';
import { ProjectManageDialog } from '../project-manage/project-manage.dialog.component';
import { ProjectContentDialog } from '../../../cms/project/content-dialog/project-content.dialog.component';
import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'project-list-dialog',
	templateUrl: 'project-list.dialog.component.html',
})
export class ProjectListDialog extends BaseComponent {

	private display: boolean;
	private courseClass: CourseClass;
	private projects: Project[];
	private selectedProject: Project;
	PROJECT_STATUS = PROJECT_STATUS;

	@ViewChild(ProjectContentDialog) projectContentDialog:ProjectContentDialog;
	@ViewChild(ProjectManageDialog) projectManageDialog: ProjectManageDialog;

	constructor(private router: Router) {
		super();
		this.display = false;
		this.courseClass = new CourseClass();
		this.projects = [];
	}

	show(courseClass: CourseClass) {
		this.display = true;
		this.courseClass = courseClass;
		this.loadProjects();
	}

	loadProjects() {
		Project.listByClass(this, this.courseClass.id).subscribe(projects => {
			this.projects = projects;
		});
	}

	hide() {
		this.display = false;
	}

	addProject() {
		var project = new Project();
		project.class_id =  this.courseClass.id;
		project.course_id =  this.courseClass.course_id;
		this.projectContentDialog.show(project);
		this.projectContentDialog.onCreateComplete.subscribe(() => {
			this.loadProjects();
		});
	}

	editProject() {
		if (this.selectedProject) {
			this.projectContentDialog.show(this.selectedProject);
		}
	}

	deleteProject() {
		if (this.selectedProject) {
			this.confirm('Are you sure to delete ?', () => {
				this.selectedProject.delete(this).subscribe(()=> {
					this.success('Project deleted');
					this.loadProjects();
				});
			});
		}
	}

	markProject() {
		if (this.selectedProject)  
			this.projectManageDialog.show(this.selectedProject);
	}


}
