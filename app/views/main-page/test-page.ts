import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const {File, knownFolders, path} = require('file-system');

@Component({
    selector: "test-page",
    template:`
    <StackLayout>
        <Label text="TEST PAGE"></Label>
    </StackLayout>
    `,
    providers: [NS_ROUTER_DIRECTIVES]
})
export class TestPage {
    constructor(private router:Router) {
    }
}
