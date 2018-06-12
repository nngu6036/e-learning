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
var tree_utils_1 = require("../../../shared/helpers/tree.utils");
var SelectCompetencyDialog = (function (_super) {
    __extends(SelectCompetencyDialog, _super);
    function SelectCompetencyDialog() {
        var _this = _super.call(this) || this;
        _this.onSelectCompetencyReceiver = new Rx_1.Subject();
        _this.onSelectCompetency = _this.onSelectCompetencyReceiver.asObservable();
        _this.display = false;
        _this.competencies = [];
        _this.treeUtils = new tree_utils_1.TreeUtils();
        return _this;
    }
    SelectCompetencyDialog.prototype.hide = function () {
        this.display = false;
    };
    SelectCompetencyDialog.prototype.nodeSelect = function (event) {
        var _this = this;
        if (this.selectedNode) {
            competency_model_1.Competency.listByGroup(this, this.selectedNode.data.id).subscribe(function (competencies) {
                _this.competencies = competencies;
            });
        }
    };
    SelectCompetencyDialog.prototype.show = function () {
        var _this = this;
        this.display = true;
        group_model_1.Group.listCompetencyGroup(this).subscribe(function (groups) {
            _this.tree = _this.treeUtils.buildGroupTree(groups);
        });
    };
    SelectCompetencyDialog.prototype.selectCompetency = function () {
        this.onSelectCompetencyReceiver.next(this.selectedCompetency);
        this.hide();
    };
    SelectCompetencyDialog = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'select-competency-dialog',
            templateUrl: 'select-competency-dialog.component.html',
            styleUrls: ['select-competency-dialog.component.css'],
        }),
        __metadata("design:paramtypes", [])
    ], SelectCompetencyDialog);
    return SelectCompetencyDialog;
}(base_component_1.BaseComponent));
exports.SelectCompetencyDialog = SelectCompetencyDialog;
//# sourceMappingURL=select-competency-dialog.component.js.map