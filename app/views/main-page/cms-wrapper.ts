import {
    Component,
    Input,
    ComponentResolver,
    ComponentFactory,
    ViewContainerRef,
    ComponentRef,
    forwardRef,
    Inject
} from "@angular/core";
import {NgStyle} from "@angular/common";
import {Cms, ContainerService, Types, injectFnAndServerFnByWrapper} from "../../shared/cms/cms";
import {CmsContainer} from "./cms-container";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {Router} from "@angular/router-deprecated";
import {CmsFragment} from "./cms-fragment";
import {_} from "../../main";
import {CmsElement} from "./cms-element";
const http = require("http");

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

    constructor(@Inject(forwardRef(() => Cms)) private cms:Cms,
                private viewContainer:ViewContainerRef,
                private resolver:ComponentResolver) {
    }

    ngOnInit() {
        try {
            const Type = Types['Wrapper'];
            const wrapper = _.find(Type.store, (wrapper, name) => name === this.name);
            if (wrapper) {
                this.resolver.resolveComponent(toComponent(wrapper.template, this.name)).then((factory:ComponentFactory<any>) => {
                    this.viewContainer.createComponent(factory);
                });
            } else {
                const {list, element, Fn} = this.element;

                if (!Type.store[this.name] && !list['null']) {
                    if (list.layout) {
                        const template = `<StackLayout *ngFor="#element of result" [cmsFragment]="layout.ID" [model]="element"></StackLayout>`
                        this.resolver.resolveComponent(toComponent(template)).then((factory:ComponentFactory<any>) => {
                            let ref:ComponentRef<{result:any, layout:any, element:any}> = this.viewContainer.createComponent(factory);
                            ref.instance.result = list.query.bind(this.element)() || Types[list.BindType].list;
                            ref.instance.layout = list.layout;
                            if (Fn && Fn()) ref.instance.element.fn = _.mapValues(Fn(), f => f.bind(this.element));
                        });
                    } else {
                        const template = `<StackLayout *ngFor="#element of result" cmsElement [element]="{type:type,ref:element._id}" ></StackLayout>`
                        this.resolver.resolveComponent(toComponent(template)).then((factory:ComponentFactory<any>) => {
                            let ref:ComponentRef<{result:any, layout:any, element:any, type:any}> = this.viewContainer.createComponent(factory);
                            ref.instance.result = list.query.bind(this.element)() || Types[list.BindType].list;
                            ref.instance.type = list.BindType;
                            if (Fn && Fn()) ref.instance.element.fn = _.mapValues(Fn(), f => f.bind(this.element));
                        });
                    }
                } else {
                    const {BindType, layout, model} = element;
                    const template = `<StackLayout cmsElement [element]="{type:type,ref:element.element.model._id}"></StackLayout>`
                    this.resolver.resolveComponent(toComponent(template)).then((factory:ComponentFactory<any>) => {
                        let ref:ComponentRef<{result:any, layout:any, element:any, type:any}> = this.viewContainer.createComponent(factory);
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
