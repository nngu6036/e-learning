import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, Subject } from 'rxjs/Rx';
import { ModelAPIService } from '../../../../shared/services/api/model-api.service';
import { ReportUtils } from '../../../../shared/helpers/report.utils';
import { Exam } from '../../../../shared/models/elearning/exam.model';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { User } from '../../../../shared/models/elearning/user.model';
import { ExamLog } from '../../../../shared/models/elearning/log.model';
import { ExamGrade } from '../../../../shared/models/elearning/exam-grade.model';
import { Submission } from '../../../../shared/models/elearning/submission.model';
import { Answer } from '../../../../shared/models/elearning/answer.model';
import { ExamMember } from '../../../../shared/models/elearning/exam-member.model';
import * as _ from 'underscore';
import { EXPORT_DATETIME_FORMAT, REPORT_CATEGORY, GROUP_CATEGORY, COURSE_MODE, COURSE_MEMBER_ENROLL_STATUS, EXPORT_DATE_FORMAT } from '../../../../shared/models/constants'
import { Report } from '../../report.decorator';
import { SelectGroupDialog } from '../../../../shared/components/select-group-dialog/select-group-dialog.component';
import { SelectUsersDialog } from '../../../../shared/components/select-user-dialog/select-user-dialog.component';
import { TimeConvertPipe } from '../../../../shared/pipes/time.pipe';
import { ExcelService } from '../../../../shared/services/excel.service';
import { BaseModel } from '../../../../shared/models/base.model';
import { ExamRecord } from '../../../../shared/models/elearning/exam-record.model';

const EXAM_MEMBER_FIELDS = ['role', 'user_id', 'login', 'name', 'group_name', 'grade', 'score']

@Component({
    moduleId: module.id,
    selector: 'exam-result-report',
    templateUrl: 'exam-result-report.component.html',
})
export class ExamResultReportComponent extends BaseComponent implements OnInit {

    private records: any;
    private exams: Exam[];
    private selectedExam: any;
    private reportUtils: ReportUtils;

    constructor(private excelService: ExcelService, private datePipe: DatePipe) {
        super();
        this.reportUtils = new ReportUtils();
    }

    ngOnInit() {
        Exam.all(this).subscribe(exams => {
            this.exams = exams;
        });
    }

    clear() {
        this.records = [];
    }

    export() {
        var output = _.map(this.records, record => {
            return { 'Name': record['user_name'], 'Login': record['user_login'], 'User group': record['user_group'], 'Attempt date': record['date_attempt'], 'Score': record['score'], 'Result': record['result'] };
        });
        this.excelService.exportAsExcelFile(output, 'course_by_member_report');
    }

    render(exam: Exam) {
        this.clear();
        exam.listCandidates(this, EXAM_MEMBER_FIELDS).subscribe(members => {
            ExamLog.listByExam(this, exam.id).subscribe(logs => {
                this.records = this.generateReport(exam, logs, members);
            });
        });
    }


    generateReport(exam: Exam, logs: ExamLog[], members: ExamMember[]) {
        var rows = [];
        _.each(members, (member: ExamMember) => {
            var userLogs = _.filter(logs, (log: ExamLog) => {
                return log.user_id == member.user_id;
            });
            rows.push(this.generateReportRow(exam, member, userLogs));
        });
        return rows;
    }

    generateReportRow(exam: Exam, member: ExamMember, logs: ExamLog[]): any {
        var record = {};
        record["user_login"] = member.login;
        record["user_name"] = member.name;
        record["user_group"] = member.group_name;
        record["score"] = member.score;
        record["grade"] = member.grade;
        if (logs && logs.length) {
            var result = this.reportUtils.analyzeExamMemberActivity(logs);
            if (result[0])
                record["date_attempt"] = this.datePipe.transform(result[0], EXPORT_DATE_FORMAT);
        }

        return record;
    }

}
