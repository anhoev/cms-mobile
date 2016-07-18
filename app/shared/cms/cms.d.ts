import { Router } from "@angular/router";
export declare let Types: {
    [type: string]: Type;
};
export declare let cms: Cms;
export interface Bind {
    choice: string;
    model: {
        parentKey: string;
        key: string;
    };
    array: any;
    dynamic: any;
    serverFn: any;
    fn: any;
}
export interface Binding {
    binds: Bind[];
    parentModel: any;
}
export interface Container {
    name: string;
    elements: Element[];
}
export interface Element {
    type: string;
    ref: string;
    _data: any;
}
export interface Type {
    queryList: any[];
    directives: any[];
    fn: any;
    serverFn: any;
    list: any[];
    template: string;
    store: {
        [type: string]: {
            fn: any;
            serverFn: any;
            template: string;
            directives: any;
        };
    };
    info: any;
}
export declare enum StandardType {
    Wrapper,
    Layout,
}
export declare class Cms {
    private router;
    basePath: any;
    data: {
        types: {
            [type: string]: Type;
        };
        containerPage: {
            [path: string]: {
                [type: string]: Container;
            };
        };
    };
    services: {
        [type: string]: ContainerService;
    };
    routes: {
        path: string;
        component: any;
        as: string;
    }[];
    cache: any;
    initTypes: any;
    alreadyLoaded: boolean;
    constructor(router: Router);
    sync(): void;
    load(): void;
    walkInContainers(containers: any, cb: any): void;
    findFnByRef(type: any, ref: any): any;
    findFnByID(type: any, ID: any): any;
    findByRef(type: any, ref: any): any;
    findByID(type: any, ID: any): any;
    createElement(type: any, content: any, cb: any): void;
    loadElements(type: any, cb: any, params: any): void;
    updateElement(type: any, model: any): void;
}
export declare class ContainerService {
    data: {
        containers: {
            [type: string]: Container;
        };
        element: any;
    };
}
export declare class FragmentService {
    data: {};
}
export declare function injectFnAndServerFn(scope: any, type: any): void;
export declare function injectFnAndServerFnByWrapper(scope: any, name: any): void;
