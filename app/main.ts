import {nativeScriptBootstrap} from "nativescript-angular/application";
import {HTTP_PROVIDERS} from "angular2/http";
import {NS_ROUTER_PROVIDERS} from "nativescript-angular/router";
import {AppComponent} from "./app.component";
import "./livesync-patch";
import {Cms} from "./shared/cms/cms";
import {DynamicRouteConfigurator} from "./shared/route/dynamic-route";
import {enableProdMode} from 'angular2/core';
export let _ = require('lodash');
//noinspection TypeScriptUnresolvedVariable
global._ = _;
export let JsonFn = require('./jsonfn');
//noinspection TypeScriptUnresolvedVariable
global.JsonFn = JsonFn;

enableProdMode();
nativeScriptBootstrap(AppComponent, [HTTP_PROVIDERS, NS_ROUTER_PROVIDERS, Cms, DynamicRouteConfigurator]);