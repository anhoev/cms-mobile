import {Component, DynamicComponentLoader, Input, Output, ElementRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const _ = global._ = require('lodash');
const http = require("http");
import {CmsContainer} from './cms-container';
import {forwardRef} from "angular2/core";
import {Inject} from "angular2/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";

import {Router} from "angular2/router";
import {CmsFragment} from "./cms-fragment";
const JsonFn = require('json-fn');

function toComponent(template:string, name:String, fn, serverFn, result, layout, containers = [], directives = []) {
    directives.push(NgStyle, CmsContainer, NS_ROUTER_DIRECTIVES, CmsFragment);
    @Component({
        selector: 'WrapLayout[dynamic-component]',
        template,
        directives,
        providers: [ContainerService]
    })
    class DynamicComponent {
        private fn = {};
        private serverFn = {};
        private state = {};
        private model:any = {};
        private result = result;
        private layout = layout;

        constructor(private cms:Cms, private containerService:ContainerService, private router:Router) {
            this.containerService.data = {containers};

            this.model.router = router;
            _.each(fn, (f, k) => this.fn[k] = f.bind(this));
            const basePath = this.cms.basePath;

            function post(link, body) {
                return http.request({
                    url: basePath + link,
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    content: JsonFn.stringify(body)
                }).then(function (response) {
                    return {data: JsonFn.parse(response.content.toString())};
                })
            }

            _.each(serverFn, (fn, k) => {
                fn(post, this, name, k);
            })
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
            const Type = this.cms.data.types['Wrapper'];
            let template, serverFn, fn;
            const wrapper = _.find(Type.store, (wrapper, name) => name === this.name);
            if (wrapper) {
                template = wrapper.template;
                serverFn = wrapper.serverFn;
                fn = wrapper.fn;
            }

            let result, layout, BindType;

            const {list, element, Fn:_fn} = this.element;
            //noinspection TypeScriptUnresolvedVariable
            if (!Type.store[this.name] && !list['null']) {
                const {query} = list;
                BindType = list.BindType;
                result = query.bind(this.element)() || this.cms.data.types[BindType].list;
                layout = list.layout;
                template = `
                <StackLayout *ngFor="#element of result" [cmsFragment]="layout.ID" [model]="element"></StackLayout>
                `
            }
            /* else if (!Type.store[this.name] && !element.null) {
             const {layout, model, query} = element;
             BindType = list.BindType;
             result = query.bind(this.element)();
             if (!result) result = model;
             layout = layout;
             template = `<br><div cms-element="{type:type,ref:result._id}"></div>`
             }*/
            /*if (_fn) {
             this.element.fn = _.mapValues(_fn(), f => f.bind(this.element));
             vm.element.fn.sync = function () {
             scope.model = vm.element.element.model;
             element.html(`${template}`);
             $compile(element.contents())(scope);
             }
             }*/


            this.loader.loadNextToLocation(
                toComponent(template, this.name, fn, serverFn, result, layout),
                this.elementRef);
        } catch (e) {
            console.warn(e);
        }
    }
}
