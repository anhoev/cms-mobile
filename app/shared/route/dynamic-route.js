"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var DynamicRouteConfigurator = (function () {
    function DynamicRouteConfigurator() {
    }
    DynamicRouteConfigurator.prototype.setComponent = function (component) {
        this.component = component;
    };
    DynamicRouteConfigurator.prototype.addRoutes = function (routes) {
        var routeConfig = this.getRoutes(this.component);
        routes.forEach(function (route) { return routeConfig.configs.push(route); });
        this.updateRouteConfig(routeConfig);
    };
    DynamicRouteConfigurator.prototype.addRoute = function (route) {
        var routeConfig = this.getRoutes(this.component);
        routeConfig.configs.push(route);
        this.updateRouteConfig(routeConfig);
    };
    DynamicRouteConfigurator.prototype.removeRoute = function () {
        // need to touch private APIs - bad
    };
    DynamicRouteConfigurator.prototype.getRoutes = function () {
        return Reflect.getMetadata('annotations', this.component)
            .filter(function (a) { return a.constructor.name === 'RouteConfig'; }).pop();
    };
    DynamicRouteConfigurator.prototype.updateRouteConfig = function (routeConfig) {
        var annotations = Reflect.getMetadata('annotations', this.component);
        var routeConfigIndex = -1;
        for (var i = 0; i < annotations.length; i += 1) {
            if (annotations[i].constructor.name === 'RouteConfig') {
                routeConfigIndex = i;
                break;
            }
        }
        if (routeConfigIndex < 0) {
            throw new Error('No route metadata attached to the component');
        }
        annotations[routeConfigIndex] = routeConfig;
        Reflect.defineMetadata('annotations', annotations, this.component);
    };
    DynamicRouteConfigurator = __decorate([
        core_1.Injectable()
    ], DynamicRouteConfigurator);
    return DynamicRouteConfigurator;
}());
exports.DynamicRouteConfigurator = DynamicRouteConfigurator;
