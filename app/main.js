"use strict";
var application_1 = require("nativescript-angular/application");
var app_component_1 = require("./app.component");
var status_bar_util_1 = require("./utils/status-bar-util");
var cms_1 = require("./shared/cms/cms");
var core_1 = require('@angular/core');
var dynamic_route_1 = require("./shared/route/dynamic-route");
exports._ = require('lodash');
//noinspection TypeScriptUnresolvedVariable
global._ = exports._;
exports.JsonFn = require('./jsonfn');
//noinspection TypeScriptUnresolvedVariable
global.JsonFn = exports.JsonFn;
core_1.enableProdMode();
status_bar_util_1.setStatusBarColors();
application_1.nativeScriptBootstrap(app_component_1.AppComponent, [dynamic_route_1.DynamicRouteConfigurator, cms_1.Cms]);
