import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { Course } from '../../../shared/models/elearning/course.model';
import { User } from '../../../shared/models/elearning/user.model';
import { CourseClass } from '../../../shared/models/elearning/course-class.model';
import { CourseMember } from '../../../shared/models/elearning/course-member.model';
import * as _ from 'underscore';
import { TreeUtils } from '../../../shared/helpers/tree.utils';
import { TreeNode } from 'primeng/api';
import { SelectItem, MenuItem } from 'primeng/api';
import {
    GROUP_CATEGORY, PROJECT_STATUS
} from '../../../shared/models/constants'
import { SelectUsersDialog } from '../../../shared/components/select-user-dialog/select-user-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { Project } from '../../../shared/models/elearning/project.model';
import { Answer } from '../../../shared/models/elearning/answer.model';
import { ProjectSubmission } from '../../../shared/models/elearning/project-submission.model';
import { ExamQuestion } from '../../../shared/models/elearning/exam-question.model';
import { ProjectMarkingDialog } from '../project-marking/project-marking.dialog.component';
import { ExamGrade } from '../../../shared/models/elearning/exam-grade.model';
import { Http, Response } from '@angular/http';
import { QuestionSheet } from '../../../shared/models/elearning/question-sheet.model';


@Component({
	moduleId: module.id,
	selector: 'project-manage-dialog',
	templateUrl: 'project-manage.dialog.component.html',
    styleUrls: ['project-manage.dialog.component.css'],
})
export class ProjectManageDialog extends BaseComponent {

    private display: boolean;
	private project: Project;
    private scoreRecords: any;
    private selectedRecord: any;
    PROJECT_STATUS = PROJECT_STATUS;
    @ViewChild(ProjectMarkingDialog) projectMarkDialog: ProjectMarkingDialog;

	constructor() {
		super();
		this.project = new Project();
	}

	show(project:Project) {
        this.project =  project;
        this.display =  true;
        this.loadScores();
        this.startTransaction();
        
	}

	mark() {
        if (this.selectedRecord && this.selectedRecord['submit'])
               this.projectMarkDialog.show(this.selectedRecord['submit']);
    }

    loadScores() {
        this.startTransaction();
        ProjectSubmission.listByProject(this, this.project.id).subscribe(submits => {
            CourseClass.get(this, this.project.class_id).subscribe(clazz => {
                CourseMember.listByClass(this, clazz.id).subscribe(members => {
                    this.scoreRecords = members;
                    _.each(members, (member: CourseMember) => {
                        var submit = _.find(submits, (submit: ProjectSubmission) => {
                            return submit.member_id == member.id;
                        });
                        member["submit"] = submit;
                        if (submit) {
                            if (submit.score != null) {
                                member["score"] = submit.score;
                                member["date_submit"] = submit.date_submit;
                            }
                            else {
                                member["score"] = '';
                                member["date_submit"] = '';
                            }
                        }
                    });
                    this.closeTransaction();
                });
            });
        });
    }

    hide() {
        this.display = false;
    }

}

