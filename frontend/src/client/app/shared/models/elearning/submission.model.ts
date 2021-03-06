
import { BaseModel } from '../base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model, FieldProperty, ReadOnlyProperty } from '../decorator';
import { APIContext } from '../context';
import { SearchReadAPI } from '../../services/api/search-read.api';
import { ListAPI } from '../../services/api/list.api';
import { Answer } from './answer.model';

@Model('etraining.submission')
export class Submission extends BaseModel{

    // Default constructor will be called by mapper
    constructor(){
        super();
		this.picture = undefined;
        this.user_id = undefined;
        this.member_id = undefined;
        this.exam_id = undefined;
        this.end = undefined;
        this.start = undefined;
        this.score = undefined;
        this.answer_ids = [];
    }
    
    exam_id: number;
    user_id: number;
    member_id: number;
    picture: string;
    @FieldProperty<Date>()
    end: Date;
    @FieldProperty<Date>()
    start: Date;
    score: number;
    @ReadOnlyProperty()
    answer_ids: number[];
    

    static __api__listAnswers(answer_ids: number[],fields?:string[]): ListAPI {
        return new ListAPI(Answer.Model, answer_ids,fields);
    }

    listAnswers( context:APIContext,fields?:string[]): Observable<any[]> {
        return Answer.array(context,this.answer_ids,fields);
    }

}
