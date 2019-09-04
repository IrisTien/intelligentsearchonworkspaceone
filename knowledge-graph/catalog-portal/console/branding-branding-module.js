(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["branding-branding-module"],{

/***/ "./src/app/branding/branding-routing.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/branding/branding-routing.module.ts ***!
  \*****************************************************/
/*! exports provided: BrandingRoutingModule, RoutedComponents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrandingRoutingModule", function() { return BrandingRoutingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoutedComponents", function() { return RoutedComponents; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _branding_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./branding.component */ "./src/app/branding/branding.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    { path: '', component: _branding_component__WEBPACK_IMPORTED_MODULE_2__["BrandingComponent"] }
];
var BrandingRoutingModule = /** @class */ (function () {
    function BrandingRoutingModule() {
    }
    BrandingRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        })
    ], BrandingRoutingModule);
    return BrandingRoutingModule;
}());

var RoutedComponents = [_branding_component__WEBPACK_IMPORTED_MODULE_2__["BrandingComponent"]];


/***/ }),

/***/ "./src/app/branding/branding.component.html":
/*!**************************************************!*\
  !*** ./src/app/branding/branding.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"section-header\">\n  <h2 [innerHTML]=\"'nav.label.branding' | translate\"></h2>\n  <p [innerHTML]=\"'desc.branding' | translate\"></p>\n</section>\n\n<div class=\"clr-row no-margin content-scrollable flex-no-wrap\">\n  <section class=\"col-md-6 left-branding-nav\">\n    <form [formGroup]=\"brandingForm\">\n      <section class=\"form-block\">\n        <div class=\"form-group\">\n          <label [innerHTML]=\"'branding.form.label.logo' | translate\"></label>\n          <app-file-upload [branding]=\"brandingForm.value\" [isIcon]=\"false\" (ImageUpload)=\"onLogoUpload($event)\"></app-file-upload>\n        </div>\n        <!--<div class=\"form-group\">-->\n          <!--<label [innerHTML]=\"'branding.form.label.welcome.text' | translate\"></label>-->\n          <!--<textarea class=\"welcome-field\" formControlName=\"welcomeText\"></textarea>-->\n        <!--</div>-->\n        <h5 [innerHTML]=\"'branding.navigation.bar' | translate\"></h5>\n        <div class=\"form-group\" [formGroup]=\"brandingForm['controls'].navigationBar\">\n          <label class=\"required\" [innerHTML]=\"'branding.form.label.background.color' | translate\"></label>\n          <input type=\"text\" class=\"text-field-inline\" formControlName=\"backgroundColor\" />\n          <div class=\"color-preview\" [ngStyle]=\"{'background-color' :\n          brandingForm.value.navigationBar.backgroundColor}\"></div>\n          <div *ngIf=\"hasRequired(brandingForm['controls'].navigationBar['controls'].backgroundColor)\" class=\"error\"\n          [innerHTML]=\"'field.required' | translate\"></div>\n          <div *ngIf=\"hasError(brandingForm['controls'].navigationBar['controls'].backgroundColor)\" class=\"error\"\n               [innerHTML]=\"'branding.color.field.invalid' | translate\"></div>\n        </div>\n        <!--<div class=\"form-group\" [formGroup]=\"brandingForm['controls'].navigationBar\">-->\n          <!--<label [innerHTML]=\"'branding.form.label.background.effect' | translate\"></label>-->\n          <!--<div class=\"toggle-switch\">-->\n            <!--<input type=\"checkbox\" id=\"background_effect\" formControlName=\"backgroundEffect\">-->\n            <!--<label for=\"background_effect\"></label>-->\n          <!--</div>-->\n        <!--</div>-->\n        <div class=\"form-group\" [formGroup]=\"brandingForm['controls'].navigationBar\">\n          <label [innerHTML]=\"'branding.form.label.type' | translate\"></label>\n          <div class=\"radio-inline black_color\">\n            <input type=\"radio\" id=\"black_color\" formControlName=\"typeAndIconColor\" value=\"#000000\">\n            <label for=\"black_color\" [innerHTML]=\"'branding.color.black' | translate\"></label>\n          </div>\n          <div class=\"radio-inline white_color\">\n            <input type=\"radio\" id=\"white_color\" formControlName=\"typeAndIconColor\" value=\"#FFFFFF\">\n            <label for=\"white_color\" [innerHTML]=\"'branding.color.white' | translate\"></label>\n          </div>\n        </div>\n        <!--<div class=\"form-group\">-->\n          <!--<label [innerHTML]=\"'branding.form.label.icon' | translate\"></label>-->\n          <!--<app-file-upload [branding]=\"brandingForm.value\" [isIcon]=\"true\" (ImageUpload)=\"onIconUpload($event)\"></app-file-upload>-->\n        <!--</div>-->\n        <h5 [innerHTML]=\"'branding.body' | translate\"></h5>\n        <div class=\"form-group\" [formGroup]=\"brandingForm['controls'].body\">\n          <label class=\"required\" [innerHTML]=\"'branding.form.label.interactive.color' | translate\"></label>\n          <input type=\"text\" class=\"text-field-inline\" formControlName=\"interactiveColor\" />\n          <div class=\"color-preview\" [ngStyle]=\"{'background-color' :\n          brandingForm.value.body.interactiveColor}\"></div>\n          <div *ngIf=\"hasRequired(brandingForm['controls'].body['controls'].interactiveColor)\" class=\"error\"\n               [innerHTML]=\"'field.required' | translate\"></div>\n          <div *ngIf=\"hasError(brandingForm['controls'].body['controls'].interactiveColor)\" class=\"error\"\n               [innerHTML]=\"'branding.color.field.invalid' | translate\"></div>\n        </div>\n        <div class=\"form-group\" [formGroup]=\"brandingForm['controls'].body\">\n          <label [innerHTML]=\"'branding.form.label.content' | translate\"></label>\n          <div class=\"toggle-switch advanced-branding-toggle\">\n            <input type=\"checkbox\" id=\"content_branding\" formControlName=\"defaultBodyBranding\">\n            <label for=\"content_branding\"></label>\n          </div>\n          <clr-tooltip class=\"advanced-branding-toggle\">\n            <clr-icon clrTooltipTrigger shape=\"info-circle\" size=\"24\"></clr-icon>\n            <clr-tooltip-content *clrIfOpen>\n              <span [innerHTML]=\"'branding.body.content' | translate\"></span>\n            </clr-tooltip-content>\n          </clr-tooltip>\n        </div>\n        <div class=\"form-group type-icon\" [formGroup]=\"brandingForm['controls'].body\" *ngIf=\"brandingForm.value.body.defaultBodyBranding\">\n          <label class=\"required\" [innerHTML]=\"'branding.form.label.background.color' | translate\"></label>\n          <input type=\"text\" class=\"text-field-inline\" formControlName=\"backgroundColor\" />\n          <div class=\"color-preview\" [ngStyle]=\"{'background-color' : brandingForm.value.body.backgroundColor}\"></div>\n          <div *ngIf=\"hasRequired(brandingForm['controls'].body['controls'].backgroundColor)\" class=\"error\"\n               [innerHTML]=\"'field.required' | translate\"></div>\n          <div *ngIf=\"hasError(brandingForm['controls'].body['controls'].backgroundColor)\" class=\"error\"\n               [innerHTML]=\"'branding.color.field.invalid' | translate\"></div>\n        </div>\n        <div class=\"form-group\" [formGroup]=\"brandingForm['controls'].body\" *ngIf=\"brandingForm.value.body.defaultBodyBranding\">\n          <label [innerHTML]=\"'branding.form.label.type' | translate\"></label>\n          <div class=\"radio-inline\">\n            <input type=\"radio\" id=\"type_black_color\" formControlName=\"typeAndIconColor\" value=\"#000000\">\n            <label for=\"type_black_color\" [innerHTML]=\"'branding.color.black' | translate\"></label>\n          </div>\n          <div class=\"radio-inline\">\n            <input type=\"radio\" id=\"type_white_color\" formControlName=\"typeAndIconColor\" value=\"#FFFFFF\">\n            <label for=\"type_white_color\" [innerHTML]=\"'branding.color.white' | translate\"></label>\n          </div>\n        </div>\n        <h5 [innerHTML]=\"'branding.bar' | translate\"></h5>\n        <div class=\"form-group\"[formGroup]=\"brandingForm['controls'].tabBar\">\n          <label [innerHTML]=\"'branding.form.label.type' | translate\"></label>\n          <div class=\"radio default_branding\">\n            <input type=\"radio\" id=\"default_branding\" formControlName=\"useNavigationBarTypeAndIconColor\" [value]=\"false\">\n            <label for=\"default_branding\" [innerHTML]=\"'branding.form.label.default.branding' | translate\"></label>\n          </div>\n          <div class=\"radio navigation_bar\">\n            <input type=\"radio\" id=\"navigation_bar\" formControlName=\"useNavigationBarTypeAndIconColor\" [value]=\"true\">\n            <label for=\"navigation_bar\" [innerHTML]=\"'branding.form.label.navigation.bar' | translate\"></label>\n          </div>\n        </div>\n        <div>\n          <button class=\"btn btn-primary\" [innerHTML]=\"'form.label.save' | translate\"\n                  [disabled]=\"brandingForm.invalid\" (click)=\"saveBranding()\"></button>\n          <button class=\"btn\" [innerHTML]=\"'form.label.reset' | translate\" (click)=\"resetBranding.open()\"></button>\n        </div>\n      </section>\n    </form>\n  </section>\n\n  <section class=\"col-md-6 right-branding-nav\">\n    <!--<app-branding-desktop-preview [branding]=\"brandingForm.value\"></app-branding-desktop-preview>-->\n    <app-branding-mobile-preview [branding]=\"brandingForm.value\"></app-branding-mobile-preview>\n  </section>\n</div>\n\n<app-branding-reset (resetSuccess)=\"resetSuccess($event)\" #resetBranding></app-branding-reset>\n"

/***/ }),

