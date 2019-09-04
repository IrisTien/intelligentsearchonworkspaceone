(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./branding/branding.module": [
		"./src/app/branding/branding.module.ts",
		"branding-branding-module"
	],
	"./customization/customization.module": [
		"./src/app/customization/customization.module.ts",
		"customization-customization-module"
	],
	"./uem-integration/uem-integration.module": [
		"./src/app/uem-integration/uem-integration.module.ts",
		"uem-integration-uem-integration-module"
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids) {
		return Promise.resolve().then(function() {
			var e = new Error('Cannot find module "' + req + '".');
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}
	return __webpack_require__.e(ids[1]).then(function() {
		var module = __webpack_require__(ids[0]);
		return module;
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _error_error_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error/error.component */ "./src/app/error/error.component.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core */ "./src/app/core/index.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot([
                    {
                        path: 'branding',
                        loadChildren: './branding/branding.module#BrandingModule',
                        canActivate: [_core__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]],
                        canActivateChild: [_core__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]]
                    },
                    {
                        path: 'uem',
                        loadChildren: './uem-integration/uem-integration.module#UemIntegrationModule',
                        canActivate: [_core__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]],
                        canActivateChild: [_core__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]]
                    },
                    {
                        path: 'customization',
                        loadChildren: './customization/customization.module#CustomizationModule',
                        canActivate: [_core__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]],
                        canActivateChild: [_core__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]]
                    },
                    {
                        path: 'error',
                        component: _error_error_component__WEBPACK_IMPORTED_MODULE_2__["ErrorComponent"]
                    },
                    {
                        path: '',
                        redirectTo: 'customization',
                        pathMatch: 'full'
                    },
                    {
                        path: '**',
                        component: _error_error_component__WEBPACK_IMPORTED_MODULE_2__["ErrorComponent"]
                    },
                ], { useHash: true, preloadingStrategy: _angular_router__WEBPACK_IMPORTED_MODULE_1__["PreloadAllModules"] })
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"main-container hub-console\">\n  <app-header [userDetails]=\"userDetails\"></app-header>\n  <div class=\"content-container\">\n    <app-left-nav class=\"side-nav\" *ngIf=\"(!isErrorMode || !isMdmConfigured) && isLoggedInUser\"></app-left-nav>\n    <div class=\"content-area dox-content-panel\">\n      <app-toast></app-toast>\n      <router-outlet></router-outlet>\n    </div>\n  </div>\n  <app-spinner></app-spinner>\n</div>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core */ "./src/app/core/index.ts");
/* harmony import */ var _core_services_window_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/services/window.service */ "./src/app/core/services/window.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppComponent = /** @class */ (function () {
    // We have issues with browser refresh in this logic. It will be fixed in the coming patch.
    // @HostListener('window:beforeunload', ['$event']) public onClick(event: any) {
    //   this.userProfileService.doBrowserLogOut$().subscribe(response => {});
    // }
    function AppComponent(translate, titleService, userProfileService, windowService) {
        this.translate = translate;
        this.titleService = titleService;
        this.userProfileService = userProfileService;
        this.windowService = windowService;
        this.title = 'app';
        this.isLoggedInUser = this.userProfileService.isLoggedIn;
        this.userDetails = this.userProfileService.userDetails;
        this.isMdmConfigured = this.windowService.getHubConsole().mdmRedirectUrl;
        this.isErrorMode = this.windowService.getHubConsole().errorMessageCode;
        translate.setDefaultLang('en');
        translate.use(this.windowService.getHubConsole().i18nLocale);
        this.translate.get('title').toPromise().then(function (title) {
            titleService.setTitle(title);
        });
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html")
        }),
        __metadata("design:paramtypes", [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"], _core__WEBPACK_IMPORTED_MODULE_3__["UserProfileService"],
            _core_services_window_service__WEBPACK_IMPORTED_MODULE_4__["WindowService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: HttpLoaderFactory, bootstrapProviderFactory, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpLoaderFactory", function() { return HttpLoaderFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bootstrapProviderFactory", function() { return bootstrapProviderFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _clr_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @clr/angular */ "./node_modules/@clr/angular/esm5/clr-angular.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/esm5/ngx-translate-http-loader.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./header/header.component */ "./src/app/header/header.component.ts");
/* harmony import */ var _left_nav_left_nav_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./left-nav/left-nav.component */ "./src/app/left-nav/left-nav.component.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./core */ "./src/app/core/index.ts");
/* harmony import */ var _error_error_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./error/error.component */ "./src/app/error/error.component.ts");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shared */ "./src/app/shared/index.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _core_services_window_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./core/services/window.service */ "./src/app/core/services/window.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
















function HttpLoaderFactory(http) {
    return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_5__["TranslateHttpLoader"](http, '/catalog-portal/console/assets/i18n/', '.json');
}
function bootstrapProviderFactory(provider) {
    return function () { return provider.load(); };
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
                _header_header_component__WEBPACK_IMPORTED_MODULE_8__["HeaderComponent"],
                _left_nav_left_nav_component__WEBPACK_IMPORTED_MODULE_9__["LeftNavComponent"],
                _error_error_component__WEBPACK_IMPORTED_MODULE_12__["ErrorComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_14__["BrowserAnimationsModule"],
                _clr_angular__WEBPACK_IMPORTED_MODULE_2__["ClarityModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_10__["AppRoutingModule"],
                _core__WEBPACK_IMPORTED_MODULE_11__["CoreModule"],
                _shared__WEBPACK_IMPORTED_MODULE_13__["SharedModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateModule"].forRoot({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateLoader"],
                        useFactory: HttpLoaderFactory,
                        deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"]]
                    }
                })
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__["TranslateModule"]],
            providers: [
                _core__WEBPACK_IMPORTED_MODULE_11__["AuthGuardService"],
                _core_services_window_service__WEBPACK_IMPORTED_MODULE_15__["WindowService"],
                { provide: _angular_core__WEBPACK_IMPORTED_MODULE_1__["APP_INITIALIZER"], useFactory: bootstrapProviderFactory, deps: [_core__WEBPACK_IMPORTED_MODULE_11__["BootstrapService"]], multi: true },
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HTTP_INTERCEPTORS"], useClass: _core__WEBPACK_IMPORTED_MODULE_11__["ConsoleHttpInterceptor"], multi: true }
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/core/core.module.ts":
/*!*************************************!*\
  !*** ./src/app/core/core.module.ts ***!
  \*************************************/
/*! exports provided: CoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoreModule", function() { return CoreModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-cookie-service */ "./node_modules/ngx-cookie-service/index.js");
/* harmony import */ var _services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/api.service */ "./src/app/core/services/api.service.ts");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/http.service */ "./src/app/core/services/http.service.ts");
/* harmony import */ var _services_log_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/log.service */ "./src/app/core/services/log.service.ts");
/* harmony import */ var _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/auth-guard.service */ "./src/app/core/services/auth-guard.service.ts");
/* harmony import */ var _services_bootstrap_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/bootstrap.service */ "./src/app/core/services/bootstrap.service.ts");
/* harmony import */ var _services_http_interceptor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./services/http.interceptor */ "./src/app/core/services/http.interceptor.ts");
/* harmony import */ var _services_user_profile_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./services/user-profile.service */ "./src/app/core/services/user-profile.service.ts");
/* harmony import */ var _spinner_spinner_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./spinner/spinner.component */ "./src/app/core/spinner/spinner.component.ts");
/* harmony import */ var _spinner_spinner_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./spinner/spinner.service */ "./src/app/core/spinner/spinner.service.ts");
/* harmony import */ var _toast_toast_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./toast/toast.component */ "./src/app/core/toast/toast.component.ts");
/* harmony import */ var _toast_toast_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./toast/toast.service */ "./src/app/core/toast/toast.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _services_http_client_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./services/http-client.service */ "./src/app/core/services/http-client.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};















