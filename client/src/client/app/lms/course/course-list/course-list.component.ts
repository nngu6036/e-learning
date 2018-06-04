import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ModelAPIService } from '../../../shared/services/api/model-api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ReportUtils } from '../../../shared/helpers/report.utils';
import * as _ from 'underscore';
import { GROUP_CATEGORY, CONTENT_STATUS, COURSE_MODE } from '../../../shared/models/constants'
import { Course } from '../../../shared/models/elearning/course.model';
import { CourseUnit } from '../../../shared/models/elearning/course-unit.model';
import { CourseSyllabus } from '../../../shared/models/elearning/course-syllabus.model';
import { CourseMember } from '../../../shared/models/elearning/course-member.model';
import { Group } from '../../../shared/models/elearning/group.model';
import { User } from '../../../shared/models/elearning/user.model';
import { SelectItem } from 'primeng/api';
import { CourseSyllabusDialog } from '../../../cms/course/course-syllabus/course-syllabus.dialog.component';
import { BaseModel } from '../../../shared/models/base.model';


@Component({
    moduleId: module.id,
    selector: 'lms-course-list',
    templateUrl: 'course-list.component.html',
    styleUrls: ['course-list.component.css'],
})

export class CourseListComponent extends BaseComponent implements OnInit {

    CONTENT_STATUS = CONTENT_STATUS;
    COURSE_MODE = COURSE_MODE;

    private courses: Course[];
    private currentUser: User;
    private courseMembers: CourseMember[];
    private reportUtils: ReportUtils;
<<<<<<< HEAD

=======
    COURSE_STATUS = COURSE_STATUS;
    COURSE_MODE = COURSE_MODE;
>>>>>>> add button backup and restore
    @ViewChild(CourseSyllabusDialog) syllabusDialog: CourseSyllabusDialog;

    constructor(private router: Router) {
        super();
        this.reportUtils = new ReportUtils();
    }