/***/ "./src/app/branding/branding.component.less":
/*!**************************************************!*\
  !*** ./src/app/branding/branding.component.less ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".hub-console h2,\n.hub-console p {\n  margin-top: 0;\n}\n.hub-console .content-container .content-area {\n  padding: 0;\n  position: relative;\n}\n.hub-console .section-header {\n  padding: 1rem;\n}\n.hub-console .content-scrollable {\n  padding: 0 1rem 1rem 1rem;\n}\n.hub-console .side-nav {\n  border-right: 1px solid #ccc;\n  background-color: #eee;\n}\n.hub-console form .text-field {\n  border-radius: 2px;\n  border: solid 1px #cccccc;\n}\n.hub-console form .text-field.error {\n  border: 1px solid #c92100;\n}\n.hub-console button:focus {\n  outline: none;\n}\n.text-align-center {\n  text-align: center;\n}\n.no-margin {\n  margin: 0;\n}\n.no-padding {\n  padding: 0;\n}\n.pull-right {\n  float: right;\n}\n.pull-left {\n  float: left;\n}\n.full-width {\n  width: 100%;\n}\n.border-grey {\n  border: solid 1px #cccccc;\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.display-inline-block {\n  display: inline-block;\n}\n.text-capitalize {\n  text-transform: uppercase;\n}\n.display-table {\n  display: table;\n}\n.display-table-cell {\n  display: table-cell;\n  vertical-align: middle;\n}\n.no-text-wrap {\n  word-break: break-word;\n  white-space: normal;\n  line-height: 1rem;\n}\n.error {\n  color: red;\n}\n.capsule {\n  background: #ffffff;\n  border-radius: 50px;\n}\n.header-capsule {\n  background: #ffffff;\n  border-radius: 50px;\n  display: inline-block;\n  width: 50px;\n  height: 20px;\n}\n.color-preview {\n  padding: 4px 6px;\n  height: 24px;\n  width: 24px;\n  margin-top: 5px;\n  border: solid 1px #cccccc;\n  border-radius: 2px;\n}\n.text-field-inline {\n  width: 215px;\n  height: 24px;\n  border-radius: 2px;\n  border: solid 1px #cccccc;\n}\n.welcome-field {\n  width: 270px;\n  height: 189px;\n  border-radius: 3px;\n  background-color: #ffffff;\n  border: solid 1px #cccccc;\n}\n.row-title {\n  border-radius: 5px;\n  width: 134px;\n  height: 80px;\n  border: solid 1px;\n  background: #0a658a;\n  padding: 15px;\n  margin: 0 5px 0 0;\n}\n.row-title .row-title-icon {\n  border-radius: 6px;\n  height: 50px;\n  background: white;\n  border: solid 1px #cccccc;\n}\n.row-title .app-list-item-content {\n  height: 25px;\n}\n.row-title .app-list-item-content .app-list-item-header {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n}\n.row-title .app-list-item-content .app-list-item-type {\n  border-radius: 50px;\n  width: 30px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n  margin-top: 3px;\n}\n.row-title .app-list-item-action {\n  border-radius: 2px;\n  height: 10px;\n  width: 50px;\n  background: white;\n  line-height: 7px;\n  text-align: center;\n}\n.row-title .app-list-item-action .app-list-item-type {\n  border-radius: 50px;\n  display: inline-block;\n  width: 25px;\n  height: 5px;\n  background: #0a658a;\n}\n.title-list {\n  margin: 15px 0 0 10px;\n}\n.title-list .title-list-icon {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #ffffff;\n  border: none;\n  float: left;\n}\n.title-list .title-list-content {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #0a658a;\n  border: none;\n  float: right;\n}\n.title-list .title-list-row {\n  margin: 0px;\n  width: 100%;\n  overflow: hidden;\n  flex-wrap: nowrap;\n}\n.title-list .title-list-row .tile-list {\n  margin: 5px 5px 0 0;\n}\n.title-list .title-list-row .icon {\n  border-radius: 6px;\n  width: 60px;\n  height: 60px;\n  background: white;\n  border: solid 1px;\n}\n.title-list .title-list-row .content {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #ffffff;\n  border: none;\n  margin-top: 5px;\n}\n.content-bar-title {\n  border-radius: 3px;\n  width: 60%;\n  height: 20px;\n  border: solid 1px #cccccc;\n  margin: 0px 10px;\n  text-align: center;\n  line-height: 0.8rem;\n  background: transparent;\n}\n.content-bar-title .rounded-link {\n  border-radius: 10px;\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  background: #cccccc;\n}\n.content-bar-title .content-bar-capsule {\n  background: #ffffff;\n  border-radius: 50px;\n  display: inline-block;\n  width: 50px;\n  height: 10px;\n  background: #cccccc;\n}\n.alert-success,\n.alert-danger {\n  position: fixed;\n  width: 80%;\n  z-index: 1;\n  margin: 10px 0 0 20px;\n}\n.loader-container {\n  width: 100%;\n  height: 100%;\n  text-align: center;\n}\n.loader-container span {\n  top: 50%;\n}\n.form-group .advanced-branding-toggle {\n  margin: 0.25rem 0 0 0;\n}\n.flex-no-wrap {\n  flex-wrap: nowrap;\n}\n.left-branding-nav {\n  max-width: 25rem;\n  min-width: 21rem;\n}\n.right-branding-nav {\n  max-width: 20rem;\n  min-width: 18rem;\n}\n"

/***/ }),

