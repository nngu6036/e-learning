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
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var group_model_1 = require("../../models/elearning/group.model");
var base_component_1 = require("../base/base.component");
var competency_model_1 = require("../../../shared/models/elearning/competency.model");
var _ = require("underscore");
var tree_utils_1 = require("../../../shared/helpers/tree.utils");
var competency_level_model_1 = require("../../../shared/models/elearning/competency-level.model");
var SelectCompetencyLevelDialog = (function (_super) {
    __extends(SelectCompetencyLevelDialog, _super);
    function SelectCompetencyLevelDialog() {
        var _this = _super.call(this) || this;
        _this.onSelectCompetencyLevelReceiver = new Rx_1.Subject();
        _this.onSelectCompetencyLevel = _this.onSelectCompetencyLevelReceiver.asObservable();
        _this.display = false;
        _this.levels = [];
        _this.displayLevels = [];
        _this.treeUtils = new tree_utils_1.TreeUtils();
        return _this;
    }
    SelectCompetencyLevelDialog.prototype.hide = function () {
        this.display = false;
    };
    SelectCompetencyLevelDialog.prototype.nodeSelect = function (event) {
        var _this = this;
        if (this.selectedNode) {
            this.displayLevels = [];
            competency_model_1.Competency.listByGroup(this, this.selectedNode.data.id).subscribe(function (competencies) {
                _.each(competencies, function (competency) {
                    var levels = _.filter(_this.levels, function (level) {
                        return level.competency_id == competency.id;
                    });
                    _this.displayLevels = _this.displayLevels.concat(levels);
                });
            });
        }
    };
    SelectCompetencyLevelDialog.prototype.show = function () {
        var _this = this;
        this.display = true;
        group_model_1.Group.listCompetencyGroup(this).subscribe(function (groups) {
            _this.tree = _this.treeUtils.buildGroupTree(groups);
            competency_level_model_1.CompetencyLevel.all(_this).subscribe(function (levels) {
                _this.levels = levels;
            });
        });
    };
    SelectCompetencyLevelDialog.prototype.selectLevel = function () {
        this.onSelectCompetencyLevelReceiver.next(this.selectedLevel);
        this.hide();
    };
    SelectCompetencyLevelDialog = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'select-competency-level-dialog',
            template: "<p-dialog header=\"{{'Select competency level'|translate}}\" [positionTop]=\"50\" [(visible)]=\"display\" modal=\"true\" width=\"800\" height=\"100%\" [responsive]=\"true\" appendTo=\"body\">   <div class=\"spinner\" [hidden]=\"!loading\"></div>   <div class=\"ui-g ui-fluid form-group\">     <div class=\"ui-g-5\">       <p-tree [value]=\"tree\" selectionMode=\"single\" (onNodeSelect)=\"nodeSelect($event)\" [(selection)]=\"selectedNode\" ></p-tree>     </div>     <div class=\"ui-g-7\">       <p-table  [value]=\"displayLevels\" [(selection)]=\"selectedLevel\" >         <ng-template pTemplate=\"header\" >           <tr>             <th style=\"width: 2.25em\">             </th>             <th>               {{'Competency'|translate}}             </th>              <th>               {{'Level'|translate}}             </th>           </tr>         </ng-template>         <ng-template pTemplate=\"body\" let-rowData>           <tr [pSelectableRow]=\"rowData\">             <td>               <p-tableRadioButton [value]=\"rowData\"></p-tableRadioButton>             </td>             <td >               {{rowData.competency_name}}             </td>             <td >               {{rowData.name}}             </td>           </tr>         </ng-template>       </p-table>     </div>   </div>   <p-footer>     <button type=\"button\" [disabled]=\"!selectedLevel\" pButton icon=\"fa-check\" label=\"{{'OK'|translate}}\" (click)=\"selectLevel()\"></button>     <button type=\"button\" pButton icon=\"fa-close\" (click)=\"hide()\" label=\"{{'Close'|translate}}\"></button>   </p-footer> </p-dialog>",
            styles: [".form-group{max-height:450px}"],
        }),
        __metadata("design:paramtypes", [])
    ], SelectCompetencyLevelDialog);
    return SelectCompetencyLevelDialog;
}(base_component_1.BaseComponent));
exports.SelectCompetencyLevelDialog = SelectCompetencyLevelDialog;