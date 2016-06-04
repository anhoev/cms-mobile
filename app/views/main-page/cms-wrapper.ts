import {Component, DynamicComponentLoader, Input, Output, ElementRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const http = require("http");
import {CmsContainer} from './cms-container';
import {forwardRef} from "angular2/core";
import {Inject} from "angular2/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {Router} from "angular2/router";
import {CmsFragment} from "./cms-fragment";
import {Types} from "../../shared/cms/cms";
import {injectFnAndServerFn} from "../../shared/cms/cms";
import {injectFnAndServerFnByWrapper} from "../../shared/cms/cms";
import {_} from "../../main";
import {CmsElement} from "./cms-element";
import {StandardType} from "../../shared/cms/cms";

function toComponent(template:string, name:String, containers = [], directives = []) {
    directives.push(NgStyle, CmsContainer, NS_ROUTER_DIRECTIVES, CmsFragment, CmsElement);
    @Component({
        selector: '[dynamic-component]',
        template,
        directives,
        providers: [ContainerService]
    })
    class DynamicComponent {
        private model:any = {};
        private element = {element: {model: {_id: null}}}

        constructor(private containerService:ContainerService, private router:Router) {
            this.containerService.data = {containers};
            this.model.router = router;
            if (name) injectFnAndServerFnByWrapper(this, name)
        }
    }

    return DynamicComponent;
}

@Component({
    selector: "[cms-wrapper]",
    template: ``
})
export class CmsWrapper {
    @Input() name:string
    @Input() element:any

    constructor(private loader:DynamicComponentLoader, private elementRef:ElementRef, @Inject(forwardRef(() => Cms)) private cms:Cms) {
    }

    ngOnInit() {
        try {
            const Type = Types['Wrapper'];
            const wrapper = _.find(Type.store, (wrapper, name) => name === this.name);
            if (wrapper) {
                this.loader.loadNextToLocation(toComponent(wrapper.template, this.name), this.elementRef);
            } else {
                const {list, element, Fn} = this.element;

                if (!Type.store[this.name] && !list['null']) {
                    if (list.layout) {
                        const template = `<StackLayout *ngFor="#element of result" [cmsFragment]="layout.ID" [model]="element"></StackLayout>`
                        this.loader.loadNextToLocation(toComponent(template), this.elementRef).then(ref => {
                            ref.instance.result = list.query.bind(this.element)() || Types[list.BindType].list;
                            ref.instance.layout = list.layout;
                            if (Fn && Fn()) ref.instance.element.fn = _.mapValues(Fn(), f => f.bind(this.element));
                        });
                    } else {
                        const template = `<StackLayout *ngFor="#element of result" cmsElement [element]="{type:type,ref:element._id}" ></StackLayout>`
                        this.loader.loadNextToLocation(toComponent(template), this.elementRef).then(ref => {
                            ref.instance.result = list.query.bind(this.element)() || Types[list.BindType].list;
                            ref.instance.type = list.BindType;
                            if (Fn && Fn()) ref.instance.element.fn = _.mapValues(Fn(), f => f.bind(this.element));
                        });
                    }
                } else {
                    const {BindType,layout, model} = element;
                    const template = `<StackLayout cmsElement [element]="{type:type,ref:element.element.model._id}"></StackLayout>`
                    this.loader.loadNextToLocation(toComponent(template), this.elementRef).then(ref => {
                        ref.instance.element = this.element;
                        ref.instance.type = BindType;
                        if (Fn && Fn()) ref.instance.element.fn = _.mapValues(Fn(), f => f.bind(this.element));
                    });
                    // todo: layout
                }
            }
        } catch (e) {
            console.warn(e);
        }
    }
}