/***/ "./src/app/branding/branding.component.ts":
/*!************************************************!*\
  !*** ./src/app/branding/branding.component.ts ***!
  \************************************************/
/*! exports provided: BrandingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrandingComponent", function() { return BrandingComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _branding_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./branding.service */ "./src/app/branding/branding.service.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core */ "./src/app/core/index.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BrandingComponent = /** @class */ (function () {
    function BrandingComponent(formBuilder, brandingService, spinnerService, toastService) {
        this.formBuilder = formBuilder;
        this.brandingService = brandingService;
        this.spinnerService = spinnerService;
        this.toastService = toastService;
        this.hexaPattern = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
        this.brandingForm = this.formBuilder.group({
            companyLogo: null,
            welcomeText: null,
            navigationBar: this.formBuilder.group({
                backgroundColor: ['#000000', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(this.hexaPattern)])],
                backgroundEffect: null,
                typeAndIconColor: '#000000',
                icon: null,
            }),
            body: this.formBuilder.group({
                interactiveColor: ['#1393C7', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(this.hexaPattern)])],
                backgroundColor: ['#FFFFFF', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].compose([_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern(this.hexaPattern)])],
                defaultBodyBranding: false,
                typeAndIconColor: '#000000'
            }),
            tabBar: this.formBuilder.group({
                useNavigationBarTypeAndIconColor: false,
                typeAndIconColor: '#000000'
            }),
            webIcon: null,
            _links: null
        });
        this.defaultBrandingSubscription = null;
    }
    BrandingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.spinnerService.show();
        this.brandingService.getBranding$().subscribe(function (response) {
            _this.brandingForm.patchValue(response);
            _this.spinnerService.hide();
        }, function (error) {
            _this.spinnerService.hide();
        });
        var bodyForm = (this.brandingForm.controls.body);
        this.defaultBrandingSubscription = bodyForm.controls.defaultBodyBranding.valueChanges
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["distinctUntilChanged"])())
            .subscribe(function (changes) {
            _this.onDefaultValueChanges(changes);
        });
    };
    BrandingComponent.prototype.onDefaultValueChanges = function (formValue) {
        if (!formValue) {
            var bodyForm = (this.brandingForm.controls.body);
            bodyForm.controls.backgroundColor.setValue('#F5F5F5');
            bodyForm.controls.typeAndIconColor.setValue('#000000');
        }
    };
    BrandingComponent.prototype.ngOnDestroy = function () {
        if (this.defaultBrandingSubscription) {
            this.defaultBrandingSubscription.unsubscribe();
        }
    };
    BrandingComponent.prototype.onLogoUpload = function (fileId) {
        this.brandingForm.controls.companyLogo.setValue(fileId);
    };
    BrandingComponent.prototype.onIconUpload = function (fileId) {
        this.brandingForm.controls.webIcon.setValue(fileId);
    };
    BrandingComponent.prototype.saveBranding = function () {
        var _this = this;
        this.spinnerService.show();
        this.brandingService.postBranding$(this.brandingForm.value).subscribe(function (response) {
            _this.toastService.activateWithTranslate('branding.update.success', 'success');
            _this.brandingForm.patchValue(response);
            _this.spinnerService.hide();
        }, function (error) {
            _this.spinnerService.hide();
            _this.toastService.activateWithTranslate('branding.update.error', 'danger');
        });
    };
    BrandingComponent.prototype.resetSuccess = function (obj) {
        if (obj.isSuccess) {
            this.toastService.activateWithTranslate(obj.keyString, 'success');
            this.brandingForm.patchValue(obj.branding);
            this.brandingForm.controls.companyLogo.setValue(null);
            this.brandingForm.controls.webIcon.setValue(null);
            this.brandingForm.controls.navigationBar['controls'].icon.setValue(null);
        }
        else {
            this.toastService.activateWithTranslate(obj.keyString, 'danger');
        }
    };
    BrandingComponent.prototype.hasRequired = function (control) {
        return control.errors && control.errors.required && control.touched;
    };
    BrandingComponent.prototype.hasError = function (control) {
        return control.errors && !control.errors.required && control.invalid;
    };
    BrandingComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-branding',
            template: __webpack_require__(/*! ./branding.component.html */ "./src/app/branding/branding.component.html"),
            styles: [__webpack_require__(/*! ./branding.component.less */ "./src/app/branding/branding.component.less")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _branding_service__WEBPACK_IMPORTED_MODULE_2__["BrandingService"],
            _core__WEBPACK_IMPORTED_MODULE_3__["SpinnerService"],
            _core__WEBPACK_IMPORTED_MODULE_3__["ToastService"]])
    ], BrandingComponent);
    return BrandingComponent;
}());



/***/ }),

/***/ "./src/app/branding/branding.module.ts":
/*!*********************************************!*\
  !*** ./src/app/branding/branding.module.ts ***!
  \*********************************************/
/*! exports provided: BrandingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrandingModule", function() { return BrandingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _branding_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./branding-routing.module */ "./src/app/branding/branding-routing.module.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _preview_desktop_branding_desktop_preview_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./preview/desktop/branding-desktop-preview.component */ "./src/app/branding/preview/desktop/branding-desktop-preview.component.ts");
/* harmony import */ var _preview_mobile_branding_mobile_preview_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./preview/mobile/branding-mobile-preview.component */ "./src/app/branding/preview/mobile/branding-mobile-preview.component.ts");
/* harmony import */ var _reset_branding_reset_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reset/branding-reset.component */ "./src/app/branding/reset/branding-reset.component.ts");
/* harmony import */ var _upload_file_upload_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./upload/file-upload.component */ "./src/app/branding/upload/file-upload.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _clr_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @clr/angular */ "./node_modules/@clr/angular/esm5/clr-angular.js");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../shared */ "./src/app/shared/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var BrandingModule = /** @class */ (function () {
    function BrandingModule() {
    }
    BrandingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_branding_routing_module__WEBPACK_IMPORTED_MODULE_2__["BrandingRoutingModule"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ReactiveFormsModule"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["CommonModule"], _clr_angular__WEBPACK_IMPORTED_MODULE_9__["ClarityModule"], _shared__WEBPACK_IMPORTED_MODULE_10__["SharedModule"]],
            exports: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateModule"], _preview_desktop_branding_desktop_preview_component__WEBPACK_IMPORTED_MODULE_4__["BrandingDesktopPreviewComponent"], _preview_mobile_branding_mobile_preview_component__WEBPACK_IMPORTED_MODULE_5__["BrandingMobilePreviewComponent"],
                _reset_branding_reset_component__WEBPACK_IMPORTED_MODULE_6__["BrandingResetComponent"], _upload_file_upload_component__WEBPACK_IMPORTED_MODULE_7__["FileUploadComponent"]],
            declarations: [_branding_routing_module__WEBPACK_IMPORTED_MODULE_2__["RoutedComponents"], _preview_desktop_branding_desktop_preview_component__WEBPACK_IMPORTED_MODULE_4__["BrandingDesktopPreviewComponent"], _preview_mobile_branding_mobile_preview_component__WEBPACK_IMPORTED_MODULE_5__["BrandingMobilePreviewComponent"],
                _reset_branding_reset_component__WEBPACK_IMPORTED_MODULE_6__["BrandingResetComponent"], _upload_file_upload_component__WEBPACK_IMPORTED_MODULE_7__["FileUploadComponent"]]
        })
    ], BrandingModule);
    return BrandingModule;
}());



/***/ }),

