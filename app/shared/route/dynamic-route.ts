import {Injectable} from 'angular2/core';
import {Type} from 'angular2/core';

@Injectable()
export class DynamicRouteConfigurator {
    component:Type;

    constructor() {
    }

    setComponent(component:Type) {
        this.component = component;
    }

    addRoutes(routes: Array) {
        let routeConfig = this.getRoutes(this.component);
        routes.forEach(route => routeConfig.configs.push(route));
        this.updateRouteConfig(routeConfig);
    }

    addRoute(route) {
        let routeConfig = this.getRoutes(this.component);
        routeConfig.configs.push(route);
        this.updateRouteConfig(routeConfig);
    }

    removeRoute() {
        // need to touch private APIs - bad
    }

    getRoutes() {
        return Reflect.getMetadata('annotations', this.component)
            .filter(a => a.constructor.name === 'RouteConfig').pop();
    }

    updateRouteConfig(routeConfig) {
        let annotations = Reflect.getMetadata('annotations', this.component);
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
        Reflect.defineMetadata('annotations', annotations, this.component);
    }
}