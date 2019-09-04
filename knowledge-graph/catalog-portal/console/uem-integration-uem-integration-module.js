(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["uem-integration-uem-integration-module"],{

/***/ "./src/app/uem-integration/uem-details.ts":
/*!************************************************!*\
  !*** ./src/app/uem-integration/uem-details.ts ***!
  \************************************************/
/*! exports provided: UemDetails */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UemDetails", function() { return UemDetails; });
var UemDetails = /** @class */ (function () {
    function UemDetails(apiServicesUrl, apiKey, organizationGroupId, certificate, base64EncodedCert, privateKeyPassword, deviceServicesUrl) {
        this.apiServicesUrl = apiServicesUrl;
        this.apiKey = apiKey;
        this.organizationGroupId = organizationGroupId;
        this.certificate = certificate;
        this.base64EncodedCert = base64EncodedCert;
        this.privateKeyPassword = privateKeyPassword;
        this.deviceServicesUrl = deviceServicesUrl;
    }
    return UemDetails;
}());



/***/ }),

/***/ "./src/app/uem-integration/uem-integration-routing.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/uem-integration/uem-integration-routing.module.ts ***!
  \*******************************************************************/
/*! exports provided: UemIntegrationRoutingModule, RoutedComponents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UemIntegrationRoutingModule", function() { return UemIntegrationRoutingModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoutedComponents", function() { return RoutedComponents; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _uem_integration_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./uem-integration.component */ "./src/app/uem-integration/uem-integration.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    { path: '', component: _uem_integration_component__WEBPACK_IMPORTED_MODULE_2__["UemIntegrationComponent"] }
];
var UemIntegrationRoutingModule = /** @class */ (function () {
    function UemIntegrationRoutingModule() {
    }
    UemIntegrationRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        })
    ], UemIntegrationRoutingModule);
    return UemIntegrationRoutingModule;
}());

var RoutedComponents = [_uem_integration_component__WEBPACK_IMPORTED_MODULE_2__["UemIntegrationComponent"]];


/***/ }),

/***/ "./src/app/uem-integration/uem-integration.component.html":
/*!****************************************************************!*\
  !*** ./src/app/uem-integration/uem-integration.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"uem-integrations\">\n  <section class=\"section-header\">\n    <h2 [innerHTML]=\"'nav.label.uem' | translate\"></h2>\n    <p [innerHTML]=\"'desc.uem' | translate\"></p>\n  </section>\n  <section class=\"content-scrollable\">\n    <form (ngSubmit)=\"saveUemDetails()\" [formGroup]=\"uemForm\">\n      <section class=\"form-block\">\n        <div class=\"form-group\">\n          <label [innerHTML]=\"'uem.form.label.airwatch.url' | translate\" for=\"url\"></label>\n          <input type=\"text\" formControlName=\"apiServicesUrl\" class=\"text-field\" size=\"50\" name=\"apiServicesUrl\" id=\"url\"\n                 [ngClass]=\"{'error': isInputValid('apiServicesUrl')}\" [attr.disabled]=\"true\">\n        </div>\n        <div class=\"form-group\">\n          <label [innerHTML]=\"'uem.form.label.airwatch.certificate' | translate\"></label>\n          <div *ngIf=\"false\">\n            <input class=\"hidden-upload\" (change)=\"onFileChange($event)\" formControlName=\"base64EncodedCert\" type=\"file\"\n                   name=\"base64EncodedCert\"/>\n            <button class=\"btn btn-outline btn-upload\" [innerHTML]=\"'form.label.upload' | translate\"></button>\n            <span class=\"clr-subtext filename\" *ngIf=\"file\">{{file.name}}</span>\n            <div class=\"btn btn-link\"\n                 [innerHTML]=\"(showCertificateDetails ? 'form.label.hide.details' : 'form.label.show.details') | translate\"\n                 (click)=\"toggleCertificateDetails()\" *ngIf=\"uemDetails.certificate && !file\"></div>\n          </div>\n        </div>\n        <div class=\"certificate-details\" *ngIf=\"uemDetails.certificate && !file\">\n          <div>\n            <label [innerHTML]=\"'uem.cert.issue.by' | translate\"></label>\n            <span>{{uemDetails.certificate.metadata['Issuer']}}</span>\n          </div>\n          <div>\n            <label [innerHTML]=\"'uem.cert.valid.from' | translate\"></label>\n            <span>{{uemDetails.certificate.metadata['Valid-From']}}</span>\n          </div>\n          <div>\n            <label [innerHTML]=\"'uem.cert.valid.to' | translate\"></label>\n            <span>{{uemDetails.certificate.metadata['Valid-To']}}</span>\n          </div>\n          <div>\n            <label [innerHTML]=\"'uem.cert.thumbprint' | translate\"></label>\n            <span>{{uemDetails.certificate.metadata['Thumbprint']}}</span>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <label [innerHTML]=\"'uem.form.label.airwatch.certificate.password' | translate\"></label>\n          <input type=\"password\" class=\"text-field\" formControlName=\"privateKeyPassword\"\n                 [ngClass]=\"{'error': isInputValid('privateKeyPassword')}\" size=\"50\" name=\"privateKeyPassword\"\n                 [attr.disabled]=\"true\">\n        </div>\n        <div class=\"form-group\">\n          <label [innerHTML]=\"'uem.form.label.airwatch.api.key' | translate\"></label>\n          <input type=\"text\" class=\"text-field\" formControlName=\"apiKey\" [ngClass]=\"{'error': isInputValid('apiKey')}\" size=\"50\"\n                 name=\"apiKey\" [attr.disabled]=\"true\">\n        </div>\n        <div class=\"form-group\">\n          <label [innerHTML]=\"'uem.form.label.airwatch.group.id' | translate\"></label>\n          <input type=\"text\" class=\"text-field\" formControlName=\"organizationGroupId\"\n                 [ngClass]=\"{'error': isInputValid('organizationGroupId')}\" size=\"50\" name=\"organizationGroupId\"\n                 [attr.disabled]=\"true\">\n        </div>\n        <div class=\"form-group\">\n          <label [innerHTML]=\"'uem.form.label.airwatch.ds.url' | translate\"></label>\n          <input type=\"text\" class=\"text-field\" formControlName=\"deviceServicesUrl\"\n                 [ngClass]=\"{'error': isInputValid('deviceServicesUrl')}\" size=\"50\" name=\"deviceServicesUrl\"\n                 [attr.disabled]=\"true\">\n        </div>\n      </section>\n    </form>\n  </section>\n</div>\n"

/***/ }),

