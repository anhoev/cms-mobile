import {Component, forwardRef, Inject} from "@angular/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {CmsContainer} from "./cms-container";
import {Cms, ContainerService} from "../../shared/cms/cms";
import {cmsSync} from "./cms-sync";
import {ActivatedRoute} from "@angular/router";
import {KeysPipe} from "./KeysPipe";

@Component({
    selector: "main-page",
    template: `
        <GridLayout rows="auto, *">
            <StackLayout row="0" cmsSync *ngIf="!cms.alreadyLoaded"></StackLayout>
            <GridLayout row="1">
                <template row="1" ngFor let-container [ngForOf]="containerService.data.containers | keys">
                    <template [cmsContainer]="container" ></template>
                </template>
            </GridLayout>
        </GridLayout >
        `,
    directives: [CmsContainer, NS_ROUTER_DIRECTIVES, cmsSync],
    providers: [forwardRef(() => ContainerService)],
    pipes: [KeysPipe]
})
export class MainPage {
    path;

    constructor(@Inject(forwardRef(() => Cms)) private cms:Cms,
                @Inject(forwardRef(() => ContainerService)) private containerService:ContainerService,
                private router:ActivatedRoute) {
        this.path = router.snapshot.data['path'];
        containerService.data.containers = this.cms.data.containerPage[this.path];
        console.log(JSON.stringify(containerService.data.containers));
        this.cms.services[this.path] = this.containerService;
    }
}
