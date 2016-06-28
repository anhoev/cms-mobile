"use strict";
var application_1 = require("nativescript-angular/application");
var app_component_1 = require("./app.component");
var status_bar_util_1 = require("./utils/status-bar-util");
var cms_1 = require("./shared/cms/cms");
var app_route_1 = require("./app.route");
// enableProdMode();
status_bar_util_1.setStatusBarColors();
application_1.nativeScriptBootstrap(app_component_1.AppComponent, [cms_1.Cms, app_route_1.APP_ROUTER_PROVIDERS]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQUFvQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3ZFLDhCQUEyQixpQkFBaUIsQ0FBQyxDQUFBO0FBQzdDLGdDQUFpQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQzNELG9CQUFrQixrQkFBa0IsQ0FBQyxDQUFBO0FBRXJDLDBCQUFtQyxhQUFhLENBQUMsQ0FBQTtBQUVqRCxvQkFBb0I7QUFDcEIsb0NBQWtCLEVBQUUsQ0FBQztBQUNyQixtQ0FBcUIsQ0FBQyw0QkFBWSxFQUFFLENBQUMsU0FBRyxFQUFFLGdDQUFvQixDQUFDLENBQUMsQ0FBQyJ9