var CoreModule = /** @class */ (function () {
    function CoreModule(parentModule) {
    }
    CoreModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__["BrowserModule"]],
            exports: [[_spinner_spinner_component__WEBPACK_IMPORTED_MODULE_9__["SpinnerComponent"], _toast_toast_component__WEBPACK_IMPORTED_MODULE_11__["ToastComponent"]]],
            declarations: [_spinner_spinner_component__WEBPACK_IMPORTED_MODULE_9__["SpinnerComponent"], _toast_toast_component__WEBPACK_IMPORTED_MODULE_11__["ToastComponent"]],
            providers: [
                ngx_cookie_service__WEBPACK_IMPORTED_MODULE_1__["CookieService"],
                _services_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"],
                _services_http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"],
                _services_log_service__WEBPACK_IMPORTED_MODULE_4__["LogService"],
                _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_5__["AuthGuardService"],
                _services_bootstrap_service__WEBPACK_IMPORTED_MODULE_6__["BootstrapService"],
                _services_http_interceptor__WEBPACK_IMPORTED_MODULE_7__["ConsoleHttpInterceptor"],
                _services_user_profile_service__WEBPACK_IMPORTED_MODULE_8__["UserProfileService"],
                _spinner_spinner_service__WEBPACK_IMPORTED_MODULE_10__["SpinnerService"],
                _toast_toast_service__WEBPACK_IMPORTED_MODULE_12__["ToastService"],
                _services_http_client_service__WEBPACK_IMPORTED_MODULE_14__["HttpClientService"]
            ]
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [CoreModule])
    ], CoreModule);
    return CoreModule;
}());



/***/ }),

/***/ "./src/app/core/index.ts":
/*!*******************************!*\
  !*** ./src/app/core/index.ts ***!
  \*******************************/
/*! exports provided: ApiService, HttpService, LogService, AuthGuardService, BootstrapService, ConsoleHttpInterceptor, UserProfileService, SpinnerService, ToastService, CoreModule, HttpClientService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services/api.service */ "./src/app/core/services/api.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return _services_api_service__WEBPACK_IMPORTED_MODULE_0__["ApiService"]; });

/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/http.service */ "./src/app/core/services/http.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HttpService", function() { return _services_http_service__WEBPACK_IMPORTED_MODULE_1__["HttpService"]; });

/* harmony import */ var _services_log_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/log.service */ "./src/app/core/services/log.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LogService", function() { return _services_log_service__WEBPACK_IMPORTED_MODULE_2__["LogService"]; });

/* harmony import */ var _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/auth-guard.service */ "./src/app/core/services/auth-guard.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthGuardService", function() { return _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_3__["AuthGuardService"]; });

/* harmony import */ var _services_bootstrap_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/bootstrap.service */ "./src/app/core/services/bootstrap.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BootstrapService", function() { return _services_bootstrap_service__WEBPACK_IMPORTED_MODULE_4__["BootstrapService"]; });

/* harmony import */ var _services_http_interceptor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/http.interceptor */ "./src/app/core/services/http.interceptor.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConsoleHttpInterceptor", function() { return _services_http_interceptor__WEBPACK_IMPORTED_MODULE_5__["ConsoleHttpInterceptor"]; });

