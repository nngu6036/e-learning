import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ModelAPIService } from '../../../shared/services/api/model-api.service';
import { AuthService } from '../../../shared/services/auth.service';
import * as _ from 'underscore';
import { GROUP_CATEGORY, SURVEY_STATUS, REVIEW_STATE } from '../../../shared/models/constants'
import { Survey } from '../../../shared/models/elearning/survey.model';
import { Group } from '../../../shared/models/elearning/group.model';
import { SurveyDialog } from '../survey-dialog/survey-dialog.component';
import { SurveyEnrollDialog } from '../enrollment-dialog/enrollment-dialog.component';
import { SelectItem } from 'primeng/api';
import { User } from '../../../shared/models/elearning/user.model';

@Component({
    moduleId: module.id,
    selector: 'survey-list',
    templateUrl: 'survey-list.component.html',
    styleUrls: ['survey-list.component.css'],
})
export class SurveyListComponent extends BaseComponent {

    SURVEY_STATUS = SURVEY_STATUS;
    REVIEW_STATE = REVIEW_STATE;

    private selectedSurvey: Survey;
    private surveys: Survey[];
    private events: any[];
    private header: any;

    @ViewChild(SurveyDialog) surveyDialog: SurveyDialog;
    @ViewChild(SurveyEnrollDialog) surveyEnrollDialog: SurveyEnrollDialog;

    constructor() {
        super();
        this.header = {
            left: 'prev, today, next',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };
    }

    ngOnInit() {
        this.loadSurveys();
    }


    addSurvey() {
        var survey = new Survey();
        survey.is_public = true;
        this.surveyDialog.show(survey);
        this.surveyDialog.onCreateComplete.subscribe(() => {
            this.loadSurveys();
        });
    }

    editSurvey() {
        if (!this.ContextUser.IsSuperAdmin || this.ContextUser.id != this.selectedSurvey.supervisor_id) {
            this.error(this.translateService.instant('You do not have edit permission for this survey'));
            return;
        }
        this.surveyDialog.show(this.selectedSurvey);
    }

    deleteSurvey() {
        if (!this.ContextUser.IsSuperAdmin && this.ContextUser.id != this.selectedSurvey.supervisor_id) {
            this.error(this.translateService.instant('You do not have delete permission for this survey'));
            return;
        }
        this.confirm(this.translateService.instant('Are you sure to delete?'), () => {
            this.selectedSurvey.delete(this).subscribe(() => {
                this.loadSurveys();
                this.selectedSurvey = null;
            })
        });
    }

    loadSurveys() {
        Survey.listPublicSurvey(this).subscribe(surveys => {
            this.surveys = surveys;
            this.surveys.sort((s1, s2): any => {
                return (s1.id < s2.id);
            });
        });
    }

    requestReview() {
        if (this.ContextUser.id != this.selectedSurvey.supervisor_id) {
            this.error(this.translateService.instant('You do not have submit-review permission for this survey'));
            return;
        }
        this.workflowService.createSurveyReviewTicket(this, this.selectedSurvey).subscribe(() => {
            this.success(this.translateService.instant('Request submitted'));
            this.selectedSurvey.refresh(this).subscribe();
        });
    }
}