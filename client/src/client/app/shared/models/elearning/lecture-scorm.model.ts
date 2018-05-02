
import { BaseModel } from '../base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model } from '../decorator';
import { APIContext } from '../context';

@Model('etraining.scorm_lecture')
export class SCORMLecture extends BaseModel{

    // Default constructor will be called by mapper
    constructor(){
        super();
        
        this.base_url = undefined;
        this.entry_file = undefined;
        this.unit_id = undefined;
        this.package_url = undefined;
    }

    entry_file: string;
    base_url: string;
    package_url: string;
    unit_id: number;


    static byCourseUnit(context:APIContext, unitId: number):Observable<any> {
        return SCORMLecture.search(context,[],"[('unit_id','=',"+unitId+")]")
        .map(lectures => {
            if (lectures.length)
                return lectures[0];
            else
                return null;
        });
    }
}
