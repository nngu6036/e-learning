import { NgModule } from '@angular/core';
import { AuthModule } from '../auth/auth.module';
import { ErpSharedModule } from '../shared/shared.module';
import { CourseComponent } from './course.component'
import { ByCoursePipe } from './course.pipe';
import { ByClassPipe } from './class.pipe';
import { ClassListDialog } from './enrollment/class-list/class-list-dialog.component';
import { CourseClassDialog } from './enrollment/class-dialog/class-dialog.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { CourseDialog } from './course/course-dialog/course-dialog.component';
import { CourseEnrollDialog } from './enrollment/enrollment-dialog/enrollment-dialog.component';
import { CourseEnrollmentListComponent } from './enrollment/course-list/course-list.component';
import { CourseRoutingModule } from './course-routing';

@NgModule({
	imports: [
		CourseRoutingModule,
		ErpSharedModule,
		AuthModule
	],
	declarations: [
		CourseComponent,
		CourseClassDialog,
		ClassListDialog,
		ByCoursePipe,
		ByClassPipe,
		CourseListComponent,
		CourseDialog,
		CourseEnrollDialog,
		CourseEnrollmentListComponent
	],
	exports: [
		CourseDialog,
		CourseClassDialog
	],
	providers: []
})
export class CourseModule {
}
