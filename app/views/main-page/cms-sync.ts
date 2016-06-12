import {Cms} from "../../shared/cms/cms";
import {Component, forwardRef, Inject} from "@angular/core";
/**
 * Created by tran on 12/06/16.
 */


@Component({
    selector: "cmsSync",
    template: `
        <GridLayout row="0" columns="3*,2*" rows="auto">
            <TextField [(ngModel)]="cms.basePath" col="0"></TextField>
            <Button text="Sync" (tap)="cms.sync()" col="1" style="color:red"></Button>
        </GridLayout>
        `,
    directives: []
})
export class cmsSync {
    constructor(@Inject(forwardRef(() => Cms)) private cms:Cms) {
    }
}
