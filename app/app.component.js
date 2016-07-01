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
var core_1 = require("@angular/core");
var router_1 = require('@angular/router');
var router_2 = require("nativescript-angular/router");
var cms_1 = require("./shared/cms/cms");
var AppComponent = (function () {
    function AppComponent(cms) {
        this.cms = cms;
        cms.load();
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: "main",
            directives: [router_1.ROUTER_DIRECTIVES, router_2.NS_ROUTER_DIRECTIVES],
            template: "<page-router-outlet></page-router-outlet>"
        }), 
        __metadata('design:paramtypes', [cms_1.Cms])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF3QixlQUFlLENBQUMsQ0FBQTtBQUN4Qyx1QkFBZ0MsaUJBQWlCLENBQUMsQ0FBQTtBQUNsRCx1QkFBbUMsNkJBQTZCLENBQUMsQ0FBQTtBQUNqRSxvQkFBa0Isa0JBQWtCLENBQUMsQ0FBQTtBQU9yQztJQUNJLHNCQUFvQixHQUFPO1FBQVAsUUFBRyxHQUFILEdBQUcsQ0FBSTtRQUN2QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZixDQUFDO0lBUkw7UUFBQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLE1BQU07WUFDaEIsVUFBVSxFQUFFLENBQUMsMEJBQWlCLEVBQUUsNkJBQW9CLENBQUM7WUFDckQsUUFBUSxFQUFFLDJDQUEyQztTQUN4RCxDQUFDOztvQkFBQTtJQUtGLG1CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxvQkFBWSxlQUl4QixDQUFBIn0=