import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, Subject } from 'rxjs/Rx';
import { APIService } from '../../../../shared/services/api.service';
import { ReportUtils } from '../../../../shared/helpers/report.utils';
import { Group } from '../../../../shared/models/elearning/group.model';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { User } from '../../../../shared/models/elearning/user.model';
import { Course } from '../../../../shared/models/elearning/course.model';
import { CourseLog } from '../../../../shared/models/elearning/log.model';
import { CourseMember } from '../../../../shared/models/elearning/course-member.model';
import * as _ from 'underscore';
import { EXPORT_DATETIME_FORMAT, REPORT_CATEGORY, GROUP_CATEGORY, COURSE_MODE, COURSE_MEMBER_ENROLL_STATUS, EXPORT_DATE_FORMAT } from '../../../../shared/models/constants'
import { Report } from '../../report.decorator';
import { SelectGroupDialog } from '../../../../shared/components/select-group-dialog/select-group-dialog.component';
import { SelectCoursesDialog } from '../../../../shared/components/select-course-dialog/select-course-dialog.component';
import { TimeConvertPipe} from '../../../../shared/pipes/time.pipe';
import { ExcelService } from '../../../../shared/services/excel.service';

@Component({
    moduleId: module.id,
    selector: 'member-by-course-report',
	templateUrl: 'member-by-course-report.component.html',
	styleUrls: ['member-by-course-report.component.css'],
})
export class MemberByCourseReportComponent extends BaseComponent{

	private records: any;
	private summary: any;
	GROUP_CATEGORY =  GROUP_CATEGORY;
    private reportUtils: ReportUtils;

    constructor( private excelService: ExcelService, private datePipe: DatePipe, private timePipe: TimeConvertPipe) {
        super();
        this.records = [];
		this.summary =  this.generateReportFooter(this.records);
        this.reportUtils = new ReportUtils();
    }

    export() {
		var output = [];
		this.records.forEach(record => {
			var course = { 'Course code': record['course_code'], 'Course name': record['course_name'], 'Total': record['total_member'], 'Total registered': record['total_member_registered'], 'Percentage registered': record['percentage_member_registered'], 'Total in-progress': record['total_member_inprogress'], 'Percentage in-progress': record['percentage_member_inprogress'], 'Total completed': record['total_member_completed'], 'Percentage completed': record['percentage_member_inprogress'], 'Time': record['time_spent'] };
			output.push(course);
		});
    	this.excelService.exportAsExcelFile(output,'course_by_member_report');
    }

    clear() {
        this.records = [];
    }

    render(courses:Course[]) {
        this.startTransaction();
		this.summary = {};
		this.generateReport(courses).subscribe(records => {
			this.records = records;
			this.summary =  this.generateReportFooter(records);
            this.closeTransaction();
		});
    }

    generateReport(courses:Course[]):Observable<any> {
    	var subscriptions =[];
    	_.each(courses, (course:Course)=> {
    		var subscription = CourseMember.listByCourse(this, course.id).flatMap(members => {
    			return CourseLog.courseActivity(this, course.id).map(logs => {
    				return this.generateReportRow(course, members, logs);
	    		});
    		});	
    		subscriptions.push(subscription);	
    	});		
    	return Observable.zip(...subscriptions);
    }

    generateReportRow(course: Course, members: CourseMember[], logs: CourseLog[]):any {
		var record = {};
	    record["course_name"] = course.name;
	    record["course_code"] = course.code;
        var courseMemberData = this.reportUtils.analyseCourseMember(course, members);
        Object.assign(record, courseMemberData);
	    var result = this.reportUtils.analyzeCourseMemberActivity(logs);
	    record["time_spent"] =  this.timePipe.transform(+result[2],'min');
	    return record;
    }

    generateReportFooter(records:any) {
    	var summary = {
			total_member_student:0,
    		total_member:records.length,
    		total_member_registered:0,
    		percentage_member_registered:0,
    		total_member_inprogress:0,
    		percentage_member_inprogress:0,
    		total_member_completed:0,
    		percentage_member_completed:0,
    		time_spent:0
    	};
    	_.each(records, (record)=> {
    		_.each(summary, (key)=> {
    			summary[key] += record[key]
    		});
		});
    	return summary;
    }

}
