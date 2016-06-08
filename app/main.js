"use strict";
var application_1 = require("nativescript-angular/application");
var app_component_1 = require("./app.component");
var status_bar_util_1 = require("./utils/status-bar-util");
var cms_1 = require("./shared/cms/cms");
var core_1 = require('@angular/core');
var dynamic_route_1 = require("./shared/route/dynamic-route");
core_1.enableProdMode();
status_bar_util_1.setStatusBarColors();
application_1.nativeScriptBootstrap(app_component_1.AppComponent, [dynamic_route_1.DynamicRouteConfigurator, cms_1.Cms]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQUFvQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3ZFLDhCQUEyQixpQkFBaUIsQ0FBQyxDQUFBO0FBQzdDLGdDQUFpQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQzNELG9CQUFrQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ3JDLHFCQUE2QixlQUFlLENBQUMsQ0FBQTtBQUM3Qyw4QkFBdUMsOEJBQThCLENBQUMsQ0FBQTtBQUV0RSxxQkFBYyxFQUFFLENBQUM7QUFDakIsb0NBQWtCLEVBQUUsQ0FBQztBQUNyQixtQ0FBcUIsQ0FBQyw0QkFBWSxFQUFFLENBQUMsd0NBQXdCLEVBQUUsU0FBRyxDQUFDLENBQUMsQ0FBQyJ9