/* harmony import */ var _services_user_profile_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/user-profile.service */ "./src/app/core/services/user-profile.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UserProfileService", function() { return _services_user_profile_service__WEBPACK_IMPORTED_MODULE_6__["UserProfileService"]; });

/* harmony import */ var _spinner_spinner_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./spinner/spinner.service */ "./src/app/core/spinner/spinner.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SpinnerService", function() { return _spinner_spinner_service__WEBPACK_IMPORTED_MODULE_7__["SpinnerService"]; });

/* harmony import */ var _toast_toast_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./toast/toast.service */ "./src/app/core/toast/toast.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ToastService", function() { return _toast_toast_service__WEBPACK_IMPORTED_MODULE_8__["ToastService"]; });

/* harmony import */ var _core_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core.module */ "./src/app/core/core.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CoreModule", function() { return _core_module__WEBPACK_IMPORTED_MODULE_9__["CoreModule"]; });

/* harmony import */ var _services_http_client_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./services/http-client.service */ "./src/app/core/services/http-client.service.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HttpClientService", function() { return _services_http_client_service__WEBPACK_IMPORTED_MODULE_10__["HttpClientService"]; });














/***/ }),

/***/ "./src/app/core/services/api.service.ts":
/*!**********************************************!*\
  !*** ./src/app/core/services/api.service.ts ***!
  \**********************************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./http.service */ "./src/app/core/services/http.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ApiService = /** @class */ (function () {
    function ApiService(httpService) {
        this.httpService = httpService;
    }
    ApiService.prototype.observeComplete = function (observer, key) {
        observer.next(this.resource[key].href);
        observer.complete();
    };
    ApiService.prototype.observeError = function (observer) {
        observer.next('No links');
        observer.complete();
    };
    ApiService.prototype.getLink = function (key) {
        var _this = this;
        var self = this;
        return rxjs__WEBPACK_IMPORTED_MODULE_1__["Observable"].create(function (observer) {
            if (_this.resource[key]) {
                self.observeComplete(observer, key);
            }
            else {
                _this.getApiList().subscribe(function (ApiResponse) {
                    self.setApiResource(ApiResponse['_links']);
                    if (_this.resource[key]) {
                        self.observeComplete(observer, key);
                    }
                    else {
                        self.observeError(observer);
                    }
                }, function (error) {
                    self.observeError(observer);
                });
            }
        });
    };
    ApiService.prototype.setApiResource = function (obj) {
        this.resource = obj;
        return this.resource;
    };
    ApiService.prototype.getApiList = function () {
        return this.httpService.get('/catalog-portal/services/console/api' + window.location.search);
    };
    ApiService.prototype.getTooglesList = function () {
        var _this = this;
        return this.getLink('toggles')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["flatMap"])(function (url) { return _this.httpService.get(url + window.location.search); }));
    };
    ApiService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]])
    ], ApiService);
    return ApiService;
}());



/***/ }),

/***/ "./src/app/core/services/auth-guard.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/core/services/auth-guard.service.ts ***!
  \*****************************************************/
/*! exports provided: AuthGuardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuardService", function() { return AuthGuardService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_profile_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./user-profile.service */ "./src/app/core/services/user-profile.service.ts");
/* harmony import */ var _window_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./window.service */ "./src/app/core/services/window.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthGuardService = /** @class */ (function () {
    function AuthGuardService(userProfileService, router, windowService) {
        this.userProfileService = userProfileService;
        this.router = router;
        this.windowService = windowService;
    }
    AuthGuardService.prototype.canLoad = function () {
        if (this.windowService.getHubConsole().mdmRedirectUrl || this.windowService.getHubConsole().errorMessageCode) {
            this.router.navigate(['/error']);
            return false;
        }
        if (this.userProfileService.isLoggedIn) {
            return true;
        }
        this.router.navigate(['/error']);
        return false;
    };
    AuthGuardService.prototype.canActivate = function () {
        if (this.windowService.getHubConsole().mdmRedirectUrl || this.windowService.getHubConsole().errorMessageCode) {
            this.router.navigate(['/error']);
            return false;
        }
        if (this.userProfileService.isLoggedIn) {
            return true;
        }
        this.router.navigate(['/error']);
        return false;
    };
    AuthGuardService.prototype.canActivateChild = function () {
        return this.canActivate();
    };
    AuthGuardService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_user_profile_service__WEBPACK_IMPORTED_MODULE_2__["UserProfileService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _window_service__WEBPACK_IMPORTED_MODULE_3__["WindowService"]])
    ], AuthGuardService);
    return AuthGuardService;
}());



/***/ }),

/***/ "./src/app/core/services/bootstrap.service.ts":
/*!****************************************************!*\
  !*** ./src/app/core/services/bootstrap.service.ts ***!
  \****************************************************/