/***/ "./src/app/branding/branding.service.ts":
/*!**********************************************!*\
  !*** ./src/app/branding/branding.service.ts ***!
  \**********************************************/
/*! exports provided: BrandingService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrandingService", function() { return BrandingService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core */ "./src/app/core/index.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};



var BrandingService = /** @class */ (function () {
    function BrandingService(httpService, apiService) {
        this.httpService = httpService;
        this.apiService = apiService;
    }
    BrandingService.prototype.postBranding$ = function (branding) {
        var self = this;
        var webIcon = branding.webIcon, welcomeText = branding.welcomeText, brandingDetails = __rest(branding, ["webIcon", "welcomeText"]);
        // const formData = new FormData();
        // formData.append('brandingDetails', JSON.stringify(brandingDetails));
        //
        if (branding.companyLogo) {
            brandingDetails.companyLogo = branding.companyLogo;
        }
        //
        // if (branding.webIcon) {
        //   formData.append('webIcon', branding.webIcon);
        // }
        return this.apiService.getLink('consoleHubBranding').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["flatMap"])(function (url) {
            return self.httpService.put(url + window.location.search, null, brandingDetails);
        }));
    };
    BrandingService.prototype.getBranding$ = function () {
        // return this.httpService.get('/catalog-portal/services/console/api/hub-branding' + window.location.search)
        //   .pipe((res) => res);
        var self = this;
        return this.apiService.getLink('consoleHubBranding').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["flatMap"])(function (url) {
            return self.httpService.get(url + window.location.search);
        }));
    };
    BrandingService.prototype.resetBranding$ = function () {
        var self = this;
        return this.apiService.getLink('consoleHubBranding').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["flatMap"])(function (url) {
            return self.httpService.delete(url + window.location.search);
        }));
    };
    BrandingService.prototype.uploadImage$ = function (url, image) {
        var formData = new FormData();
        formData.append('companyLogo', image);
        return this.httpService.put(url + window.location.search, { responseType: 'text' }, formData);
    };
    BrandingService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_core__WEBPACK_IMPORTED_MODULE_1__["HttpService"],
            _core__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], BrandingService);
    return BrandingService;
}());



/***/ }),

/***/ "./src/app/branding/preview/desktop/branding-desktop-preview.component.html":
/*!**********************************************************************************!*\
  !*** ./src/app/branding/preview/desktop/branding-desktop-preview.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n  <label [innerHTML]=\"'preview.desktop' | translate\"></label>\n  <section class=\"desktop-container clr-row border-grey\" [ngStyle]=\"{'background-color' : branding.body.backgroundColor}\">\n    <div class=\"clr-row no-margin full-width\">\n      <div class=\"desktop-side-nav col-md-1\" [ngStyle]=\"{'background-color' : branding.navigationBar.backgroundColor}\">\n        <div class=\"side-nav-image\">\n          <img *ngIf=\"imgSrc\" [src]=\"imgSrc | sanitizer : urlSanitizer\" />\n        </div>\n        <section>\n          <div class=\"side-nav-icon\" [ngClass]=\"{'side-nav-no-border': i === 1}\" *ngFor=\"let index of [1,2,3,4]; let i = index;\"></div>\n        </section>\n      </div>\n\n      <div class=\"col-md-11\">\n        <div style=\"margin: 10px 0 10px 0\">\n          <div [ngStyle]=\"{'background-color' : branding.navigationBar.typeAndIconColor}\" class=\"header-capsule\"></div>\n          <div class=\"content-bar-title pull-right\">\n            <span class=\"rounded-link\"></span>\n            <span class=\"content-bar-capsule\"></span>\n          </div>\n        </div>\n\n        <div class=\"clr-row no-margin\">\n          <div class=\"clr-row row-title\" [style.background]=\"branding.body.interactiveColor\" *ngFor=\"let item of [1,2,3]\">\n            <div class=\"col-xs-5 row-title-icon\"></div>\n            <div class=\"col-xs-5\">\n              <div class=\"app-list-item-content\">\n                <div class=\"app-list-item-header\"></div>\n                <div class=\"app-list-item-type\"></div>\n              </div>\n              <div class=\"app-list-item-action\">\n                <div class=\"app-list-item-type\"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"clr-row no-margin\" style=\"height: 200px; width: 100%;padding: 10px 0 0 0;\">\n          <div class=\"col-xs-3\" style=\"border-right: solid 1px;\">\n            <div class=\"app-list-item-content\">\n              <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"app-list-item-header\"></div>\n              <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"app-list-item-type\" *ngFor=\"let i of [1,2,3,4,5,6,7,8,9,10]\" ></div>\n            </div>\n          </div>\n          <div class=\"col-xs-9\">\n            <div class=\"title-list\">\n              <div>\n                <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"title-list-icon\"></div>\n                <div class=\"title-list-content\"></div>\n              </div>\n              <div class=\"clr-row title-list-row\">\n                <div class=\"tile-list\" style=\"margin-right: 5px;\" *ngFor=\"let i of [1,2,3,4,5,6,7,8,9]\">\n                  <div class=\"icon\"></div>\n                  <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"content\"></div>\n                </div>\n              </div>\n            </div>\n            <div class=\"title-list\">\n              <div>\n                <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"title-list-icon\"></div>\n                <div class=\"title-list-content\"></div>\n              </div>\n              <div class=\"clr-row title-list-row\">\n                <div class=\"tile-list\" style=\"margin-right: 5px;\" *ngFor=\"let i of [1,2,3,4,5,6,7,8,9]\">\n                  <div class=\"icon\"></div>\n                  <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"content\"></div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n</section>\n"

/***/ }),

