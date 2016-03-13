import {Component, DynamicComponentLoader, ElementRef, Input, Host, Optional, forwardRef} from "angular2/core";
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
import {toCmsElement} from './cms-element';
import {Inject} from "angular2/core";
import {CanReuse} from "angular2/router";
import {Directive} from "angular2/core";
import {provide} from "angular2/core";
import {Injector} from "angular2/core";
import {ViewContainerRef} from "angular2/core";
const _ = require('lodash');

@Directive({
    selector: "[cmsContainer]"
})
export class CmsContainer {
    @Input('cmsContainer') name:String;
    constructor(@Inject(forwardRef(() => ContainerService)) private containerService:ContainerService,
                private loader:DynamicComponentLoader,
                private elementRef:ElementRef) {
    }

    ngOnInit() {
        if (this.containerService) {
            const container = _.find(this.containerService.data.containers, c => c.name === this.name);
            if (container){
                for (const element of container.elements){
                    this.loader.loadNextToLocation(toCmsElement(element), this.elementRef);
                }
            }
        }
    }
}