/*! exports provided: BootstrapService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BootstrapService", function() { return BootstrapService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _user_profile_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user-profile.service */ "./src/app/core/services/user-profile.service.ts");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api.service */ "./src/app/core/services/api.service.ts");
/* harmony import */ var _http_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./http.service */ "./src/app/core/services/http.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var BootstrapService = /** @class */ (function () {
    function BootstrapService(apiService, httpService, userProfileService) {
        this.apiService = apiService;
        this.httpService = httpService;
        this.userProfileService = userProfileService;
        this.apiResource = this.apiService.getApiList();
    }
    BootstrapService.prototype.load = function () {
        var _this = this;
        var self = this;
        return new Promise(function (resolve) {
            _this.apiResource
                .subscribe(function (ApiResponse) {
                self.apiService.setApiResource(ApiResponse['_links']);
                self.userProfileService.getUserDetails()
                    .subscribe(function (userData) {
                    self.userProfileService.setUserDetails(userData);
                    resolve();
                }, function () {
                    self.userProfileService.setUserDetails({});
                    resolve();
                });
            }, function () {
                self.userProfileService.setUserDetails({});
                resolve();
            });
        });
    };
    BootstrapService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"], _http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"],
            _user_profile_service__WEBPACK_IMPORTED_MODULE_1__["UserProfileService"]])
    ], BootstrapService);
    return BootstrapService;
}());



/***/ }),

/***/ "./src/app/core/services/http-client.service.ts":
/*!******************************************************!*\
  !*** ./src/app/core/services/http-client.service.ts ***!
  \******************************************************/
/*! exports provided: HttpClientService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpClientService", function() { return HttpClientService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// The above HTTPService which will return the observable as promise.
// If we need to cancel the previous pending http request, using a
// promise we will not able to reject. By, extending the httpClient
// we will be able to unsubscribe / cancel the pending request.


var HttpClientService = /** @class */ (function () {
    function HttpClientService(http) {
        this.http = http;
    }
    HttpClientService.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request(url, 'GET', options);
    };
    HttpClientService.prototype.request = function (url, method, options, body) {
        return body ? this.http.request(new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpRequest"](method, url, body, options)) :
            (this.http.request(method, url, options));
    };
    HttpClientService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], HttpClientService);
    return HttpClientService;
}());



/***/ }),

/***/ "./src/app/core/services/http.interceptor.ts":
/*!***************************************************!*\
  !*** ./src/app/core/services/http.interceptor.ts ***!
  \***************************************************/
/*! exports provided: ConsoleHttpInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConsoleHttpInterceptor", function() { return ConsoleHttpInterceptor; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-cookie-service */ "./node_modules/ngx-cookie-service/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_profile_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./user-profile.service */ "./src/app/core/services/user-profile.service.ts");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./api.service */ "./src/app/core/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ConsoleHttpInterceptor = /** @class */ (function () {
    function ConsoleHttpInterceptor(apiService, router, cookieService, userProfileService) {
        this.apiService = apiService;
        this.router = router;
        this.cookieService = cookieService;
        this.userProfileService = userProfileService;
        this.refreshingUccCookie = false;
    }
    ConsoleHttpInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        var req = this.addXSRFHeader(request);
        return next.handle(req).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (res) {
            if (res instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpResponse"]) {
                return res;
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (err) {
            if (err.status === 401) {
                _this.http401Interceptor(err);
            }
            if (err.status === 403 || err.status === 409) {
                _this.http403Interceptor(err);
            }
            throw err;
        }));
    };
    ConsoleHttpInterceptor.prototype.addXSRFHeader = function (request) {
        var XSRFHeader;
        XSRFHeader = this.cookieService.get('EUC_XSRF_TOKEN') ? this.cookieService.get('EUC_XSRF_TOKEN') : '';
        return request.clone({
            headers: request.headers.set('X-XSRF-TOKEN', XSRFHeader)
        });
    };
    ConsoleHttpInterceptor.prototype.http401Interceptor = function (err) {
        this.userProfileService.setUserDetails(false);
        this.router.navigate(['error']);
    };
    ConsoleHttpInterceptor.prototype.http403Interceptor = function (err) {
        this.userProfileService.setUserDetails(false);
        this.router.navigate(['error']);
    };
    ConsoleHttpInterceptor = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_api_service__WEBPACK_IMPORTED_MODULE_6__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            ngx_cookie_service__WEBPACK_IMPORTED_MODULE_2__["CookieService"], _user_profile_service__WEBPACK_IMPORTED_MODULE_5__["UserProfileService"]])
    ], ConsoleHttpInterceptor);
    return ConsoleHttpInterceptor;
}());



/***/ }),

/***/ "./src/app/core/services/http.service.ts":
/*!***********************************************!*\
  !*** ./src/app/core/services/http.service.ts ***!
  \***********************************************/
/*! exports provided: HttpService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpService", function() { return HttpService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HttpService = /** @class */ (function () {
    function HttpService(http) {
        this.http = http;
        this.mockData = {};
    }
    HttpService.prototype.setMockData = function (mockData, url, error, status) {
        this.mockData[url] = {
            data: mockData,
            error: error,
            status: status
        };
    };
    HttpService.prototype.post = function (url, options, body) {
        if (options === void 0) { options = {}; }
        if (body === void 0) { body = {}; }
        return this.request(url, 'POST', options, body);
    };
    HttpService.prototype.get = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request(url, 'GET', options);
    };
    HttpService.prototype.put = function (url, options, body) {
        if (options === void 0) { options = {}; }
        return this.request(url, 'PUT', options, body);
    };
    HttpService.prototype.delete = function (url, options) {
        if (options === void 0) { options = {}; }
        return this.request(url, 'DELETE', options);
    };
    HttpService.prototype.request = function (url, method, options, body) {
        var _this = this;
        return rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"].create(function (observer) {
            if (_this.mockData && _this.mockData[url]) {
                if (_this.mockData[url].error) {
                    observer.error(new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpErrorResponse"]({
                        error: _this.mockData[url].data,
                        status: _this.mockData[url].status
                    }));
                }
                else {
                    observer.next(_this.mockData[url].data);
                }
            }
            else {
                var req = void 0;
                if (body) {
                    req = _this.http.request(new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpRequest"](method, url, body, options));
                }
                else {
                    req = _this.http.request(new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpRequest"](method, url, options));
                }
                req.toPromise()
                    .then(function (response) {
                    observer.next(response['body']);
                    observer.complete();
                }, function (error) {
                    observer.error(error['error'] || error);
                });
            }
        });
    };
    HttpService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], HttpService);
    return HttpService;
}());



