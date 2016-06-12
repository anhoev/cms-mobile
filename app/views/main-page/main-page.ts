import {Component, forwardRef, Inject} from "@angular/core";
import {RouteData} from "@angular/router-deprecated";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {TextField} from "ui/text-field";
import {CmsContainer} from "./cms-container";
import {Cms, ContainerService} from "../../shared/cms/cms";
import {cmsSync} from "./cms-sync";

const {File, knownFolders, path} = require('file-system');

export function createPage() {
    @Component({
        selector: "main-page",
        template: `
        <GridLayout rows="auto, *">
            <StackLayout [cmsSync]  *ngIf="!cms.alreadyLoaded"></StackLayout>
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
        constructor(private routeData:RouteData,
                    @Inject(forwardRef(() => Cms)) private cms:Cms,
                    @Inject(forwardRef(() => ContainerService)) private containerService:ContainerService) {
            console.log('create page');
            const path = routeData.get('path');
            containerService.data.containers = this.cms.data.containerPage[path];
            this.cms.services[path] = this.containerService;
        }
    }

    return MainPage;
}