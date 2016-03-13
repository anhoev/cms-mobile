import {Component, DynamicComponentLoader, Input, Output, ElementRef, forwardRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
import {CmsContainer} from './cms-container';
import {CmsWrapper} from "./cms-wrapper";
import {Inject} from "angular2/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
const _ = require('lodash');
import {StandardType} from "../../shared/cms/cms";
import {toCmsElement} from "./cms-element";
import {copyFrom} from "utils/utils";
import {SimpleChange,OnChanges,DoCheck,KeyValueDiffers,KeyValueDiffer} from "angular2/core";
import {Type} from "../../shared/cms/cms";
import {isPresent,isBlank} from "angular2/src/facade/lang";
import {ChangeDetectorRef} from "angular2/core";


@Component({
    selector: '[cmsFragment]',
    template: ``
})
export class CmsFragment implements DoCheck {
    @Input() model:any
    @Input() cmsFragment:string
    @Input() save:string
    public containers:Container[]
    public Layout:any
    public bind:any
    private BindType:string;
    private differ:KeyValueDiffer;

    constructor(private loader:DynamicComponentLoader, private elementRef:ElementRef,
                @Inject(forwardRef(() => Cms)) private cms:Cms,
                private differs:KeyValueDiffers,
                private ref: ChangeDetectorRef) {
    }

    ngOnInit() {
        try {
            this.differ = this.differs.find(this.model).create(null);
            this.Layout = this.cms.data.types[StandardType.Layout];
            const layout = _.find(this.Layout.list, layout => layout.ID === this.cmsFragment);
            let {containers, bind, BindType} = this.save ? _.find(layout.SAVE, save => save.name === this.save) : layout.SAVE[0];
            this.BindType = BindType;
            this.bind = bind;
            this.containers = _.cloneDeep(containers);
            //noinspection TypeScriptUnresolvedFunction
            this.Layout.fn.getTreeWithBinding(this.containers, bind, this.model, this.cms.data.types, BindType);
            const element = {ref: layout._id, type: StandardType.Layout, containers: this.containers};
            this.loader.loadNextToLocation(toCmsElement(element), this.elementRef);
        } catch (e) {
            console.warn(e);
        }
    }

    ngDoCheck():any {
        if (isPresent(this.differ)) {
            var changes = this.differ.diff(this.model);
            if (isPresent(changes)) {
                try {
                    //noinspection TypeScriptUnresolvedFunction
                    this.Layout.fn.getTreeWithBinding(this.containers, this.bind, this.model, this.cms.data.types, this.BindType);
                    this.ref.detectChanges();
                } catch (e) {
                }
            }
        }


    }
}
