import "reflect-metadata";
import {Component,ViewEncapsulation} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {DynamicRouteConfigurator} from "./shared/route/dynamic-route";
import {Cms} from "./shared/cms/cms";

@Component({
  selector: "main",
  directives: [NS_ROUTER_DIRECTIVES],
  template: "<StackLayout><page-router-outlet></page-router-outlet></StackLayout>"
})
@RouteConfig([])
export class AppComponent {
    constructor(private dynamicRouteConfigurator:DynamicRouteConfigurator, private cms:Cms) {
        dynamicRouteConfigurator.setComponent(this.constructor);
        cms.load();
    }
}