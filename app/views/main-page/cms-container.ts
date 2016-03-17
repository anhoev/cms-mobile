import {Component, DynamicComponentLoader, ElementRef, Input, Host, Optional, forwardRef} from "angular2/core";
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
import {CmsElement} from './cms-element';
import {Inject} from "angular2/core";
import {CanReuse} from "angular2/router";
import {Directive} from "angular2/core";
import {provide} from "angular2/core";
import {ViewContainerRef} from "angular2/core";
import {_} from "../../main"

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
            if (container) {
                for (const element of container.elements) {
                    this.loader.loadNextToLocation(CmsElement, this.elementRef).then(ref => {
                        ref.instance.element = element;
                        (<CmsElement>ref.instance).ngOnInit();
                    });
                }
            }
        }
    }
}
