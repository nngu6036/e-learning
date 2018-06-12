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
var base_dialog_1 = require("../../../shared/components/base/base.dialog");
var CourseFaqDialog = (function (_super) {
    __extends(CourseFaqDialog, _super);
    function CourseFaqDialog() {
        return _super.call(this) || this;
    }
    CourseFaqDialog.prototype.ngOnInit = function () {
    };
    CourseFaqDialog = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'course-faq-dialog',
            templateUrl: 'course-faq.dialog.component.html',
        }),
        __metadata("design:paramtypes", [])
    ], CourseFaqDialog);
    return CourseFaqDialog;
}(base_dialog_1.BaseDialog));
exports.CourseFaqDialog = CourseFaqDialog;
//# sourceMappingURL=course-faq.dialog.component.js.map