    ngOnInit() {
        this.currentUser = this.authService.UserProfile;
        BaseModel.bulk_search(this,
            CourseMember.__api__listByUser(this.currentUser.id),
            Course.__api__listByAuthor(this.currentUser.id))
            .subscribe(jsonArray => {
                this.courseMembers = CourseMember.toArray(jsonArray[0]);
                this.courses = Course.toArray(jsonArray[3]);
                this.displayCourses();
            });
    }

<<<<<<< HEAD
    displayCourses() {
        this.courseMembers = _.filter(this.courseMembers, (member: CourseMember) => {
            return member.course_id && (member.course_mode == 'self-study' || member.class_id) && member.status == 'active';
        });
        CourseMember.populateCourses(this, this.courseMembers).subscribe((courses) => {
            this.courses = this.courses.concat(courses);
            this.courses = _.uniq(courses, (course) => {
                return course.id;
            });
            this.courses.sort((course1:Course, course2:Course): any => {
                return (course1.create_date.getTime() - course2.create_date.getTime());
            });
            var apiList = _.map(this.courses, (course: Course) => {
                return CourseSyllabus.__api__byCourse(course.id);
            });
            BaseModel.bulk_search(this, ...apiList)
                .map(jsonArr => {
                    return _.flatten(jsonArr);
                })
                .subscribe(jsonArr => {
                    var syllabi = CourseSyllabus.toArray(jsonArr);
                    _.each(this.courses, (course: Course) => {
                        course["student"] = _.find(this.courseMembers, (member: CourseMember) => {
                            return member.course_id == course.id && member.role == 'student';
                        });
                        course["teacher"] = _.find(this.courseMembers, (member: CourseMember) => {
                            return member.course_id == course.id && member.role == 'teacher';
                        });
                        course["isAuthor"] = course.author_id == this.currentUser.id;
                        course["courseMemberData"] = {};
                        course["syllabus"] = _.find(syllabi, (syl: CourseSyllabus) => {
                            return syl.course_id == course.id;
                        });
                    });
                    var searchApiList = [];
                    for (var i = 0; i < this.courses.length; i++) {
                        searchApiList.push(CourseMember.__api__listByCourse(this.courses[i].id))
                    }
                    BaseModel.bulk_search(this, ...searchApiList).subscribe(jsonArr => {
                        for (var i = 0; i < this.courses.length; i++) {
                            var members = CourseMember.toArray(jsonArr[i]);
                            this.courses[i]["courseMemberData"] = this.reportUtils.analyseCourseMember(this.courses[i], members);
                        };
                    });
                    var countApiList = [];
                    for (var i = 0; i < this.courses.length; i++) {
                        countApiList.push(CourseUnit.__api__countBySyllabus(this.courses[i]["syllabus"].id))
                    }
                    BaseModel.bulk_count(this, ...countApiList)
                        .map(countArr => {
                            return _.flatten(countArr);
                        })
                        .subscribe(counts => {
                            for (var i = 0; i < this.courses.length; i++) {
                                this.courses[i]["unit_count"] = counts[i];
                            };
                        });
                })
=======
    loadCourses() {
        this.startTransaction();
        CourseMember.listByUser(this, this.currentUser.id).subscribe(members => {
            members = _.filter(members, (member => {
                return member.course_id && (member.course_mode == 'self-study' || member.class_id) && member.status == 'active'
            }));
            var courseIds = _.pluck(members, 'course_id');
            Observable.zip(Course.array(this, courseIds), Course.listByAuthor(this, this.currentUser.id))
                .map(courses => {
                    var courstList = _.flatten(courses);
                    return _.uniq(courstList, (course) => {
                        return course.id;
                    });
                })
                .subscribe(courses => {
                    this.courses = courses;
                    _.each(this.courses, (course) => {
                        course["courseMemberData"] = {};
                        CourseMember.listByCourse(this, course.id).subscribe(members => {
                            course["courseMemberData"] = this.reportUtils.analyseCourseMember(course, members);
                        });
                        if (course.syllabus_id)
                            CourseUnit.countBySyllabus(this, course.syllabus_id).subscribe(count => {
                                course["unit_count"] = count;
                            });
                        else
                            course["unit_count"] = 0;
                        course["member"] = _.find(members, (member: CourseMember) => {
                            return member.course_id == course.id;
                        });
                    });
                    this.courses.sort((course1, course2): any => {
                        if (course1.create_date > course2.create_date)
                            return -1;
                        else if (course1.create_date < course2.create_date)
                            return 1;
                        else
                            return 0;
                    });
                    this.closeTransaction();
                });
        });
    }

    getCourseSyllabus(course: Course): Observable<any> {
        return CourseSyllabus.byCourse(this, course.id).flatMap((syllabus: CourseSyllabus) => {
            if (syllabus)
                return Observable.of(syllabus);
            else {
                var syllabus = new CourseSyllabus();
                syllabus.course_id = course.id;
                syllabus.name = course.name;
                return syllabus.save(this);
            }
>>>>>>> add button backup and restore
        });
    }

    editSyllabus(course: Course) {
<<<<<<< HEAD
        CourseSyllabus.byCourse(this, course.id).subscribe(syllabus => {
=======
        this.startTransaction();
        this.getCourseSyllabus(course).subscribe(syllabus => {
>>>>>>> add button backup and restore
            this.syllabusDialog.show(syllabus);
        });
    }

    studyCourse(course: Course, member: CourseMember) {
        if (course.status == 'published') {
<<<<<<< HEAD
=======
            this.startTransaction();
>>>>>>> add button backup and restore
            CourseSyllabus.byCourse(this, course.id).subscribe(syl => {
                if (syl && syl.status == 'published')
                    this.router.navigate(['/lms/courses/study', course.id, member.id]);
                else
                    this.error('The course has not been published');
            });
        }
        else {
            this.error('The course has not been published');
        }
    }

    manageCourse(course: Course, member: CourseMember) {
        if (course.status == 'published') {
<<<<<<< HEAD
=======
            this.startTransaction();
>>>>>>> add button backup and restore
            CourseSyllabus.byCourse(this, course.id).subscribe(syl => {
                if (syl && syl.status == 'published')
                    this.router.navigate(['/lms/courses/manage', course.id]);
                else
                    this.error('The course has not been published');
            });
        }
        else {
            this.error('The course has not been published');
        }

<<<<<<< HEAD
=======
    }

    backupCourse(course: Course) {
        console.log('course:', course);
    }

    restoreCourse(course: Course) {
        console.log('course:', course);
>>>>>>> add button backup and restore
    }
}