/***/ "./src/app/uem-integration/uem-integration.component.less":
/*!****************************************************************!*\
  !*** ./src/app/uem-integration/uem-integration.component.less ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".uem-integrations .certificate-details {\n  margin-left: 50px;\n  margin-top: 40px;\n}\n.uem-integrations .certificate-details > div {\n  height: 50px;\n}\n.uem-integrations .certificate-details > div label {\n  width: 13em;\n}\n.uem-integrations .hidden-upload {\n  opacity: 0;\n  width: 90px;\n  height: 45px;\n  position: absolute;\n  z-index: 10;\n  cursor: pointer;\n  font-size: 0;\n}\n.uem-integrations .filename {\n  line-height: 36px;\n}\n"

/***/ }),

/***/ "./src/app/uem-integration/uem-integration.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/uem-integration/uem-integration.component.ts ***!
  \**************************************************************/
/*! exports provided: UemIntegrationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UemIntegrationComponent", function() { return UemIntegrationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _uem_details__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uem-details */ "./src/app/uem-integration/uem-details.ts");
/* harmony import */ var _uem_integration_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./uem-integration.service */ "./src/app/uem-integration/uem-integration.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core */ "./src/app/core/index.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var UemIntegrationComponent = /** @class */ (function () {
    function UemIntegrationComponent(uemService, spinnerService, toastService, translate) {
        this.uemService = uemService;
        this.spinnerService = spinnerService;
        this.toastService = toastService;
        this.translate = translate;
        this.showCertificateDetails = false;
        this.uemDetails = new _uem_details__WEBPACK_IMPORTED_MODULE_1__["UemDetails"]('', '', '', '', '', '', '');
        this.uemForm = this.createForm();
    }
    UemIntegrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.spinnerService.show();
        this.uemService.getUemDetails().subscribe(function (data) {
            self.uemDetails = data;
            _this.uemForm = _this.createForm();
            _this.spinnerService.hide();
        }, function () {
            _this.spinnerService.hide();
        });
    };
    UemIntegrationComponent.prototype.prepareSave = function () {
        var input = new FormData();
        var config = this.uemForm.getRawValue();
        input.append('config', new Blob([JSON.stringify(config)], { type: 'application/vnd.vmware.catalog.tenants-console-aw-config-v1+json' }));
        input.append('certificate', this.file);
        return input;
    };
    UemIntegrationComponent.prototype.createForm = function () {
        return new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormGroup"]({
            'apiServicesUrl': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.uemDetails.apiServicesUrl, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required
            ]),
            'apiKey': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.uemDetails.apiKey, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required
            ]),
            'organizationGroupId': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.uemDetails.organizationGroupId, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required
            ]),
            'base64EncodedCert': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.uemDetails.base64EncodedCert, this.uemDetails.certificate ? [] : [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required
            ]),
            'privateKeyPassword': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.uemDetails.privateKeyPassword, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required
            ]),
            'deviceServicesUrl': new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.uemDetails.deviceServicesUrl, [
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required
            ])
        });
    };
    UemIntegrationComponent.prototype.isInputValid = function (key) {
        return this.uemForm.controls[key].invalid && this.uemForm.controls[key].touched;
    };
    UemIntegrationComponent.prototype.onFileChange = function (event) {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
        }
    };
    UemIntegrationComponent.prototype.toggleCertificateDetails = function () {
        this.showCertificateDetails = !this.showCertificateDetails;
    };
    UemIntegrationComponent.prototype.saveUemDetails = function () {
        var _this = this;
        var self = this;
        this.spinnerService.show();
        var data = this.prepareSave();
        this.uemService.saveUemDetails(data).subscribe(function (res) {
            self.uemDetails = res;
            self.file = false;
            _this.uemForm = _this.createForm();
            _this.spinnerService.hide();
            _this.toastService.activateWithTranslate('uem.save.success', 'success');
        }, function (error) {
            _this.spinnerService.hide();
            if (error.code === 'airwatch.certificate.invalid') {
                _this.toastService.activateWithTranslate('uem.password.error', 'danger');
            }
            else {
                _this.toastService.activateWithTranslate('uem.save.error', 'danger');
            }
        });
    };
    UemIntegrationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-uem-integration',
            template: __webpack_require__(/*! ./uem-integration.component.html */ "./src/app/uem-integration/uem-integration.component.html"),
            styles: [__webpack_require__(/*! ./uem-integration.component.less */ "./src/app/uem-integration/uem-integration.component.less")]
        }),
        __metadata("design:paramtypes", [_uem_integration_service__WEBPACK_IMPORTED_MODULE_2__["UemIntegrationService"], _core__WEBPACK_IMPORTED_MODULE_4__["SpinnerService"], _core__WEBPACK_IMPORTED_MODULE_4__["ToastService"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__["TranslateService"]])
    ], UemIntegrationComponent);
    return UemIntegrationComponent;
}());



