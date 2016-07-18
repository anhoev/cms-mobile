import {
    Input,
    forwardRef,
    Inject,
    Directive,
    ComponentResolver,
    ComponentFactory,
    ViewContainerRef,
    ComponentRef
} from "@angular/core";
import {ContainerService} from "../../shared/cms/cms";
import {CmsElement} from "./cms-element";
import {_} from "../../global.lib";

@Directive({
    selector: "[cmsContainer]"
})
export class CmsContainer {
    @Input('cmsContainer') name:String;

    constructor(@Inject(forwardRef(() => ContainerService)) private containerService:ContainerService,
                private viewContainer: ViewContainerRef,
                private resolver:ComponentResolver) {
    }

    ngOnInit() {
        if (this.containerService) {
            console.log(`container : ${this.name}`);
            const container = this.containerService.data.containers[this.name];
            if (container) {
                for (const element of container.elements) {
                    this.resolver.resolveComponent(CmsElement).then((factory:ComponentFactory<any>) => {
                        let ref:ComponentRef<CmsElement> = this.viewContainer.createComponent(factory);
                        ref.instance.element = element;
                        ref.instance.ngOnInit();
                    });
                }
            }
        }
    }
}
