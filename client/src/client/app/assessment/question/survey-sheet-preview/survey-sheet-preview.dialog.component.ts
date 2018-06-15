import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, ComponentFactoryResolver } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { APIService } from '../../../shared/services/api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Group } from '../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { Exam } from '../../../shared/models/elearning/exam.model';
import { SurveyQuestion } from '../../../shared/models/elearning/survey-question.model';
import { Answer } from '../../../shared/models/elearning/answer.model';
import { CloudAccount } from '../../../shared/models/cloud/cloud-account.model';
import { Submission } from '../../../shared/models/elearning/submission.model';
import { Question } from '../../../shared/models/elearning/question.model';
import { SurveySheet } from '../../../shared/models/elearning/survey-sheet.model';
import { ExamMember } from '../../../shared/models/elearning/exam-member.model';
import { Http, Response } from '@angular/http';
import { QuestionContainerDirective } from '../../../assessment/question/question-template/question-container.directive';
import { IQuestion } from '../../../assessment/question/question-template/question.interface';
import { QuestionRegister } from '../../../assessment/question/question-template/question.decorator';
import 'rxjs/add/observable/timer';
import * as _ from 'underscore';

@Component({
    moduleId: module.id,
    selector: 'survey-sheet-preview-dialog',
    templateUrl: 'survey-sheet-preview.dialog.component.html',
    styleUrls: ['survey-sheet-preview.dialog.component.css'],
})
export class SurveySheetPreviewDialog extends BaseComponent {
    
    private display: boolean;
    private surveyQuestions: SurveyQuestion[];
    private sheet: SurveySheet;

    @ViewChildren(QuestionContainerDirective) questionsComponents: QueryList<QuestionContainerDirective>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        super();
        this.display = false;
        this.surveyQuestions = [];
    }

    show(sheet: SurveySheet) {
        this.display = true;
        this.surveyQuestions = [];
        this.sheet = sheet;
        this.startReview();
    }

    hide() {
        this.display = false;
    }

    startReview() {
        SurveyQuestion.listBySheet(this, this.sheet.id).subscribe(surveyQuestions => {
            SurveyQuestion.populateQuestionForArray(this, surveyQuestions).subscribe(()=> {
                this.surveyQuestions = surveyQuestions;
                setTimeout(()=> {
                    var componentHostArr = this.questionsComponents.toArray();
                    for (var i = 0; i < surveyQuestions.length; i++) {
                        var surveyQuestion = surveyQuestions[i];
                        var componentHost = componentHostArr[i];
                        this.displayQuestion(surveyQuestion, componentHost);
                    }
                },0)
            })
            
            
        });
    }

    displayQuestion(surveyQuestion: SurveyQuestion, componentHost) {
            var detailComponent = QuestionRegister.Instance.lookup(surveyQuestion.question.type);
            let viewContainerRef = componentHost.viewContainerRef;
            if (detailComponent) {
                let componentFactory = this.componentFactoryResolver.resolveComponentFactory(detailComponent);
                viewContainerRef.clear();
                var componentRef = viewContainerRef.createComponent(componentFactory);
                (<IQuestion>componentRef.instance).mode = 'preview';
                (<IQuestion>componentRef.instance).render(surveyQuestion.question);
            }
    }
}



