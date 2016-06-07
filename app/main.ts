import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {setStatusBarColors} from "./utils/status-bar-util";
import {Cms} from "./shared/cms/cms";
import {enableProdMode} from '@angular/core';
import {DynamicRouteConfigurator} from "./shared/route/dynamic-route";

export let _ = require('lodash');
//noinspection TypeScriptUnresolvedVariable
global._ = _;
export let JsonFn = require('./jsonfn');
//noinspection TypeScriptUnresolvedVariable
global.JsonFn = JsonFn;

enableProdMode();
setStatusBarColors();
nativeScriptBootstrap(AppComponent, [DynamicRouteConfigurator, Cms]);