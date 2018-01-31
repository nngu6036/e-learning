import { GROUP_CATEGORY} from './constants';
import { BaseModel } from './base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model } from './decorator';
import { APIContext } from './context';

@Model('etraining.certificate')
export class Certificate extends BaseModel{

    // Default constructor will be called by mapper
    constructor(){
        super();
		
		this.name = undefined;
		this.course_id = undefined;
        this.member_id = undefined;
        this.date_issue = undefined;
        this.attachment_id = undefined;
        this.url = undefined;
    }
    
    name:string;
    course_id: number;
    member_id: number;
    date_issue:Date;
    attachment_id: number;
    url:string;
}