/***/ }),

/***/ "./src/app/core/services/log.service.ts":
/*!**********************************************!*\
  !*** ./src/app/core/services/log.service.ts ***!
  \**********************************************/
/*! exports provided: LogService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogService", function() { return LogService; });
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

var LogService = /** @class */ (function () {
    function LogService() {
    }
    LogService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], LogService);
    return LogService;
}());



/***/ }),

/***/ "./src/app/core/services/user-profile.service.ts":
/*!*******************************************************!*\
  !*** ./src/app/core/services/user-profile.service.ts ***!
  \*******************************************************/
/*! exports provided: UserProfileService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserProfileService", function() { return UserProfileService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./http.service */ "./src/app/core/services/http.service.ts");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./api.service */ "./src/app/core/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var UserProfileService = /** @class */ (function () {
    function UserProfileService(httpService, apiService) {
        this.httpService = httpService;
        this.apiService = apiService;
    }
    UserProfileService.prototype.getUserDetails = function () {
        var self = this;
        return this.apiService.getLink('consoleUserDetails').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["flatMap"])(function (url) {
            return self.httpService.get(url + window.location.search);
        }));
    };
    UserProfileService.prototype.setUserDetails = function (details) {
        this.isLoggedIn = details.adminUser;
        this.userDetails = details;
    };
    UserProfileService.prototype.doLogOut$ = function () {
        return this.apiService.getLink('consoleLogOut')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (url) { return url + window.location.search; }));
    };
    /**
     * Making the plain XMLHttpRequest to make the call synchronously when the browser tab is closed.
     */
    UserProfileService.prototype.doBrowserLogOut$ = function () {
        return this.apiService.getLink('consoleLogOut')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (url) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url.toString() + window.location.search, false);
            xhr.send();
        }));
    };
    UserProfileService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"], _api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"]])
    ], UserProfileService);
    return UserProfileService;
}());



/***/ }),

/***/ "./src/app/core/services/window.service.ts":
/*!*************************************************!*\
  !*** ./src/app/core/services/window.service.ts ***!
  \*************************************************/
/*! exports provided: WindowService, HubConsole */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WindowService", function() { return WindowService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HubConsole", function() { return HubConsole; });
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

var WindowService = /** @class */ (function () {
    function WindowService() {
        this.windowObj = window;
    }
    WindowService.prototype.getWindowObj = function () {
        return this.windowObj;
    };
    WindowService.prototype.getHubConsole = function () {
        return this.windowObj['hubConsole'];
    };
    WindowService.prototype.setHubConsole = function (obj) {
        this.windowObj['hubConsole'] = obj;
    };
    WindowService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], WindowService);
    return WindowService;
}());

var HubConsole = /** @class */ (function () {
    function HubConsole(mdmRedirectUrl, i18nLocale, awsCdnHostname, errorMessageCode) {
        this.mdmRedirectUrl = mdmRedirectUrl;
        this.i18nLocale = i18nLocale;
        this.awsCdnHostname = awsCdnHostname;
        this.errorMessageCode = errorMessageCode;
    }
    return HubConsole;
}());



/***/ }),

/***/ "./src/app/core/spinner/spinner.component.html":
/*!*****************************************************!*\
  !*** ./src/app/core/spinner/spinner.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"spinner-container\" [class.is-active]=\"visible\">\n  <span class=\"spinner spinner-inverse\">\n      Loading...\n  </span>\n</div>\n"

/***/ }),

/***/ "./src/app/core/spinner/spinner.component.less":
/*!*****************************************************!*\
  !*** ./src/app/core/spinner/spinner.component.less ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".spinner-container {\n  width: 100%;\n  height: 100%;\n  display: none;\n  position: absolute;\n  top: 0;\n}\n.spinner-container.is-active {\n  display: block;\n}\n.spinner {\n  margin: 0;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}\n"

/***/ }),

/***/ "./src/app/core/spinner/spinner.component.ts":
/*!***************************************************!*\
  !*** ./src/app/core/spinner/spinner.component.ts ***!
  \***************************************************/
/*! exports provided: SpinnerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpinnerComponent", function() { return SpinnerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _spinner_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./spinner.service */ "./src/app/core/spinner/spinner.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SpinnerComponent = /** @class */ (function () {
    function SpinnerComponent(spinnerService) {
        this.spinnerService = spinnerService;
        this.visible = false;
    }
    SpinnerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.spinnerStateChanged = this.spinnerService.spinnerState
            .subscribe(function (state) { return _this.visible = state.show; });
    };
    SpinnerComponent.prototype.ngOnDestroy = function () {
        this.spinnerStateChanged.unsubscribe();
    };
    SpinnerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-spinner',
            template: __webpack_require__(/*! ./spinner.component.html */ "./src/app/core/spinner/spinner.component.html"),
            styles: [__webpack_require__(/*! ./spinner.component.less */ "./src/app/core/spinner/spinner.component.less")]
        }),
        __metadata("design:paramtypes", [_spinner_service__WEBPACK_IMPORTED_MODULE_1__["SpinnerService"]])
    ], SpinnerComponent);
    return SpinnerComponent;
}());