/***/ "./src/app/branding/preview/desktop/branding-desktop-preview.component.less":
/*!**********************************************************************************!*\
  !*** ./src/app/branding/preview/desktop/branding-desktop-preview.component.less ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".hub-console h2,\n.hub-console p {\n  margin-top: 0;\n}\n.hub-console .content-container .content-area {\n  padding: 0;\n  position: relative;\n}\n.hub-console .section-header {\n  padding: 1rem;\n}\n.hub-console .content-scrollable {\n  padding: 0 1rem 1rem 1rem;\n}\n.hub-console .side-nav {\n  border-right: 1px solid #ccc;\n  background-color: #eee;\n}\n.hub-console form .text-field {\n  border-radius: 2px;\n  border: solid 1px #cccccc;\n}\n.hub-console form .text-field.error {\n  border: 1px solid #c92100;\n}\n.hub-console button:focus {\n  outline: none;\n}\n.text-align-center {\n  text-align: center;\n}\n.no-margin {\n  margin: 0;\n}\n.no-padding {\n  padding: 0;\n}\n.pull-right {\n  float: right;\n}\n.pull-left {\n  float: left;\n}\n.full-width {\n  width: 100%;\n}\n.border-grey {\n  border: solid 1px #cccccc;\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.display-inline-block {\n  display: inline-block;\n}\n.text-capitalize {\n  text-transform: uppercase;\n}\n.display-table {\n  display: table;\n}\n.display-table-cell {\n  display: table-cell;\n  vertical-align: middle;\n}\n.no-text-wrap {\n  word-break: break-word;\n  white-space: normal;\n  line-height: 1rem;\n}\n.error {\n  color: red;\n}\n.capsule {\n  background: #ffffff;\n  border-radius: 50px;\n}\n.header-capsule {\n  background: #ffffff;\n  border-radius: 50px;\n  display: inline-block;\n  width: 50px;\n  height: 20px;\n}\n.color-preview {\n  padding: 4px 6px;\n  height: 24px;\n  width: 24px;\n  margin-top: 5px;\n  border: solid 1px #cccccc;\n  border-radius: 2px;\n}\n.text-field-inline {\n  width: 215px;\n  height: 24px;\n  border-radius: 2px;\n  border: solid 1px #cccccc;\n}\n.welcome-field {\n  width: 270px;\n  height: 189px;\n  border-radius: 3px;\n  background-color: #ffffff;\n  border: solid 1px #cccccc;\n}\n.row-title {\n  border-radius: 5px;\n  width: 134px;\n  height: 80px;\n  border: solid 1px;\n  background: #0a658a;\n  padding: 15px;\n  margin: 0 5px 0 0;\n}\n.row-title .row-title-icon {\n  border-radius: 6px;\n  height: 50px;\n  background: white;\n  border: solid 1px #cccccc;\n}\n.row-title .app-list-item-content {\n  height: 25px;\n}\n.row-title .app-list-item-content .app-list-item-header {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n}\n.row-title .app-list-item-content .app-list-item-type {\n  border-radius: 50px;\n  width: 30px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n  margin-top: 3px;\n}\n.row-title .app-list-item-action {\n  border-radius: 2px;\n  height: 10px;\n  width: 50px;\n  background: white;\n  line-height: 7px;\n  text-align: center;\n}\n.row-title .app-list-item-action .app-list-item-type {\n  border-radius: 50px;\n  display: inline-block;\n  width: 25px;\n  height: 5px;\n  background: #0a658a;\n}\n.title-list {\n  margin: 15px 0 0 10px;\n}\n.title-list .title-list-icon {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #ffffff;\n  border: none;\n  float: left;\n}\n.title-list .title-list-content {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #0a658a;\n  border: none;\n  float: right;\n}\n.title-list .title-list-row {\n  margin: 0px;\n  width: 100%;\n  overflow: hidden;\n  flex-wrap: nowrap;\n}\n.title-list .title-list-row .tile-list {\n  margin: 5px 5px 0 0;\n}\n.title-list .title-list-row .icon {\n  border-radius: 6px;\n  width: 60px;\n  height: 60px;\n  background: white;\n  border: solid 1px;\n}\n.title-list .title-list-row .content {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #ffffff;\n  border: none;\n  margin-top: 5px;\n}\n.content-bar-title {\n  border-radius: 3px;\n  width: 60%;\n  height: 20px;\n  border: solid 1px #cccccc;\n  margin: 0px 10px;\n  text-align: center;\n  line-height: 0.8rem;\n  background: transparent;\n}\n.content-bar-title .rounded-link {\n  border-radius: 10px;\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  background: #cccccc;\n}\n.content-bar-title .content-bar-capsule {\n  background: #ffffff;\n  border-radius: 50px;\n  display: inline-block;\n  width: 50px;\n  height: 10px;\n  background: #cccccc;\n}\n.alert-success,\n.alert-danger {\n  position: fixed;\n  width: 80%;\n  z-index: 1;\n  margin: 10px 0 0 20px;\n}\n.loader-container {\n  width: 100%;\n  height: 100%;\n  text-align: center;\n}\n.loader-container span {\n  top: 50%;\n}\n.form-group .advanced-branding-toggle {\n  margin: 0.25rem 0 0 0;\n}\n.flex-no-wrap {\n  flex-wrap: nowrap;\n}\n.left-branding-nav {\n  max-width: 25rem;\n  min-width: 21rem;\n}\n.right-branding-nav {\n  max-width: 20rem;\n  min-width: 18rem;\n}\n.desktop-container {\n  width: 485px;\n  height: 330px;\n  margin-bottom: 20px;\n}\n.desktop-side-nav {\n  width: 35px;\n  height: 100%;\n  border-right: solid 1px #cccccc;\n  text-align: center;\n  padding-left: 10px;\n}\n.side-nav-image {\n  width: 20px;\n  height: 20px;\n  margin: 10px 0;\n}\n.side-nav-image img {\n  width: 20px;\n  height: 20px;\n}\n.side-nav-image section {\n  margin-top: 5px;\n}\n.side-nav-icon {\n  border-radius: 50%;\n  display: inline-block;\n  height: 20px;\n  width: 20px;\n  border: solid 1px;\n}\n.side-nav-no-border {\n  border: none;\n  background: #0a658a;\n}\n.title-list {\n  border-bottom: solid 1px;\n}\n.title-list .title-list-row {\n  margin-bottom: 10px;\n}\n.title-list .title-list-row .tile-list .icon {\n  width: 50px;\n  height: 50px;\n}\n.app-list-item-content {\n  height: 25px;\n}\n.app-list-item-content .app-list-item-header {\n  border-radius: 50px;\n  width: 50px;\n  height: 10px;\n  display: block;\n  background: #ffffff;\n  border: solid 1px;\n}\n.app-list-item-content .app-list-item-type {\n  border-radius: 50px;\n  width: 40px;\n  height: 7px;\n  display: block;\n  background: #ffffff;\n  border: solid 1px;\n  margin-top: 10px;\n}\n"

/***/ }),

/***/ "./src/app/branding/preview/desktop/branding-desktop-preview.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/branding/preview/desktop/branding-desktop-preview.component.ts ***!
  \********************************************************************************/
/*! exports provided: BrandingDesktopPreviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrandingDesktopPreviewComponent", function() { return BrandingDesktopPreviewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _shared_sanitizer_sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared/sanitizer/sanitizer-type.enum */ "./src/app/shared/sanitizer/sanitizer-type.enum.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BrandingDesktopPreviewComponent = /** @class */ (function () {
    function BrandingDesktopPreviewComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.urlSanitizer = _shared_sanitizer_sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__["SanitizerType"].URL;
    }
    BrandingDesktopPreviewComponent.prototype.ngOnChanges = function () {
        if (this.branding && this.branding.navigationBar && this.branding.navigationBar.icon) {
            this.imgSrc = this.branding.navigationBar.icon + window.location.search;
        }
        else if (this.branding && this.branding.webIcon) {
            this.imgSrc = window.URL.createObjectURL(this.branding.webIcon);
        }
        else {
            this.imgSrc = './console/assets/graphics/icon.png';
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BrandingDesktopPreviewComponent.prototype, "branding", void 0);
    BrandingDesktopPreviewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-branding-desktop-preview',
            template: __webpack_require__(/*! ./branding-desktop-preview.component.html */ "./src/app/branding/preview/desktop/branding-desktop-preview.component.html"),
            styles: [__webpack_require__(/*! ./branding-desktop-preview.component.less */ "./src/app/branding/preview/desktop/branding-desktop-preview.component.less")]
        }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DomSanitizer"]])
    ], BrandingDesktopPreviewComponent);
    return BrandingDesktopPreviewComponent;
}());



/***/ }),

