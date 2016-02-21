import {Injectable} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, RouteRegistry} from 'angular2/router';
import {Type} from 'angular2/core';
import {AppComponent} from '../../app.component';

@Injectable()
export class DynamicRouteConfigurator {
    constructor(private registry:RouteRegistry) {
    }

    addRoute(component: Type, route) {
        let routeConfig = this.getRoutes(component);
        routeConfig.configs.push(route);
        this.updateRouteConfig(component, routeConfig);
        this.registry.config(component, route);
    }

    removeRoute() {
        // need to touch private APIs - bad
    }

    getRoutes(component: Type) {
        return Reflect.getMetadata('annotations', component)
            .filter(a => {
                return a.constructor.name === 'RouteConfig';
            }).pop();
    }

    updateRouteConfig(component: Type, routeConfig) {
        let annotations = Reflect.getMetadata('annotations', component);
        let routeConfigIndex = -1;
        for (let i = 0; i < annotations.length; i += 1) {
            if (annotations[i].constructor.name === 'RouteConfig') {
                routeConfigIndex = i;
                break;
            }
        }
        if (routeConfigIndex < 0) {
            throw new Error('No route metadata attached to the component');
        }
        annotations[routeConfigIndex] = routeConfig;
        Reflect.defineMetadata('annotations', annotations, AppComponent);
    }
}