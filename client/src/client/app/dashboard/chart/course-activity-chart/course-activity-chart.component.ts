import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../../../shared/services/api.service';
import { ReportUtils } from '../../../shared/helpers/report.utils';
import { Exam } from '../../../shared/models/exam.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { User } from '../../../shared/models/user.model';
import { UserLog } from '../../../shared/models/log.model';
import { ExamGrade } from '../../../shared/models/exam-grade.model';
import { Submission } from '../../../shared/models/submission.model';
import { Answer } from '../../../shared/models/answer.model';
import { ExamMember } from '../../../shared/models/exam-member.model';
import * as _ from 'underscore';
import { EXPORT_DATETIME_FORMAT, REPORT_CATEGORY, GROUP_CATEGORY, COURSE_MODE, COURSE_MEMBER_ENROLL_STATUS, EXPORT_DATE_FORMAT } from '../../../shared/models/constants'
import { Chart } from '../../chart.decorator';


@Component({
    moduleId: module.id,
    selector: 'etraining-course-activity-chart',
    templateUrl: 'course-activity-chart.component.html',
})
@Chart({
    title:'Course activity chart',
})
export class CourseActivityChartComponent extends BaseComponent implements OnInit{

    chartData:any;
    duration: number = 7;

    constructor() {
        super();
    }

    ngOnInit() {
           this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: this.translateService.instant('Course unit attempt'),
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#FFC107'
                }
            ]
        };
    }

   

}
