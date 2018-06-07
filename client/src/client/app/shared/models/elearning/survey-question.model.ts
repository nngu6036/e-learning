
import { BaseModel } from '../base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model } from '../decorator';
import { APIContext } from '../context';

@Model('etraining.survey_question')
export class SurveyQuestion extends BaseModel{

    // Default constructor will be called by mapper
    constructor(){
        super();
		
		this.title = undefined;
		this.content = undefined;
		this.type = undefined;
        this.group_id = undefined;
        this.question_id = undefined;
        this.survey_id = undefined;
        this.sheet_id = undefined;
        this.order = undefined;
        this.group_id__DESC__ = undefined;
	}

    question_id: number;
    survey_id: number;
    sheet_id: number;
    order: number;
    title:string;
    content: string;
    type: string;
    group_id: number;
    group_id__DESC__: string;

    clone() {
        var question = new SurveyQuestion();
        question.question_id =  this.question_id;
        question.order =  this.order;
        question.title =  this.title;
        question.content =  this.content;
        question.type =  this.type;
        question.group_id =  this.group_id;
        question.group_id__DESC__ =  this.group_id__DESC__;
        return question;
    }


    static listBySheet( context:APIContext, sheetId: number): Observable<any[]> {
        return SurveyQuestion.search(context,[],"[('sheet_id','=',"+sheetId+")]");
    }

    static countBySurvey( context:APIContext, surveyId: number): Observable<any[]> {
        return SurveyQuestion.count(context,"[('survey_id','=',"+surveyId+")]");
    }

    static countBySheet( context:APIContext, sheetId: number): Observable<any> {
        return SurveyQuestion.count(context,"[('sheet_id','=',"+sheetId+")]");
    }

    static byQuestion( context:APIContext, questionId: number): Observable<any[]> {
        return SurveyQuestion.search(context,[],"[('question_id','=',"+questionId+")]").map(questions =>{
            return questions.length ? questions[0]: null;
        });
    }

}