/***/ }),

/***/ "./src/app/core/spinner/spinner.service.ts":
/*!*************************************************!*\
  !*** ./src/app/core/spinner/spinner.service.ts ***!
  \*************************************************/
/*! exports provided: SpinnerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpinnerService", function() { return SpinnerService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var SpinnerService = /** @class */ (function () {
    function SpinnerService(prior) {
        this.spinnerSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.spinnerState = this.spinnerSubject.asObservable();
        if (prior) {
            return prior;
        }
    }
    SpinnerService.prototype.show = function () {
        this.spinnerSubject.next({ show: true });
    };
    SpinnerService.prototype.hide = function () {
        this.spinnerSubject.next({ show: false });
    };
    SpinnerService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [SpinnerService])
    ], SpinnerService);
    return SpinnerService;
}());



/***/ }),

/***/ "./src/app/core/toast/toast.component.html":
/*!*************************************************!*\
  !*** ./src/app/core/toast/toast.component.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"app-toast\" id=\"toast\">\n  <div class=\"alert alert-{{type}}\">\n    <div class=\"alert-items\">\n      <div class=\"alert-item static\">\n        <div class=\"alert-text\">\n          {{message}}\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/core/toast/toast.component.less":
/*!*************************************************!*\
  !*** ./src/app/core/toast/toast.component.less ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".app-toast {\n  position: fixed;\n  width: calc(100% - 241px);\n  opacity: 0;\n  transition: opacity 200ms ease-in;\n}\n.app-toast .alert {\n  margin: 5px;\n}\n"

/***/ }),

/***/ "./src/app/core/toast/toast.component.ts":
/*!***********************************************!*\
  !*** ./src/app/core/toast/toast.component.ts ***!
  \***********************************************/
/*! exports provided: ToastComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToastComponent", function() { return ToastComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _toast_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toast.service */ "./src/app/core/toast/toast.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ToastComponent = /** @class */ (function () {
    function ToastComponent(toastService) {
        var _this = this;
        this.toastService = toastService;
        this.defaults = {
            message: '',
            type: 'info'
        };
        this.toastSubscription = this.toastService.toastState.subscribe(function (toastMessage) {
            _this.activate(toastMessage.message, toastMessage.type);
        });
    }
    ToastComponent.prototype.activate = function (message, type) {
        if (message === void 0) { message = this.defaults.message; }
        if (type === void 0) { type = this.defaults.type; }
        this.message = message;
        this.type = type;
        this.show();
    };
    ToastComponent.prototype.ngOnInit = function () {
        this.toastElement = document.getElementById('toast');
    };
    ToastComponent.prototype.ngOnDestroy = function () {
        this.toastSubscription.unsubscribe();
    };
    ToastComponent.prototype.show = function () {
        var _this = this;
        console.log(this.message);
        this.toastElement.style.opacity = 1;
        this.toastElement.style.zIndex = 9999;
        window.setTimeout(function () { return _this.hide(); }, 2500);
    };
    ToastComponent.prototype.hide = function () {
        var _this = this;
        this.toastElement.style.opacity = 0;
        window.setTimeout(function () { return _this.toastElement.style.zIndex = 0; }, 400);
    };
    ToastComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-toast',
            template: __webpack_require__(/*! ./toast.component.html */ "./src/app/core/toast/toast.component.html"),
            styles: [__webpack_require__(/*! ./toast.component.less */ "./src/app/core/toast/toast.component.less")]
        }),
        __metadata("design:paramtypes", [_toast_service__WEBPACK_IMPORTED_MODULE_1__["ToastService"]])
    ], ToastComponent);
    return ToastComponent;
}());



/***/ }),

/***/ "./src/app/core/toast/toast.service.ts":
/*!*********************************************!*\
  !*** ./src/app/core/toast/toast.service.ts ***!
  \*********************************************/
/*! exports provided: ToastService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToastService", function() { return ToastService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var ToastService = /** @class */ (function () {
    function ToastService(prior, translate) {
        this.translate = translate;
        this.toastSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.toastState = this.toastSubject.asObservable();
        if (prior) {
            return prior;
        }
    }
    ToastService.prototype.activate = function (message, type) {
        this.toastSubject.next({ message: message || '', type: type || 'info' });
    };
    ToastService.prototype.activateWithTranslate = function (message, type) {
        var _this = this;
        this.translate.get(message).subscribe(function (msg) {
            _this.toastSubject.next({ message: msg || '', type: type || 'info' });
        });
    };
    ToastService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [ToastService, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateService"]])
    ], ToastService);
    return ToastService;
}());



/***/ }),

/***/ "./src/app/error/error.component.html":
/*!********************************************!*\
  !*** ./src/app/error/error.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"!isMdmConfigured\" class=\"error-container\">\n  <h1 [innerHTML]=\"'error.page.header' | translate\"></h1>\n  <section class=\"error-details\">\n    <div class=\"error-image\"></div>\n    <p class=\"error-text-node\" *ngIf=\"!errorMessageCode.length\" [innerHTML]=\"'error.page.desc' | translate\"></p>\n    <p class=\"error-text-node\" *ngIf=\"errorMessageCode\" [innerHTML]=\"errorMessageCode | translate\"></p>\n  </section>\n</div>\n\n\n<div *ngIf=\"isMdmConfigured\" class=\"error-container\">\n  <h3 [innerHTML]=\"'error.page.setup.header' | translate\"></h3>\n  <section class=\"error-details\">\n    <div class=\"error-image\"></div>\n    <div>\n      <div [innerHTML]=\"'error.page.setup.desc' | translate\"></div>\n      <div [innerHTML]=\"'error.page.setup.steps' | translate\"></div>\n      <ul>\n        <li [innerHTML]=\"'error.page.setup.list.one' | translate\"></li>\n        <li [innerHTML]=\"'error.page.setup.list.two' | translate\"></li>\n      </ul>\n      <div [innerHTML]=\"'error.page.setup.confirm' | translate\"></div>\n      <button class=\"btn btn-primary\" [innerHTML]=\"'error.page.setup.button' | translate\" (click)=\"redirect()\"></button>\n    </div>\n  </section>\n</div>\n"

/***/ }),

