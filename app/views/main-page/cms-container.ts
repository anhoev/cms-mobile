import {Component, DynamicComponentLoader, Input, Host, Optional} from "angular2/core";
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
import {CmsElement} from './cms-element';

@Component({
    selector: "[cms-container]",
    templateUrl: "views/main-page/cms-container.html",
    directives: [CmsElement]
})
export class CmsContainer {
    @Input() name:String;
    private elements

    constructor(@Optional() private containerService:ContainerService) {
    }

    ngOnInit() {
        if (this.containerService) {
            //noinspection TypeScriptUnresolvedVariable
            const container = _.find(this.containerService.data.containers, c => c.name === this.name);
            if (container) this.elements = container.elements;
        }
    }
}
