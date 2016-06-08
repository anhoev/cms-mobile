"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DynamicRouteConfigurator);
    return DynamicRouteConfigurator;
}());
exports.DynamicRouteConfigurator = DynamicRouteConfigurator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1yb3V0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImR5bmFtaWMtcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUd6QztJQUdJO0lBQ0EsQ0FBQztJQUVELCtDQUFZLEdBQVosVUFBYSxTQUFTO1FBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQy9CLENBQUM7SUFFRCw0Q0FBUyxHQUFULFVBQVUsTUFBYTtRQUNuQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQS9CLENBQStCLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELDJDQUFRLEdBQVIsVUFBUyxLQUFLO1FBQ1YsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCw4Q0FBVyxHQUFYO1FBQ0ksbUNBQW1DO0lBQ3ZDLENBQUM7SUFFRCw0Q0FBUyxHQUFUO1FBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDcEQsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFwQyxDQUFvQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDakUsQ0FBQztJQUVELG9EQUFpQixHQUFqQixVQUFrQixXQUFXO1FBQ3pCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRSxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDcEQsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixLQUFLLENBQUM7WUFDVixDQUFDO1FBQ0wsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFDRCxXQUFXLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxXQUFXLENBQUM7UUFDNUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBOUNMO1FBQUMsaUJBQVUsRUFBRTs7Z0NBQUE7SUErQ2IsK0JBQUM7QUFBRCxDQUFDLEFBOUNELElBOENDO0FBOUNZLGdDQUF3QiwyQkE4Q3BDLENBQUEifQ==