/***/ "./src/app/error/error.component.less":
/*!********************************************!*\
  !*** ./src/app/error/error.component.less ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".error-container {\n  padding: 50px;\n}\n.error-container .error-details .error-image {\n  margin: 20px auto;\n  background-size: cover;\n  background-image: url(/catalog-portal/console/assets/graphics/access-denied.svg);\n  height: 13rem;\n  width: 14rem;\n}\n.error-container .error-details p {\n  text-align: center;\n  width: 510px;\n  margin: auto;\n}\n.error-container h1 {\n  text-align: center;\n}\n/deep/ .link {\n  color: #007cbb;\n  text-decoration: underline;\n  cursor: pointer;\n}\n"

/***/ }),

/***/ "./src/app/error/error.component.ts":
/*!******************************************!*\
  !*** ./src/app/error/error.component.ts ***!
  \******************************************/
/*! exports provided: ErrorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorComponent", function() { return ErrorComponent; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_services_window_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/services/window.service */ "./src/app/core/services/window.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var ErrorComponent = /** @class */ (function () {
    function ErrorComponent(windowService, document) {
        this.windowService = windowService;
        this.document = document;
        this.isMdmConfigured = this.windowService.getHubConsole().mdmRedirectUrl;
        this.errorMessageCode = this.windowService.getHubConsole().errorMessageCode;
    }
    ErrorComponent.prototype.ngOnInit = function () {
    };
    ErrorComponent.prototype.redirect = function () {
        this.document.location.href = this.windowService.getHubConsole().mdmRedirectUrl;
    };
    ErrorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-error',
            template: __webpack_require__(/*! ./error.component.html */ "./src/app/error/error.component.html"),
            styles: [__webpack_require__(/*! ./error.component.less */ "./src/app/error/error.component.less")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_angular_common__WEBPACK_IMPORTED_MODULE_0__["DOCUMENT"])),
        __metadata("design:paramtypes", [_core_services_window_service__WEBPACK_IMPORTED_MODULE_2__["WindowService"], Object])
    ], ErrorComponent);
    return ErrorComponent;
}());



/***/ }),

/***/ "./src/app/header/header.component.html":
/*!**********************************************!*\
  !*** ./src/app/header/header.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"header-6\">\n  <div class=\"branding\">\n    <a href=\"/\" class=\"nav-link nav-icon\">\n      <img src=\"./console/assets/graphics/outline.svg\" />\n      <span [translate]=\"'title.workspace'\" class=\"title\"></span>\n      <span [translate]=\"'title.hub'\" class=\"title hub-title\"></span>\n    </a>\n  </div>\n  <div class=\"header-actions\">\n    <button class=\"btn btn-inverse\" [innerHTML]=\"redirectLaunchLabel | translate\" *ngIf=\"redirectUrl\" (click)=\"goBack()\"></button>\n    <div class=\"nav-link nav-text\" *ngIf=\"userDetails.firstName\">\n      {{ userDetails.firstName }} {{userDetails.lastName}}\n    </div>\n  </div>\n</header>\n"

/***/ }),

/***/ "./src/app/header/header.component.less":
/*!**********************************************!*\
  !*** ./src/app/header/header.component.less ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".header-actions .btn {\n  margin: 12px 0;\n}\n.branding .hub-title {\n  color: #9ca9b1;\n  margin-left: 5px;\n}\n.branding img {\n  margin-right: 5px;\n}\n"

/***/ }),

/***/ "./src/app/header/header.component.ts":
/*!********************************************!*\
  !*** ./src/app/header/header.component.ts ***!
  \********************************************/
/*! exports provided: HeaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeaderComponent", function() { return HeaderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core */ "./src/app/core/index.ts");
/* harmony import */ var ngx_cookie_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-cookie-service */ "./node_modules/ngx-cookie-service/index.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(cookieService, document, userProfileService, spinnerService) {
        this.cookieService = cookieService;
        this.document = document;
        this.userProfileService = userProfileService;
        this.spinnerService = spinnerService;
        this.launchCookie = 'CONSOLE_LAUNCH_SOURCE';
        this.defaultLaunchCookie = 'mdm';
    }
    HeaderComponent.prototype.ngOnInit = function () {
        this.redirectUrl = this.cookieService.get('ORIGINATION_URL') ? this.cookieService.get('ORIGINATION_URL') : '';
        this.redirectLaunchLabel = this.cookieService.get(this.launchCookie) === this.defaultLaunchCookie
            ? 'back.to.intelligent.hub' : 'back.to.hub.config';
    };
    HeaderComponent.prototype.goBack = function () {
        var _this = this;
        this.userProfileService.doLogOut$().subscribe(function (response) {
            _this.document.location.href = response;
        }, function (error) {
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], HeaderComponent.prototype, "userDetails", void 0);
    HeaderComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-header',
            template: __webpack_require__(/*! ./header.component.html */ "./src/app/header/header.component.html"),
            styles: [__webpack_require__(/*! ./header.component.less */ "./src/app/header/header.component.less")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_common__WEBPACK_IMPORTED_MODULE_3__["DOCUMENT"])),
        __metadata("design:paramtypes", [ngx_cookie_service__WEBPACK_IMPORTED_MODULE_2__["CookieService"], Object, _core__WEBPACK_IMPORTED_MODULE_1__["UserProfileService"], _core__WEBPACK_IMPORTED_MODULE_1__["SpinnerService"]])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/left-nav/left-nav.component.html":
