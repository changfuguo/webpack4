const componentManager = (function (g) {
    if (!g.componentManager) {
        g.componentManager = function (Vue) {
            g.componentManager.Vue = Vue;
            for(var name in g.componentManager.components) {
                g.componentManager.use(name, g.componentManager.components[name]);
            }

            return g.componentManager;
        };
        g.componentManager.components = {};
        g.componentManager.use = function (name, component) {
            const oldCom = g.componentManager.components[name];
            if (oldCom && oldCom.installed) {
                // 存在老的同名组件，且已经installed了
                return g.componentManager;
            }
            g.componentManager.components[name] = component;
            if (g.componentManager.Vue && !component.installed) {
                g.componentManager.Vue.component(`${name}`, component);
                component.installed = true;
            }
            return g.componentManager;
        };
    }
    if (typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(g.componentManager);
    }
    return g.componentManager;
})(window || global);


if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(componentManager);
}


export default componentManager;