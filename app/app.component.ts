import "reflect-metadata";
import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";

import {MainPage} from "./views/main-page/main-page";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: "<StackLayout><page-router-outlet></page-router-outlet></StackLayout>"
})
@RouteConfig([
    //{ path: "/", component: LoginPage, as: "Login" },
    { path: "/", component: MainPage, as: "MainPage" }
])
export class AppComponent {}
