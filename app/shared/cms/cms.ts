import {Injectable} from 'angular2/core';
const {File, Folder, knownFolders, path} = require('file-system');
const http = require("http");
const {toFile} = require('../utils/to-file');
const JsonFn = require('json-fn');

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
    public basePath = 'http://192.168.56.1:8888';
    public data:{
        types:{[type: string]: Type},
        containers: Container[]
    }
    public service:ContainerService;

    constructor() {
        this.load();
    }

    public sync() {
        http.request({url: this.basePath + "/cms-mobile", method: "GET"}).then(res => {
            const {tree:content, Types} = JsonFn.parse(res.content.toString());
            const basePath = knownFolders.currentApp().path + '/page';

            function entry(path, node) {
                if (node.file) {
                    toFile(`${basePath}/${path}${path !== '' ? '/' : ''}${node.text}`, node.file);
                } else if (node.type === 'directory' || node.type === 'containerDirectory') {
                    var path2 = `${path}${path !== '' ? '/' : ''}${node.text !== 'root' ? node.text : ''}`;
                    if (node.text !== 'root') {
                        Folder.fromPath(`${basePath}/${path2}`);
                    }
                    node.children.forEach(n => {
                        entry(path2, n);
                    });
                }
            }

            entry('', content);
            File.fromPath(knownFolders.currentApp().path + '/data.json').writeTextSync(JsonFn.stringify(Types));
            this.load();
        })
    }

    public load() {
        const basePath = knownFolders.currentApp().path + '/page';
        const indexPath = basePath + '/index.json';
        const index = File.fromPath(indexPath).readTextSync();
        const containerPage = JsonFn.parse(index);
        this.data = this.data || {containers: {}, types: {}};
        this.data.containers = containerPage.containers;
        this.data.types = JsonFn.parse(File.fromPath(knownFolders.currentApp().path + '/data.json').readTextSync());
        if (this.service) {
            this.service.data.containers = this.data.containers;
        }
    }
}

export class ContainerService {
    public data:{
        containers: Container[]
    };
}