import "reflect-metadata";
import {Component,ViewEncapsulation} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";

import {MainPage} from "./views/main-page/main-page";
import {TestPage} from "./views/main-page/test-page";
import {DynamicRouteConfigurator} from "./shared/route/dynamic-route";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: "<StackLayout><page-router-outlet></page-router-outlet></StackLayout>",
    providers: [DynamicRouteConfigurator],
    encapsulation: ViewEncapsulation.None
})
@RouteConfig([
    {path: "/", component: MainPage, as: "MainPage"},
    {path: "/TestPage", component: TestPage, as: "TestPage", useAsDefault: true}
])
export class AppComponent {
    constructor(private dynamicRouteConfigurator:DynamicRouteConfigurator) {
    }
}
