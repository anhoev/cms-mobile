import {Component, DynamicComponentLoader, Input, Output, ElementRef, forwardRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const _ = global._ = require('lodash');
const http = require("http");
import {CmsContainer} from './cms-container';
import {CmsWrapper} from "./cms-wrapper";
import {Inject} from "angular2/core";
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router";

function toComponent(template:string, model:any, type:String, containers, directives = []) {
    directives.push(NgStyle, CmsContainer, CmsWrapper, NS_ROUTER_DIRECTIVES);
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

            this.model = model;
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
        public model:any

        constructor(private loader:DynamicComponentLoader, private elementRef:ElementRef,
                    @Inject(forwardRef(() => Cms)) private cms:Cms,
                    @Inject(forwardRef(() => ContainerService)) private containerService:ContainerService) {
        }

        ngOnInit() {
            debugger;
            try {
                /*if (this.data) {
                 data = this.data;
                 } else {
                 data = this.containerService.data.element;
                 }*/
                const template:string = this.cms.data.types[element.type].template;
                this.model = _.find(this.cms.data.types[element.type].list, model => model._id === element.ref);
                this.loader.loadNextToLocation(toComponent(template, this.model, element.type, element.containers), this.elementRef);
            } catch (e) {
            }

        }
    }
    return CmsElement;
}