import { BaseModel } from '../base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model,FieldProperty, ReadOnlyProperty } from '../decorator';
import { APIContext } from '../context';
import { SearchReadAPI } from '../../services/api/search-read.api';

import { ListAPI } from '../../services/api/list.api';
import { ExamQuestion } from './exam-question.model';

@Model('etraining.question_sheet')
export class QuestionSheet extends BaseModel{

    // Default constructor will be called by mapper
    constructor(){
        super();
		
        this.exam_id = undefined;
        this.exercise_id = undefined;
        this.seed = undefined;
        this.finalized = undefined;
        this.name = undefined;
        this.status =  undefined;
        this.question_count =  undefined;
        this.question_ids = [];
	}

    name: string;
    question_count: number;
    exam_id: number;
    exercise_id: number;
    seed:number;
    finalized:boolean;
    status: string;
    @ReadOnlyProperty()
    question_ids: number[];

    
    clone():QuestionSheet {
        var sheet = new QuestionSheet();
        sheet.name = this.name;
        sheet.exam_id = this.exam_id;
        sheet.exercise_id = this.exercise_id;
        sheet.finalized = this.finalized;
        sheet.seed = this.seed;
        return sheet;
    }
    
    static __api__listTemplate(fields?:string[]): SearchReadAPI {
        return new SearchReadAPI(QuestionSheet.Model, fields,"[('exam_id','=',False)]");
    }

    static listTemplate( context:APIContext,fields?:string[]): Observable<any> {
        return QuestionSheet.search(context,fields,"[('exam_id','=',False)]");
    }

    static __api__listQuestions(question_ids: number[],fields?:string[]): ListAPI {
        return new ListAPI(ExamQuestion.Model, question_ids,fields);
    }

    listQuestions( context:APIContext,fields?:string[]): Observable<any[]> {
        return ExamQuestion.array(context,this.question_ids,fields);
    }
}
