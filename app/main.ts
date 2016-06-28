import {nativeScriptBootstrap} from "nativescript-angular/application";
import {AppComponent} from "./app.component";
import {setStatusBarColors} from "./utils/status-bar-util";
import {Cms} from "./shared/cms/cms";
import {enableProdMode} from '@angular/core';
import {APP_ROUTER_PROVIDERS} from "./app.route";

// enableProdMode();
setStatusBarColors();
nativeScriptBootstrap(AppComponent, [Cms, APP_ROUTER_PROVIDERS]);