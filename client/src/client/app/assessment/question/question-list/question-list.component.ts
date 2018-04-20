import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import * as _ from 'underscore';
import { QUESTION_TYPE, GROUP_CATEGORY, QUESTION_LEVEL } from '../../../shared/models/constants'
import { Question } from '../../../shared/models/elearning/question.model';
import { Group } from '../../../shared/models/elearning/group.model';
import { QuestionDialog } from '../question-dialog/question-dialog.component';
import { TreeUtils } from '../../../shared/helpers/tree.utils';
import { TreeNode, MenuItem } from 'primeng/api';
import { QuestionImportDialog } from '../import-dialog/import-dialog.component';

@Component({
    moduleId: module.id,
    selector: 'question-list',
    templateUrl: 'question-list.component.html',
    styleUrls: ['question-list.component.css'],
})
export class QuestionListComponent extends BaseComponent {

    @ViewChild(QuestionDialog) questionDialog: QuestionDialog;
    @ViewChild(QuestionImportDialog) questionImportDialog: QuestionImportDialog;

    tree: TreeNode[];
    items: MenuItem[];
    questions: Question[];
    selectedQuestion: any;
    filterGroups: Group[];
    selectedGroupNodes: TreeNode[];
    QUESTION_LEVEL = QUESTION_LEVEL;
    QUESTION_TYPE = QUESTION_TYPE;

    constructor(private treeUtils: TreeUtils) {
        super();
        this.filterGroups = [];
    }

    ngOnInit() {
        Group.listByCategory(this,GROUP_CATEGORY.QUESTION).subscribe(groups => {
            this.tree = this.treeUtils.buildTree(groups);
        });
        this.loadQuestions();
        this.items = [
            {label: this.translateService.instant(QUESTION_TYPE['sc']), command: ()=> { this.add('sc')}},
            {label: this.translateService.instant(QUESTION_TYPE['ext']), command: ()=> { this.add('ext')}},
        ];
    }

    add(type:string) {
        var question = new Question();
        question.type = type;
        this.questionDialog.show(question);
        this.questionDialog.onCreateComplete.subscribe(() => {
            this.loadQuestions();
        });
    }

    edit() {
        if (this.selectedQuestion)
            this.questionDialog.show(this.selectedQuestion);
        this.questionDialog.onUpdateComplete.subscribe(() => {
            this.loadQuestions();
        });
    }

    delete() {
        if (this.selectedQuestion)
            this.confirm('Are you sure to delete ?', () => {
                this.selectedQuestion.delete(this).subscribe(() => {
                    this.loadQuestions();
                    this.selectedQuestion = null;
                });
            });
    }

    loadQuestions() {
        // if (this.selectedNode)
        //     Question.listByGroup(this, this.selectedNode.data.id).subscribe(questions => {
        //         this.questions = questions;
        //     });
        // else
            Question.all(this).subscribe(questions => {
                this.questions = questions;
            });
    }

    import() {
        this.questionImportDialog.show();
        this.questionImportDialog.onImportComplete.subscribe(()=> {
            this.loadQuestions();
        });
    }

}