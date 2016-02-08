import {Component, DynamicComponentLoader, Input} from "angular2/core";
import {Cms, Container} from "../../shared/cms/cms";
import {CmsElement} from "./cms-element";

@Component({
    selector: "cms-container",
    templateUrl: "views/main-page/cms-container.html",
    directives: [CmsElement]
})
export class CmsContainer {
    @Input() cmsContainerData:Container;

    constructor() {
    }

    ngOnInit() {
    }
}
