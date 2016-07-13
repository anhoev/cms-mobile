import {Component, forwardRef, Inject} from "@angular/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {CmsContainer} from "./cms-container";
import {Cms, ContainerService} from "../../shared/cms/cms";
import {cmsSync} from "./cms-sync";

export function createPage(path) {
    return @Component({
        selector: "main-page",
        template: `
        <GridLayout rows="auto, *">
            <StackLayout row="0" cmsSync *ngIf="!cms.alreadyLoaded"></StackLayout>
            <GridLayout row="1">
                <template row="1" ngFor let-container [ngForOf]="containerService.data.containers">
                    <template [cmsContainer]="container.name" ></template>
                </template>
            </GridLayout>
        </GridLayout >
        `,
        directives: [CmsContainer, NS_ROUTER_DIRECTIVES, cmsSync],
        providers: [forwardRef(() => ContainerService)]
    })
    class MainPage {
        path = path;

        constructor(@Inject(forwardRef(() => Cms)) private cms:Cms,
                    @Inject(forwardRef(() => ContainerService)) private containerService:ContainerService) {
            console.log('create page');
            containerService.data.containers = this.cms.data.containerPage[this.path];
            console.log(JSON.stringify(containerService.data.containers));
            this.cms.services[this.path] = this.containerService;
        }
    }
}