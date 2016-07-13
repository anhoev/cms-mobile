import { ComponentResolver, ViewContainerRef } from "@angular/core";
import { Cms } from "../../shared/cms/cms";
export declare class CmsWrapper {
    private cms;
    private viewContainer;
    private resolver;
    name: string;
    element: any;
    constructor(cms: Cms, viewContainer: ViewContainerRef, resolver: ComponentResolver);
    ngOnInit(): void;
}