/*!**************************************************!*\
  !*** ./src/app/left-nav/left-nav.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<clr-vertical-nav>\n  <a clrVerticalNavLink routerLink=\"./uem\" routerLinkActive=\"active\" [innerHTML]=\"'nav.label.uem' | translate\"></a>\n  <a clrVerticalNavLink routerLink=\"./customization\" routerLinkActive=\"active\"\n     [innerHTML]=\"'nav.label.customization' | translate\"></a>\n  <a clrVerticalNavLink routerLink=\"./branding\" routerLinkActive=\"active\"\n     [innerHTML]=\"'nav.label.branding' | translate\"></a>\n</clr-vertical-nav>\n"

/***/ }),

/***/ "./src/app/left-nav/left-nav.component.less":
/*!**************************************************!*\
  !*** ./src/app/left-nav/left-nav.component.less ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/left-nav/left-nav.component.ts":
/*!************************************************!*\
  !*** ./src/app/left-nav/left-nav.component.ts ***!
  \************************************************/
/*! exports provided: LeftNavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LeftNavComponent", function() { return LeftNavComponent; });
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

var LeftNavComponent = /** @class */ (function () {
    function LeftNavComponent() {
    }
    LeftNavComponent.prototype.ngOnInit = function () {
    };
    LeftNavComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-left-nav',
            template: __webpack_require__(/*! ./left-nav.component.html */ "./src/app/left-nav/left-nav.component.html"),
            styles: [__webpack_require__(/*! ./left-nav.component.less */ "./src/app/left-nav/left-nav.component.less")]
        }),
        __metadata("design:paramtypes", [])
    ], LeftNavComponent);
    return LeftNavComponent;
}());



/***/ }),

/***/ "./src/app/shared/index.ts":
/*!*********************************!*\
  !*** ./src/app/shared/index.ts ***!
  \*********************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared.module */ "./src/app/shared/shared.module.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return _shared_module__WEBPACK_IMPORTED_MODULE_0__["SharedModule"]; });




/***/ }),

/***/ "./src/app/shared/sanitizer/sanitizer-type.enum.ts":
/*!*********************************************************!*\
  !*** ./src/app/shared/sanitizer/sanitizer-type.enum.ts ***!
  \*********************************************************/
/*! exports provided: SanitizerType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SanitizerType", function() { return SanitizerType; });
var SanitizerType;
(function (SanitizerType) {
    SanitizerType[SanitizerType["HTML"] = 0] = "HTML";
    SanitizerType[SanitizerType["STYLE"] = 1] = "STYLE";
    SanitizerType[SanitizerType["SCRIPT"] = 2] = "SCRIPT";
    SanitizerType[SanitizerType["URL"] = 3] = "URL";
    SanitizerType[SanitizerType["RESOURCE_URL"] = 4] = "RESOURCE_URL";
})(SanitizerType || (SanitizerType = {}));


/***/ }),

/***/ "./src/app/shared/sanitizer/sanitizer.pipe.ts":
/*!****************************************************!*\
  !*** ./src/app/shared/sanitizer/sanitizer.pipe.ts ***!
  \****************************************************/
/*! exports provided: SanitizerPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SanitizerPipe", function() { return SanitizerPipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sanitizer-type.enum */ "./src/app/shared/sanitizer/sanitizer-type.enum.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SanitizerPipe = /** @class */ (function () {
    function SanitizerPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SanitizerPipe.prototype.transform = function (value, sanatizeType) {
        switch (sanatizeType) {
            case _sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__["SanitizerType"].HTML:
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case _sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__["SanitizerType"].STYLE:
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case _sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__["SanitizerType"].URL:
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case _sanitizer_type_enum__WEBPACK_IMPORTED_MODULE_2__["SanitizerType"].RESOURCE_URL:
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                return this.sanitizer.bypassSecurityTrustHtml(value);
        }
    };
    SanitizerPipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({ name: 'sanitizer' }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["DomSanitizer"]])
    ], SanitizerPipe);
    return SanitizerPipe;
}());



/***/ }),

/***/ "./src/app/shared/shared.module.ts":
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _sanitizer_sanitizer_pipe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sanitizer/sanitizer.pipe */ "./src/app/shared/sanitizer/sanitizer.pipe.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var SharedModule = /** @class */ (function () {
    function SharedModule(parentModule) {
    }
    SharedModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [],
            exports: [_sanitizer_sanitizer_pipe__WEBPACK_IMPORTED_MODULE_1__["SanitizerPipe"]],
            declarations: [_sanitizer_sanitizer_pipe__WEBPACK_IMPORTED_MODULE_1__["SanitizerPipe"]],
            providers: []
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"])()), __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["SkipSelf"])()),
        __metadata("design:paramtypes", [SharedModule])
    ], SharedModule);
    return SharedModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /build/mts/release/bora-13143633/common-end-user-catalog/console/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map