import {
    Component,
    Input,
    forwardRef,
    Inject,
    DoCheck,
    KeyValueDiffers,
    PipeTransform,
    Pipe,
    ViewContainerRef,
    ComponentRef,
    ComponentResolver,
    ComponentFactory
} from "@angular/core";
import {NgStyle} from "@angular/common";
import {Cms, ContainerService, Types, injectFnAndServerFn, StandardType} from "../../shared/cms/cms";
import {CmsContainer} from "./cms-container";
import {CmsWrapper} from "./cms-wrapper";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {CmsFragment} from "./cms-fragment";
import {isPresent} from "@angular/core/src/facade/lang";
import {DefaultKeyValueDiffer} from "@angular/core/src/change_detection/differs/default_keyvalue_differ";
import {KeysPipe} from "./KeysPipe";
const http = require("http");
const _ = require('lodash');

function toComponent(template:string, element:any,
                     directives = []) {
    const {containers, type, binding, ref}  = element;
    const model = _.find(Types[element.type].list, {_id: ref});
    directives.push(NgStyle, CmsContainer, CmsWrapper, NS_ROUTER_DIRECTIVES, CmsFragment, CmsElement);
    if (Types[element.type].directives) directives.push(...Types[element.type].directives);
    @Component({
        selector: '[dynamic-component]',
        template,
        directives,
        providers: [ContainerService],
        pipes: [KeysPipe]
    })
    class DynamicComponent implements DoCheck {

        public model;
        public fn:any
        public serverFn:any
        private parentModel;
        private differ;
        private watches = [];

        ngDoCheck():any {
            if (isPresent(this.differ)) {
                const changes:DefaultKeyValueDiffer = this.differ.diff(this.parentModel);
                if (isPresent(changes)) {
                    changes.forEachChangedItem(record => this.watches.forEach(watch => watch(record)));
                }
            }
        }

        constructor(private containerService:ContainerService,
                    private differs:KeyValueDiffers) {
            this.containerService.data = {containers};

            if (binding) {
                this.model = _.cloneDeep(model);
                if (binding.binds) {
                    this.parentModel = binding.parentModel;
                    this.differ = this.differs.find(this.parentModel).create(null);
                    for (const bind of binding.binds) {
                        if (bind.choice === 'model') {
                            const {parentKey, key} = bind.model;
                            this.model[key] = this.parentModel[parentKey]
                            this.watches.push(record => {
                                if (record.key === parentKey) this.model[key] = this.parentModel[parentKey]
                            })
                        } else if (bind.choice === 'scope') {
                            const {key} = bind.scope;
                            this.model[key] = model[key].bind(this.parentModel);
                        }
                    }
                }
            } else {
                this.model = model;
            }

            injectFnAndServerFn(this, type);
        }
    }

    return DynamicComponent;
}

function toArrayComponent(template:string, items:any, prepareElement, directives = []) {
    @Pipe({name: 'prepareElement'})
    class PrepareElement implements PipeTransform {
        transform(item:any):any {
            return prepareElement(item);
        }
    }

    directives.push(NgStyle, CmsElement);
    @Component({
        selector: '[dynamic-component]',
        template,
        directives,
        pipes: [PrepareElement]
    })
    class DynamicComponent {
        private items = items;
    }

    return DynamicComponent;
}

@Component({
    selector: '[cmsElement]',
    template: ``
})
export class CmsElement implements DoCheck {
    @Input() element;
    oneTime = false;
    compRef:ComponentRef;
    ref:string;


    constructor(@Inject(forwardRef(() => Cms)) private cms:Cms, private viewContainer:ViewContainerRef,
                private resolver:ComponentResolver) {
    }

    ngOnInit() {
        if (this.element && !this.oneTime) {
            this.ref = this.element.ref;
            this.oneTime = true;
            this.render();
        }
    }

    render() {
        try {
            console.log('element :' + this.element.type);
            if (this.element.type && _.find(Types[this.element.type].list, {_id: this.element.ref})) {
                let template:string = Types[this.element.type].template;
                let isList = false;
                const {binding} = this.element;
                if (binding && binding.binds) {
                    for (const bind of binding.binds) {
                        //noinspection TypeScriptUnresolvedVariable
                        if (bind.choice === 'array') {
                            isList = true;
                            const {parentKey} = bind.array;
                            const prepareElement = item => {
                                const containers = _.clone(this.element.containers);
                                //noinspection TypeScriptUnresolvedFunction
                                Types[StandardType.Layout].fn.getTreeWithBinding(containers, bind.array.bind, item, binding.BindType);
                                return {type: this.element.type, ref: this.element.ref, containers, binding: {}};
                            }
                            template = `<StackLayout *ngFor="let item of items" cmsElement [element]="item | prepareElement"></StackLayout>`;
                            if (binding.parentModel[parentKey])
                                this.resolver.resolveComponent(toArrayComponent(template, binding.parentModel[parentKey], prepareElement)).then((factory:ComponentFactory<any>) => {
                                    this.compRef = this.viewContainer.createComponent(factory);
                                });
                        }
                    }
                }

                if (!isList)
                    this.resolver.resolveComponent(toComponent(template, this.element)).then((factory:ComponentFactory<any>) => {
                        this.compRef = this.viewContainer.createComponent(factory);
                    });
            }
        } catch (e) {
            console.warn(e);
        }
    }

    ngDoCheck() {
        if (this.element && this.ref !== this.element.ref) {
            this.ref = this.element.ref;
            if (this.compRef) this.compRef.dispose();
            this.render();
        }
    }
}
