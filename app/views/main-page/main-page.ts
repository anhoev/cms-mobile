import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";
import {TextField} from "ui/text-field";
import {CmsContainer} from "./cms-container";
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const {File, knownFolders, path} = require('file-system');

@Component({
    selector: "main-page",
    templateUrl: "views/main-page/main-page.html",
    directives: [CmsContainer],
    providers: [ContainerService, NS_ROUTER_DIRECTIVES]
})
export class MainPage {
    constructor(private router:Router, private cms:Cms,
                private containerService:ContainerService) {
        containerService.data = {containers: cms.data.containers};
        cms.service = containerService;
    }
}
