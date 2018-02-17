import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { LMSComponent } from './lms.component';
import { ExamListComponent} from './exam/exam-list/exam-list.component';
import { CourseListComponent} from './course/course-list/course-list.component';
import { CourseStudyComponent} from './course/course-study/course-study.component';
import { CourseManageComponent} from './course/course-manage/course-manage.component';

export const LMSRoutes: Routes = [
    {
       path: "lms",
       component: LMSComponent,
       data: {
         breadcrumb:'LMS'
       },
       children:
       [
           {
               path: "exams",
               component: ExamListComponent,
               data: {
                 breadcrumb:'My exams'
               }
            },
            {
               path: "courses",
               component: CourseListComponent,
               data: {
                 breadcrumb:'My courses'
               }
            },
            {
               path: "course/study/:courseId",
               component: CourseStudyComponent,
               data: {
                 breadcrumb:'Study'
               }
            },
       ]
    }

]
