import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, Subject } from 'rxjs/Rx';
import { ModelAPIService } from '../../../shared/services/api/model-api.service';
import { ReportUtils } from '../../../shared/helpers/report.utils';
import { Exam } from '../../../shared/models/elearning/exam.model';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { User } from '../../../shared/models/elearning/user.model';
import { ExamGrade } from '../../../shared/models/elearning/exam-grade.model';
import { Submission } from '../../../shared/models/elearning/submission.model';
import { Answer } from '../../../shared/models/elearning/answer.model';
import { ExamMember } from '../../../shared/models/elearning/exam-member.model';
import * as _ from 'underscore';
import { EXPORT_DATETIME_FORMAT, REPORT_CATEGORY, GROUP_CATEGORY, COURSE_MODE, COURSE_MEMBER_ENROLL_STATUS, EXPORT_DATE_FORMAT } from '../../../shared/models/constants'
import { Chart } from '../chart.decorator';
import { StatsUtils } from '../../../shared/helpers/statistics.utils';

@Component({
    moduleId: module.id,
    selector: 'user-login-activity-chart',
    templateUrl: 'user-login-activity-chart.component.html',
})
export class UserLoginActivityChartComponent extends BaseComponent {

    private chartData: any;
    private statsUtils: StatsUtils;
    private cacheData: any;

    constructor() {
        super();
        this.statsUtils = new StatsUtils();
        this.cacheData = {};
    }

    prepareChartDate(duration: number): Observable<any> {
        if (this.cacheData[duration])
            return Observable.of(this.cacheData[duration]);
        var end = new Date();
        var start = new Date(end.getTime() - duration * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        return this.statsUtils.userLoginStatisticByDate(this, start, end).do(slots => {
            this.cacheData[duration] = slots;
        });
    }

    drawChart(duration: number) {
        this.prepareChartDate(duration).subscribe(slots => {
            console.log(slots);
            var labels = [this.translateService.instant('Today')];
            var data = [slots[slots.length - 1]];
            for (var i = 1; i < slots.length; i++) {
                labels.push(this.translateService.instant("Day-" + i));
                data.push(slots[slots.length - 1 - i]);
            }
            this.chartData = {
                labels: labels,
                datasets: [
                    {
                        label: this.translateService.instant('User login attempt'),
                        data: data,
                        fill: false,
                        borderColor: '#FFC107'
                    }
                ]
            };

        });

    }

}