/***/ "./src/app/branding/preview/mobile/branding-mobile-preview.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/branding/preview/mobile/branding-mobile-preview.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n  <label [innerHTML]=\"'preview.mobile' | translate\"></label>\n  <div class=\"clr-row no-margin\">\n    <section [ngStyle]=\"{'background-color' : branding.body.backgroundColor}\" class=\"mobile-container border-grey\">\n      <section class=\"mobile-header border-bottom-grey\"\n               [ngStyle]=\"{'background-color' : branding.navigationBar.backgroundColor}\">\n        <span [ngStyle]=\"{'background-color' : branding.navigationBar.typeAndIconColor}\" class=\"header-capsule\"></span>\n        <div class=\"side-nav-icon no-margin pull-right\"></div>\n      </section>\n      <section class=\"app-list-item\">\n        <div class=\"content-bar-title\">\n          <span class=\"rounded-link\"></span>\n          <span class=\"content-bar-capsule\"></span>\n        </div>\n        <div class=\"app-title\">\n          <div class=\"clr-row row-title\" [style.background]=\"branding.body.interactiveColor\">\n            <div class=\"col-xs-5 row-title-icon\"></div>\n            <div class=\"col-xs-5\">\n              <div class=\"app-list-item-content\">\n                <div class=\"app-list-item-header\"></div>\n                <div class=\"app-list-item-type\"></div>\n              </div>\n              <div class=\"app-list-item-action\">\n                <div class=\"app-list-item-type\"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"title-list\">\n          <div>\n            <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"title-list-icon\"></div>\n            <div class=\"title-list-content\" [style.background]=\"branding.body.interactiveColor\"></div>\n          </div>\n          <div class=\"clr-row title-list-row\">\n            <div class=\"tile-list\" *ngFor=\"let i of [1,2,3,4]\">\n              <div class=\"icon\"></div>\n              <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"content\"></div>\n            </div>\n          </div>\n        </div>\n      </section>\n      <section class=\"text-align-center border-top-grey left-preview\"\n               [style.background]=\"branding.tabBar.useNavigationBarTypeAndIconColor ? branding.navigationBar.backgroundColor : '#FFFFFF'\">\n        <div class=\"side-nav-icon side-nav-no-border\"\n             [style.background]=\"(branding.tabBar.useNavigationBarTypeAndIconColor) ?\n             (i === 1 ? branding.body.interactiveColor : branding.navigationBar.typeAndIconColor) : (i === 1 ? '#0081A7' : '#848482')\"\n             *ngFor=\"let item of [1,2,3,4]; let i = index;\"></div>\n      </section>\n    </section>\n\n    <section [ngStyle]=\"{'background-color' : branding.body.backgroundColor}\" class=\"mobile-container border-grey\">\n      <section class=\"mobile-header text-align-center border-bottom-grey\"\n               [ngStyle]=\"{'background-color' : branding.navigationBar.backgroundColor}\">\n        <clr-icon shape=\"caret\" class=\"pull-left\" style=\"transform: rotate(270deg);\"\n                  [ngStyle]=\"{'color' : branding.navigationBar.typeAndIconColor}\"></clr-icon>\n        <span [ngStyle]=\"{'background-color' : branding.navigationBar.typeAndIconColor}\" class=\"header-capsule\"></span>\n        <div class=\"side-nav-icon no-margin pull-right\"></div>\n      </section>\n      <section class=\"app-list-item overflow-hidden apps-list-page\">\n        <div class=\"app-list-content-wrapper\" *ngFor=\"let item of [1,2,3,4,5,6]\">\n          <div class=\"app-list-item-icon\"></div>\n          <div class=\"app-list-item-content\">\n            <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"app-list-item-header\"></div>\n            <div [ngStyle]=\"{'background-color' : branding.body.typeAndIconColor}\" class=\"app-list-item-type\"></div>\n          </div>\n          <div class=\"app-list-item-action\" [style.background]=\"branding.body.interactiveColor\">\n            <div class=\"app-list-item-type\"></div>\n          </div>\n        </div>\n      </section>\n      <section class=\"text-align-center border-top-grey right-preview\"\n               [style.background]=\"branding.tabBar.useNavigationBarTypeAndIconColor ? branding.navigationBar.backgroundColor : '#FFFFFF'\">\n        <div class=\"side-nav-icon side-nav-no-border\"\n             [style.background]=\"(branding.tabBar.useNavigationBarTypeAndIconColor) ?\n             (i === 1 ? branding.body.interactiveColor : branding.navigationBar.typeAndIconColor) : (i === 1 ? '#0081A7' : '#848482')\"\n             *ngFor=\"let item of [1,2,3,4]; let i = index;\"></div>\n      </section>\n    </section>\n  </div>\n  <label class=\"hint-text\" [innerHTML]=\"'preview.graphic.hint' | translate\"></label>\n</section>\n"

/***/ }),

