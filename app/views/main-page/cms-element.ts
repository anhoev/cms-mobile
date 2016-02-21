import {Component, DynamicComponentLoader, Input, Output, ElementRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const _ = global._ = require('lodash');
const http = require("http");
import {CmsContainer} from './cms-container';
import {CmsWrapper} from "./cms-wrapper";

function toComponent(template:string, model:any, type:String, containers, directives = []) {
    directives.push(NgStyle, CmsContainer, CmsWrapper);
    @Component({
        selector: 'WrapLayout[dynamic-component]',
        template,
        directives,
        providers: [ContainerService]
    })
    class DynamicComponent {
        public model
        public fn
        public serverFn

        constructor(private cms:Cms, private containerService:ContainerService) {
            containerService.data = {containers};

            this.model = model;
            this.fn = {};
            _.each(cms.data.types[type].fn, (f, k) => this.fn[k] = f.bind(this.model))

            this.model.$find = (_type, ObjId) => {
                return _.find(cms.data.types[_type].list, {_id: ObjId instanceof Object ? ObjId._id : ObjId});
            }

            function post(link, body) {
                return http.request({
                    url: cms.basePath + link,
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    content: JSON.stringify(body)
                }).then(function (response) {
                    return {data: response.content.toString()};
                })
            }

            this.serverFn = {};
            _.each(cms.data.types[type].serverFn, (fn, k) => {
                fn.bind(this.model)(post, this, type, k);
            })
        }
    }

    return DynamicComponent;
}

@Component({
    selector: "[cms-element]",
    template: ``
})
export class CmsElement {
    @Input() data:any
    public model:any

    constructor(private loader:DynamicComponentLoader, private elementRef:ElementRef, private cms:Cms) {
    }

    ngOnInit() {
        if (this.cms.data.types[this.data.type]) {
            const template:string = this.cms.data.types[this.data.type].template;
            this.model = _.find(this.cms.data.types[this.data.type].list, model => model._id === this.data.ref);
            try {
                this.loader.loadNextToLocation(toComponent(template, this.model, this.data.type, this.data.containers), this.elementRef);
            } catch (e) {
                console.warn(e);
            }
        }
    }
}