/***/ }),

/***/ "./src/app/uem-integration/uem-integration.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/uem-integration/uem-integration.module.ts ***!
  \***********************************************************/
/*! exports provided: UemIntegrationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UemIntegrationModule", function() { return UemIntegrationModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _uem_integration_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./uem-integration-routing.module */ "./src/app/uem-integration/uem-integration-routing.module.ts");
/* harmony import */ var _clr_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @clr/angular */ "./node_modules/@clr/angular/esm5/clr-angular.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var UemIntegrationModule = /** @class */ (function () {
    function UemIntegrationModule() {
    }
    UemIntegrationModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_uem_integration_routing_module__WEBPACK_IMPORTED_MODULE_2__["UemIntegrationRoutingModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateModule"],
                _clr_angular__WEBPACK_IMPORTED_MODULE_3__["ClarityModule"],
                _clr_angular__WEBPACK_IMPORTED_MODULE_3__["ClrFormsNextModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"]],
            exports: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateModule"]],
            declarations: [_uem_integration_routing_module__WEBPACK_IMPORTED_MODULE_2__["RoutedComponents"]]
        })
    ], UemIntegrationModule);
    return UemIntegrationModule;
}());



/***/ }),

/***/ "./src/app/uem-integration/uem-integration.service.ts":
/*!************************************************************!*\
  !*** ./src/app/uem-integration/uem-integration.service.ts ***!
  \************************************************************/
/*! exports provided: UemIntegrationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UemIntegrationService", function() { return UemIntegrationService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core */ "./src/app/core/index.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var UemIntegrationService = /** @class */ (function () {
    function UemIntegrationService(httpService, apiService) {
        this.httpService = httpService;
        this.apiService = apiService;
    }
    UemIntegrationService.prototype.getUemDetails = function () {
        var _this = this;
        return this.apiService.getLink('consoleAirWatchConfig')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["flatMap"])(function (url) { return _this.httpService.get(url + window.location.search); }));
    };
    UemIntegrationService.prototype.saveUemDetails = function (data) {
        var _this = this;
        return this.apiService.getLink('consoleAirWatchConfig')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["flatMap"])(function (url) { return _this.httpService
            .put(url + window.location.search, {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpHeaders"]({
                'Accept': 'application/vnd.vmware.catalog.tenants-console-aw-config-v1+json'
            })
        }, data); }));
    };
    UemIntegrationService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_core__WEBPACK_IMPORTED_MODULE_1__["HttpService"], _core__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
    ], UemIntegrationService);
    return UemIntegrationService;
}());



/***/ })

}]);
//# sourceMappingURL=uem-integration-uem-integration-module.js.map