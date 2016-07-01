import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from '@angular/router';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {Cms} from "./shared/cms/cms";

@Component({
    selector: "main",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent {
    constructor(private cms:Cms) {
        cms.load();
    }
}