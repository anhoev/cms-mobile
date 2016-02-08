import {Component, DynamicComponentLoader} from "angular2/core";
import {Router} from "angular2/router";
import * as dialogsModule from "ui/dialogs";
import {TextField} from "ui/text-field";
import {CmsContainer} from "./cms-container";
import {Cms, Container} from "../../shared/cms/cms";

import {ActionBarUtil} from "../../shared/utils/action-bar-util";
// const JsonFn = require('json-fn');
import * as JsonFn from "json-fn";
const {File, knownFolders, path} = require('file-system');
var console = require("console");

@Component({
    selector: "main-page",
    templateUrl: "views/main-page/main-page.html",
    directives: [CmsContainer],
    providers: [Cms]
})
export class MainPage {
    public containers:{[type: string]: Container}

    constructor(private router:Router, loader:DynamicComponentLoader, cms:Cms) {
        const indexPath = knownFolders.currentApp().path + '/page/index.json';
        const index = File.fromPath(indexPath).readTextSync();
        const containerPage = JsonFn.parse(index);
        cms.containers = {};
        containerPage.containers.forEach(c => cms.containers[c.name] = c);
        this.containers = cms.containers;
        //todo: draw container 0

    }
}
