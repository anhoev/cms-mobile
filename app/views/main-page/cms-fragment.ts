import {Component, DynamicComponentLoader, Input, Output, ElementRef, forwardRef} from "@angular/core";
import {NgStyle} from '@angular/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
import {CmsContainer} from './cms-container';
import {CmsWrapper} from "./cms-wrapper";
import {Inject} from "@angular/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {_} from "../../main"
import {StandardType} from "../../shared/cms/cms";
import {CmsElement} from "./cms-element";
import {Type} from "../../shared/cms/cms";
import {Types} from "../../shared/cms/cms";


@Component({
    selector: '[cmsFragment]',
    template: ``
})
export class CmsFragment {
    @Input() model:any
    @Input() cmsFragment:string
    @Input() save:string
    public containers:Container[]
    public Layout:any
    public bind:any
    private BindType:string;

    constructor(private loader:DynamicComponentLoader, private elementRef:ElementRef,
                @Inject(forwardRef(() => Cms)) private cms:Cms) {
    }

    ngOnInit() {
        try {
            this.Layout = Types[StandardType.Layout];
            const layout = _.find(this.Layout.list, layout => layout.ID === this.cmsFragment);
            //noinspection TypeScriptUnresolvedVariable
            let {containers, bind, BindType} = this.save ? _.find(layout.SAVE, save => save.name === this.save) : layout.SAVE[0];
            this.BindType = BindType;
            this.bind = bind;
            this.containers = _.cloneDeep(containers);
            //noinspection TypeScriptUnresolvedFunction
            this.Layout.fn.getTreeWithBinding(this.containers, bind, this.model, BindType);
            const element = {ref: layout._id, type: StandardType.Layout, containers: this.containers};
            this.loader.loadNextToLocation(CmsElement, this.elementRef).then(ref => {
                ref.instance.element = element;
                ref.instance.ngOnInit();
            });
        } catch (e) {
            console.warn(e);
        }
    }

}
