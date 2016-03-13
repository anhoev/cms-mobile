import {Injectable} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, RouteRegistry} from 'angular2/router';
import {DynamicRouteConfigurator} from "../route/dynamic-route";
const {File, Folder, knownFolders, path} = require('file-system');
const http = require("http");
const {toFile} = require('../utils/to-file');
const JsonFn = require('json-fn');
const CONTAINER_DIRECTORY = 'containerDirectory';
import {createPage} from "../../views/main-page/main-page";
import {Router} from "angular2/router";
const _ = require('lodash');

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
        global.cms = this;
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
        global.Types = this.data.types;

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
