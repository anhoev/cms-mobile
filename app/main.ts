import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {setStatusBarColors} from "./utils/status-bar-util";
import {Cms} from "./shared/cms/cms";
import {enableProdMode} from '@angular/core';
import {DynamicRouteConfigurator} from "./shared/route/dynamic-route";
import {APP_ROUTER_PROVIDERS} from "./app.route";

// enableProdMode();
setStatusBarColors();
nativeScriptBootstrap(AppComponent, [DynamicRouteConfigurator, Cms, APP_ROUTER_PROVIDERS]);