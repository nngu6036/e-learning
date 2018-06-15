import { NgModule } from '@angular/core';
import { AuthModule } from '../auth/auth.module';
import { ErpSharedModule } from '../shared/shared.module';
import { AnalysisComponent } from './analysis.component';
import { ReportComponent } from './report/report.component';
import { ChartComponent } from './chart/chart.component';
import { ExamResultStatsReportComponent } from './report/exam/exam-result-stats-report/exam-result-stats-report.component';
import { ExamResultStatsReportContainerComponent } from './report/exam/exam-result-stats-report/exam-result-stats-report-container.component';
import { ExamResultReportComponent } from './report/exam/exam-result-report/exam-result-report.component';
import { ExamResultReportContainerComponent } from './report/exam/exam-result-report/exam-result-report-container.component';
import { CourseByMemberReportComponent } from './report/course/course-by-member-report/course-by-member-report.component';
import { CourseByMemberReportContainerComponent } from './report/course/course-by-member-report/course-by-member-report-container.component';
import { MemberByCourseReportComponent } from './report/course/member-by-course-report/member-by-course-report.component';
import { MemberByCourseReportContainerComponent } from './report/course/member-by-course-report/member-by-course-report-container.component';
import { ReportContainerDirective } from './report/report-container.directive';
import { CourseActivityChartComponent } from './chart/course-activity-chart/course-activity-chart.component';
import { CourseActivityChartContainerComponent } from './chart/course-activity-chart/course-activity-chart-container.component';
import { UserLoginActivityChartComponent } from './chart/user-login-activity-chart/user-login-activity-chart.component';
import { UserLoginActivityChartContainerComponent } from './chart/user-login-activity-chart/user-login-activity-chart-container.component';
import { UserChartComponent } from './chart/user-chart/user-chart.component';
import { UserChartContainerComponent } from './chart/user-chart/user-chart-container.component';
import { ChartContainerDirective } from './chart/chart-container.directive'
import { DatePipe } from '@angular/common';
import { ReportUtils } from '../shared/helpers/report.utils';
import { TimeConvertPipe} from '../shared/pipes/time.pipe';
import { SurveyResultStatsReportComponent } from './report/survey/survey-result-stats-report/survey-result-stats-report.component';
import { SurveyResultStatsReportContainerComponent } from './report/survey/survey-result-stats-report/survey-result-stats-report-container.component';
import { StatsUtils } from '../shared/helpers/statistics.utils';
import { CompetencyByGroupReportComponent } from './report/competency/competency-by-group-report/competency-by-group-report.component';
import { CompetencyByGroupReportContainerComponent } from './report/competency/competency-by-group-report/competency-by-group-report-container.component';

@NgModule({
	imports: [ErpSharedModule, AuthModule],
	declarations: [
	AnalysisComponent,
	ReportComponent, 
	ChartComponent,
	ExamResultReportContainerComponent,
	ExamResultReportComponent,
	CourseByMemberReportContainerComponent,
	CourseByMemberReportComponent,
	MemberByCourseReportContainerComponent,
	MemberByCourseReportComponent,
	ChartContainerDirective,
	CourseActivityChartComponent,
	CourseActivityChartContainerComponent,
	UserLoginActivityChartComponent,
	UserLoginActivityChartContainerComponent,
	ExamResultStatsReportComponent,
	ExamResultStatsReportContainerComponent,
	SurveyResultStatsReportComponent,
	SurveyResultStatsReportContainerComponent,
	UserChartComponent,
	UserChartContainerComponent,
	CompetencyByGroupReportComponent,
	CompetencyByGroupReportContainerComponent,
	ReportContainerDirective],
	entryComponents: [
		ExamResultReportContainerComponent,
        CourseByMemberReportContainerComponent,
        MemberByCourseReportContainerComponent,
        ExamResultStatsReportContainerComponent,
        CompetencyByGroupReportContainerComponent,
        UserChartContainerComponent,
        UserLoginActivityChartContainerComponent,
        CourseActivityChartContainerComponent,
        SurveyResultStatsReportContainerComponent
    ],
	exports: [ExamResultReportComponent,SurveyResultStatsReportComponent,ExamResultStatsReportComponent],
	providers: [DatePipe, TimeConvertPipe]
})
export class AnalysisModule {
}
