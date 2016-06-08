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
require("reflect-metadata");
var core_1 = require("@angular/core");
var router_deprecated_1 = require("@angular/router-deprecated");
var router_1 = require("nativescript-angular/router");
var dynamic_route_1 = require("./shared/route/dynamic-route");
var cms_1 = require("./shared/cms/cms");
var AppComponent = (function () {
    function AppComponent(dynamicRouteConfigurator, cms) {
        this.dynamicRouteConfigurator = dynamicRouteConfigurator;
        this.cms = cms;
        dynamicRouteConfigurator.setComponent(this.constructor);
        cms.load();
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: "main",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            providers: [router_1.NS_ROUTER_PROVIDERS],
            template: "<page-router-outlet></page-router-outlet>"
        }),
        router_deprecated_1.RouteConfig([]), 
        __metadata('design:paramtypes', [dynamic_route_1.DynamicRouteConfigurator, cms_1.Cms])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFFBQU8sa0JBQWtCLENBQUMsQ0FBQTtBQUMxQixxQkFBd0IsZUFBZSxDQUFDLENBQUE7QUFDeEMsa0NBQTBCLDRCQUE0QixDQUFDLENBQUE7QUFDdkQsdUJBQXdELDZCQUE2QixDQUFDLENBQUE7QUFDdEYsOEJBQXVDLDhCQUE4QixDQUFDLENBQUE7QUFDdEUsb0JBQWtCLGtCQUFrQixDQUFDLENBQUE7QUFTckM7SUFDSSxzQkFBb0Isd0JBQWlELEVBQVUsR0FBTztRQUFsRSw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQXlCO1FBQVUsUUFBRyxHQUFILEdBQUcsQ0FBSTtRQUNsRix3QkFBd0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFYTDtRQUFDLGdCQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsTUFBTTtZQUNoQixVQUFVLEVBQUUsQ0FBQyw2QkFBb0IsQ0FBQztZQUNsQyxTQUFTLEVBQUUsQ0FBQyw0QkFBbUIsQ0FBQztZQUNoQyxRQUFRLEVBQUUsMkNBQTJDO1NBQ3hELENBQUM7UUFDRCwrQkFBVyxDQUFDLEVBQUUsQ0FBQzs7b0JBQUE7SUFNaEIsbUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUxZLG9CQUFZLGVBS3hCLENBQUEifQ==