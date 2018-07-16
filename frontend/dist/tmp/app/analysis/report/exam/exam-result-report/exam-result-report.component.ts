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
        BaseModel
            .bulk_search(this,
                ExamMember.__api__listCandidateByExam(exam.id),
                ExamRecord.__api__listByExam(exam.id),
                ExamLog.__api__listByExam(exam.id))
            .subscribe(jsonArr => {
                var members = ExamMember.toArray(jsonArr[0]);
                var records = ExamRecord.toArray(jsonArr[1]);
                var logs = ExamLog.toArray(jsonArr[2]);
                this.records = this.generateReport(exam, records, logs, members);
            })
    }


    generateReport(exam: Exam, records: ExamRecord[], logs: ExamLog[], members: ExamMember[]) {
        var rows = [];
        _.each(members, (member: ExamMember) => {
            var userLogs = _.filter(logs, (log: ExamLog) => {
                return log.user_id == member.user_id;
            });
            var examRecord = _.find(records, (obj: ExamRecord) => {
                return obj.member_id == member.id;
            });
            rows.push(this.generateReportRow(exam, member, examRecord, userLogs));
        });
        return rows;
    }

    generateReportRow(exam: Exam, member: ExamMember, examRecord: ExamRecord, logs: ExamLog[]): any {
        var record = {};
        record["user_login"] = member.login;
        record["user_name"] = member.name;
        record["user_group"] = member.group_id__DESC__;
        if (examRecord) {
            record["score"] = examRecord.score;
            record["grade"] = examRecord.grade;
        }
        if (logs && logs.length) {
            var result = this.reportUtils.analyzeExamMemberActivity(logs);
            if (result[0])
                record["date_attempt"] = this.datePipe.transform(result[0], EXPORT_DATE_FORMAT);
        }

        return record;
    }

}