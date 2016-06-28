import {RouterConfig} from "@angular/router";
import {nsProvideRouter} from "nativescript-angular/router";

export const routes: RouterConfig = [];

export const APP_ROUTER_PROVIDERS = [
    nsProvideRouter(routes, {})
];