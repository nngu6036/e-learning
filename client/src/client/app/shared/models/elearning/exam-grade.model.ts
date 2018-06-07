import { BaseModel } from '../base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model } from '../decorator';
import { APIContext } from '../context';
import { ExamGradeCache } from '../../services/cache.service';

@Model('etraining.exam_grade')
export class ExamGrade extends BaseModel {

    // Default constructor will be called by mapper
    constructor() {
        super();

        this.name = undefined;
        this.min_score = undefined;
        this.max_score = undefined;
    }

    name: string;
    exam_id: number;
    min_score: number;
    max_score: number;

    static all(context: APIContext): Observable<any[]> {
        return ExamGradeCache.all(context);
    }

    static listByExam(context: APIContext, examId: number): Observable<any[]> {
        return ExamGrade.search(context, [], "[('exam_id','='," + examId + ")]");
    }
}
