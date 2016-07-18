import {JsonFn, _} from "../../global.lib";
import {Injectable} from "@angular/core";
import {DynamicRouteConfigurator} from "../route/dynamic-route";
import {createPage, MainPage} from "../../views/main-page/main-page";
import {Router, RouterConfig} from "@angular/router";
export let Types:{[type:string]:Type};
export let cms:Cms;
const {File, Folder, knownFolders, path} = require('file-system');
const http = require("http");
const {toFile} = require('../utils/to-file');
const CONTAINER_DIRECTORY = 'containerDirectory';
const cache = require('nativescript-cache');
const base64 = require('base-64');


export interface Bind {
    choice:string,
    model:{parentKey:string, key:string},
    array:any,
    dynamic:any,
    serverFn:any,
    fn:any
}

export interface Binding {
    binds:Bind[],
    parentModel:any
}

export interface Container {
    name:string
    elements:Element[]
}

export interface Element {
    type:string
    ref:string
    _data:any
}

export interface Type {
    queryList:any[];
    directives:any[];
    fn:any,
    serverFn:any,
    list:any[],
    template:string,
    store:{[type:string]:{fn:any, serverFn:any, template:string, directives:any}},
    info:any
}

export enum StandardType {
    Wrapper = 'Wrapper',
    Layout = 'Layout'
}

@Injectable()
export class Cms {
    public basePath = cache.get('cms.basePath') || 'http://localhost:8888';
    public data:{
        types:{[type:string]:Type},
        containerPage:{[path:string]:{[type:String]:Container}}
    } = {containerPage: {}, types: {}};
    public services:{[type:string]:ContainerService} = {};
    public routes:{path:string, component:any, as:string}[] = [];
    public cache = cache;
    public initTypes;
    public alreadyLoaded = cache.get('cms.alreadyLoaded') === 'true';

    constructor(private router:Router) {
        //noinspection TypeScriptUnresolvedVariable
        cms = global.cms = this;
    }

    public sync() {
        cache.set('cms.basePath', cms.basePath);
        http.request({url: this.basePath + "/cms-mobile", method: "GET"}).then(res => {
            const {tree:content, Types} = JsonFn.parse(res.content.toString(), true);
            const basePath = path.normalize(knownFolders.documents().path + '/page');
            const root = {};

            function walk(path, node, _node) {
                if (node.file) {
                    if (node.text.endsWith('index.json')) {
                        console.log(`cms.page/${path}${path !== '' ? '/' : ''}${node.text}`);
                        cache.set(`cms.page/${path}${path !== '' ? '/' : ''}${node.text}`, base64.decode(node.file));
                    } else {
                        toFile(`${basePath}/${path}${path !== '' ? '/' : ''}${node.text}`, node.file);
                    }
                } else if (node.type === 'directory' || node.type === CONTAINER_DIRECTORY) {
                    let path2 = `${path}${path !== '' ? '/' : ''}${node.text !== 'root' ? node.text : ''}`;
                    if (node.text !== 'root') {
                        Folder.fromPath(`${basePath}/${path2}`);
                    }
                    if (node.type === CONTAINER_DIRECTORY || node.text === 'root') {
                        _node.type = CONTAINER_DIRECTORY;
                        _node.path = path2;
                        _node.text = node.text ? node.text : 'Root';
                    }
                    _node.children = [];
                    node.children.forEach(n => {
                        const subNode = {};
                        walk(path2, n, subNode);
                        if (subNode.hasOwnProperty('type')) _node.children.push(subNode);
                    });
                }
            }

            walk('', content, root);
            cache.set('cms.data', JsonFn.stringify(Types));
            cache.set('cms.root', JsonFn.stringify(root));
            this.load();

            this.alreadyLoaded = true;
            cache.set('cms.alreadyLoaded', 'true');
        })
    }

    public load() {
        const root = JsonFn.parse(cache.get('cms.root') || `{"path": "", "type": "containerDirectory", "text": "Root", "children": []}`, true);

        this.data.types = JsonFn.parse(cache.get('cms.data') || `{}`, true);

        //noinspection TypeScriptUnresolvedVariable
        Types = global.Types = this.data.types;

        if (this.initTypes) this.initTypes();

        const entry = node => {
            if (node.type === CONTAINER_DIRECTORY) {
                const index = cache.get(`cms.page/${node.path}${node.path !== '' ? '/' : ''}index.json`);
                const containerPage = JsonFn.parse(index || '{}', true);
                const _path = _.capitalize(node.path);
                this.data.containerPage[_path] = containerPage.containers;
                // todo: page
                if (this.services[_path]) {
                    this.services[_path].data.containers = this.data.containerPage[_path];
                }

                // create Page
                const route = {
                    path: _path,
                    component: MainPage,
                    // data: {path: _path}
                    //name: _.capitalize(node.text),
                };
                this.routes.push(route);
            }
            node.children.forEach(n => entry(n));
        }

        this.routes = [];
        entry(root);

        console.log(JSON.stringify(this.routes));
        //noinspection TypeScriptUnresolvedVariable
        this.router.config.push(...this.routes);

        // get data from cache (if element is not viewelement)

        for (let type in Types) {
            //noinspection TypeScriptUnresolvedVariable
            if (!Types[type].info.isViewElement) {
                console.log('Get list for ' + type);
                try {
                    Types[type].list = JsonFn.parse(cache.get(`Types.${type}.list`), true);
                } catch (e) {
                    console.warn(e);
                }
            }
        }
    }

