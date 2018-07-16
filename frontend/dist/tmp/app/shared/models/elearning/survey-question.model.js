"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var search_read_api_1 = require("../../services/api/search-read.api");
var base_model_1 = require("../base.model");
var Rx_1 = require("rxjs/Rx");
var decorator_1 = require("../decorator");
var search_count_api_1 = require("../../services/api/search-count.api");
var list_api_1 = require("../../services/api/list.api");
var question_model_1 = require("./question.model");
var _ = require("underscore");
var SurveyQuestion = (function (_super) {
    __extends(SurveyQuestion, _super);
    function SurveyQuestion() {
        var _this = _super.call(this) || this;
        _this.title = undefined;
        _this.question = new question_model_1.Question();
        _this.content = undefined;
        _this.type = undefined;
        _this.group_id = undefined;
        _this.question_id = undefined;
        _this.survey_id = undefined;
        _this.sheet_id = undefined;
        _this.order = undefined;
        _this.group_id__DESC__ = undefined;
        return _this;
    }
    SurveyQuestion_1 = SurveyQuestion;
    SurveyQuestion.prototype.clone = function () {
        var question = new SurveyQuestion_1();
        question.question_id = this.question_id;
        question.order = this.order;
        question.title = this.title;
        question.content = this.content;
        question.type = this.type;
        question.group_id = this.group_id;
        question.group_id__DESC__ = this.group_id__DESC__;
        return question;
    };
    SurveyQuestion.__api__listBySheet = function (sheetId) {
        return new search_read_api_1.SearchReadAPI(SurveyQuestion_1.Model, [], "[('sheet_id','='," + sheetId + ")]");
    };
    SurveyQuestion.__api__countBySheet = function (sheetId) {
        return new search_count_api_1.SearchCountAPI(SurveyQuestion_1.Model, "[('sheet_id','='," + sheetId + ")]");
    };
    SurveyQuestion.__api__countBySurvey = function (surveyId) {
        return new search_count_api_1.SearchCountAPI(SurveyQuestion_1.Model, "[('survey_id','='," + surveyId + ")]");
    };
    SurveyQuestion.countBySurvey = function (context, surveyId) {
        return SurveyQuestion_1.count(context, "[('survey_id','='," + surveyId + ")]");
    };
    SurveyQuestion.__api__byQuestion = function (questionId) {
        return new search_read_api_1.SearchReadAPI(SurveyQuestion_1.Model, [], "[('question_id','='," + questionId + ")]");
    };
    SurveyQuestion.listBySheet = function (context, sheetId) {
        return SurveyQuestion_1.search(context, [], "[('sheet_id','='," + sheetId + ")]");
    };
    SurveyQuestion.countBySheet = function (context, sheetId) {
        return SurveyQuestion_1.count(context, "[('sheet_id','='," + sheetId + ")]");
    };
    SurveyQuestion.prototype.__api__populateQuestion = function () {
        return new list_api_1.ListAPI(question_model_1.Question.Model, [this.question_id], []);
    };
    SurveyQuestion.prototype.populateQuestion = function (context) {
        var _this = this;
        if (!this.question_id)
            return Rx_1.Observable.of(null);
        return question_model_1.Question.get(context, this.question_id).do(function (question) {
            _this.question = question;
        });
    };
    SurveyQuestion.populateQuestions = function (context, surveyQuestions) {
        var questionIds = _.pluck(surveyQuestions, 'question_id');
        questionIds = _.filter(questionIds, function (id) {
            return id;
        });
        return question_model_1.Question.array(context, questionIds).do(function (questions) {
            _.each(surveyQuestions, function (surveyQuestion) {
                surveyQuestion.question = _.find(questions, function (question) {
                    return surveyQuestion.question_id == question.id;
                });
            });
        });
    };
    var SurveyQuestion_1;
    SurveyQuestion = SurveyQuestion_1 = __decorate([
        decorator_1.Model('etraining.survey_question'),
        __metadata("design:paramtypes", [])
    ], SurveyQuestion);
    return SurveyQuestion;
}(base_model_1.BaseModel));
exports.SurveyQuestion = SurveyQuestion;