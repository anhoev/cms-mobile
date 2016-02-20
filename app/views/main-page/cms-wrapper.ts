import {Component, DynamicComponentLoader, Input, Output, ElementRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container, ContainerService} from "../../shared/cms/cms";
const _ = global._ = require('lodash');
const http = require("http");
import {CmsContainer} from './cms-container';
const JsonFn = require('json-fn');

function toComponent(template:string, name:String, fn, serverFn, containers = [], directives = []) {
    directives.push(NgStyle, CmsContainer);
    @Component({
        selector: 'WrapLayout[dynamic-component]',
        template,
        directives,
        providers: [ContainerService]
    })
    class DynamicComponent {

        constructor(private cms:Cms, private containerService:ContainerService) {
            containerService.data = {containers};

            this.fn = fn

            function post(link, body) {
                return http.request({
                    url: cms.basePath + link,
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    content: JsonFn.stringify(body)
                }).then(function (response) {
                    return {data: JsonFn.parse(response.content.toString())};
                })
            }

            this.serverFn = {};
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

    constructor(private loader:DynamicComponentLoader, private elementRef:ElementRef, private cms:Cms) {}

    ngOnInit() {
        try {
            const Type = this.cms.data.types['Wrapper'];
            const {template, serverFn, fn} = _.find(Type.store, (wrapper, name) => name = this.name);
            this.loader.loadNextToLocation(toComponent(template, this.name, fn, serverFn), this.elementRef);
        } catch (e) {
            console.warn(e);
        }
    }
}