/***/ "./src/app/branding/preview/mobile/branding-mobile-preview.component.less":
/*!********************************************************************************!*\
  !*** ./src/app/branding/preview/mobile/branding-mobile-preview.component.less ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".hub-console h2,\n.hub-console p {\n  margin-top: 0;\n}\n.hub-console .content-container .content-area {\n  padding: 0;\n  position: relative;\n}\n.hub-console .section-header {\n  padding: 1rem;\n}\n.hub-console .content-scrollable {\n  padding: 0 1rem 1rem 1rem;\n}\n.hub-console .side-nav {\n  border-right: 1px solid #ccc;\n  background-color: #eee;\n}\n.hub-console form .text-field {\n  border-radius: 2px;\n  border: solid 1px #cccccc;\n}\n.hub-console form .text-field.error {\n  border: 1px solid #c92100;\n}\n.hub-console button:focus {\n  outline: none;\n}\n.text-align-center {\n  text-align: center;\n}\n.no-margin {\n  margin: 0;\n}\n.no-padding {\n  padding: 0;\n}\n.pull-right {\n  float: right;\n}\n.pull-left {\n  float: left;\n}\n.full-width {\n  width: 100%;\n}\n.border-grey {\n  border: solid 1px #cccccc;\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.display-inline-block {\n  display: inline-block;\n}\n.text-capitalize {\n  text-transform: uppercase;\n}\n.display-table {\n  display: table;\n}\n.display-table-cell {\n  display: table-cell;\n  vertical-align: middle;\n}\n.no-text-wrap {\n  word-break: break-word;\n  white-space: normal;\n  line-height: 1rem;\n}\n.error {\n  color: red;\n}\n.capsule {\n  background: #ffffff;\n  border-radius: 50px;\n}\n.header-capsule {\n  background: #ffffff;\n  border-radius: 50px;\n  display: inline-block;\n  width: 50px;\n  height: 20px;\n}\n.color-preview {\n  padding: 4px 6px;\n  height: 24px;\n  width: 24px;\n  margin-top: 5px;\n  border: solid 1px #cccccc;\n  border-radius: 2px;\n}\n.text-field-inline {\n  width: 215px;\n  height: 24px;\n  border-radius: 2px;\n  border: solid 1px #cccccc;\n}\n.welcome-field {\n  width: 270px;\n  height: 189px;\n  border-radius: 3px;\n  background-color: #ffffff;\n  border: solid 1px #cccccc;\n}\n.row-title {\n  border-radius: 5px;\n  width: 134px;\n  height: 80px;\n  border: solid 1px;\n  background: #0a658a;\n  padding: 15px;\n  margin: 0 5px 0 0;\n}\n.row-title .row-title-icon {\n  border-radius: 6px;\n  height: 50px;\n  background: white;\n  border: solid 1px #cccccc;\n}\n.row-title .app-list-item-content {\n  height: 25px;\n}\n.row-title .app-list-item-content .app-list-item-header {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n}\n.row-title .app-list-item-content .app-list-item-type {\n  border-radius: 50px;\n  width: 30px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n  margin-top: 3px;\n}\n.row-title .app-list-item-action {\n  border-radius: 2px;\n  height: 10px;\n  width: 50px;\n  background: white;\n  line-height: 7px;\n  text-align: center;\n}\n.row-title .app-list-item-action .app-list-item-type {\n  border-radius: 50px;\n  display: inline-block;\n  width: 25px;\n  height: 5px;\n  background: #0a658a;\n}\n.title-list {\n  margin: 15px 0 0 10px;\n}\n.title-list .title-list-icon {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #ffffff;\n  border: none;\n  float: left;\n}\n.title-list .title-list-content {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #0a658a;\n  border: none;\n  float: right;\n}\n.title-list .title-list-row {\n  margin: 0px;\n  width: 100%;\n  overflow: hidden;\n  flex-wrap: nowrap;\n}\n.title-list .title-list-row .tile-list {\n  margin: 5px 5px 0 0;\n}\n.title-list .title-list-row .icon {\n  border-radius: 6px;\n  width: 60px;\n  height: 60px;\n  background: white;\n  border: solid 1px;\n}\n.title-list .title-list-row .content {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  background: #ffffff;\n  border: none;\n  margin-top: 5px;\n}\n.content-bar-title {\n  border-radius: 3px;\n  width: 60%;\n  height: 20px;\n  border: solid 1px #cccccc;\n  margin: 0px 10px;\n  text-align: center;\n  line-height: 0.8rem;\n  background: transparent;\n}\n.content-bar-title .rounded-link {\n  border-radius: 10px;\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  background: #cccccc;\n}\n.content-bar-title .content-bar-capsule {\n  background: #ffffff;\n  border-radius: 50px;\n  display: inline-block;\n  width: 50px;\n  height: 10px;\n  background: #cccccc;\n}\n.alert-success,\n.alert-danger {\n  position: fixed;\n  width: 80%;\n  z-index: 1;\n  margin: 10px 0 0 20px;\n}\n.loader-container {\n  width: 100%;\n  height: 100%;\n  text-align: center;\n}\n.loader-container span {\n  top: 50%;\n}\n.form-group .advanced-branding-toggle {\n  margin: 0.25rem 0 0 0;\n}\n.flex-no-wrap {\n  flex-wrap: nowrap;\n}\n.left-branding-nav {\n  max-width: 25rem;\n  min-width: 21rem;\n}\n.right-branding-nav {\n  max-width: 20rem;\n  min-width: 18rem;\n}\n.mobile-container {\n  width: 185px;\n  height: 330px;\n  margin-right: 10px;\n}\n.mobile-header {\n  height: 40px;\n  padding: 10px;\n}\n.mobile-header.border-bottom-white {\n  border-bottom: solid 1px white;\n}\n.mobile-header.border-bottom-grey {\n  border-bottom: solid 1px #cccccc;\n}\n.border-top-white {\n  border-top: solid 1px white;\n}\n.border-top-grey {\n  border-top: solid 1px #cccccc;\n}\n.app-list-item {\n  height: 257px;\n  padding-top: 10px;\n}\n.app-list-item .app-list-content-wrapper {\n  padding: 10px 10px 0 10px;\n  border-bottom: solid 1px;\n  border-color: rgba(0, 0, 0, 0.12);\n}\n.app-list-item .app-list-content-wrapper .app-list-item-icon {\n  border-radius: 6px;\n  display: inline-block;\n  width: 25px;\n  height: 25px;\n  background: white;\n  border: solid 1px;\n}\n.app-list-item .app-list-content-wrapper .app-list-item-content {\n  display: inline-block;\n  height: 25px;\n  padding-top: 5px;\n  margin-left: 5px;\n}\n.app-list-item .app-list-content-wrapper .app-list-item-content .app-list-item-header {\n  border-radius: 50px;\n  width: 50px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n}\n.app-list-item .app-list-content-wrapper .app-list-item-content .app-list-item-type {\n  border-radius: 50px;\n  width: 30px;\n  height: 6px;\n  display: block;\n  background: #ffffff;\n  border: none;\n  margin-top: 3px;\n}\n.app-list-item .app-list-content-wrapper .app-list-item-action {\n  border-radius: 2px;\n  display: inline-block;\n  height: 15px;\n  width: 50px;\n  background: #0a658a;\n  line-height: 15px;\n  text-align: center;\n  float: right;\n  margin-top: 4px;\n}\n.app-list-item .app-list-content-wrapper .app-list-item-action .app-list-item-type {\n  border-radius: 50px;\n  display: inline-block;\n  width: 25px;\n  height: 7px;\n  background: #ffffff;\n  border: none;\n}\n.app-title {\n  height: 110px;\n  border-top: solid 1px #cccccc;\n  border-bottom: solid 1px #cccccc;\n  margin-top: 10px;\n  width: 100%;\n  overflow: auto;\n  overflow-y: hidden;\n  padding: 10px;\n}\n.app-title .row-title {\n  width: 150px;\n  margin: 0;\n  border: none;\n}\n.side-nav-icon {\n  height: 20px;\n  width: 20px;\n  border: solid 1px;\n  border-radius: 50%;\n  display: inline-block;\n  margin: 3px 12px 0 12px;\n}\n.side-nav-icon.no-margin {\n  margin: 0;\n  background: #C1CDD4;\n  background: linear-gradient(to right, #C1CDD4 0, #A9B6BE 100%);\n  background: -webkit-linear-gradient(left, #C1CDD4 0, #A9B6BE 100%);\n  border: none;\n}\n.content-bar-title {\n  width: 170px;\n}\n.side-nav-no-border {\n  border: none;\n  background: #0a658a;\n}\n.back-link {\n  font-size: 20px;\n  color: white;\n}\n.hint-text {\n  font-size: 10px;\n  color: #565656;\n  font-family: Metropolis;\n}\n"

/***/ }),

/***/ "./src/app/branding/preview/mobile/branding-mobile-preview.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/branding/preview/mobile/branding-mobile-preview.component.ts ***!
  \******************************************************************************/
/*! exports provided: BrandingMobilePreviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrandingMobilePreviewComponent", function() { return BrandingMobilePreviewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BrandingMobilePreviewComponent = /** @class */ (function () {
    function BrandingMobilePreviewComponent() {
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], BrandingMobilePreviewComponent.prototype, "branding", void 0);
    BrandingMobilePreviewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-branding-mobile-preview',
            template: __webpack_require__(/*! ./branding-mobile-preview.component.html */ "./src/app/branding/preview/mobile/branding-mobile-preview.component.html"),
            styles: [__webpack_require__(/*! ./branding-mobile-preview.component.less */ "./src/app/branding/preview/mobile/branding-mobile-preview.component.less")]
        })
    ], BrandingMobilePreviewComponent);
    return BrandingMobilePreviewComponent;
}());



/***/ }),

/***/ "./src/app/branding/reset/branding-reset.component.html":
/*!**************************************************************!*\
  !*** ./src/app/branding/reset/branding-reset.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<clr-modal [(clrModalOpen)]=\"openModal\">\n  <h3 class=\"modal-title\" [innerHTML]=\"'branding.reset.title' | translate\"></h3>\n  <div class=\"modal-body\">\n    <p [innerHTML]=\"'branding.reset.confirmation' | translate\"></p>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-outline\" (click)=\"openModal = false\"\n            [innerHTML]=\"'form.label.cancel' | translate\"></button>\n    <button type=\"button\" class=\"btn btn-primary\" (click)=\"resetBranding()\"\n            [innerHTML]=\"'form.label.reset' | translate\"></button>\n  </div>\n</clr-modal>\n"

/***/ }),

/***/ "./src/app/branding/reset/branding-reset.component.ts":
/*!************************************************************!*\
  !*** ./src/app/branding/reset/branding-reset.component.ts ***!
  \************************************************************/
