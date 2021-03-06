import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Config } from '../../env.config';
import 'rxjs/add/operator/map';
import { Observable, Subject } from 'rxjs/Rx';
import { ModelAPIService } from './api/model-api.service';
import { ExecuteAPI } from '../services/api/execute.api';
import { APIContext } from '../models/context';

@Injectable()
export class NotificationService {
    constructor(private apiService: ModelAPIService) { }


    broadcast(context: APIContext, subject: string, body:string, recipients:string) : Observable<any> {
        var params = {subject: subject, body: body, recipients: recipients};
        var executeApi = new ExecuteAPI('etraining.notification_service','broadcastMail', params, null)
        return this.apiService.execute(executeApi,context.authService.LoginToken);
    }  


}
