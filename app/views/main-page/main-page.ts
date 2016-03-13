import {Component, DynamicComponentLoader, ElementRef, TemplateRef} from "angular2/core";
import {Router} from "angular2/router";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {TextField} from "ui/text-field";
import {CmsContainer} from "./cms-container";
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
import {CanReuse} from "angular2/router";
import {ComponentInstruction} from "angular2/router";
import {OnReuse} from "angular2/router";
import {RouteData} from "angular2/router";
import {forwardRef} from "angular2/core";
import {Inject} from "angular2/core";
import {_} from "../../main";
import {ComponentRef} from "angular2/core";
import {Injector} from "angular2/core";
import {provide} from "angular2/core";
import {CmsContainer} from "./cms-container";

const {File, knownFolders, path} = require('file-system');

export function createPage() {
    @Component({
        selector: "main-page",
        template: `
        <DockLayout stretchLastChild="true" >
            <GridLayout dock="top" columns="3*,2*" rows="auto">
                <TextField [(ngModel)]="cms.basePath" col="0" ></TextField>
                <Button text="Sync" (tap)="cms.sync()" col="1"></Button>
            </GridLayout>
            <template ngFor #container [ngForOf]="containerService.data.containers">
                <template [cmsContainer]="container.name" ></template>
            </template>
        </DockLayout >
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