import { GROUP_CATEGORY} from './constants';
import { BaseModel } from './base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model } from './decorator';
import { APIContext } from './context';

@Model('etraining.user_log')
export class UserLog extends BaseModel{

    constructor(){
        super();
        
        this.user_id = undefined;
        this.res_id = undefined;
        this.res_model = undefined;
        this.note = undefined;
        this.end = undefined;
        this.start = undefined;
        this.attachment_url = undefined;
        this.attachment_id = undefined;
    }

    res_id: number;
    user_id: number;
    res_model: string;
    note: string;
    end: Date;
    start: Date;
    attachment_url: string;
    attachment_id: number;

    static userStudyActivity(context:APIContext, userId, courseId):Observable<any> {
        var domain = "";
        if (courseId)
            domain = "[('user_id','=',"+userId+"),('res_id','=',"+courseId+"),('res_model','=','etraining.course')]";
        else
            domain = "[('user_id','=',"+userId+"),('res_model','=','etraining.course')]"
        return UserLog.search(context,[], domain );
    }

    static userExamActivity(context:APIContext, userId, examId):Observable<any> {
        var domain = "";
        if (examId)
            domain = "[('user_id','=',"+userId+"),('res_id','=',"+examId+"),('res_model','=','etraining.exam')]";
        else
            domain = "[('user_id','=',"+userId+"),('res_model','=','etraining.exam')]"
        return UserLog.search(context,[], domain );
    }

    static courseActivity(context:APIContext, courseId):Observable<any> {
        return UserLog.search(context,[], "[('res_id','=',"+courseId+"),('res_model','=','etraining.course')]" );
    }


}
