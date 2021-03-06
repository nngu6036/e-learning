import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModelAPIService } from '../services/api/model-api.service';
import { APIContext } from '../models/context';
import { CourseMember } from '../models/elearning/course-member.model';
import * as _ from 'underscore';
import { LMSProfileService } from '../services/lms-profile.service';

@Injectable()
export class CourseGuard implements CanActivate, APIContext {

	apiService: ModelAPIService;
	authService: AuthService;

	constructor(apiService: ModelAPIService, authService: AuthService, private lmsService: LMSProfileService, private router: Router) {
		this.apiService =  apiService;
		this.authService = authService;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		var courseId = route.params.courseId;
		var memberId = route.params.memberId;
		if (!courseId || !memberId)
			return Observable.of(false);
		return this.lmsService.init(this)
		.map(()=> {
			var member = this.lmsService.courseMemberById(memberId);
            return member != null && ( member.role == 'teacher' ||  member.role == 'supervisor' );
        }).catch(() => {
            return Observable.of(false);
        });
	}
}