import { ComponentResolver, ViewContainerRef } from "@angular/core";
import { ContainerService } from "../../shared/cms/cms";
export declare class CmsContainer {
    private containerService;
    private viewContainer;
    private resolver;
    name: String;
    constructor(containerService: ContainerService, viewContainer: ViewContainerRef, resolver: ComponentResolver);
    ngOnInit(): void;
}
