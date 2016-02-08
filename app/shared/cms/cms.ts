import {Injectable} from 'angular2/core';

export interface Container {
    name: string
    elements: Element[]
}

export interface Element {
    type: string
    ref: string
    _data: any
}

export interface Type {
    list: any[],
    template: string
}

@Injectable()
export class Cms {
    public containers: {[type: string]: Container}
    public types: {[type: string]: Type}
    constructor() {
        this.types = {};
        this.types.Button = {
            template: `<Button [text]="model.text" [style]="setStyles()"></Button>`
        }
    }
}