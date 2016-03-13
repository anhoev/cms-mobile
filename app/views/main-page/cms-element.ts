import {Component, DynamicComponentLoader, Input, Output, ElementRef, forwardRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const _ = global._ = require('lodash');
const http = require("http");
import {CmsContainer} from './cms-container';
import {CmsWrapper} from "./cms-wrapper";
import {Inject} from "angular2/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";
import {CmsFragment} from "./cms-fragment";

function toComponent(template:string, model:any, type:String, containers,
                     binding: {binds: {type: any, key: any, model: any} [], model: any, parentModel: any},
                     directives = []) {
    directives.push(NgStyle, CmsContainer, CmsWrapper, NS_ROUTER_DIRECTIVES, CmsFragment);
    @Component({
        selector: '[dynamic-component]',
        template,
        directives,
        providers: [ContainerService]
    })
    class DynamicComponent {
        public model:any
        public fn:any
        public serverFn:any

        constructor(private cms:Cms, private containerService:ContainerService) {
            this.containerService.data = {containers};

            if (binding) {
                this.model = _.assign(_.cloneDeep(model), binding);
                if (binding.binds) {
                    for (const bind of binding.binds) {
                        if (bind.type === 'model') {
                            _.assign(this.model, bind);
                        } else if (bind.type === 'fn') {
                            _.assign(this.model, bind);
                        } else if (bind.type === 'scope') {
                            this.model[bind.key] = model[bind.key].bind(bind.model);
                        }
                    }
                }
                binding.model = this.model;
                this.model.parent = binding.parentModel;
            } else {
                this.model = model;
            }
            this.fn = {};
            _.each(this.cms.data.types[type].fn, (f, k) => this.fn[k] = f.bind(this.model))

            this.model.$find = (_type, ObjId) => {
                return _.find(this.cms.data.types[_type].list, {_id: ObjId instanceof Object ? ObjId._id : ObjId});
            }

            const basePath = this.cms.basePath;

            function post(link, body) {
                return http.request({
                    url: basePath + link,
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    content: JSON.stringify(body)
                }).then(function (response) {
                    return {data: response.content.toString()};
                })
            }

            this.serverFn = {};
            _.each(this.cms.data.types[type].serverFn, (fn, k) => {
                fn(post, this, type, k);
            })
        }

    }

    return DynamicComponent;
}
export function toCmsElement(element) {
    @Component({
        selector: '[cms-element]',
        template: ``
    })
    class CmsElement {
        public model:any;

        constructor(private loader:DynamicComponentLoader, private elementRef:ElementRef,
                    @Inject(forwardRef(() => Cms)) private cms:Cms) {
        }

        ngOnInit() {
            try {
                const template:string = this.cms.data.types[element.type].template;
                this.model = _.find(this.cms.data.types[element.type].list, model => model._id === element.ref);
                this.loader.loadNextToLocation(toComponent(template, this.model, element.type, element.containers, element.binding), this.elementRef);
            } catch (e) {
                console.warn(e);
            }
        }
    }
    return CmsElement;
}