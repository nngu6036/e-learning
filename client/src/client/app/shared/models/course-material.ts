import { GROUP_CATEGORY} from './constants';
import { BaseModel } from './base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model } from './decorator';
import { APIContext } from './context';

@Model('etraining.course_material')
export class CourseMaterial extends BaseModel{

    // Default constructor will be called by mapper
    constructor(){
        super();
		
		this.name = undefined;
		this.syllabus_id = undefined;
        this.attachment_id = undefined;
		this.filename = undefined;
        this.type = undefined;
        this.url = undefined;
    }
    
    name:string;
    syllabus_id: number;
    attachment_id: number;
    filename:string;
    type:string;
    url:string;
}
