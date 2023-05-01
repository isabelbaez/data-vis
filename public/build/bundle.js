
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.58.0 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;

    	const block = {
    		c: function create() {
    			main = element("main");
    			add_location(main, file, 233, 0, 6854);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	function create_station_markers(station_data) {
    		station_markers = marker_container.selectAll("circle").data(station_data).enter().append("circle").attr("r", 20).style("fill", "#808080").attr("stroke", "#808080").attr("stroke-width", 1).attr("fill-opacity", 0.4).attr("name", function (d) {
    			return d["name"];
    		});

    		position_station_markers();
    	}

    	function create_curve(station_data) {
    		var curve_path = "M20,70 T80,100 T160,80 T200,90";

    		curve = marker_container.selectAll("path").data(station_data).enter().append("path").attr("d", curve_path).attr("fill", "none").attr("stroke", "red").attr("stroke-width", 2).attr("marker-start", "url(#triangle)").attr("marker-mid", "url(#triangle)").attr("marker-end", "url(#triangle)").attr("name", function (d) {
    			return d["name"];
    		});
    	} //position_station_markers();

    	function position_station_markers() {
    		station_markers.attr("cx", function (d) {
    			return project(d).x;
    		}).attr("cy", function (d) {
    			return project(d).y;
    		});
    	}

    	function project(d) {
    		return map.project(new mapboxgl.LngLat(+d.lon, +d.lat));
    	}

    	mapboxgl.accessToken = "pk.eyJ1IjoiaXNhYmVsYmFleiIsImEiOiJjbGdjajA0OW4wMDd5M2VwamJlenI1eHl1In0.5iu1gJj4fI7cATQyKv2-Eg";

    	const map = new mapboxgl.Map({
    			container: "map",
    			style: "mapbox://styles/mapbox/light-v11",
    			center: [-91.0942, 20.3601],
    			zoom: 4.5, // starting zoom level
    			minZoom: 4.5,
    			maxZoom: 6
    		});

    	// const map = new mapboxgl.Map({
    	// 	container: "map",
    	// 	style: "mapbox://styles/mapbox/light-v11", 
    	// 	center: [-71.0942, 42.3601], 
    	// 	zoom: 13, // starting zoom level
    	// 	minZoom: 12,
    	// 	maxZoom: 15,
    	// });
    	map.on("viewreset", position_station_markers);

    	map.on("move", position_station_markers);
    	map.on("moveend", position_station_markers);
    	map.on("viewreset", position_line);
    	map.on("move", position_line);
    	map.on("moveend", position_line);
    	let stationsFile = "https://raw.githubusercontent.com/isabelbaez/data-vis/main/src/data.json";
    	let station_data = [];
    	let station_markers;
    	let curve;

    	function lines() {
    		var curve_path = "M20,70 T80,100 T160,80 T200,90";
    		marker_container.append("path").attr("d", curve_path).attr("fill", "none").attr("stroke", "blue").attr("stroke-width", 2).attr("marker-start", "url(#triangle)").attr("marker-mid", "url(#triangle)").attr("marker-end", "url(#triangle)");
    	}

    	const marker_container = d3.select(map.getCanvasContainer()).append("svg").attr("width", "100%").attr("height", "100%").style("position", "absolute").style("z-index", 2);
    	fetch(stationsFile).then(response => response.json()).then(d => station_data = d.data.stations).then(d => create_station_markers(d)).then(d => lines());

    	var migration_path = [
    		[-89.2090, 13.6929],
    		[-90.5349, 14.6349],
    		[-92.6443, 16.7370],
    		[-96.7203, 17.0732],
    		[-99.1332, 19.4326],
    		//   [-100.3161, 25.6866], // Monterrey, Mexico
    		[-104.6663, 24.0277],
    		[-106.4847, 31.7392],
    		[-106.4425, 31.7776],
    		[-106.7538, 32.3199]
    	]; // San Salvador, El Salvador
    	// Guatemala City, Guatemala
    	// San Cristóbal de las Casas, Chiapas, Mexico
    	// Oaxaca de Juárez, Mexico
    	// Mexico City, Mexico
    	// Durango, Mexico
    	// Ciudad Juárez, Mexico
    	// El Paso, Texas
    	// Las Cruces, New Mexico

    	var migration_path2 = [
    		[-87.2068, 14.0818],
    		[-88.0256, 15.5047],
    		[-89.0336, 15.4752],
    		[-91.1353, 16.9299],
    		[-92.9293, 16.7451],
    		[-94.9689, 16.6915],
    		[-98.7624, 20.1011],
    		[-101.8381, 21.1231],
    		[-98.1077, 29.5410],
    		[-98.4936, 29.4241]
    	]; // Tegucigalpa, Honduras
    	// San Pedro Sula, Honduras
    	// Flores, Guatemala
    	// Palenque, Mexico
    	// San Cristobal de las Casas, Mexico
    	// Tapachula, Mexico
    	// Pachuca de Soto, Hidalgo, Mexico
    	// León, Guanajuato, Mexico
    	// Laredo, Texas, USA
    	// San Antonio, Texas, USA

    	var migration_path3 = [
    		[-90.5069, 14.6349],
    		[-92.1219, 14.8972],
    		[-93.9058, 16.2387],
    		[-96.7203, 17.0732],
    		[-99.1332, 19.4326],
    		[-100.3161, 25.6866],
    		[-99.5075, 27.5064],
    		[-95.3698, 29.7604]
    	]; // Guatemala City, Guatemala
    	// Tapachula, Mexico
    	// Arriaga, Mexico
    	// Oaxaca de Juárez, Mexico
    	// Mexico City, Mexico
    	// Monterrey, Mexico
    	// Laredo, Texas, USA
    	// Houston, Texas, USA

    	// create a D3 line generator
    	var line = d3.line().curve(d3.curveCatmullRom.alpha(0.5)).x(function (d) {
    		return map.project([d[0], d[1]]).x; // set the curve type
    	}).y(function (d) {
    		return map.project([d[0], d[1]]).y; // convert longitude to x position
    	}); // convert latitude to y position

    	var line2 = d3.line().curve(d3.curveCatmullRom.alpha(0.5)).x(function (d) {
    		return map.project([d[0], d[1]]).x; // set the curve type
    	}).y(function (d) {
    		return map.project([d[0], d[1]]).y; // convert longitude to x position
    	}); // convert latitude to y position

    	var line3 = d3.line().curve(d3.curveCatmullRom.alpha(0.5)).x(function (d) {
    		return map.project([d[0], d[1]]).x; // set the curve type
    	}).y(function (d) {
    		return map.project([d[0], d[1]]).y; // convert longitude to x position
    	}); // convert latitude to y position

    	// add the path element to the map
    	var path = marker_container.attr('class', 'curved-path').append('path').datum(migration_path).attr('d', line).style('fill', 'none').style('stroke', '#000').style('stroke-width', 4); // set the path coordinates using the line generator

    	var path2 = marker_container.attr('class', 'curved-path').append('path').datum(migration_path2).attr('d', line2).style('fill', 'none').style('stroke', 'red').style('stroke-width', 4); // set the path coordinates using the line generator
    	var path3 = marker_container.attr('class', 'curved-path').append('path').datum(migration_path3).attr('d', line3).style('fill', 'none').style('stroke', 'blue').style('stroke-width', 4); // set the path coordinates using the line generator

    	function position_line() {
    		path.attr('d', line);
    		path2.attr('d', line2);
    		path3.attr('d', line3);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		create_station_markers,
    		create_curve,
    		position_station_markers,
    		project,
    		map,
    		stationsFile,
    		station_data,
    		station_markers,
    		curve,
    		lines,
    		marker_container,
    		migration_path,
    		migration_path2,
    		migration_path3,
    		line,
    		line2,
    		line3,
    		path,
    		path2,
    		path3,
    		position_line
    	});

    	$$self.$inject_state = $$props => {
    		if ('stationsFile' in $$props) stationsFile = $$props.stationsFile;
    		if ('station_data' in $$props) station_data = $$props.station_data;
    		if ('station_markers' in $$props) station_markers = $$props.station_markers;
    		if ('curve' in $$props) curve = $$props.curve;
    		if ('migration_path' in $$props) migration_path = $$props.migration_path;
    		if ('migration_path2' in $$props) migration_path2 = $$props.migration_path2;
    		if ('migration_path3' in $$props) migration_path3 = $$props.migration_path3;
    		if ('line' in $$props) line = $$props.line;
    		if ('line2' in $$props) line2 = $$props.line2;
    		if ('line3' in $$props) line3 = $$props.line3;
    		if ('path' in $$props) path = $$props.path;
    		if ('path2' in $$props) path2 = $$props.path2;
    		if ('path3' in $$props) path3 = $$props.path3;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
