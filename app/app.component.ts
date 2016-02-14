import "reflect-metadata";
import {Component} from "angular2/core";
import {RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

import {MainPage} from "./views/main-page/main-page";

@Component({
    selector: "main",
    directives: [ROUTER_DIRECTIVES],
    template: `<StackLayout><router-outlet></router-outlet></StackLayout>`
})
@RouteConfig([
    //{ path: "/", component: LoginPage, as: "Login" },
    { path: "/", component: MainPage, as: "MainPage" }
])
export class AppComponent {}
