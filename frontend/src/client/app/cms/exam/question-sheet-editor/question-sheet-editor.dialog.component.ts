import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ModelAPIService } from '../../../shared/services/api/model-api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { Exam } from '../../../shared/models/elearning/exam.model';
import { Question } from '../../../shared/models/elearning/question.model';
import { QuestionSheet } from '../../../shared/models/elearning/question-sheet.model';
import { ExamGrade } from '../../../shared/models/elearning/exam-grade.model';
import { ExamQuestion } from '../../../shared/models/elearning/exam-question.model';
import { Http, Response } from '@angular/http';
import { QUESTION_SELECTION, GROUP_CATEGORY, EXAM_STATUS, QUESTION_TYPE, EXAM_MEMBER_STATUS, QUESTION_LEVEL } from '../../../shared/models/constants'
import { SelectItem, MenuItem } from 'primeng/api';
import * as _ from 'underscore';
import { TreeUtils } from '../../../shared/helpers/tree.utils';
import { SelectQuestionsDialog } from '../../../shared/components/select-question-dialog/select-question-dialog.component';
import { TreeNode } from 'primeng/api';

@Component({
	moduleId: module.id,
	selector: 'question-sheet-editor-dialog',
	templateUrl: 'question-sheet-editor.dialog.component.html',
})
export class QuestionSheetEditorDialog extends BaseComponent implements OnInit {

	QUESTION_LEVEL = QUESTION_LEVEL;

	private display: boolean;
	private tree: any;
	private selectorGroups: any;
	private selectedNodes: any;
	private groups: Group[];
	private treeUtils: TreeUtils;
	private examQuestions: ExamQuestion[];
	private onSaveReceiver: Subject<any> = new Subject();
	private totalQuestion: number;
	onSave: Observable<any> = this.onSaveReceiver.asObservable();

	constructor() {
		super();
		this.treeUtils = new TreeUtils();

	}

	ngOnInit() {
		this.tree = {};
		this.selectorGroups = {};
		this.selectedNodes = {};
		this.totalQuestion = 0;
		_.each(QUESTION_LEVEL, (val, key) => {
			this.selectorGroups[key] = {};
			this.selectorGroups[key]["number"] = 0;
			this.selectorGroups[key]["score"] = 0;
			this.selectorGroups[key]["include_sub_group"] = true;
			this.selectorGroups[key]["group_ids"] = [];
			this.selectedNodes[key] = [];
		});
		Group.listQuestionGroup(this).subscribe(groups => {
			_.each(QUESTION_LEVEL, (val, key) => {
				groups.forEach((group: any) => {
					Question.listByGroup(this, group.id).subscribe(questions => {
						var questions = questions;
						var test = [];
						test = _.filter(questions, (quest: any) => {
							return quest.level == key;
						});
						group.number = test.length;
					});
				});
				this.tree[key] = this.treeUtils.buildGroupTree(groups);
				this.selectedNodes[key] = _.map(this.selectorGroups[key]["group_ids"], (group_id => {
					return this.treeUtils.findTreeNode(this.tree[key], group_id);
				}));
			});
		});
	}

	nodeSelect(event: any, level) {
		this.selectorGroups[level]["group_ids"] = _.map(this.selectedNodes[level], (node => {
			return node['data']['id'];
		}));
		this.selectorGroups[level]["group_ids"].forEach((id: any) => {
			Question.listByGroup(this, id).subscribe(questions => {
				var questions = questions;
				var test = [];
				test = _.filter(questions, (quest: any) => {
					return quest.level == level;
				});
				this.totalQuestion = this.totalQuestion + test.length;
				console.log('test', test);
				console.log(this.totalQuestion);
			});
		});
	}

	createExamQuestionFromQuestionBank(questions: Question[], score) {
		return _.map(questions, (question: Question) => {
			var examQuestion = new ExamQuestion();
			examQuestion.question_id = question.id;
			examQuestion.score = score;
			examQuestion.title = question.title;
			examQuestion.group_id = question.group_id;
			examQuestion.group_id__DESC__ = question.group_id__DESC__;
			return examQuestion;
		});
	}

	generateQuestion() {
		var subscriptions = [];
		_.each(QUESTION_LEVEL, (val, key) => {
			var groupIds = this.selectorGroups[key]["group_ids"]
			if (groupIds.length > 0 && this.selectorGroups[key]["number"])
				subscriptions.push(Question.listByGroups(this, groupIds).do(questions => {
					questions = _.shuffle(questions);
					questions = _.filter(questions, (obj: Question) => {
						return obj.level == key;
					});
					var score = this.selectorGroups[key]["score"];
					questions = questions.slice(0, this.selectorGroups[key]["number"]);
					this.examQuestions = this.examQuestions.concat(this.createExamQuestionFromQuestionBank(questions, score));
				}));
		});
		return subscriptions;
	}

	show() {
		this.display = true;
		this.examQuestions = [];
	}


	hide() {
		this.display = false;
	}

	save() {
		Observable.forkJoin(this.generateQuestion()).subscribe(() => {
			this.hide();
			this.onSaveReceiver.next(this.examQuestions);
			this.success(this.translateService.instant('Content saved successfully.'));
		})
	}
}
