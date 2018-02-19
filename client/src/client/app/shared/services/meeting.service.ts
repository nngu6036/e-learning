import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Config } from '../../env.config';
import 'rxjs/add/operator/map';
import { WindowRef } from '../helpers/windonw.ref';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class MeetingService {

    nativeWindow: any;

    constructor(private winRef: WindowRef) {
         this.nativeWindow = winRef.getNativeWindow();
    }

    join(room_ref:string, member_ref: string):Observable<any> {
        this.nativeWindow.open(`${Config.CONFERENCE_ENDPOINT}?room=${room_ref}&member=${member_ref}`);
    }

   
}
