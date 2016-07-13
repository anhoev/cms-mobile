import { ComponentResolver, ViewContainerRef } from "@angular/core";
import { Cms, Container } from "../../shared/cms/cms";
export declare class CmsFragment {
    private cms;
    private viewContainer;
    private resolver;
    model: any;
    cmsFragment: string;
    save: string;
    containers: Container[];
    Layout: any;
    bind: any;
    private BindType;
    constructor(cms: Cms, viewContainer: ViewContainerRef, resolver: ComponentResolver);
    ngOnInit(): void;
}
