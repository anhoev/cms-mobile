import {Component, DynamicComponentLoader, Input, ElementRef} from "angular2/core";
import {NgStyle} from 'angular2/common';
import {Cms, Container} from "../../shared/cms/cms";

function toComponent(template:string, model:any, directives = []) {
    directives.push(NgStyle);
    @Component({
        selector: 'dynamic-component',
        template,
        directives
    })
    class DynamicComponent {
        public model

        constructor() {
            this.model = model;
            this.setStyles = () => {
                let styles = '';
                if (model.styles) {
                    if (model.styles.backgroundColor) styles += `background-color:${model.styles.backgroundColor};`
                    if (model.styles.color) styles += `color:${model.styles.color};`
                }
                return styles;
            }
        }
    }

    return DynamicComponent;
}

@Component({
    selector: "cms-element",
    providers: [Cms],
    template: ``
})
export class CmsElement {
    @Input() data:any
    public model:any
    loader:DynamicComponentLoader
    elementRef:ElementRef
    cms:Cms

    constructor(loader:DynamicComponentLoader, elementRef:ElementRef, cms:Cms) {
        this.loader = loader;
        this.elementRef = elementRef;
        this.cms = cms;
    }

    ngOnInit() {
        if (this.cms.types[this.data.type]) {
            const template:string = this.cms.types[this.data.type].template;
            this.model = this.data._data;
            this.loader.loadNextToLocation(toComponent(template, this.model), this.elementRef);
        }

    }
}
