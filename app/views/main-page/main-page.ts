import {Component, forwardRef, Inject} from "@angular/core";
import {RouteData} from "@angular/router-deprecated";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {TextField} from "ui/text-field";
import {CmsContainer} from "./cms-container";
import {Cms, ContainerService} from "../../shared/cms/cms";

const {File, knownFolders, path} = require('file-system');

export function createPage() {
    @Component({
        selector: "main-page",
        template: `
        <GridLayout rows="auto, *">
            <GridLayout row="0" columns="3*,2*" rows="auto">
                <TextField [(ngModel)]="cms.basePath" col="0"></TextField>
                <Button text="Sync" (tap)="cms.sync()" col="1" style="color:red"></Button>
            </GridLayout>
            <GridLayout row="1">
                <template row="1" ngFor let-container [ngForOf]="containerService.data.containers">
                    <template [cmsContainer]="container.name" ></template>
                </template>
            </GridLayout>
        </GridLayout >
        `,
        directives: [CmsContainer, NS_ROUTER_DIRECTIVES],
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