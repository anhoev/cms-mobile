import {JsonFn} from "../../main";
export let Types:{[type: string]: Type};
export let cms:Cms;
import {Injectable} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, RouteRegistry} from 'angular2/router';
import {DynamicRouteConfigurator} from "../route/dynamic-route";
const {File, Folder, knownFolders, path} = require('file-system');
const http = require("http");
const {toFile} = require('../utils/to-file');
const CONTAINER_DIRECTORY = 'containerDirectory';
import {createPage} from "../../views/main-page/main-page";
import {Router} from "angular2/router";
import {_} from "../../main"
import {rawString} from "angular2/src/core/change_detection/codegen_facade";

export interface Bind {
    choice: string,
    model: {parentKey:string, key:string},
    array: any,
    dynamic:any,
    serverFn:any,
    fn:any
}

export interface Binding {
    binds: Bind[],
    parentModel: any
}

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
    fn:any,
    serverFn:any,
    list: any[],
    template: string,
    store:{[type: string]: {fn:any, serverFn:any, template:string}}
}

export enum StandardType {
    Wrapper = 'Wrapper',
    Layout = 'Layout'
}

@Injectable()
export class Cms {
    public basePath = 'http://localhost:8888';
    public data:{
        types:{[type: string]: Type},
        containerPage: {[path: string]: Container[]}
    } = {containerPage: {}, types: {}};
    public services:{[type: string]: ContainerService} = {};
    public routes:{path:string, component:any, as:string}[] = [];

    constructor(private dynamicRouteConfigurator:DynamicRouteConfigurator/*, private router:Router*/) {
        //noinspection TypeScriptUnresolvedVariable
        cms = global.cms = this;
    }

    public sync() {
        http.request({url: this.basePath + "/cms-mobile", method: "GET"}).then(res => {
            const {tree:content, Types} = JsonFn.parse(res.content.toString());
            const basePath = path.normalize(knownFolders.documents().path + '/page');
            const root = {};

            function walk(path, node, _node) {
                if (node.file) {
                    toFile(`${basePath}/${path}${path !== '' ? '/' : ''}${node.text}`, node.file);
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
            File.fromPath(path.normalize(knownFolders.documents().path + '/data.json')).writeTextSync(JsonFn.stringify(Types));
            File.fromPath(path.normalize(knownFolders.documents().path + '/root.json')).writeTextSync(JsonFn.stringify(root));
            this.load();
        })
    }

    public load() {
        let basePath;
        if (File.exists(knownFolders.documents().path + '/page/index.json')) {
            basePath = path.normalize(knownFolders.documents().path);
        } else {
            basePath = path.normalize(knownFolders.currentApp().path);
        }
        const root = JsonFn.parse(File.fromPath(`${basePath}/root.json`).readTextSync());
        this.data.types = JsonFn.parse(File.fromPath(basePath + '/data.json').readTextSync());
        //noinspection TypeScriptUnresolvedVariable
        Types = global.Types = this.data.types;

        const entry = node => {
            if (node.type === CONTAINER_DIRECTORY) {
                const index = File.fromPath(`${basePath}/page/${node.path}${node.path !== '' ? '/' : ''}index.json`).readTextSync();
                const containerPage = JsonFn.parse(index);
                const _path = node.path.charAt(0) === '/' ? _.capitalize(node.path) : '/' + _.capitalize(node.path);
                this.data.containerPage[_path] = containerPage.containers;
                // todo: page
                if (this.services[_path]) {
                    this.services[_path].data.containers = this.data.containerPage[_path];
                }

                // create Page
                const route = {
                    path: _path,
                    component: createPage(),
                    as: _.capitalize(node.text),
                    data: {path: _path}
                };
                this.routes.push(route);
            }
            node.children.forEach(n => entry(n));
        }

        this.routes = [];
        entry(root);

        console.log(JSON.stringify(this.routes));
        this.dynamicRouteConfigurator.addRoutes(this.routes);
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

    public createModel(type, cb, content) {
        http.request({
            url: `${this.basePath}/cms-types/${type}`,
            headers: {"Content-Type": "application/json"},
            method: "POST",
            content: JsonFn.stringify(content)
        }).then(res => {
            const {data:e} = JsonFn.parse(res.content.toString());
            const ref = e._id;
            Types[type].list.push(e);
            cb(Types[type], ref, _.find(Types[type].list, {_id: ref}));
        })
    }
}

@Injectable()
export class ContainerService {
    public data:{
        containers: Container[],
        element: any
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