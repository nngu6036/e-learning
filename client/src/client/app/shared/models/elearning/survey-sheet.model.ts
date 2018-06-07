import { BaseModel } from '../base.model';
import { Observable, Subject } from 'rxjs/Rx';
import { Model,FieldProperty } from '../decorator';
import { APIContext } from '../context';

@Model('etraining.survey_sheet')
export class SurveySheet extends BaseModel{

    // Default constructor will be called by mapper
    constructor(){
        super();
		
        this.survey_id = undefined;
        this.name = undefined;
        this.seed = undefined;
        this.finalized = undefined;
	}
    survey_id: number;
    name: string;
    seed:number;
    finalized:boolean;

    clone() {
        var sheet = new SurveySheet();
        sheet.name =  this.name;
        sheet.seed =  this.seed;
        sheet.finalized =  this.finalized;
        return sheet;
    }

    static bySurvey( context:APIContext, surveyId: number): Observable<any> {
        return SurveySheet.search(context,[],"[('survey_id','=',"+surveyId+")]").map(sheets =>{
            return sheets.length ? sheets[0]: null;
        });
    }

    static listTemplate( context:APIContext): Observable<any> {
        return SurveySheet.search(context,[],"[('survey_id','=',False)]");
    }
}
