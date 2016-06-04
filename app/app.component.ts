import "reflect-metadata";
import {Component} from "@angular/core";
import {RouteConfig} from "@angular/router-deprecated";
import {NS_ROUTER_DIRECTIVES, NS_ROUTER_PROVIDERS} from "nativescript-angular/router";
import {DynamicRouteConfigurator} from "./shared/route/dynamic-route";
import {Cms} from "./shared/cms/cms";

@Component({
  selector: "main",
  directives: [NS_ROUTER_DIRECTIVES],
  providers: [NS_ROUTER_PROVIDERS],
  template: "<page-router-outlet></page-router-outlet>"
})
@RouteConfig([])
export class AppComponent {
    constructor(private dynamicRouteConfigurator:DynamicRouteConfigurator, private cms:Cms) {
        dynamicRouteConfigurator.setComponent(this.constructor);
        cms.load();
    }
}