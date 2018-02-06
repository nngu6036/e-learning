import { NgModule } from '@angular/core';
import { AuthModule } from '../auth/auth.module';
import { ErpSharedModule } from '../shared/shared.module';
import  { AssessmentComponent } from './assessment.component'
import { ExamListComponent } from './exam/exam-list/exam-list.component';
import { ExamDialog } from './exam/exam-dialog/exam-dialog.component';
import { QuestionListComponent } from './question/question-list/question-list.component';
import { QuestionDialog } from './question/question-dialog/question-dialog.component';
import { QuestionContainerDirective } from './question/question-template/question-container.directive';
import { SingleChoiceQuestionComponent } from './question/question-template/single-choice-question/single-choice-question.component';
import { QuestionImportDialog } from './question/import-dialog/import-dialog.component';
import { ExamMemberDialog } from './exam/member-dialog/member-dialog.component';

@NgModule({
    imports: [ErpSharedModule, AuthModule],
    declarations: [AssessmentComponent, ExamListComponent, ExamDialog,ExamMemberDialog,
    				QuestionListComponent, QuestionDialog, QuestionContainerDirective,
    				SingleChoiceQuestionComponent, QuestionImportDialog],
    exports: [],
    providers: [],
    entryComponents: [SingleChoiceQuestionComponent]
})
export class AssessmentModule {
}