    public walkInContainers(containers, cb) {
        function walk(containers) {
            _.each(containers, container => {
                _.each(container.elements, element => {
                    //noinspection TypeScriptUnresolvedVariable
                    const Type = Types[element.type];
                    const e = _.find(Type.list, e => e._id === element.ref);
                    cb(element, e, container);
                    if (element.containers && element.containers.length > 0) {
                        walk(element.containers);
                    }
                });
            });
        }

        walk(containers);
    }

    public findFnByRef(type, ref) {
        const fn = JsonFn.clone(Types[type].fn);
        _.each(fn, (f, k) => fn[k] = f.bind(this.findByRef(type, ref)));
        return fn;
    }

    public findFnByID(type, ID) {
        const fn = JsonFn.clone(Types[type].fn);
        _.each(fn, (f, k) => fn[k] = f.bind(_.find(Types[type].list, {ID})));
        return fn;
    }

    public findByRef(type, ref) {
        return _.find(Types[type].list, {_id: ref});
    }

    public findByID(type, ID) {
        return _.find(Types[type].list, {ID});
    }

    public createElement(type, content, cb) {
        http.request({
            url: `${this.basePath}/cms-types/${type}`,
            headers: {"Content-Type": "application/json"},
            method: "POST",
            content: JsonFn.stringify(content)
        }).then(res => {
            const {data:e} = JsonFn.parse(res.content.toString(), true);
            const ref = e._id;
            Types[type].list = Types[type].list || [];
            Types[type].list.push(e);
            if (cb) cb(_.find(Types[type].list, {_id: ref}));
        }, e => console.log(e));
    }

    public loadElements(type, cb, params) {
        http.request({url: `${this.basePath}/api/v1/${type}?${params}`, method: 'GET'}).then(res => {
            const list = JsonFn.parse(res.content.toString(), true);
            if (params) {
                this.data.types[type].list = _.unionWith(this.data.types[type].list, list, (e1, e2) => e1._id === e2._id);
                this.data.types[type].queryList = list.map(e => _.find(this.data.types[type].list, e2 => e2._id === e._id));
                if (cb) cb(this.data.types[type].queryList);
            } else {
                this.data.types[type].list = list;
                if (cb) cb(this.data.types[type].list);
            }
            cache.set(`Types.${type}.list`, JsonFn.stringify(this.data.types[type].list));
        });
    }

    public updateElement(type, model) {
        http.request({
            url: `${this.basePath}/api/v1/${type}/${model._id}`,
            headers: {"Content-Type": "application/json"},
            method: 'POST',
            content: JsonFn.stringify(model)
        }).then(function (res) {
            console.log('update element successful');
        });
    }
}

@Injectable()
export class ContainerService {
    public data:{
        containers:{[type:String]:Container},
        element:any
    } = {};
}

@Injectable()
export class FragmentService {
    public data:{
    } = {};
}

function post(link, body) {
    return http.request({
        url: cms.basePath + link,
        method: "POST",
        headers: {"Content-Type": "application/json"},
        content: JsonFn.stringify(body)
    }).then(function (response) {
        return {data: response.content.toString()};
    })
}

export function injectFnAndServerFn(scope, type) {
    scope.fn = {};
    _.each(Types[type].fn, (f, k) => scope.fn[k] = f.bind(scope.model))

    scope.serverFn = {};
    _.each(Types[type].serverFn, (fn, k) => {
        fn(post, scope, type, k);
    })
}

export function injectFnAndServerFnByWrapper(scope, name) {
    //noinspection TypeScriptUnresolvedVariable
    const wrapper = _.find(Types.Wrapper.store, (wrapper, key) => key === name);
    scope.fn = {};
    _.each(wrapper.fn, (f, k) => scope.fn[k] = f.bind(scope.model))

    scope.serverFn = {};
    _.each(wrapper.serverFn, (fn, k) => {
        fn(post, scope, name, k);
    })
}