/*! exports provided: BrandingResetComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrandingResetComponent", function() { return BrandingResetComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _branding_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../branding.service */ "./src/app/branding/branding.service.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core */ "./src/app/core/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BrandingResetComponent = /** @class */ (function () {
    function BrandingResetComponent(brandingService, spinnerService) {
        this.brandingService = brandingService;
        this.spinnerService = spinnerService;
        this.resetSuccess = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.openModal = false;
    }
    BrandingResetComponent.prototype.open = function () {
        this.openModal = true;
    };
    BrandingResetComponent.prototype.resetBranding = function () {
        var _this = this;
        this.spinnerService.show();
        this.openModal = false;
        this.brandingService.resetBranding$().subscribe(function (response) {
            _this.spinnerService.hide();
            _this.resetSuccess.emit({ keyString: 'branding.reset.success', isSuccess: true, branding: response });
        }, function (error) {
            _this.resetSuccess.emit({ keyString: 'branding.update.error', isSuccess: false });
            _this.spinnerService.hide();
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], BrandingResetComponent.prototype, "resetSuccess", void 0);
    BrandingResetComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-branding-reset',
            template: __webpack_require__(/*! ./branding-reset.component.html */ "./src/app/branding/reset/branding-reset.component.html"),
            styleUrls: []
        }),
        __metadata("design:paramtypes", [_branding_service__WEBPACK_IMPORTED_MODULE_1__["BrandingService"],
            _core__WEBPACK_IMPORTED_MODULE_2__["SpinnerService"]])
    ], BrandingResetComponent);
    return BrandingResetComponent;
}());



/***/ }),

/***/ "./src/app/branding/upload/file-upload.component.html":
/*!************************************************************!*\
  !*** ./src/app/branding/upload/file-upload.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n  <div [ngClass]=\"{'sm-icon-wrapper': isIcon, 'lg-icon-wrapper': !isIcon}\">\n    <img *ngIf=\"imgSrc\" [src]=\"imgSrc | sanitizer : urlSanitizer\"\n         [ngClass]=\"{'sm-icon-placeholder': isIcon, 'lg-icon-placeholder': !isIcon}\">\n  </div>\n  <input type=\"file\" #file class=\"display-none\" (change)=\"handleUpload($event.target.files[0])\" />\n  <a (click)=\"addFiles()\" class=\"text-uppercase upload-pointer\" [innerHTML]=\"'form.label.upload' | translate\"></a>\n  <clr-tooltip>\n    <clr-icon clrTooltipTrigger shape=\"info-circle\" size=\"24\"></clr-icon>\n    <clr-tooltip-content clrSize=\"sm\" *clrIfOpen>\n      <span *ngIf=\"!isIcon\" [innerHTML]=\"'branding.company.logo.size'| translate\"></span>\n      <span *ngIf=\"isIcon\" [innerHTML]=\"'branding.desktop.icon.size'| translate\"></span>\n    </clr-tooltip-content>\n  </clr-tooltip>\n  <span *ngIf=\"errorMsg\" class=\"color-red\" [innerHTML]=\"errorMsg | translate\"></span>\n</div>\n"

/***/ }),

/***/ "./src/app/branding/upload/file-upload.component.less":
/*!************************************************************!*\
  !*** ./src/app/branding/upload/file-upload.component.less ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".border-align {\n  background-color: #f2f2f2;\n  border: solid 1px #cccccc;\n  text-align: center;\n}\n.sm-icon-wrapper {\n  background-color: #f2f2f2;\n  border: solid 1px #cccccc;\n  text-align: center;\n  width: 96px;\n  height: 96px;\n}\n.lg-icon-wrapper {\n  background-color: #f2f2f2;\n  border: solid 1px #cccccc;\n  text-align: center;\n  width: 250px;\n  height: 85px;\n}\n.lg-icon-placeholder {\n  max-width: 200px;\n  max-height: 80px;\n}\n.sm-icon-placeholder {\n  max-width: 52px;\n  max-height: 64px;\n}\n.display-none {\n  display: none;\n}\n.color-red {\n  color: red;\n}\n.upload-pointer {\n  cursor: pointer;\n  color: #007cbb;\n}\n"

/***/ }),

/***/ "./src/app/branding/upload/file-upload.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/branding/upload/file-upload.component.ts ***!
  \**********************************************************/
/*! exports provided: FileUploadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileUploadComponent", function() { return FileUploadComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _shared_sanitizer_sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/sanitizer/sanitizer-type.enum */ "./src/app/shared/sanitizer/sanitizer-type.enum.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core */ "./src/app/core/index.ts");
/* harmony import */ var _branding_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../branding.service */ "./src/app/branding/branding.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FileUploadComponent = /** @class */ (function () {
    function FileUploadComponent(sanitizer, spinnerService, brandingService, toastService) {
        this.sanitizer = sanitizer;
        this.spinnerService = spinnerService;
        this.brandingService = brandingService;
        this.toastService = toastService;
        this.ImageUpload = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.urlSanitizer = _shared_sanitizer_sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__["SanitizerType"].URL;
    }
    FileUploadComponent.prototype.ngOnChanges = function () {
        if (this.branding && this.branding.companyLogo &&
            !this.isIcon && !this.isLocalImage) {
            var url = this.branding._links['companylogo-url'].href;
            this.imgSrc = url + window.location.search;
        }
        if (this.branding && this.branding.navigationBar && this.branding.navigationBar.icon &&
            this.isIcon && !this.isLocalImage) {
            this.imgSrc = this.branding.navigationBar.icon + window.location.search;
        }
        else if (this.branding && !this.branding.webIcon && this.isIcon) {
            this.imgSrc = './console/assets/graphics/icon.png';
        }
        else if (this.branding && !this.branding.companyLogo && !this.isIcon) {
            this.imgSrc = './console/assets/graphics/company-logo.png';
        }
    };
    FileUploadComponent.prototype.addFiles = function () {
        this.file.nativeElement.click();
    };
    FileUploadComponent.prototype.confirmImage = function (file) {
        var _this = this;
        if (file && !file.type.match('image.png|image.jpeg|image.jpg|image.gif')) {
            this.errorMsg = 'branding.image.type.error';
            setTimeout(function () {
                _this.errorMsg = '';
            }, 3000);
        }
        else {
            this.errorMsg = '';
        }
    };
    FileUploadComponent.prototype.handleUpload = function (file) {
        var _this = this;
        if (!file) {
            return;
        }
        this.confirmImage(file);
        if (!this.errorMsg) {
            var url = this.branding._links['upload-companylogo'].href;
            this.spinnerService.show();
            this.brandingService.uploadImage$(url, file)
                .subscribe(function (response) {
                _this.spinnerService.hide();
                _this.isLocalImage = true;
                _this.imgSrc = window.URL.createObjectURL(file);
                _this.ImageUpload.emit(response);
            }, function (error) {
                _this.spinnerService.hide();
                if (error && typeof error === 'string') {
                    var errorMsg = JSON.parse(error);
                    if (errorMsg && errorMsg.code && errorMsg.message) {
                        _this.toastService.activate(errorMsg.message, 'danger');
                    }
                }
            });
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('file'),
        __metadata("design:type", Object)
    ], FileUploadComponent.prototype, "file", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Boolean)
    ], FileUploadComponent.prototype, "isIcon", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], FileUploadComponent.prototype, "ImageUpload", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], FileUploadComponent.prototype, "branding", void 0);
    FileUploadComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-file-upload',
            template: __webpack_require__(/*! ./file-upload.component.html */ "./src/app/branding/upload/file-upload.component.html"),
            styles: [__webpack_require__(/*! ./file-upload.component.less */ "./src/app/branding/upload/file-upload.component.less")],
        }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DomSanitizer"],
            _core__WEBPACK_IMPORTED_MODULE_3__["SpinnerService"],
            _branding_service__WEBPACK_IMPORTED_MODULE_4__["BrandingService"],
            _core__WEBPACK_IMPORTED_MODULE_3__["ToastService"]])
    ], FileUploadComponent);
    return FileUploadComponent;
}());



/***/ })

}]);
//# sourceMappingURL=branding-branding-module.js.map