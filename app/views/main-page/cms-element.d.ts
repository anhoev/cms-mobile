import { DoCheck, ViewContainerRef, ComponentRef, ComponentResolver } from "@angular/core";
import { Cms } from "../../shared/cms/cms";
export declare class CmsElement implements DoCheck {
    private cms;
    private viewContainer;
    private resolver;
    element: any;
    oneTime: boolean;
    compRef: ComponentRef;
    ref: string;
    constructor(cms: Cms, viewContainer: ViewContainerRef, resolver: ComponentResolver);
    ngOnInit(): void;
    render(): void;
    ngDoCheck(): void;
}
