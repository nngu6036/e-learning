import { BaseModel } from '../base.model';
import { Submission } from './submission.model';
import { Conference } from './conference.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model,FieldProperty } from '../decorator';
import { APIContext } from '../context';
import { SearchReadAPI } from '../../services/api/search-read.api';
import { Cache } from '../../helpers/cache.utils';
import { DeleteAPI } from '../../services/api/delete.api';
import { BulkDeleteAPI } from '../../services/api/bulk-delete.api';
import { ListAPI } from '../../services/api/list.api';
import { BulkListAPI } from '../../services/api/bulk-list.api';
import * as _ from 'underscore';

@Model('etraining.conference_member')
export class ConferenceMember extends BaseModel{

    constructor(){
        super();
        this.course_member_id = undefined;
        this.email = undefined;
        this.phone = undefined;
        this.name = undefined;
        this.user_id = undefined;
        this.conference_id = undefined;
        this.room_member_ref = undefined;
        this.group_id = undefined;
        this.group_id__DESC__ = undefined;
        this.is_active =  undefined;
        this.class_id = undefined;
        this.conference_status = undefined;
        this.conference =  new Conference();
    }

    course_member_id: number;
    email: string;
    phone: string;
    name: string;
    group_name: string;
    room_member_ref:string;
    is_active: boolean;
    class_id: number;
    group_id: number;
    user_id: number;
    conference_id: number;
    conference: Conference;
    conference_status: string;
    group_id__DESC__: string;


}