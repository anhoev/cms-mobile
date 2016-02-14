import {Component,ElementRef} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import {TextField} from "ui/text-field";
import {CmsContainer} from "./cms-container";
import {Cms, Container, ContainerService} from "../../shared/cms/cms";

import {ActionBarUtil} from "../../shared/utils/action-bar-util";
const {File, knownFolders, path} = require('file-system');

@Component({
    selector: "main-page",
    templateUrl: "views/main-page/main-page.html",
    directives: [CmsContainer],
    providers: [ContainerService]
})
export class MainPage {

    constructor(private router:Router, private cms:Cms, private containerService:ContainerService, elementRef: ElementRef) {
        containerService.data = {containers: cms.data.containers};
        cms.service = containerService;
    }
}
