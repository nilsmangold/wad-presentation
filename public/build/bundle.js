
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_node(node) {
        if (!node)
            return document;
        return (node.getRootNode ? node.getRootNode() : node.ownerDocument); // check for getRootNode because IE is still supported
    }
    function get_root_for_styles(node) {
        const root = get_root_for_node(node);
        return root.host ? root : root;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_styles(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_node(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
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
            ctx: null,
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
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.40.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    /* node_modules/svelte-fullpage/src/Indicator/Dot.svelte generated by Svelte v3.40.2 */

    const file$k = "node_modules/svelte-fullpage/src/Indicator/Dot.svelte";

    // (13:4) {#if names}
    function create_if_block$8(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*name*/ ctx[2]);
    			attr_dev(p, "class", "svelte-fp-slide-name svelte-tlycps");
    			add_location(p, file$k, 13, 8, 266);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 4) set_data_dev(t, /*name*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(13:4) {#if names}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let li;
    	let t;
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*names*/ ctx[3] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (if_block) if_block.c();
    			t = space();
    			button = element("button");

    			attr_dev(button, "class", button_class_value = "svelte-fp-indicator-list-item-btn " + (/*activeSection*/ ctx[0] === /*index*/ ctx[1]
    			? 'svelte-fp-active'
    			: '') + " svelte-tlycps");

    			add_location(button, file$k, 17, 4, 345);
    			attr_dev(li, "class", "svelte-fp-indicator-list-item svelte-tlycps");
    			add_location(li, file$k, 11, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t);
    			append_dev(li, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*goto*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*names*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(li, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*activeSection, index*/ 3 && button_class_value !== (button_class_value = "svelte-fp-indicator-list-item-btn " + (/*activeSection*/ ctx[0] === /*index*/ ctx[1]
    			? 'svelte-fp-active'
    			: '') + " svelte-tlycps")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dot', slots, []);
    	let { activeSection = 0 } = $$props;
    	let { index = 0 } = $$props;
    	let { name = '' } = $$props;
    	let { names = false } = $$props;

    	const goto = () => {
    		$$invalidate(0, activeSection = index);
    	};

    	const writable_props = ['activeSection', 'index', 'name', 'names'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dot> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('names' in $$props) $$invalidate(3, names = $$props.names);
    	};

    	$$self.$capture_state = () => ({ activeSection, index, name, names, goto });

    	$$self.$inject_state = $$props => {
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('names' in $$props) $$invalidate(3, names = $$props.names);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeSection, index, name, names, goto];
    }

    class Dot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			activeSection: 0,
    			index: 1,
    			name: 2,
    			names: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dot",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get activeSection() {
    		throw new Error("<Dot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeSection(value) {
    		throw new Error("<Dot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Dot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Dot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Dot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Dot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get names() {
    		throw new Error("<Dot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set names(value) {
    		throw new Error("<Dot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-fullpage/src/Indicator/index.svelte generated by Svelte v3.40.2 */
    const file$j = "node_modules/svelte-fullpage/src/Indicator/index.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (10:8) {#each sections as page,index}
    function create_each_block$2(ctx) {
    	let dot;
    	let updating_activeSection;
    	let current;

    	function dot_activeSection_binding(value) {
    		/*dot_activeSection_binding*/ ctx[2](value);
    	}

    	let dot_props = {
    		index: /*index*/ ctx[5],
    		name: /*page*/ ctx[3]
    	};

    	if (/*activeSection*/ ctx[0] !== void 0) {
    		dot_props.activeSection = /*activeSection*/ ctx[0];
    	}

    	dot = new Dot({ props: dot_props, $$inline: true });
    	binding_callbacks.push(() => bind(dot, 'activeSection', dot_activeSection_binding));

    	const block = {
    		c: function create() {
    			create_component(dot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dot, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dot_changes = {};
    			if (dirty & /*sections*/ 2) dot_changes.name = /*page*/ ctx[3];

    			if (!updating_activeSection && dirty & /*activeSection*/ 1) {
    				updating_activeSection = true;
    				dot_changes.activeSection = /*activeSection*/ ctx[0];
    				add_flush_callback(() => updating_activeSection = false);
    			}

    			dot.$set(dot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(10:8) {#each sections as page,index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let ul;
    	let current;
    	let each_value = /*sections*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-fp-indicator-list svelte-dh6fo0");
    			add_location(ul, file$j, 8, 4, 158);
    			attr_dev(div, "class", "svelte-fp-indicator svelte-dh6fo0");
    			add_location(div, file$j, 7, 0, 120);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sections, activeSection*/ 3) {
    				each_value = /*sections*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Indicator', slots, []);
    	let { sections = [] } = $$props;
    	let { activeSection = 0 } = $$props;
    	const writable_props = ['sections', 'activeSection'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Indicator> was created with unknown prop '${key}'`);
    	});

    	function dot_activeSection_binding(value) {
    		activeSection = value;
    		$$invalidate(0, activeSection);
    	}

    	$$self.$$set = $$props => {
    		if ('sections' in $$props) $$invalidate(1, sections = $$props.sections);
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    	};

    	$$self.$capture_state = () => ({ Dot, sections, activeSection });

    	$$self.$inject_state = $$props => {
    		if ('sections' in $$props) $$invalidate(1, sections = $$props.sections);
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeSection, sections, dot_activeSection_binding];
    }

    class Indicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { sections: 1, activeSection: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Indicator",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get sections() {
    		throw new Error("<Indicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sections(value) {
    		throw new Error("<Indicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeSection() {
    		throw new Error("<Indicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeSection(value) {
    		throw new Error("<Indicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* node_modules/svelte-fullpage/src/Fullpage.svelte generated by Svelte v3.40.2 */

    const { console: console_1 } = globals;
    const file$i = "node_modules/svelte-fullpage/src/Fullpage.svelte";

    function create_fragment$j(ctx) {
    	let t0;
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let indicator;
    	let updating_activeSection;
    	let updating_sections;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	function indicator_activeSection_binding(value) {
    		/*indicator_activeSection_binding*/ ctx[25](value);
    	}

    	function indicator_sections_binding(value) {
    		/*indicator_sections_binding*/ ctx[26](value);
    	}

    	let indicator_props = {};

    	if (/*activeSection*/ ctx[0] !== void 0) {
    		indicator_props.activeSection = /*activeSection*/ ctx[0];
    	}

    	if (/*sections*/ ctx[2] !== void 0) {
    		indicator_props.sections = /*sections*/ ctx[2];
    	}

    	indicator = new Indicator({ props: indicator_props, $$inline: true });
    	binding_callbacks.push(() => bind(indicator, 'activeSection', indicator_activeSection_binding));
    	binding_callbacks.push(() => bind(indicator, 'sections', indicator_sections_binding));

    	const block = {
    		c: function create() {
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			create_component(indicator.$$.fragment);
    			attr_dev(div0, "class", "svelte-fp-container svelte-ng9shq");
    			add_location(div0, file$i, 169, 8, 6337);
    			attr_dev(div1, "class", "svelte-fp-container svelte-ng9shq");
    			add_location(div1, file$i, 168, 4, 6295);
    			attr_dev(div2, "class", "" + (null_to_empty(/*classes*/ ctx[5]) + " svelte-ng9shq"));
    			attr_dev(div2, "style", /*style*/ ctx[1]);
    			add_location(div2, file$i, 165, 0, 5979);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[24](div0);
    			append_dev(div1, t1);
    			mount_component(indicator, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keydown_handler*/ ctx[23], false, false, false),
    					listen_dev(div2, "wheel", /*wheel_handler*/ ctx[27], false, false, false),
    					listen_dev(div2, "touchstart", /*touchstart_handler*/ ctx[28], false, false, false),
    					listen_dev(div2, "touchmove", /*touchmove_handler*/ ctx[29], false, false, false),
    					listen_dev(div2, "drag", drag_handler, false, false, false),
    					listen_dev(div2, "mousedown", /*mousedown_handler*/ ctx[30], false, false, false),
    					listen_dev(div2, "mouseup", /*mouseup_handler*/ ctx[31], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[21], !current ? [-1, -1] : dirty, null, null);
    				}
    			}

    			const indicator_changes = {};

    			if (!updating_activeSection && dirty[0] & /*activeSection*/ 1) {
    				updating_activeSection = true;
    				indicator_changes.activeSection = /*activeSection*/ ctx[0];
    				add_flush_callback(() => updating_activeSection = false);
    			}

    			if (!updating_sections && dirty[0] & /*sections*/ 4) {
    				updating_sections = true;
    				indicator_changes.sections = /*sections*/ ctx[2];
    				add_flush_callback(() => updating_sections = false);
    			}

    			indicator.$set(indicator_changes);

    			if (!current || dirty[0] & /*style*/ 2) {
    				attr_dev(div2, "style", /*style*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(indicator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(indicator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[24](null);
    			destroy_component(indicator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const drag_handler = () => {
    	return false;
    };

    function instance$j($$self, $$props, $$invalidate) {
    	let $activeSectionStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fullpage', slots, ['default']);
    	let { class: defaultClasses = '' } = $$props;
    	let { style = '' } = $$props;
    	let { activeSection = 0 } = $$props;
    	const activeSectionStore = writable(activeSection);
    	validate_store(activeSectionStore, 'activeSectionStore');
    	component_subscribe($$self, activeSectionStore, value => $$invalidate(36, $activeSectionStore = value));
    	let sectionCount = 0;
    	let { sectionTitles = false } = $$props;
    	let sections = [];
    	let { transitionDuration = 500 } = $$props;
    	let { arrows = false } = $$props;
    	let { drag = false } = $$props;
    	let { dragThreshold = 100 } = $$props;
    	let { touchThreshold = 75 } = $$props;
    	let { pullDownToRefresh = false } = $$props;

    	// Placeholder for content of slot
    	let fullpageContent;

    	// Auxiliary variables that make possible drag and scroll feature
    	let dragStartPosition;

    	let touchStartPosition;

    	//extending exported classes with wrapper class
    	let classes = `${defaultClasses} svelte-fp-wrapper`;

    	let recentScroll = 0;

    	//setting section visible
    	let active = true;

    	/*
    Passing data about section visibility to all sections, activeSectionStore notifies all child FullpageSections about
    changed active section, so previously active section will hide and newly active section will appear. Function getId
    is for determination sectionId for FullpageSection
     */
    	setContext('section', {
    		activeSectionStore,
    		getId: () => {
    			$$invalidate(20, sectionCount++, sectionCount);
    			return sectionCount - 1;
    		}
    	});

    	//function that handles scroll and sets scroll cooldown based on animation duration
    	const handleScroll = event => {
    		//getting direction of scroll, if negative, scroll up, if positive, scroll down
    		let deltaY = event.deltaY;

    		let timer = new Date().getTime();

    		//if cooldown time is up, fullpage is scrollable again
    		if (transitionDuration < timer - recentScroll) {
    			recentScroll = timer;

    			if (deltaY < 0) {
    				scrollUp();
    			} else if (deltaY > 0) {
    				scrollDown();
    			}
    		}
    	};

    	// toggles visibility of active section
    	const toggleActive = () => {
    		active = !active;
    	};

    	// scroll up effect, only when it's possible
    	const scrollUp = async () => {
    		if ($activeSectionStore > 0) {
    			$$invalidate(0, activeSection--, activeSection);
    		}
    	};

    	// scroll down effect, only when it's possible
    	const scrollDown = async () => {
    		if ($activeSectionStore < sectionCount - 1) {
    			$$invalidate(0, activeSection++, activeSection);
    		}
    	};

    	// handling arrow event
    	const handleKey = event => {
    		if (arrows) {
    			switch (event.key) {
    				case 'ArrowDown':
    					scrollDown();
    					break;
    				case 'ArrowUp':
    					scrollUp();
    					break;
    			}
    		}
    	};

    	// memoize drag start Y coordinate, only if drag effect is enabled
    	const handleDragStart = event => {
    		if (drag) {
    			dragStartPosition = event.screenY;
    		}
    	};

    	// handles drag end event
    	const handleDragEnd = event => {
    		if (drag) {
    			const dragEndPosition = event.screenY;

    			// Trigger scroll event after thresholds are exceeded
    			if (dragStartPosition - dragEndPosition > dragThreshold) {
    				scrollDown();
    			} else if (dragStartPosition - dragEndPosition < -dragThreshold) {
    				scrollUp();
    			}
    		}
    	};

    	// memoize touch start Y coordinate
    	const handleTouchStart = event => {
    		touchStartPosition = event.touches[0].screenY;
    	};

    	// Compare touch start and end Y coordinates, if difference exceeds threshold, scroll function is triggered
    	const handleTouchEnd = event => {
    		// Timer is used for preventing scrolling multiple sections
    		let timer = new Date().getTime();

    		const touchEndPosition = event.touches[0].screenY;

    		if (transitionDuration < timer - recentScroll) {
    			if (touchStartPosition - touchEndPosition > touchThreshold) {
    				scrollDown();
    				recentScroll = timer;
    			} else if (touchStartPosition - touchEndPosition < -touchThreshold) {
    				scrollUp();
    				recentScroll = timer;
    			}
    		}
    	};

    	const writable_props = [
    		'class',
    		'style',
    		'activeSection',
    		'sectionTitles',
    		'transitionDuration',
    		'arrows',
    		'drag',
    		'dragThreshold',
    		'touchThreshold',
    		'pullDownToRefresh'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Fullpage> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = event => handleKey(event);

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fullpageContent = $$value;
    			$$invalidate(3, fullpageContent);
    		});
    	}

    	function indicator_activeSection_binding(value) {
    		activeSection = value;
    		$$invalidate(0, activeSection);
    	}

    	function indicator_sections_binding(value) {
    		sections = value;
    		((($$invalidate(2, sections), $$invalidate(13, sectionTitles)), $$invalidate(3, fullpageContent)), $$invalidate(20, sectionCount));
    	}

    	const wheel_handler = event => handleScroll(event);
    	const touchstart_handler = event => handleTouchStart(event);
    	const touchmove_handler = event => handleTouchEnd(event);
    	const mousedown_handler = event => handleDragStart(event);
    	const mouseup_handler = event => handleDragEnd(event);

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(12, defaultClasses = $$props.class);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    		if ('sectionTitles' in $$props) $$invalidate(13, sectionTitles = $$props.sectionTitles);
    		if ('transitionDuration' in $$props) $$invalidate(14, transitionDuration = $$props.transitionDuration);
    		if ('arrows' in $$props) $$invalidate(15, arrows = $$props.arrows);
    		if ('drag' in $$props) $$invalidate(16, drag = $$props.drag);
    		if ('dragThreshold' in $$props) $$invalidate(17, dragThreshold = $$props.dragThreshold);
    		if ('touchThreshold' in $$props) $$invalidate(18, touchThreshold = $$props.touchThreshold);
    		if ('pullDownToRefresh' in $$props) $$invalidate(19, pullDownToRefresh = $$props.pullDownToRefresh);
    		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Indicator,
    		onMount,
    		setContext,
    		writable,
    		defaultClasses,
    		style,
    		activeSection,
    		activeSectionStore,
    		sectionCount,
    		sectionTitles,
    		sections,
    		transitionDuration,
    		arrows,
    		drag,
    		dragThreshold,
    		touchThreshold,
    		pullDownToRefresh,
    		fullpageContent,
    		dragStartPosition,
    		touchStartPosition,
    		classes,
    		recentScroll,
    		active,
    		handleScroll,
    		toggleActive,
    		scrollUp,
    		scrollDown,
    		handleKey,
    		handleDragStart,
    		handleDragEnd,
    		handleTouchStart,
    		handleTouchEnd,
    		$activeSectionStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaultClasses' in $$props) $$invalidate(12, defaultClasses = $$props.defaultClasses);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    		if ('sectionCount' in $$props) $$invalidate(20, sectionCount = $$props.sectionCount);
    		if ('sectionTitles' in $$props) $$invalidate(13, sectionTitles = $$props.sectionTitles);
    		if ('sections' in $$props) $$invalidate(2, sections = $$props.sections);
    		if ('transitionDuration' in $$props) $$invalidate(14, transitionDuration = $$props.transitionDuration);
    		if ('arrows' in $$props) $$invalidate(15, arrows = $$props.arrows);
    		if ('drag' in $$props) $$invalidate(16, drag = $$props.drag);
    		if ('dragThreshold' in $$props) $$invalidate(17, dragThreshold = $$props.dragThreshold);
    		if ('touchThreshold' in $$props) $$invalidate(18, touchThreshold = $$props.touchThreshold);
    		if ('pullDownToRefresh' in $$props) $$invalidate(19, pullDownToRefresh = $$props.pullDownToRefresh);
    		if ('fullpageContent' in $$props) $$invalidate(3, fullpageContent = $$props.fullpageContent);
    		if ('dragStartPosition' in $$props) dragStartPosition = $$props.dragStartPosition;
    		if ('touchStartPosition' in $$props) touchStartPosition = $$props.touchStartPosition;
    		if ('classes' in $$props) $$invalidate(5, classes = $$props.classes);
    		if ('recentScroll' in $$props) recentScroll = $$props.recentScroll;
    		if ('active' in $$props) active = $$props.active;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*activeSection*/ 1) {
    			/*
    Everytime activeSection updates, this store gets new value and then all sections that subscribe,
    this is because user may want to control sections programmatically
     */
    			activeSectionStore.set(activeSection);
    		}

    		if ($$self.$$.dirty[0] & /*sectionTitles*/ 8192) {
    			// If user has specified sectionTitles, then sections is overridden
    			if (sectionTitles) $$invalidate(2, sections = sectionTitles);
    		}

    		if ($$self.$$.dirty[0] & /*fullpageContent, sectionTitles, sectionCount, sections*/ 1056780) {
    			// If user hasn't specified sectionTitle, sections array will be generated with placeholder strings
    			if (fullpageContent && !sectionTitles) {
    				console.log(fullpageContent.children.length);

    				for (let i = 0; sectionCount > i; i++) {
    					$$invalidate(2, sections = [...sections, `Section ${i + 1}`]);
    				}
    			}
    		}
    	};

    	return [
    		activeSection,
    		style,
    		sections,
    		fullpageContent,
    		activeSectionStore,
    		classes,
    		handleScroll,
    		handleKey,
    		handleDragStart,
    		handleDragEnd,
    		handleTouchStart,
    		handleTouchEnd,
    		defaultClasses,
    		sectionTitles,
    		transitionDuration,
    		arrows,
    		drag,
    		dragThreshold,
    		touchThreshold,
    		pullDownToRefresh,
    		sectionCount,
    		$$scope,
    		slots,
    		keydown_handler,
    		div0_binding,
    		indicator_activeSection_binding,
    		indicator_sections_binding,
    		wheel_handler,
    		touchstart_handler,
    		touchmove_handler,
    		mousedown_handler,
    		mouseup_handler
    	];
    }

    class Fullpage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$j,
    			safe_not_equal,
    			{
    				class: 12,
    				style: 1,
    				activeSection: 0,
    				sectionTitles: 13,
    				transitionDuration: 14,
    				arrows: 15,
    				drag: 16,
    				dragThreshold: 17,
    				touchThreshold: 18,
    				pullDownToRefresh: 19
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fullpage",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get class() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeSection() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeSection(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sectionTitles() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sectionTitles(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionDuration() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionDuration(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get arrows() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set arrows(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get drag() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set drag(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dragThreshold() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dragThreshold(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touchThreshold() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touchThreshold(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pullDownToRefresh() {
    		throw new Error("<Fullpage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pullDownToRefresh(value) {
    		throw new Error("<Fullpage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* node_modules/svelte-fullpage/src/FullpageSection.svelte generated by Svelte v3.40.2 */
    const file$h = "node_modules/svelte-fullpage/src/FullpageSection.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	child_ctx[44] = i;
    	return child_ctx;
    }

    // (166:0) {#if visible}
    function create_if_block$7(ctx) {
    	let section;
    	let div;
    	let t;
    	let section_class_value;
    	let section_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);
    	let if_block = /*slides*/ ctx[1][0] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "svelte-fp-container svelte-fp-flexbox-expand svelte-l4liqa");
    			toggle_class(div, "svelte-fp-flexbox-center", /*center*/ ctx[2]);
    			add_location(div, file$h, 169, 8, 5339);
    			attr_dev(section, "class", section_class_value = "" + (null_to_empty(/*classes*/ ctx[6]) + " svelte-l4liqa"));
    			attr_dev(section, "style", /*style*/ ctx[0]);
    			add_location(section, file$h, 166, 4, 5013);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(section, t);
    			if (if_block) if_block.m(section, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(section, "selectstart", /*handleSelect*/ ctx[9], false, false, false),
    					listen_dev(section, "mousedown", /*mousedown_handler*/ ctx[29], false, false, false),
    					listen_dev(section, "mouseup", /*mouseup_handler*/ ctx[30], false, false, false),
    					listen_dev(section, "touchstart", /*touchstart_handler*/ ctx[31], false, false, false),
    					listen_dev(section, "touchmove", /*touchmove_handler*/ ctx[32], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[25], !current ? [-1, -1] : dirty, null, null);
    				}
    			}

    			if (dirty[0] & /*center*/ 4) {
    				toggle_class(div, "svelte-fp-flexbox-center", /*center*/ ctx[2]);
    			}

    			if (/*slides*/ ctx[1][0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty[0] & /*classes*/ 64 && section_class_value !== (section_class_value = "" + (null_to_empty(/*classes*/ ctx[6]) + " svelte-l4liqa"))) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if (!current || dirty[0] & /*style*/ 1) {
    				attr_dev(section, "style", /*style*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!section_transition) section_transition = create_bidirectional_transition(section, slide, /*transition*/ ctx[3], true);
    				section_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!section_transition) section_transition = create_bidirectional_transition(section, slide, /*transition*/ ctx[3], false);
    			section_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			if (detaching && section_transition) section_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(166:0) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (174:8) {#if slides[0]}
    function create_if_block_1$2(ctx) {
    	let div;
    	let ul;
    	let each_value = /*slides*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-fp-indicator-list-horizontal svelte-l4liqa");
    			add_location(ul, file$h, 175, 16, 5589);
    			attr_dev(div, "class", "svelte-fp-indicator-horizontal svelte-l4liqa");
    			add_location(div, file$h, 174, 12, 5528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*activeSlideIndicator, toSlide, slides*/ 1058) {
    				each_value = /*slides*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(174:8) {#if slides[0]}",
    		ctx
    	});

    	return block;
    }

    // (177:20) {#each slides as page,index}
    function create_each_block$1(ctx) {
    	let li;
    	let button;
    	let button_class_value;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[28](/*index*/ ctx[44]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t = space();

    			attr_dev(button, "class", button_class_value = "svelte-fp-indicator-list-item-btn " + (/*activeSlideIndicator*/ ctx[5] === /*index*/ ctx[44]
    			? 'svelte-fp-active'
    			: '') + " svelte-l4liqa");

    			add_location(button, file$h, 178, 28, 5782);
    			attr_dev(li, "class", "svelte-fp-indicator-list-item svelte-l4liqa");
    			add_location(li, file$h, 177, 24, 5711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(li, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*activeSlideIndicator*/ 32 && button_class_value !== (button_class_value = "svelte-fp-indicator-list-item-btn " + (/*activeSlideIndicator*/ ctx[5] === /*index*/ ctx[44]
    			? 'svelte-fp-active'
    			: '') + " svelte-l4liqa")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(177:20) {#each slides as page,index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*visible*/ ctx[4] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*keydown_handler*/ ctx[27], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*visible*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*visible*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $activeSectionStore;
    	let $activeSlideStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullpageSection', slots, ['default']);
    	let { class: defaultClasses = '' } = $$props;
    	let { style = '' } = $$props;
    	let sectionId;
    	const { getId, activeSectionStore } = getContext('section');
    	validate_store(activeSectionStore, 'activeSectionStore');
    	component_subscribe($$self, activeSectionStore, value => $$invalidate(24, $activeSectionStore = value));
    	let { slides = [] } = $$props;
    	let { activeSlide = 0 } = $$props;
    	const activeSlideStore = writable(activeSlide);
    	validate_store(activeSlideStore, 'activeSlideStore');
    	component_subscribe($$self, activeSlideStore, value => $$invalidate(37, $activeSlideStore = value));
    	let { center = false } = $$props;
    	let { arrows = false } = $$props;
    	let { select = false } = $$props;
    	let { transitionDuration = 500 } = $$props;
    	let { dragThreshold = 100 } = $$props;
    	let { touchThreshold = 75 } = $$props;
    	let { transition = { duration: transitionDuration } } = $$props;
    	sectionId = parseInt(sectionId);
    	let visible;
    	let activeSlideIndicator = activeSlide;
    	let dragStartPosition;
    	let touchStartPosition;
    	let recentSlide = 0;
    	let slideCount = 0;
    	let classes = `${defaultClasses} svelte-fp-section svelte-fp-flexbox-center`;

    	if (!select) {
    		classes = `${classes} svelte-fp-unselectable`;
    	}

    	// Passing data about slide visibility to all slides, same principle as setContext('section',{...}) in Fullpage.svelte
    	setContext('slide', {
    		activeSlideStore,
    		getId: () => {
    			slideCount++;
    			return slideCount - 1;
    		}
    	});

    	const makePositive = num => {
    		let negative = false;

    		if (num < 0) {
    			negative = true;
    			num = -num;
    		}

    		return { num, negative };
    	};

    	const handleSelect = () => {
    		if (!select) {
    			return false;
    		}
    	};

    	const slideRight = () => {
    		const active = makePositive($activeSlideStore);

    		if (active.num < slides.length - 1) {
    			$$invalidate(5, activeSlideIndicator = active.num + 1);
    			activeSlideStore.set(-activeSlideIndicator);
    		} else {
    			activeSlideStore.set(0);
    			$$invalidate(5, activeSlideIndicator = $activeSlideStore);
    		}
    	};

    	const slideLeft = () => {
    		const active = makePositive($activeSlideStore);

    		if (active.num > 0) {
    			activeSlideStore.set(active.num - 1);
    		} else {
    			activeSlideStore.set(slides.length - 1);
    		}

    		$$invalidate(5, activeSlideIndicator = $activeSlideStore);
    	};

    	const toSlide = slideId => {
    		if (slideId > activeSlideIndicator) {
    			while (slideId > activeSlideIndicator) {
    				slideRight();
    			}
    		} else {
    			while (slideId < activeSlideIndicator) {
    				slideLeft();
    			}
    		}
    	};

    	// handling arrow event
    	const handleKey = event => {
    		if (arrows) {
    			switch (event.key) {
    				case 'ArrowLeft':
    					slideLeft();
    					break;
    				case 'ArrowRight':
    					slideRight();
    					break;
    			}
    		}
    	};

    	// memoize drag start X coordinate
    	const handleDragStart = event => {
    		dragStartPosition = event.screenX;
    	};

    	// handles drag end event
    	const handleDragEnd = event => {
    		const dragEndPosition = event.screenX;

    		// Trigger scroll event after thresholds are exceeded
    		if (dragStartPosition - dragEndPosition > dragThreshold) {
    			slideRight();
    		} else if (dragStartPosition - dragEndPosition < -dragThreshold) {
    			slideLeft();
    		}
    	};

    	// memoize touch start X coordinate
    	const handleTouchStart = event => {
    		touchStartPosition = event.touches[0].screenX;
    	};

    	// Compare touch start and end X coordinates, if difference exceeds threshold, scroll function is triggered
    	const handleTouchEnd = event => {
    		// Timer is used for preventing scrolling multiple slides
    		let timer = new Date().getTime();

    		const touchEndPosition = event.touches[0].screenX;

    		if (transitionDuration < timer - recentSlide) {
    			if (touchStartPosition - touchEndPosition > touchThreshold) {
    				slideRight();
    				recentSlide = timer;
    			} else if (touchStartPosition - touchEndPosition < -touchThreshold) {
    				slideLeft();
    				recentSlide = timer;
    			}
    		}
    	};

    	// After DOM is ready ged sectionId
    	onMount(() => {
    		$$invalidate(23, sectionId = getId());
    	});

    	const writable_props = [
    		'class',
    		'style',
    		'slides',
    		'activeSlide',
    		'center',
    		'arrows',
    		'select',
    		'transitionDuration',
    		'dragThreshold',
    		'touchThreshold',
    		'transition'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullpageSection> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = event => handleKey(event);
    	const click_handler = index => toSlide(index);
    	const mousedown_handler = event => handleDragStart(event);
    	const mouseup_handler = event => handleDragEnd(event);
    	const touchstart_handler = event => handleTouchStart(event);
    	const touchmove_handler = event => handleTouchEnd(event);

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(16, defaultClasses = $$props.class);
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('slides' in $$props) $$invalidate(1, slides = $$props.slides);
    		if ('activeSlide' in $$props) $$invalidate(17, activeSlide = $$props.activeSlide);
    		if ('center' in $$props) $$invalidate(2, center = $$props.center);
    		if ('arrows' in $$props) $$invalidate(18, arrows = $$props.arrows);
    		if ('select' in $$props) $$invalidate(19, select = $$props.select);
    		if ('transitionDuration' in $$props) $$invalidate(20, transitionDuration = $$props.transitionDuration);
    		if ('dragThreshold' in $$props) $$invalidate(21, dragThreshold = $$props.dragThreshold);
    		if ('touchThreshold' in $$props) $$invalidate(22, touchThreshold = $$props.touchThreshold);
    		if ('transition' in $$props) $$invalidate(3, transition = $$props.transition);
    		if ('$$scope' in $$props) $$invalidate(25, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		slide,
    		getContext,
    		onMount,
    		setContext,
    		writable,
    		defaultClasses,
    		style,
    		sectionId,
    		getId,
    		activeSectionStore,
    		slides,
    		activeSlide,
    		activeSlideStore,
    		center,
    		arrows,
    		select,
    		transitionDuration,
    		dragThreshold,
    		touchThreshold,
    		transition,
    		visible,
    		activeSlideIndicator,
    		dragStartPosition,
    		touchStartPosition,
    		recentSlide,
    		slideCount,
    		classes,
    		makePositive,
    		handleSelect,
    		slideRight,
    		slideLeft,
    		toSlide,
    		handleKey,
    		handleDragStart,
    		handleDragEnd,
    		handleTouchStart,
    		handleTouchEnd,
    		$activeSectionStore,
    		$activeSlideStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaultClasses' in $$props) $$invalidate(16, defaultClasses = $$props.defaultClasses);
    		if ('style' in $$props) $$invalidate(0, style = $$props.style);
    		if ('sectionId' in $$props) $$invalidate(23, sectionId = $$props.sectionId);
    		if ('slides' in $$props) $$invalidate(1, slides = $$props.slides);
    		if ('activeSlide' in $$props) $$invalidate(17, activeSlide = $$props.activeSlide);
    		if ('center' in $$props) $$invalidate(2, center = $$props.center);
    		if ('arrows' in $$props) $$invalidate(18, arrows = $$props.arrows);
    		if ('select' in $$props) $$invalidate(19, select = $$props.select);
    		if ('transitionDuration' in $$props) $$invalidate(20, transitionDuration = $$props.transitionDuration);
    		if ('dragThreshold' in $$props) $$invalidate(21, dragThreshold = $$props.dragThreshold);
    		if ('touchThreshold' in $$props) $$invalidate(22, touchThreshold = $$props.touchThreshold);
    		if ('transition' in $$props) $$invalidate(3, transition = $$props.transition);
    		if ('visible' in $$props) $$invalidate(4, visible = $$props.visible);
    		if ('activeSlideIndicator' in $$props) $$invalidate(5, activeSlideIndicator = $$props.activeSlideIndicator);
    		if ('dragStartPosition' in $$props) dragStartPosition = $$props.dragStartPosition;
    		if ('touchStartPosition' in $$props) touchStartPosition = $$props.touchStartPosition;
    		if ('recentSlide' in $$props) recentSlide = $$props.recentSlide;
    		if ('slideCount' in $$props) slideCount = $$props.slideCount;
    		if ('classes' in $$props) $$invalidate(6, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*sectionId, $activeSectionStore*/ 25165824) {
    			// Recompute visible: boolean everytime one of dependencies change
    			$$invalidate(4, visible = sectionId === $activeSectionStore);
    		}

    		if ($$self.$$.dirty[0] & /*activeSlide*/ 131072) {
    			/*
    Everytime activeSlide updates, this store gets new value and then all slides that subscribe,
    this is because user may want to control slides programmatically
     */
    			activeSlideStore.set(activeSlide);
    		}

    		if ($$self.$$.dirty[0] & /*visible*/ 16) {
    			// Everytime section disappears, slide count resets, this prevents slides from getting wrong ID
    			if (!visible) {
    				slideCount = 0;
    			}
    		}
    	};

    	return [
    		style,
    		slides,
    		center,
    		transition,
    		visible,
    		activeSlideIndicator,
    		classes,
    		activeSectionStore,
    		activeSlideStore,
    		handleSelect,
    		toSlide,
    		handleKey,
    		handleDragStart,
    		handleDragEnd,
    		handleTouchStart,
    		handleTouchEnd,
    		defaultClasses,
    		activeSlide,
    		arrows,
    		select,
    		transitionDuration,
    		dragThreshold,
    		touchThreshold,
    		sectionId,
    		$activeSectionStore,
    		$$scope,
    		slots,
    		keydown_handler,
    		click_handler,
    		mousedown_handler,
    		mouseup_handler,
    		touchstart_handler,
    		touchmove_handler
    	];
    }

    class FullpageSection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$i,
    			create_fragment$i,
    			safe_not_equal,
    			{
    				class: 16,
    				style: 0,
    				slides: 1,
    				activeSlide: 17,
    				center: 2,
    				arrows: 18,
    				select: 19,
    				transitionDuration: 20,
    				dragThreshold: 21,
    				touchThreshold: 22,
    				transition: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullpageSection",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slides() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slides(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeSlide() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeSlide(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get arrows() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set arrows(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get select() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set select(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionDuration() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionDuration(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dragThreshold() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dragThreshold(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touchThreshold() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touchThreshold(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<FullpageSection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<FullpageSection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-fullpage/src/FullpageSlide.svelte generated by Svelte v3.40.2 */
    const file$g = "node_modules/svelte-fullpage/src/FullpageSlide.svelte";

    // (55:0) {#if slideId === activeSlide}
    function create_if_block$6(ctx) {
    	let div;
    	let div_class_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(`${/*defaultClasses*/ ctx[2]} svelte-fp-content`) + " svelte-1jzpibp"));
    			attr_dev(div, "style", /*style*/ ctx[3]);
    			toggle_class(div, "svelte-fp-flexbox-center", /*center*/ ctx[4]);
    			add_location(div, file$g, 55, 4, 1464);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], !current ? -1 : dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*defaultClasses*/ 4 && div_class_value !== (div_class_value = "" + (null_to_empty(`${/*defaultClasses*/ ctx[2]} svelte-fp-content`) + " svelte-1jzpibp"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*style*/ 8) {
    				attr_dev(div, "style", /*style*/ ctx[3]);
    			}

    			if (dirty & /*defaultClasses, center*/ 20) {
    				toggle_class(div, "svelte-fp-flexbox-center", /*center*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, fly, /*transitionIn*/ ctx[0]);
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fly, /*transitionOut*/ ctx[1]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(55:0) {#if slideId === activeSlide}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*slideId*/ ctx[6] === /*activeSlide*/ ctx[5] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*slideId*/ ctx[6] === /*activeSlide*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*slideId, activeSlide*/ 96) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $activeSlideStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FullpageSlide', slots, ['default']);
    	let { class: defaultClasses = '' } = $$props;
    	let { style = '' } = $$props;
    	let slideId = 0;
    	let activeSlide = 0;
    	const { activeSlideStore, getId } = getContext('slide');
    	validate_store(activeSlideStore, 'activeSlideStore');
    	component_subscribe($$self, activeSlideStore, value => $$invalidate(8, $activeSlideStore = value));
    	let { center = false } = $$props;
    	let { transitionIn = { duration: 500, x: -2000 } } = $$props;
    	let { transitionOut = { duration: 500, x: 2000 } } = $$props;

    	const makePositive = num => {
    		let negative = false;

    		if (num < 0) {
    			negative = true;
    			num = -num;
    		}

    		return { num, negative };
    	};

    	const correctAnimation = active => {
    		const state = makePositive(active);

    		// Sets animation direction based on scroll/drag/arrow direction
    		if (state.negative) {
    			$$invalidate(0, transitionIn.x = 2000, transitionIn);
    			$$invalidate(1, transitionOut.x = -2000, transitionOut);
    		} else {
    			$$invalidate(0, transitionIn.x = -2000, transitionIn);
    			$$invalidate(1, transitionOut.x = 2000, transitionOut);
    		}

    		$$invalidate(5, activeSlide = state.num);
    	};

    	// After DOM is ready ged slideId
    	onMount(() => {
    		$$invalidate(6, slideId = getId());
    	});

    	const writable_props = ['class', 'style', 'center', 'transitionIn', 'transitionOut'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FullpageSlide> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(2, defaultClasses = $$props.class);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('center' in $$props) $$invalidate(4, center = $$props.center);
    		if ('transitionIn' in $$props) $$invalidate(0, transitionIn = $$props.transitionIn);
    		if ('transitionOut' in $$props) $$invalidate(1, transitionOut = $$props.transitionOut);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		getContext,
    		onMount,
    		defaultClasses,
    		style,
    		slideId,
    		activeSlide,
    		activeSlideStore,
    		getId,
    		center,
    		transitionIn,
    		transitionOut,
    		makePositive,
    		correctAnimation,
    		$activeSlideStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaultClasses' in $$props) $$invalidate(2, defaultClasses = $$props.defaultClasses);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('slideId' in $$props) $$invalidate(6, slideId = $$props.slideId);
    		if ('activeSlide' in $$props) $$invalidate(5, activeSlide = $$props.activeSlide);
    		if ('center' in $$props) $$invalidate(4, center = $$props.center);
    		if ('transitionIn' in $$props) $$invalidate(0, transitionIn = $$props.transitionIn);
    		if ('transitionOut' in $$props) $$invalidate(1, transitionOut = $$props.transitionOut);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*activeSlide*/ 32) {
    			// When activeSlide value changes, activeSlideStore value updates
    			activeSlideStore.set(activeSlide);
    		}

    		if ($$self.$$.dirty & /*$activeSlideStore*/ 256) {
    			// When activeSlideStore value changes, recompute transitions and change activeSlide
    			correctAnimation($activeSlideStore);
    		}
    	};

    	return [
    		transitionIn,
    		transitionOut,
    		defaultClasses,
    		style,
    		center,
    		activeSlide,
    		slideId,
    		activeSlideStore,
    		$activeSlideStore,
    		$$scope,
    		slots
    	];
    }

    class FullpageSlide extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			class: 2,
    			style: 3,
    			center: 4,
    			transitionIn: 0,
    			transitionOut: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FullpageSlide",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get class() {
    		throw new Error("<FullpageSlide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FullpageSlide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<FullpageSlide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<FullpageSlide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<FullpageSlide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<FullpageSlide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionIn() {
    		throw new Error("<FullpageSlide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionIn(value) {
    		throw new Error("<FullpageSlide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOut() {
    		throw new Error("<FullpageSlide>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOut(value) {
    		throw new Error("<FullpageSlide>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules/sveltestrap/src/Col.svelte generated by Svelte v3.40.2 */
    const file$f = "node_modules/sveltestrap/src/Col.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(' ')
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$f, 60, 0, 1427);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], !current ? -1 : dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","xs","sm","md","lg","xl","xxl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Col', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl, xxl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return; //no value for this width
    		}

    		const isXs = colWidth === 'xs';

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === '') {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push('col');
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('xs' in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(8, xxl = $$new_props.xxl);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getColumnSizeClass,
    		isObject,
    		className,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		colClasses,
    		lookup
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('xs' in $$props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(7, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(8, xxl = $$new_props.xxl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, xxl, $$scope, slots];
    }

    class Col extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7,
    			xxl: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Col",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get class() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Col>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Col>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Container.svelte generated by Svelte v3.40.2 */
    const file$e = "node_modules/sveltestrap/src/Container.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$e, 23, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], !current ? -1 : dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","sm","md","lg","xl","xxl","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('sm' in $$new_props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$new_props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		fluid,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('sm' in $$props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, sm, md, lg, xl, xxl, fluid*/ 508) {
    			$$invalidate(0, classes = classnames(className, {
    				'container-sm': sm,
    				'container-md': md,
    				'container-lg': lg,
    				'container-xl': xl,
    				'container-xxl': xxl,
    				'container-fluid': fluid,
    				container: !sm && !md && !lg && !xl && !xxl && !fluid
    			}));
    		}
    	};

    	return [classes, $$restProps, className, sm, md, lg, xl, xxl, fluid, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			class: 2,
    			sm: 3,
    			md: 4,
    			lg: 5,
    			xl: 6,
    			xxl: 7,
    			fluid: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fluid() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fluid(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/sveltestrap/src/Row.svelte generated by Svelte v3.40.2 */
    const file$d = "node_modules/sveltestrap/src/Row.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$d, 39, 0, 980);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[6], !current ? -1 : dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === 'object') {
    		return ['xs', 'sm', 'md', 'lg', 'xl'].map(colWidth => {
    			const isXs = colWidth === 'xs';
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === 'number' && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('noGutters' in $$new_props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ('form' in $$new_props) $$invalidate(4, form = $$new_props.form);
    		if ('cols' in $$new_props) $$invalidate(5, cols = $$new_props.cols);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		noGutters,
    		form,
    		cols,
    		getCols,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('noGutters' in $$props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ('form' in $$props) $$invalidate(4, form = $$new_props.form);
    		if ('cols' in $$props) $$invalidate(5, cols = $$new_props.cols);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 60) {
    			$$invalidate(0, classes = classnames(className, noGutters ? 'gx-0' : null, form ? 'form-row' : 'row', ...getCols(cols)));
    		}
    	};

    	return [classes, $$restProps, className, noGutters, form, cols, $$scope, slots];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { class: 2, noGutters: 3, form: 4, cols: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get class() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutters() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutters(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let id = 1;

    function getId() {
      return `svelte-tabs-${id++}`;
    }

    /* node_modules/svelte-tabs/src/Tabs.svelte generated by Svelte v3.40.2 */
    const file$c = "node_modules/svelte-tabs/src/Tabs.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-tabs");
    			add_location(div, file$c, 97, 0, 2405);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "keydown", /*handleKeyDown*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], !current ? -1 : dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TABS = {};

    function removeAndUpdateSelected(arr, item, selectedStore) {
    	const index = arr.indexOf(item);
    	arr.splice(index, 1);

    	selectedStore.update(selected => selected === item
    	? arr[index] || arr[arr.length - 1]
    	: selected);
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $selectedTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, ['default']);
    	let { initialSelectedIndex = 0 } = $$props;
    	const tabElements = [];
    	const tabs = [];
    	const panels = [];
    	const controls = writable({});
    	const labeledBy = writable({});
    	const selectedTab = writable(null);
    	validate_store(selectedTab, 'selectedTab');
    	component_subscribe($$self, selectedTab, value => $$invalidate(5, $selectedTab = value));
    	const selectedPanel = writable(null);

    	function registerItem(arr, item, selectedStore) {
    		arr.push(item);
    		selectedStore.update(selected => selected || item);
    		onDestroy(() => removeAndUpdateSelected(arr, item, selectedStore));
    	}

    	function selectTab(tab) {
    		const index = tabs.indexOf(tab);
    		selectedTab.set(tab);
    		selectedPanel.set(panels[index]);
    	}

    	setContext(TABS, {
    		registerTab(tab) {
    			registerItem(tabs, tab, selectedTab);
    		},
    		registerTabElement(tabElement) {
    			tabElements.push(tabElement);
    		},
    		registerPanel(panel) {
    			registerItem(panels, panel, selectedPanel);
    		},
    		selectTab,
    		selectedTab,
    		selectedPanel,
    		controls,
    		labeledBy
    	});

    	onMount(() => {
    		selectTab(tabs[initialSelectedIndex]);
    	});

    	afterUpdate(() => {
    		for (let i = 0; i < tabs.length; i++) {
    			controls.update(controlsData => ({
    				...controlsData,
    				[tabs[i].id]: panels[i].id
    			}));

    			labeledBy.update(labeledByData => ({
    				...labeledByData,
    				[panels[i].id]: tabs[i].id
    			}));
    		}
    	});

    	async function handleKeyDown(event) {
    		if (event.target.classList.contains('svelte-tabs__tab')) {
    			let selectedIndex = tabs.indexOf($selectedTab);

    			switch (event.key) {
    				case 'ArrowRight':
    					selectedIndex += 1;
    					if (selectedIndex > tabs.length - 1) {
    						selectedIndex = 0;
    					}
    					selectTab(tabs[selectedIndex]);
    					tabElements[selectedIndex].focus();
    					break;
    				case 'ArrowLeft':
    					selectedIndex -= 1;
    					if (selectedIndex < 0) {
    						selectedIndex = tabs.length - 1;
    					}
    					selectTab(tabs[selectedIndex]);
    					tabElements[selectedIndex].focus();
    			}
    		}
    	}

    	const writable_props = ['initialSelectedIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('initialSelectedIndex' in $$props) $$invalidate(2, initialSelectedIndex = $$props.initialSelectedIndex);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TABS,
    		afterUpdate,
    		setContext,
    		onDestroy,
    		onMount,
    		tick,
    		writable,
    		initialSelectedIndex,
    		tabElements,
    		tabs,
    		panels,
    		controls,
    		labeledBy,
    		selectedTab,
    		selectedPanel,
    		removeAndUpdateSelected,
    		registerItem,
    		selectTab,
    		handleKeyDown,
    		$selectedTab
    	});

    	$$self.$inject_state = $$props => {
    		if ('initialSelectedIndex' in $$props) $$invalidate(2, initialSelectedIndex = $$props.initialSelectedIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedTab, handleKeyDown, initialSelectedIndex, $$scope, slots];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { initialSelectedIndex: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get initialSelectedIndex() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialSelectedIndex(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-tabs/src/Tab.svelte generated by Svelte v3.40.2 */
    const file$b = "node_modules/svelte-tabs/src/Tab.svelte";

    function create_fragment$c(ctx) {
    	let li;
    	let li_aria_controls_value;
    	let li_tabindex_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			attr_dev(li, "role", "tab");
    			attr_dev(li, "id", /*tab*/ ctx[3].id);
    			attr_dev(li, "aria-controls", li_aria_controls_value = /*$controls*/ ctx[2][/*tab*/ ctx[3].id]);
    			attr_dev(li, "aria-selected", /*isSelected*/ ctx[1]);
    			attr_dev(li, "tabindex", li_tabindex_value = /*isSelected*/ ctx[1] ? 0 : -1);
    			attr_dev(li, "class", "svelte-tabs__tab svelte-1fbofsd");
    			toggle_class(li, "svelte-tabs__selected", /*isSelected*/ ctx[1]);
    			add_location(li, file$b, 45, 0, 812);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			/*li_binding*/ ctx[10](li);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*click_handler*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], !current ? -1 : dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*$controls*/ 4 && li_aria_controls_value !== (li_aria_controls_value = /*$controls*/ ctx[2][/*tab*/ ctx[3].id])) {
    				attr_dev(li, "aria-controls", li_aria_controls_value);
    			}

    			if (!current || dirty & /*isSelected*/ 2) {
    				attr_dev(li, "aria-selected", /*isSelected*/ ctx[1]);
    			}

    			if (!current || dirty & /*isSelected*/ 2 && li_tabindex_value !== (li_tabindex_value = /*isSelected*/ ctx[1] ? 0 : -1)) {
    				attr_dev(li, "tabindex", li_tabindex_value);
    			}

    			if (dirty & /*isSelected*/ 2) {
    				toggle_class(li, "svelte-tabs__selected", /*isSelected*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    			/*li_binding*/ ctx[10](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $selectedTab;
    	let $controls;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	let tabEl;
    	const tab = { id: getId() };
    	const { registerTab, registerTabElement, selectTab, selectedTab, controls } = getContext(TABS);
    	validate_store(selectedTab, 'selectedTab');
    	component_subscribe($$self, selectedTab, value => $$invalidate(7, $selectedTab = value));
    	validate_store(controls, 'controls');
    	component_subscribe($$self, controls, value => $$invalidate(2, $controls = value));
    	let isSelected;
    	registerTab(tab);

    	onMount(async () => {
    		await tick();
    		registerTabElement(tabEl);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tabEl = $$value;
    			$$invalidate(0, tabEl);
    		});
    	}

    	const click_handler = () => selectTab(tab);

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		tick,
    		getId,
    		TABS,
    		tabEl,
    		tab,
    		registerTab,
    		registerTabElement,
    		selectTab,
    		selectedTab,
    		controls,
    		isSelected,
    		$selectedTab,
    		$controls
    	});

    	$$self.$inject_state = $$props => {
    		if ('tabEl' in $$props) $$invalidate(0, tabEl = $$props.tabEl);
    		if ('isSelected' in $$props) $$invalidate(1, isSelected = $$props.isSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedTab*/ 128) {
    			$$invalidate(1, isSelected = $selectedTab === tab);
    		}
    	};

    	return [
    		tabEl,
    		isSelected,
    		$controls,
    		tab,
    		selectTab,
    		selectedTab,
    		controls,
    		$selectedTab,
    		$$scope,
    		slots,
    		li_binding,
    		click_handler
    	];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules/svelte-tabs/src/TabList.svelte generated by Svelte v3.40.2 */

    const file$a = "node_modules/svelte-tabs/src/TabList.svelte";

    function create_fragment$b(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "role", "tablist");
    			attr_dev(ul, "class", "svelte-tabs__tab-list svelte-12yby2a");
    			add_location(ul, file$a, 8, 0, 116);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], !current ? -1 : dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabList', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TabList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabList",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* node_modules/svelte-tabs/src/TabPanel.svelte generated by Svelte v3.40.2 */
    const file$9 = "node_modules/svelte-tabs/src/TabPanel.svelte";

    // (26:2) {#if $selectedPanel === panel}
    function create_if_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], !current ? -1 : dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(26:2) {#if $selectedPanel === panel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let div_aria_labelledby_value;
    	let current;
    	let if_block = /*$selectedPanel*/ ctx[1] === /*panel*/ ctx[2] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "id", /*panel*/ ctx[2].id);
    			attr_dev(div, "aria-labelledby", div_aria_labelledby_value = /*$labeledBy*/ ctx[0][/*panel*/ ctx[2].id]);
    			attr_dev(div, "class", "svelte-tabs__tab-panel svelte-epfyet");
    			attr_dev(div, "role", "tabpanel");
    			add_location(div, file$9, 20, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$selectedPanel*/ ctx[1] === /*panel*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$selectedPanel*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$labeledBy*/ 1 && div_aria_labelledby_value !== (div_aria_labelledby_value = /*$labeledBy*/ ctx[0][/*panel*/ ctx[2].id])) {
    				attr_dev(div, "aria-labelledby", div_aria_labelledby_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $labeledBy;
    	let $selectedPanel;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabPanel', slots, ['default']);
    	const panel = { id: getId() };
    	const { registerPanel, selectedPanel, labeledBy } = getContext(TABS);
    	validate_store(selectedPanel, 'selectedPanel');
    	component_subscribe($$self, selectedPanel, value => $$invalidate(1, $selectedPanel = value));
    	validate_store(labeledBy, 'labeledBy');
    	component_subscribe($$self, labeledBy, value => $$invalidate(0, $labeledBy = value));
    	registerPanel(panel);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabPanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		getId,
    		TABS,
    		panel,
    		registerPanel,
    		selectedPanel,
    		labeledBy,
    		$labeledBy,
    		$selectedPanel
    	});

    	return [$labeledBy, $selectedPanel, panel, selectedPanel, labeledBy, $$scope, slots];
    }

    class TabPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPanel",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Content.svelte generated by Svelte v3.40.2 */
    const get_short_slot_changes = dirty => ({});
    const get_short_slot_context = ctx => ({});
    const get_long_slot_changes = dirty => ({});
    const get_long_slot_context = ctx => ({});

    // (7:0) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const short_slot_template = /*#slots*/ ctx[2].short;
    	const short_slot = create_slot(short_slot_template, ctx, /*$$scope*/ ctx[1], get_short_slot_context);

    	const block = {
    		c: function create() {
    			if (short_slot) short_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (short_slot) {
    				short_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (short_slot) {
    				if (short_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot(short_slot, short_slot_template, ctx, /*$$scope*/ ctx[1], !current ? -1 : dirty, get_short_slot_changes, get_short_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(short_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(short_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (short_slot) short_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(7:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if long}
    function create_if_block$4(ctx) {
    	let current;
    	const long_slot_template = /*#slots*/ ctx[2].long;
    	const long_slot = create_slot(long_slot_template, ctx, /*$$scope*/ ctx[1], get_long_slot_context);

    	const block = {
    		c: function create() {
    			if (long_slot) long_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (long_slot) {
    				long_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (long_slot) {
    				if (long_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot(long_slot, long_slot_template, ctx, /*$$scope*/ ctx[1], !current ? -1 : dirty, get_long_slot_changes, get_long_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(long_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(long_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (long_slot) long_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(5:0) {#if long}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*long*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, ['long','short']);
    	let { long } = $$props;
    	const writable_props = ['long'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('long' in $$props) $$invalidate(0, long = $$props.long);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ long });

    	$$self.$inject_state = $$props => {
    		if ('long' in $$props) $$invalidate(0, long = $$props.long);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [long, $$scope, slots];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { long: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*long*/ ctx[0] === undefined && !('long' in props)) {
    			console.warn("<Content> was created without expected prop 'long'");
    		}
    	}

    	get long() {
    		throw new Error("<Content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set long(value) {
    		throw new Error("<Content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const counterCode = `<script>
  let value = 0;

  function increment() {
    value++;
  }
  function reset() {
    value = 0;
  }
</script>

<progress {value} max="5">{value}</progress>
<div>
  <button disabled={value >= 5} on:click={increment}>Work</button>
  {#if value == 0}
    Start clicking!
  {:else if value < 5}
    Keep clicking...
  {:else}
    Done!
    <button on:click={reset}>reset</button>
  {/if}
</div>


<div>
  <button on:click={() => count++}>I was clicked {count} times</button>
</div>`;

    const templatesCode = `
<script>
  let value = 0;

  function increment() {
    value++;
  }
  function reset() {
    value = 0;
  }
</script>

<progress {value} max="5">{value}</progress>
<div>
  <button disabled={value >= 5} on:click={increment}>Work</button>
  {#if value == 0}
    Start clicking!
  {:else if value < 5}
    Keep clicking...
  {:else}
    Done!
    <button on:click={reset}>reset</button>
  {/if}
</div>
`;

    const twowaybinding = `
<script>
  let name = "";
</script>

<input bind:value={name} />
<p>
  {#if name}
    Hello, {name}
  {:else}
    Please enter your name!
  {/if}
</p>
`;

    const motion = `
<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  const value = tweened(0, { duration: 400, easing: cubicOut });
</script>

<progress value={$value} max="5">{value}</progress>
<p>{$value}</p>
<div>
  <button disabled={$value >= 5} on:click={() => value.set($value + 1)}
    >Work</button
  >
  {#if $value == 0}
    Start clicking!
  {:else if $value < 5}
    Keep clicking...
  {:else}
    Done!
  {/if}
  {#if $value >= 5}
    <button transition:fade on:click={() => value.set(0)}>reset</button>
  {/if}
</div>
`;

    const components = `
// outer component
<script>
  import ComponentsInner from "./ComponentsInner.svelte";

  let notes = [
    { text: "foo", starred: false },
    { text: "bar", starred: true },
    { text: "baz", starred: false },
  ];
</script>

<div>
  {#each notes as {text, starred }}
    <ComponentsInner {text} bind:starred />
  {/each}
</div>


// inner component 
<script>
  export let text;
  export let starred;

</script>

<div class="note">
  <button on:click={() => starred = !starred}>{#if starred}🌟{:else}⭐{/if}</button>
  <p>{text}</p>
</div>

<style>
  .note {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    width: 500px;
  }
</style>
`;

    var code = /*#__PURE__*/Object.freeze({
        __proto__: null,
        counterCode: counterCode,
        templatesCode: templatesCode,
        twowaybinding: twowaybinding,
        motion: motion,
        components: components
    });

    /* src/examples/Counter.svelte generated by Svelte v3.40.2 */

    const file$8 = "src/examples/Counter.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("I was clicked ");
    			t1 = text(/*count*/ ctx[0]);
    			t2 = text(" times");
    			add_location(button, file$8, 5, 2, 45);
    			add_location(div, file$8, 4, 0, 37);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*count*/ 1) set_data_dev(t1, /*count*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Counter', slots, []);
    	let count = 0;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Counter> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, count++, count);
    	$$self.$capture_state = () => ({ count });

    	$$self.$inject_state = $$props => {
    		if ('count' in $$props) $$invalidate(0, count = $$props.count);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [count, click_handler];
    }

    class Counter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Counter",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/examples/TwoWayBinding.svelte generated by Svelte v3.40.2 */

    const file$7 = "src/examples/TwoWayBinding.svelte";

    // (9:2) {:else}
    function create_else_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Please enter your name!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(9:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:2) {#if name}
    function create_if_block$3(ctx) {
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Hello, ");
    			t1 = text(/*name*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(7:2) {#if name}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let input;
    	let t;
    	let p;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*name*/ ctx[0]) return create_if_block$3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t = space();
    			p = element("p");
    			if_block.c();
    			add_location(input, file$7, 4, 0, 37);
    			add_location(p, file$7, 5, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*name*/ ctx[0]);
    			insert_dev(target, t, anchor);
    			insert_dev(target, p, anchor);
    			if_block.m(p, null);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
    				set_input_value(input, /*name*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(p, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(p);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TwoWayBinding', slots, []);
    	let name = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TwoWayBinding> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		name = this.value;
    		$$invalidate(0, name);
    	}

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, input_input_handler];
    }

    class TwoWayBinding extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TwoWayBinding",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/examples/ComponentsInner.svelte generated by Svelte v3.40.2 */

    const file$6 = "src/examples/ComponentsInner.svelte";

    // (10:20) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("⭐");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(10:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:5) {#if starred}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("🌟");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(10:5) {#if starred}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let button0;
    	let t0;
    	let button1;
    	let t2;
    	let p;
    	let t3;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*starred*/ ctx[0]) return create_if_block$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			if_block.c();
    			t0 = space();
    			button1 = element("button");
    			button1.textContent = "X";
    			t2 = space();
    			p = element("p");
    			t3 = text(/*text*/ ctx[1]);
    			add_location(button0, file$6, 8, 2, 104);
    			add_location(button1, file$6, 11, 2, 198);
    			add_location(p, file$6, 12, 2, 237);
    			attr_dev(div, "class", "note svelte-1lkv71v");
    			add_location(div, file$6, 7, 0, 83);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			if_block.m(button0, null);
    			append_dev(div, t0);
    			append_dev(div, button1);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*remove*/ ctx[2])) /*remove*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button0, null);
    				}
    			}

    			if (dirty & /*text*/ 2) set_data_dev(t3, /*text*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ComponentsInner', slots, []);
    	let { text } = $$props;
    	let { starred } = $$props;
    	let { remove } = $$props;
    	const writable_props = ['text', 'starred', 'remove'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ComponentsInner> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, starred = !starred);

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('starred' in $$props) $$invalidate(0, starred = $$props.starred);
    		if ('remove' in $$props) $$invalidate(2, remove = $$props.remove);
    	};

    	$$self.$capture_state = () => ({ text, starred, remove });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('starred' in $$props) $$invalidate(0, starred = $$props.starred);
    		if ('remove' in $$props) $$invalidate(2, remove = $$props.remove);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [starred, text, remove, click_handler];
    }

    class ComponentsInner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { text: 1, starred: 0, remove: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ComponentsInner",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<ComponentsInner> was created without expected prop 'text'");
    		}

    		if (/*starred*/ ctx[0] === undefined && !('starred' in props)) {
    			console.warn("<ComponentsInner> was created without expected prop 'starred'");
    		}

    		if (/*remove*/ ctx[2] === undefined && !('remove' in props)) {
    			console.warn("<ComponentsInner> was created without expected prop 'remove'");
    		}
    	}

    	get text() {
    		throw new Error("<ComponentsInner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<ComponentsInner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starred() {
    		throw new Error("<ComponentsInner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starred(value) {
    		throw new Error("<ComponentsInner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get remove() {
    		throw new Error("<ComponentsInner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set remove(value) {
    		throw new Error("<ComponentsInner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/examples/ComponentsOuter.svelte generated by Svelte v3.40.2 */
    const file$5 = "src/examples/ComponentsOuter.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].text;
    	child_ctx[7] = list[i].starred;
    	child_ctx[8] = list;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (18:2) {#each notes as { text, starred }}
    function create_each_block(ctx) {
    	let componentsinner;
    	let updating_starred;
    	let current;

    	function func() {
    		return /*func*/ ctx[3](/*text*/ ctx[1]);
    	}

    	function componentsinner_starred_binding(value) {
    		/*componentsinner_starred_binding*/ ctx[4](value, /*starred*/ ctx[7], /*each_value*/ ctx[8], /*each_index*/ ctx[9]);
    	}

    	let componentsinner_props = { text: /*text*/ ctx[1], remove: func };

    	if (/*starred*/ ctx[7] !== void 0) {
    		componentsinner_props.starred = /*starred*/ ctx[7];
    	}

    	componentsinner = new ComponentsInner({
    			props: componentsinner_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(componentsinner, 'starred', componentsinner_starred_binding));

    	const block = {
    		c: function create() {
    			create_component(componentsinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(componentsinner, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const componentsinner_changes = {};
    			if (dirty & /*notes*/ 1) componentsinner_changes.text = /*text*/ ctx[1];
    			if (dirty & /*notes*/ 1) componentsinner_changes.remove = func;

    			if (!updating_starred && dirty & /*notes*/ 1) {
    				updating_starred = true;
    				componentsinner_changes.starred = /*starred*/ ctx[7];
    				add_flush_callback(() => updating_starred = false);
    			}

    			componentsinner.$set(componentsinner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(componentsinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(componentsinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(componentsinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(18:2) {#each notes as { text, starred }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t0;
    	let input;
    	let t1;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*notes*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			input = element("input");
    			t1 = space();
    			button = element("button");
    			button.textContent = "+";
    			add_location(input, file$5, 20, 2, 441);
    			add_location(button, file$5, 21, 2, 471);
    			add_location(div, file$5, 16, 0, 314);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, input);
    			set_input_value(input, /*text*/ ctx[1]);
    			append_dev(div, t1);
    			append_dev(div, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*notes, remove*/ 5) {
    				each_value = /*notes*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*text*/ 2 && input.value !== /*text*/ ctx[1]) {
    				set_input_value(input, /*text*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ComponentsOuter', slots, []);

    	let notes = [
    		{ text: "foo", starred: false },
    		{ text: "bar", starred: true },
    		{ text: "baz", starred: false }
    	];

    	function remove(text) {
    		$$invalidate(0, notes = notes.filter(note => note.text != text));
    	}

    	let text = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ComponentsOuter> was created with unknown prop '${key}'`);
    	});

    	const func = text => remove(text);

    	function componentsinner_starred_binding(value, starred, each_value, each_index) {
    		each_value[each_index].starred = value;
    		$$invalidate(0, notes);
    	}

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(1, text);
    	}

    	const click_handler = () => {
    		$$invalidate(0, notes = [...notes, { text, starred: false }]);
    		$$invalidate(1, text = "");
    	};

    	$$self.$capture_state = () => ({ ComponentsInner, notes, remove, text });

    	$$self.$inject_state = $$props => {
    		if ('notes' in $$props) $$invalidate(0, notes = $$props.notes);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		notes,
    		text,
    		remove,
    		func,
    		componentsinner_starred_binding,
    		input_input_handler,
    		click_handler
    	];
    }

    class ComponentsOuter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ComponentsOuter",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src/examples/Motion.svelte generated by Svelte v3.40.2 */
    const file$4 = "src/examples/Motion.svelte";

    // (16:2) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Done!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(16:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (14:23) 
    function create_if_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Keep clicking...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(14:23) ",
    		ctx
    	});

    	return block;
    }

    // (12:2) {#if $value == 0}
    function create_if_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Start clicking!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(12:2) {#if $value == 0}",
    		ctx
    	});

    	return block;
    }

    // (19:2) {#if $value >= 5}
    function create_if_block$1(ctx) {
    	let button;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "reset";
    			add_location(button, file$4, 19, 4, 513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, fade, {}, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, fade, {}, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(19:2) {#if $value >= 5}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let progress;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let div;
    	let button;
    	let t4;
    	let button_disabled_value;
    	let t5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$value*/ ctx[0] == 0) return create_if_block_1$1;
    		if (/*$value*/ ctx[0] < 5) return create_if_block_2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*$value*/ ctx[0] >= 5 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			progress = element("progress");
    			t0 = text(/*value*/ ctx[1]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*$value*/ ctx[0]);
    			t3 = space();
    			div = element("div");
    			button = element("button");
    			t4 = text("Work");
    			t5 = space();
    			if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			progress.value = /*$value*/ ctx[0];
    			attr_dev(progress, "max", "5");
    			add_location(progress, file$4, 7, 0, 216);
    			add_location(p, file$4, 8, 0, 268);
    			button.disabled = button_disabled_value = /*$value*/ ctx[0] >= 5;
    			add_location(button, file$4, 10, 2, 292);
    			add_location(div, file$4, 9, 0, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, progress, anchor);
    			append_dev(progress, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t4);
    			append_dev(div, t5);
    			if_block0.m(div, null);
    			append_dev(div, t6);
    			if (if_block1) if_block1.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$value*/ 1) {
    				prop_dev(progress, "value", /*$value*/ ctx[0]);
    			}

    			if (!current || dirty & /*$value*/ 1) set_data_dev(t2, /*$value*/ ctx[0]);

    			if (!current || dirty & /*$value*/ 1 && button_disabled_value !== (button_disabled_value = /*$value*/ ctx[0] >= 5)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t6);
    				}
    			}

    			if (/*$value*/ ctx[0] >= 5) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$value*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(progress);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $value;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Motion', slots, []);
    	const value = tweened(0, { duration: 400, easing: cubicOut });
    	validate_store(value, 'value');
    	component_subscribe($$self, value, value => $$invalidate(0, $value = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Motion> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => value.set($value + 1);
    	const click_handler_1 = () => value.set(0);
    	$$self.$capture_state = () => ({ tweened, cubicOut, fade, value, $value });
    	return [$value, value, click_handler, click_handler_1];
    }

    class Motion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Motion",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    var deepFreezeEs6 = {exports: {}};

    function deepFreeze(obj) {
        if (obj instanceof Map) {
            obj.clear = obj.delete = obj.set = function () {
                throw new Error('map is read-only');
            };
        } else if (obj instanceof Set) {
            obj.add = obj.clear = obj.delete = function () {
                throw new Error('set is read-only');
            };
        }

        // Freeze self
        Object.freeze(obj);

        Object.getOwnPropertyNames(obj).forEach(function (name) {
            var prop = obj[name];

            // Freeze prop if it is an object
            if (typeof prop == 'object' && !Object.isFrozen(prop)) {
                deepFreeze(prop);
            }
        });

        return obj;
    }

    deepFreezeEs6.exports = deepFreeze;
    deepFreezeEs6.exports.default = deepFreeze;

    var deepFreeze$1 = deepFreezeEs6.exports;

    /** @typedef {import('highlight.js').CallbackResponse} CallbackResponse */
    /** @typedef {import('highlight.js').CompiledMode} CompiledMode */
    /** @implements CallbackResponse */

    class Response {
      /**
       * @param {CompiledMode} mode
       */
      constructor(mode) {
        // eslint-disable-next-line no-undefined
        if (mode.data === undefined) mode.data = {};

        this.data = mode.data;
        this.isMatchIgnored = false;
      }

      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    function escapeHTML(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    /**
     * performs a shallow merge of multiple objects into one
     *
     * @template T
     * @param {T} original
     * @param {Record<string,any>[]} objects
     * @returns {T} a single new object
     */
    function inherit$1(original, ...objects) {
      /** @type Record<string,any> */
      const result = Object.create(null);

      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return /** @type {T} */ (result);
    }

    /**
     * @typedef {object} Renderer
     * @property {(text: string) => void} addText
     * @property {(node: Node) => void} openNode
     * @property {(node: Node) => void} closeNode
     * @property {() => string} value
     */

    /** @typedef {{kind?: string, sublanguage?: boolean}} Node */
    /** @typedef {{walk: (r: Renderer) => void}} Tree */
    /** */

    const SPAN_CLOSE = '</span>';

    /**
     * Determines if a node needs to be wrapped in <span>
     *
     * @param {Node} node */
    const emitsWrappingTags = (node) => {
      return !!node.kind;
    };

    /**
     *
     * @param {string} name
     * @param {{prefix:string}} options
     */
    const expandScopeName = (name, { prefix }) => {
      if (name.includes(".")) {
        const pieces = name.split(".");
        return [
          `${prefix}${pieces.shift()}`,
          ...(pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`))
        ].join(" ");
      }
      return `${prefix}${name}`;
    };

    /** @type {Renderer} */
    class HTMLRenderer {
      /**
       * Creates a new HTMLRenderer
       *
       * @param {Tree} parseTree - the parse tree (must support `walk` API)
       * @param {{classPrefix: string}} options
       */
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }

      /**
       * Adds texts to the output stream
       *
       * @param {string} text */
      addText(text) {
        this.buffer += escapeHTML(text);
      }

      /**
       * Adds a node open to the output stream (if needed)
       *
       * @param {Node} node */
      openNode(node) {
        if (!emitsWrappingTags(node)) return;

        let scope = node.kind;
        if (node.sublanguage) {
          scope = `language-${scope}`;
        } else {
          scope = expandScopeName(scope, { prefix: this.classPrefix });
        }
        this.span(scope);
      }

      /**
       * Adds a node close to the output stream (if needed)
       *
       * @param {Node} node */
      closeNode(node) {
        if (!emitsWrappingTags(node)) return;

        this.buffer += SPAN_CLOSE;
      }

      /**
       * returns the accumulated buffer
      */
      value() {
        return this.buffer;
      }

      // helpers

      /**
       * Builds a span element
       *
       * @param {string} className */
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    }

    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} | string} Node */
    /** @typedef {{kind?: string, sublanguage?: boolean, children: Node[]} } DataNode */
    /** @typedef {import('highlight.js').Emitter} Emitter */
    /**  */

    class TokenTree {
      constructor() {
        /** @type DataNode */
        this.rootNode = { children: [] };
        this.stack = [this.rootNode];
      }

      get top() {
        return this.stack[this.stack.length - 1];
      }

      get root() { return this.rootNode; }

      /** @param {Node} node */
      add(node) {
        this.top.children.push(node);
      }

      /** @param {string} kind */
      openNode(kind) {
        /** @type Node */
        const node = { kind, children: [] };
        this.add(node);
        this.stack.push(node);
      }

      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        // eslint-disable-next-line no-undefined
        return undefined;
      }

      closeAllNodes() {
        while (this.closeNode());
      }

      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }

      /**
       * @typedef { import("./html_renderer").Renderer } Renderer
       * @param {Renderer} builder
       */
      walk(builder) {
        // this does not
        return this.constructor._walk(builder, this.rootNode);
        // this works
        // return TokenTree._walk(builder, this.rootNode);
      }

      /**
       * @param {Renderer} builder
       * @param {Node} node
       */
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }

      /**
       * @param {Node} node
       */
      static _collapse(node) {
        if (typeof node === "string") return;
        if (!node.children) return;

        if (node.children.every(el => typeof el === "string")) {
          // node.text = node.children.join("");
          // delete node.children;
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            TokenTree._collapse(child);
          });
        }
      }
    }

    /**
      Currently this is all private API, but this is the minimal API necessary
      that an Emitter must implement to fully support the parser.

      Minimal interface:

      - addKeyword(text, kind)
      - addText(text)
      - addSublanguage(emitter, subLanguageName)
      - finalize()
      - openNode(kind)
      - closeNode()
      - closeAllNodes()
      - toHTML()

    */

    /**
     * @implements {Emitter}
     */
    class TokenTreeEmitter extends TokenTree {
      /**
       * @param {*} options
       */
      constructor(options) {
        super();
        this.options = options;
      }

      /**
       * @param {string} text
       * @param {string} kind
       */
      addKeyword(text, kind) {
        if (text === "") { return; }

        this.openNode(kind);
        this.addText(text);
        this.closeNode();
      }

      /**
       * @param {string} text
       */
      addText(text) {
        if (text === "") { return; }

        this.add(text);
      }

      /**
       * @param {Emitter & {root: DataNode}} emitter
       * @param {string} name
       */
      addSublanguage(emitter, name) {
        /** @type DataNode */
        const node = emitter.root;
        node.kind = name;
        node.sublanguage = true;
        this.add(node);
      }

      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }

      finalize() {
        return true;
      }
    }

    /**
     * @param {string} value
     * @returns {RegExp}
     * */

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source$3(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function lookahead$3(re) {
      return concat$3('(?=', re, ')');
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat$3(...args) {
      const joined = args.map((x) => source$3(x)).join("");
      return joined;
    }

    function stripOptionsFromArgs$1(args) {
      const opts = args[args.length - 1];

      if (typeof opts === 'object' && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }

    /**
     * Any of the passed expresssions may match
     *
     * Creates a huge this | this | that | that match
     * @param {(RegExp | string)[] } args
     * @returns {string}
     */
    function either$1(...args) {
      const opts = stripOptionsFromArgs$1(args);
      const joined = '(' +
        (opts.capture ? "" : "?:") +
        args.map((x) => source$3(x)).join("|") + ")";
      return joined;
    }

    /**
     * @param {RegExp} re
     * @returns {number}
     */
    function countMatchGroups(re) {
      return (new RegExp(re.toString() + '|')).exec('').length - 1;
    }

    /**
     * Does lexeme start with a regular expression match at the beginning
     * @param {RegExp} re
     * @param {string} lexeme
     */
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }

    // BACKREF_RE matches an open parenthesis or backreference. To avoid
    // an incorrect parse, it additionally matches the following:
    // - [...] elements, where the meaning of parentheses and escapes change
    // - other escape sequences, so we do not misparse escape sequences as
    //   interesting elements
    // - non-matching or lookahead parentheses, which do not capture. These
    //   follow the '(' with a '?'.
    const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

    // **INTERNAL** Not intended for outside usage
    // join logically computes regexps.join(separator), but fixes the
    // backreferences so they continue to match.
    // it also places each individual regular expression into it's own
    // match group, keeping track of the sequencing of those match groups
    // is currently an exercise for the caller. :-)
    /**
     * @param {(string | RegExp)[]} regexps
     * @param {{joinWith: string}} opts
     * @returns {string}
     */
    function _rewriteBackreferences(regexps, { joinWith }) {
      let numCaptures = 0;

      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source$3(regex);
        let out = '';

        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === '\\' && match[1]) {
            // Adjust the backreference.
            out += '\\' + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === '(') {
              numCaptures++;
            }
          }
        }
        return out;
      }).map(re => `(${re})`).join(joinWith);
    }

    /** @typedef {import('highlight.js').Mode} Mode */
    /** @typedef {import('highlight.js').ModeCallback} ModeCallback */

    // Common regexps
    const MATCH_NOTHING_RE = /\b\B/;
    const IDENT_RE$1 = '[a-zA-Z]\\w*';
    const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
    const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
    const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
    const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
    const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

    /**
    * @param { Partial<Mode> & {binary?: string | RegExp} } opts
    */
    const SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat$3(
          beginShebang,
          /.*\b/,
          opts.binary,
          /\b.*/);
      }
      return inherit$1({
        scope: 'meta',
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        /** @type {ModeCallback} */
        "on:begin": (m, resp) => {
          if (m.index !== 0) resp.ignoreMatch();
        }
      }, opts);
    };

    // Common modes
    const BACKSLASH_ESCAPE = {
      begin: '\\\\[\\s\\S]', relevance: 0
    };
    const APOS_STRING_MODE = {
      scope: 'string',
      begin: '\'',
      end: '\'',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const QUOTE_STRING_MODE = {
      scope: 'string',
      begin: '"',
      end: '"',
      illegal: '\\n',
      contains: [BACKSLASH_ESCAPE]
    };
    const PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    /**
     * Creates a comment mode
     *
     * @param {string | RegExp} begin
     * @param {string | RegExp} end
     * @param {Mode | {}} [modeOptions]
     * @returns {Partial<Mode>}
     */
    const COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit$1(
        {
          scope: 'comment',
          begin,
          end,
          contains: []
        },
        modeOptions
      );
      mode.contains.push({
        scope: 'doctag',
        // hack to avoid the space from being included. the space is necessary to
        // match here to prevent the plain text rule below from gobbling up doctags
        begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0
      });
      const ENGLISH_WORD = either$1(
        // list of common 1 and 2 letter words in English
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        // note: this is not an exhaustive list of contractions, just popular ones
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, // contractions - can't we'd they're let's, etc
        /[A-Za-z]+[-][a-z]+/, // `no-way`, etc.
        /[A-Za-z][a-z]{2,}/ // allow capitalized words at beginning of sentences
      );
      // looking like plain text, more likely to be a comment
      mode.contains.push(
        {
          // TODO: how to include ", (, ) without breaking grammars that use these for
          // comment delimiters?
          // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
          // ---

          // this tries to find sequences of 3 english words in a row (without any
          // "programming" type syntax) this gives us a strong signal that we've
          // TRULY found a comment - vs perhaps scanning with the wrong language.
          // It's possible to find something that LOOKS like the start of the
          // comment - but then if there is no readable text - good chance it is a
          // false match and not a comment.
          //
          // for a visual example please see:
          // https://github.com/highlightjs/highlight.js/issues/2827

          begin: concat$3(
            /[ ]+/, // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
            '(',
            ENGLISH_WORD,
            /[.]?[:]?([.][ ]|[ ])/,
            '){3}') // look for 3 words in a row
        }
      );
      return mode;
    };
    const C_LINE_COMMENT_MODE = COMMENT('//', '$');
    const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
    const HASH_COMMENT_MODE = COMMENT('#', '$');
    const NUMBER_MODE = {
      scope: 'number',
      begin: NUMBER_RE,
      relevance: 0
    };
    const C_NUMBER_MODE = {
      scope: 'number',
      begin: C_NUMBER_RE,
      relevance: 0
    };
    const BINARY_NUMBER_MODE = {
      scope: 'number',
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    const REGEXP_MODE = {
      // this outer rule makes sure we actually have a WHOLE regex and not simply
      // an expression such as:
      //
      //     3 / something
      //
      // (which will then blow up when regex's `illegal` sees the newline)
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        scope: 'regexp',
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      }]
    };
    const TITLE_MODE = {
      scope: 'title',
      begin: IDENT_RE$1,
      relevance: 0
    };
    const UNDERSCORE_TITLE_MODE = {
      scope: 'title',
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    const METHOD_GUARD = {
      // excludes method names from keyword processing
      begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
      relevance: 0
    };

    /**
     * Adds end same as begin mechanics to a mode
     *
     * Your mode must include at least a single () match group as that first match
     * group is what is used for comparison
     * @param {Partial<Mode>} mode
     */
    const END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(mode,
        {
          /** @type {ModeCallback} */
          'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
          /** @type {ModeCallback} */
          'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
        });
    };

    var MODES$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MATCH_NOTHING_RE: MATCH_NOTHING_RE,
        IDENT_RE: IDENT_RE$1,
        UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
        NUMBER_RE: NUMBER_RE,
        C_NUMBER_RE: C_NUMBER_RE,
        BINARY_NUMBER_RE: BINARY_NUMBER_RE,
        RE_STARTERS_RE: RE_STARTERS_RE,
        SHEBANG: SHEBANG,
        BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
        APOS_STRING_MODE: APOS_STRING_MODE,
        QUOTE_STRING_MODE: QUOTE_STRING_MODE,
        PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
        COMMENT: COMMENT,
        C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
        C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
        HASH_COMMENT_MODE: HASH_COMMENT_MODE,
        NUMBER_MODE: NUMBER_MODE,
        C_NUMBER_MODE: C_NUMBER_MODE,
        BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
        REGEXP_MODE: REGEXP_MODE,
        TITLE_MODE: TITLE_MODE,
        UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE,
        METHOD_GUARD: METHOD_GUARD,
        END_SAME_AS_BEGIN: END_SAME_AS_BEGIN
    });

    /**
    @typedef {import('highlight.js').CallbackResponse} CallbackResponse
    @typedef {import('highlight.js').CompilerExt} CompilerExt
    */

    // Grammar extensions / plugins
    // See: https://github.com/highlightjs/highlight.js/issues/2833

    // Grammar extensions allow "syntactic sugar" to be added to the grammar modes
    // without requiring any underlying changes to the compiler internals.

    // `compileMatch` being the perfect small example of now allowing a grammar
    // author to write `match` when they desire to match a single expression rather
    // than being forced to use `begin`.  The extension then just moves `match` into
    // `begin` when it runs.  Ie, no features have been added, but we've just made
    // the experience of writing (and reading grammars) a little bit nicer.

    // ------

    // TODO: We need negative look-behind support to do this properly
    /**
     * Skip a match if it has a preceding dot
     *
     * This is used for `beginKeywords` to prevent matching expressions such as
     * `bob.keyword.do()`. The mode compiler automatically wires this up as a
     * special _internal_ 'on:begin' callback for modes with `beginKeywords`
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    function skipIfHasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }

    /**
     *
     * @type {CompilerExt}
     */
    function scopeClassName(mode, _parent) {
      // eslint-disable-next-line no-undefined
      if (mode.className !== undefined) {
        mode.scope = mode.className;
        delete mode.className;
      }
    }

    /**
     * `beginKeywords` syntactic sugar
     * @type {CompilerExt}
     */
    function beginKeywords(mode, parent) {
      if (!parent) return;
      if (!mode.beginKeywords) return;

      // for languages with keywords that include non-word characters checking for
      // a word boundary is not sufficient, so instead we check for a word boundary
      // or whitespace - this does no harm in any case since our keyword engine
      // doesn't allow spaces in keywords anyways and we still check for the boundary
      // first
      mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
      mode.__beforeBegin = skipIfHasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;

      // prevents double relevance, the keywords themselves provide
      // relevance, the mode doesn't need to double it
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 0;
    }

    /**
     * Allow `illegal` to contain an array of illegal values
     * @type {CompilerExt}
     */
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal)) return;

      mode.illegal = either$1(...mode.illegal);
    }

    /**
     * `match` to match a single expression for readability
     * @type {CompilerExt}
     */
    function compileMatch(mode, _parent) {
      if (!mode.match) return;
      if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

      mode.begin = mode.match;
      delete mode.match;
    }

    /**
     * provides the default 1 relevance to all modes
     * @type {CompilerExt}
     */
    function compileRelevance(mode, _parent) {
      // eslint-disable-next-line no-undefined
      if (mode.relevance === undefined) mode.relevance = 1;
    }

    // allow beforeMatch to act as a "qualifier" for the match
    // the full match begin must be [beforeMatch][begin]
    const beforeMatchExt = (mode, parent) => {
      if (!mode.beforeMatch) return;
      // starts conflicts with endsParent which we need to make sure the child
      // rule is not matched multiple times
      if (mode.starts) throw new Error("beforeMatch cannot be used with starts");

      const originalMode = Object.assign({}, mode);
      Object.keys(mode).forEach((key) => { delete mode[key]; });

      mode.keywords = originalMode.keywords;
      mode.begin = concat$3(originalMode.beforeMatch, lookahead$3(originalMode.begin));
      mode.starts = {
        relevance: 0,
        contains: [
          Object.assign(originalMode, { endsParent: true })
        ]
      };
      mode.relevance = 0;

      delete originalMode.beforeMatch;
    };

    // keywords that should have no default relevance value
    const COMMON_KEYWORDS = [
      'of',
      'and',
      'for',
      'in',
      'not',
      'or',
      'if',
      'then',
      'parent', // common variable name
      'list', // common variable name
      'value' // common variable name
    ];

    const DEFAULT_KEYWORD_SCOPE = "keyword";

    /**
     * Given raw keywords from a language definition, compile them.
     *
     * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
     * @param {boolean} caseInsensitive
     */
    function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
      /** @type KeywordDict */
      const compiledKeywords = Object.create(null);

      // input can be a string of keywords, an array of keywords, or a object with
      // named keys representing scopeName (which can then point to a string or array)
      if (typeof rawKeywords === 'string') {
        compileList(scopeName, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(scopeName, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(scopeName) {
          // collapse all our objects back into the parent object
          Object.assign(
            compiledKeywords,
            compileKeywords(rawKeywords[scopeName], caseInsensitive, scopeName)
          );
        });
      }
      return compiledKeywords;

      // ---

      /**
       * Compiles an individual list of keywords
       *
       * Ex: "for if when while|5"
       *
       * @param {string} scopeName
       * @param {Array<string>} keywordList
       */
      function compileList(scopeName, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map(x => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split('|');
          compiledKeywords[pair[0]] = [scopeName, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }

    /**
     * Returns the proper score for a given keyword
     *
     * Also takes into account comment keywords, which will be scored 0 UNLESS
     * another score has been manually assigned.
     * @param {string} keyword
     * @param {string} [providedScore]
     */
    function scoreForKeyword(keyword, providedScore) {
      // manual scores always win over common keywords
      // so you can force a score of 1 if you really insist
      if (providedScore) {
        return Number(providedScore);
      }

      return commonKeyword(keyword) ? 0 : 1;
    }

    /**
     * Determines if a given keyword is common or not
     *
     * @param {string} keyword */
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }

    /*

    For the reasoning behind this please see:
    https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

    */

    /**
     * @type {Record<string, boolean>}
     */
    const seenDeprecations = {};

    /**
     * @param {string} message
     */
    const error = (message) => {
      console.error(message);
    };

    /**
     * @param {string} message
     * @param {any} args
     */
    const warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };

    /**
     * @param {string} version
     * @param {string} message
     */
    const deprecated = (version, message) => {
      if (seenDeprecations[`${version}/${message}`]) return;

      console.log(`Deprecated as of ${version}. ${message}`);
      seenDeprecations[`${version}/${message}`] = true;
    };

    /* eslint-disable no-throw-literal */

    /**
    @typedef {import('highlight.js').CompiledMode} CompiledMode
    */

    const MultiClassError = new Error();

    /**
     * Renumbers labeled scope names to account for additional inner match
     * groups that otherwise would break everything.
     *
     * Lets say we 3 match scopes:
     *
     *   { 1 => ..., 2 => ..., 3 => ... }
     *
     * So what we need is a clean match like this:
     *
     *   (a)(b)(c) => [ "a", "b", "c" ]
     *
     * But this falls apart with inner match groups:
     *
     * (a)(((b)))(c) => ["a", "b", "b", "b", "c" ]
     *
     * Our scopes are now "out of alignment" and we're repeating `b` 3 times.
     * What needs to happen is the numbers are remapped:
     *
     *   { 1 => ..., 2 => ..., 5 => ... }
     *
     * We also need to know that the ONLY groups that should be output
     * are 1, 2, and 5.  This function handles this behavior.
     *
     * @param {CompiledMode} mode
     * @param {Array<RegExp>} regexes
     * @param {{key: "beginScope"|"endScope"}} opts
     */
    function remapScopeNames(mode, regexes, { key }) {
      let offset = 0;
      const scopeNames = mode[key];
      /** @type Record<number,boolean> */
      const emit = {};
      /** @type Record<number,string> */
      const positions = {};

      for (let i = 1; i <= regexes.length; i++) {
        positions[i + offset] = scopeNames[i];
        emit[i + offset] = true;
        offset += countMatchGroups(regexes[i - 1]);
      }
      // we use _emit to keep track of which match groups are "top-level" to avoid double
      // output from inside match groups
      mode[key] = positions;
      mode[key]._emit = emit;
      mode[key]._multi = true;
    }

    /**
     * @param {CompiledMode} mode
     */
    function beginMultiClass(mode) {
      if (!Array.isArray(mode.begin)) return;

      if (mode.skip || mode.excludeBegin || mode.returnBegin) {
        error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
        throw MultiClassError;
      }

      if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
        error("beginScope must be object");
        throw MultiClassError;
      }

      remapScopeNames(mode, mode.begin, {key: "beginScope"});
      mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
    }

    /**
     * @param {CompiledMode} mode
     */
    function endMultiClass(mode) {
      if (!Array.isArray(mode.end)) return;

      if (mode.skip || mode.excludeEnd || mode.returnEnd) {
        error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
        throw MultiClassError;
      }

      if (typeof mode.endScope !== "object" || mode.endScope === null) {
        error("endScope must be object");
        throw MultiClassError;
      }

      remapScopeNames(mode, mode.end, {key: "endScope"});
      mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
    }

    /**
     * this exists only to allow `scope: {}` to be used beside `match:`
     * Otherwise `beginScope` would necessary and that would look weird

      {
        match: [ /def/, /\w+/ ]
        scope: { 1: "keyword" , 2: "title" }
      }

     * @param {CompiledMode} mode
     */
    function scopeSugar(mode) {
      if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
        mode.beginScope = mode.scope;
        delete mode.scope;
      }
    }

    /**
     * @param {CompiledMode} mode
     */
    function MultiClass(mode) {
      scopeSugar(mode);

      if (typeof mode.beginScope === "string") {
        mode.beginScope = { _wrap: mode.beginScope };
      }
      if (typeof mode.endScope === "string") {
        mode.endScope = { _wrap: mode.endScope };
      }

      beginMultiClass(mode);
      endMultiClass(mode);
    }

    /**
    @typedef {import('highlight.js').Mode} Mode
    @typedef {import('highlight.js').CompiledMode} CompiledMode
    @typedef {import('highlight.js').Language} Language
    @typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
    @typedef {import('highlight.js').CompiledLanguage} CompiledLanguage
    */

    // compilation

    /**
     * Compiles a language definition result
     *
     * Given the raw result of a language definition (Language), compiles this so
     * that it is ready for highlighting code.
     * @param {Language} language
     * @returns {CompiledLanguage}
     */
    function compileLanguage(language) {
      /**
       * Builds a regex with the case sensitivity of the current language
       *
       * @param {RegExp | string} value
       * @param {boolean} [global]
       */
      function langRe(value, global) {
        return new RegExp(
          source$3(value),
          'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
        );
      }

      /**
        Stores multiple regular expressions and allows you to quickly search for
        them all in a string simultaneously - returning the first match.  It does
        this by creating a huge (a|b|c) regex - each individual item wrapped with ()
        and joined by `|` - using match groups to track position.  When a match is
        found checking which position in the array has content allows us to figure
        out which of the original regexes / match groups triggered the match.

        The match object itself (the result of `Regex.exec`) is returned but also
        enhanced by merging in any meta-data that was registered with the regex.
        This is how we keep track of which mode matched, and what type of rule
        (`illegal`, `begin`, end, etc).
      */
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          // @ts-ignore
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          opts.position = this.position++;
          // @ts-ignore
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }

        compile() {
          if (this.regexes.length === 0) {
            // avoids the need to check length every time exec is called
            // @ts-ignore
            this.exec = () => null;
          }
          const terminators = this.regexes.map(el => el[1]);
          this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: '|' }), true);
          this.lastIndex = 0;
        }

        /** @param {string} s */
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) { return null; }

          // eslint-disable-next-line no-undefined
          const i = match.findIndex((el, i) => i > 0 && el !== undefined);
          // @ts-ignore
          const matchData = this.matchIndexes[i];
          // trim off any earlier non-relevant match groups (ie, the other regex
          // match groups that make up the multi-matcher)
          match.splice(0, i);

          return Object.assign(match, matchData);
        }
      }

      /*
        Created to solve the key deficiently with MultiRegex - there is no way to
        test for multiple matches at a single location.  Why would we need to do
        that?  In the future a more dynamic engine will allow certain matches to be
        ignored.  An example: if we matched say the 3rd regex in a large group but
        decided to ignore it - we'd need to started testing again at the 4th
        regex... but MultiRegex itself gives us no real way to do that.

        So what this class creates MultiRegexs on the fly for whatever search
        position they are needed.

        NOTE: These additional MultiRegex objects are created dynamically.  For most
        grammars most of the time we will never actually need anything more than the
        first MultiRegex - so this shouldn't have too much overhead.

        Say this is our search group, and we match regex3, but wish to ignore it.

          regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

        What we need is a new MultiRegex that only includes the remaining
        possibilities:

          regex4 | regex5                               ' ie, startAt = 3

        This class wraps all that complexity up in a simple API... `startAt` decides
        where in the array of expressions to start doing the matching. It
        auto-increments, so if a match is found at position 2, then startAt will be
        set to 3.  If the end is reached startAt will return to 0.

        MOST of the time the parser will be setting startAt manually to 0.
      */
      class ResumableMultiRegex {
        constructor() {
          // @ts-ignore
          this.rules = [];
          // @ts-ignore
          this.multiRegexes = [];
          this.count = 0;

          this.lastIndex = 0;
          this.regexIndex = 0;
        }

        // @ts-ignore
        getMatcher(index) {
          if (this.multiRegexes[index]) return this.multiRegexes[index];

          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }

        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }

        considerAll() {
          this.regexIndex = 0;
        }

        // @ts-ignore
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin") this.count++;
        }

        /** @param {string} s */
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);

          // The following is because we have no easy way to say "resume scanning at the
          // existing position but also skip the current rule ONLY". What happens is
          // all prior rules are also skipped which can result in matching the wrong
          // thing. Example of matching "booger":

          // our matcher is [string, "booger", number]
          //
          // ....booger....

          // if "booger" is ignored then we'd really need a regex to scan from the
          // SAME position for only: [string, number] but ignoring "booger" (if it
          // was the first match), a simple resume would scan ahead who knows how
          // far looking only for "number", ignoring potential string matches (or
          // future "booger" matches that might be valid.)

          // So what we do: We execute two matchers, one resuming at the same
          // position, but the second full matcher starting at the position after:

          //     /--- resume first regex match here (for [number])
          //     |/---- full match here for [string, "booger", number]
          //     vv
          // ....booger....

          // Which ever results in a match first is then used. So this 3-4 step
          // process essentially allows us to say "match at this position, excluding
          // a prior rule that was ignored".
          //
          // 1. Match "booger" first, ignore. Also proves that [string] does non match.
          // 2. Resume matching for [number]
          // 3. Match at index + 1 for [string, "booger", number]
          // 4. If #2 and #3 result in matches, which came first?
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex) ; else { // use the second matcher result
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }

          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              // wrap-around to considering all matches again
              this.considerAll();
            }
          }

          return result;
        }
      }

      /**
       * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
       * the content and find matches.
       *
       * @param {CompiledMode} mode
       * @returns {ResumableMultiRegex}
       */
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();

        mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, { type: "end" });
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, { type: "illegal" });
        }

        return mm;
      }

      /** skip vs abort vs ignore
       *
       * @skip   - The mode is still entered and exited normally (and contains rules apply),
       *           but all content is held and added to the parent buffer rather than being
       *           output when the mode ends.  Mostly used with `sublanguage` to build up
       *           a single large buffer than can be parsed by sublanguage.
       *
       *             - The mode begin ands ends normally.
       *             - Content matched is added to the parent mode buffer.
       *             - The parser cursor is moved forward normally.
       *
       * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
       *           never matched) but DOES NOT continue to match subsequent `contains`
       *           modes.  Abort is bad/suboptimal because it can result in modes
       *           farther down not getting applied because an earlier rule eats the
       *           content but then aborts.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is added to the mode buffer.
       *             - The parser cursor is moved forward accordingly.
       *
       * @ignore - Ignores the mode (as if it never matched) and continues to match any
       *           subsequent `contains` modes.  Ignore isn't technically possible with
       *           the current parser implementation.
       *
       *             - The mode does not begin.
       *             - Content matched by `begin` is ignored.
       *             - The parser cursor is not moved forward.
       */

      /**
       * Compiles an individual mode
       *
       * This can raise an error if the mode contains certain detectable known logic
       * issues.
       * @param {Mode} mode
       * @param {CompiledMode | null} [parent]
       * @returns {CompiledMode | never}
       */
      function compileMode(mode, parent) {
        const cmode = /** @type CompiledMode */ (mode);
        if (mode.isCompiled) return cmode;

        [
          scopeClassName,
          // do this early so compiler extensions generally don't have to worry about
          // the distinction between match/begin
          compileMatch,
          MultiClass,
          beforeMatchExt
        ].forEach(ext => ext(mode, parent));

        language.compilerExtensions.forEach(ext => ext(mode, parent));

        // __beforeBegin is considered private API, internal use only
        mode.__beforeBegin = null;

        [
          beginKeywords,
          // do this later so compiler extensions that come earlier have access to the
          // raw array if they wanted to perhaps manipulate it, etc.
          compileIllegal,
          // default to 1 relevance if not specified
          compileRelevance
        ].forEach(ext => ext(mode, parent));

        mode.isCompiled = true;

        let keywordPattern = null;
        if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
          // we need a copy because keywords might be compiled multiple times
          // so we can't go deleting $pattern from the original on the first
          // pass
          mode.keywords = Object.assign({}, mode.keywords);
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }
        keywordPattern = keywordPattern || /\w+/;

        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }

        cmode.keywordPatternRe = langRe(keywordPattern, true);

        if (parent) {
          if (!mode.begin) mode.begin = /\B|\b/;
          cmode.beginRe = langRe(mode.begin);
          if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
          if (mode.end) cmode.endRe = langRe(mode.end);
          cmode.terminatorEnd = source$3(mode.end) || '';
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
          }
        }
        if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
        if (!mode.contains) mode.contains = [];

        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === 'self' ? mode : c);
        }));
        mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

        if (mode.starts) {
          compileMode(mode.starts, parent);
        }

        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }

      if (!language.compilerExtensions) language.compilerExtensions = [];

      // self is not valid at the top-level
      if (language.contains && language.contains.includes('self')) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }

      // we need a null object, which inherit will guarantee
      language.classNameAliases = inherit$1(language.classNameAliases || {});

      return compileMode(/** @type Mode */ (language));
    }

    /**
     * Determines if a mode has a dependency on it's parent or not
     *
     * If a mode does have a parent dependency then often we need to clone it if
     * it's used in multiple places so that each copy points to the correct parent,
     * where-as modes without a parent can often safely be re-used at the bottom of
     * a mode chain.
     *
     * @param {Mode | null} mode
     * @returns {boolean} - is there a dependency on the parent?
     * */
    function dependencyOnParent(mode) {
      if (!mode) return false;

      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }

    /**
     * Expands a mode or clones it if necessary
     *
     * This is necessary for modes with parental dependenceis (see notes on
     * `dependencyOnParent`) and for nodes that have `variants` - which must then be
     * exploded into their own individual modes at compile time.
     *
     * @param {Mode} mode
     * @returns {Mode | Mode[]}
     * */
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit$1(mode, { variants: null }, variant);
        });
      }

      // EXPAND
      // if we have variants then essentially "replace" the mode with the variants
      // this happens in compileMode, where this function is called from
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }

      // CLONE
      // if we have dependencies on parents then we need a unique
      // instance of ourselves, so we can be reused with many
      // different parents without issue
      if (dependencyOnParent(mode)) {
        return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
      }

      if (Object.isFrozen(mode)) {
        return inherit$1(mode);
      }

      // no special dependency issues, just return ourselves
      return mode;
    }

    var version = "11.1.0";

    /*
    Syntax highlighting with language autodetection.
    https://highlightjs.org/
    */

    /**
    @typedef {import('highlight.js').Mode} Mode
    @typedef {import('highlight.js').CompiledMode} CompiledMode
    @typedef {import('highlight.js').Language} Language
    @typedef {import('highlight.js').HLJSApi} HLJSApi
    @typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
    @typedef {import('highlight.js').PluginEvent} PluginEvent
    @typedef {import('highlight.js').HLJSOptions} HLJSOptions
    @typedef {import('highlight.js').LanguageFn} LanguageFn
    @typedef {import('highlight.js').HighlightedHTMLElement} HighlightedHTMLElement
    @typedef {import('highlight.js').BeforeHighlightContext} BeforeHighlightContext
    @typedef {import('highlight.js/private').MatchType} MatchType
    @typedef {import('highlight.js/private').KeywordData} KeywordData
    @typedef {import('highlight.js/private').EnhancedMatch} EnhancedMatch
    @typedef {import('highlight.js/private').AnnotatedError} AnnotatedError
    @typedef {import('highlight.js').AutoHighlightResult} AutoHighlightResult
    @typedef {import('highlight.js').HighlightOptions} HighlightOptions
    @typedef {import('highlight.js').HighlightResult} HighlightResult
    */


    const escape = escapeHTML;
    const inherit = inherit$1;
    const NO_MATCH = Symbol("nomatch");
    const MAX_KEYWORD_HITS = 7;

    /**
     * @param {any} hljs - object that is extended (legacy)
     * @returns {HLJSApi}
     */
    const HLJS = function(hljs) {
      // Global internal variables used within the highlight.js library.
      /** @type {Record<string, Language>} */
      const languages = Object.create(null);
      /** @type {Record<string, string>} */
      const aliases = Object.create(null);
      /** @type {HLJSPlugin[]} */
      const plugins = [];

      // safe/production mode - swallows more errors, tries to keep running
      // even if a single syntax or parse hits a fatal error
      let SAFE_MODE = true;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      /** @type {Language} */
      const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

      // Global options used when within external APIs. This is modified when
      // calling the `hljs.configure` function.
      /** @type HLJSOptions */
      let options = {
        ignoreUnescapedHTML: false,
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: 'hljs-',
        cssSelector: 'pre code',
        languages: null,
        // beta configuration options, subject to change, welcome to discuss
        // https://github.com/highlightjs/highlight.js/issues/1086
        __emitter: TokenTreeEmitter
      };

      /* Utility functions */

      /**
       * Tests a language name to see if highlighting should be skipped
       * @param {string} languageName
       */
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }

      /**
       * @param {HighlightedHTMLElement} block - the HTML element to determine language for
       */
      function blockLanguage(block) {
        let classes = block.className + ' ';

        classes += block.parentNode ? block.parentNode.className : '';

        // language-* takes precedence over non-prefixed class names.
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : 'no-highlight';
        }

        return classes
          .split(/\s+/)
          .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }

      /**
       * Core highlighting function.
       *
       * OLD API
       * highlight(lang, code, ignoreIllegals, continuation)
       *
       * NEW API
       * highlight(code, {lang, ignoreIllegals})
       *
       * @param {string} codeOrLanguageName - the language to use for highlighting
       * @param {string | HighlightOptions} optionsOrCode - the code to highlight
       * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       *
       * @returns {HighlightResult} Result - an object that represents the result
       * @property {string} language - the language name
       * @property {number} relevance - the relevance score
       * @property {string} value - the highlighted HTML code
       * @property {string} code - the original raw code
       * @property {CompiledMode} top - top of the current mode stack
       * @property {boolean} illegal - indicates whether any illegal matches were found
      */
      function highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrLanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
        } else {
          // old API
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrLanguageName;
          code = optionsOrCode;
        }

        // https://github.com/highlightjs/highlight.js/issues/3149
        // eslint-disable-next-line no-undefined
        if (ignoreIllegals === undefined) { ignoreIllegals = true; }

        /** @type {BeforeHighlightContext} */
        const context = {
          code,
          language: languageName
        };
        // the plugin can change the desired language or the code to be highlighted
        // just be changing the object it was passed
        fire("before:highlight", context);

        // a before plugin can usurp the result completely by providing it's own
        // in which case we don't even need to call highlight
        const result = context.result
          ? context.result
          : _highlight(context.language, context.code, ignoreIllegals);

        result.code = context.code;
        // the plugin can change anything in result to suite it
        fire("after:highlight", result);

        return result;
      }

      /**
       * private highlight that's used internally and does not fire callbacks
       *
       * @param {string} languageName - the language to use for highlighting
       * @param {string} codeToHighlight - the code to highlight
       * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
       * @param {CompiledMode?} [continuation] - current continuation mode, if any
       * @returns {HighlightResult} - result of the highlight operation
      */
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        const keywordHits = Object.create(null);

        /**
         * Return keyword data if a match is a keyword
         * @param {CompiledMode} mode - current mode
         * @param {string} matchText - the textual match
         * @returns {KeywordData | false}
         */
        function keywordData(mode, matchText) {
          return mode.keywords[matchText];
        }

        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }

          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";

          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
            const data = keywordData(top, word);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";

              keywordHits[word] = (keywordHits[word] || 0) + 1;
              if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                // _ implied for relevance only, do not highlight
                // by applying a class name
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitter.addKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substr(lastIndex);
          emitter.addText(buf);
        }

        function processSubLanguage() {
          if (modeBuffer === "") return;
          /** @type HighlightResult */
          let result = null;

          if (typeof top.subLanguage === 'string') {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = /** @type {CompiledMode} */ (result._top);
          } else {
            result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }

          // Counting embedded language score towards the host language may be disabled
          // with zeroing the containing mode relevance. Use case in point is Markdown that
          // allows XML everywhere and makes every XML snippet to have a much larger Markdown
          // score.
          if (top.relevance > 0) {
            relevance += result.relevance;
          }
          emitter.addSublanguage(result._emitter, result.language);
        }

        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = '';
        }

        /**
         * @param {CompiledMode} mode
         * @param {RegExpMatchArray} match
         */
        function emitMultiClass(scope, match) {
          let i = 1;
          // eslint-disable-next-line no-undefined
          while (match[i] !== undefined) {
            if (!scope._emit[i]) { i++; continue; }
            const klass = language.classNameAliases[scope[i]] || scope[i];
            const text = match[i];
            if (klass) {
              emitter.addKeyword(text, klass);
            } else {
              modeBuffer = text;
              processKeywords();
              modeBuffer = "";
            }
            i++;
          }
        }

        /**
         * @param {CompiledMode} mode - new mode to start
         * @param {RegExpMatchArray} match
         */
        function startNewMode(mode, match) {
          if (mode.scope && typeof mode.scope === "string") {
            emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
          }
          if (mode.beginScope) {
            // beginScope just wraps the begin match itself in a scope
            if (mode.beginScope._wrap) {
              emitter.addKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
              modeBuffer = "";
            } else if (mode.beginScope._multi) {
              // at this point modeBuffer should just be the match
              emitMultiClass(mode.beginScope, match);
              modeBuffer = "";
            }
          }

          top = Object.create(mode, { parent: { value: top } });
          return top;
        }

        /**
         * @param {CompiledMode } mode - the mode to potentially end
         * @param {RegExpMatchArray} match - the latest match
         * @param {string} matchPlusRemainder - match plus remainder of content
         * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
         */
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);

          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored) matched = false;
            }

            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          // even if on:end fires an `ignore` it's still possible
          // that we might trigger the end node because of a parent mode
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }

        /**
         * Handle matching but then ignoring a sequence of text
         *
         * @param {string} lexeme - string containing full match text
         */
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            // no more regexes to potentially match here, so we move the cursor forward one
            // space
            modeBuffer += lexeme[0];
            return 1;
          } else {
            // no need to move the cursor, we still have additional regexes to try and
            // match at this very spot
            resumeScanAtSamePosition = true;
            return 0;
          }
        }

        /**
         * Handle the start of a new potential mode match
         *
         * @param {EnhancedMatch} match - the current match
         * @returns {number} how far to advance the parse cursor
         */
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;

          const resp = new Response(newMode);
          // first internal before callbacks, then the public ones
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb) continue;
            cb(match, resp);
            if (resp.isMatchIgnored) return doIgnore(lexeme);
          }

          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode, match);
          return newMode.returnBegin ? 0 : lexeme.length;
        }

        /**
         * Handle the potential end of mode
         *
         * @param {RegExpMatchArray} match - the current match
         */
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substr(match.index);

          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) { return NO_MATCH; }

          const origin = top;
          if (top.endScope && top.endScope._wrap) {
            processBuffer();
            emitter.addKeyword(lexeme, top.endScope._wrap);
          } else if (top.endScope && top.endScope._multi) {
            processBuffer();
            emitMultiClass(top.endScope, match);
          } else if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.scope && !top.isMultiClass) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            startNewMode(endMode.starts, match);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }

        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.scope) {
              list.unshift(current.scope);
            }
          }
          list.forEach(item => emitter.openNode(item));
        }

        /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
        let lastMatch = {};

        /**
         *  Process an individual match
         *
         * @param {string} textBeforeMatch - text preceding the match (since the last match)
         * @param {EnhancedMatch} [match] - the match itself
         */
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];

          // add non-matched text to the current mode buffer
          modeBuffer += textBeforeMatch;

          if (lexeme == null) {
            processBuffer();
            return 0;
          }

          // we've found a 0 width match and we're stuck, so we need to advance
          // this happens when we have badly behaved rules that have optional matchers to the degree that
          // sometimes they can end up matching nothing at all
          // Ref: https://github.com/highlightjs/highlight.js/issues/2140
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            // spit the "skipped" character that our regex choked on back into the output sequence
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              /** @type {AnnotatedError} */
              const err = new Error(`0 width match regex (${languageName})`);
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;

          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            // illegal match, we do not continue processing
            /** @type {AnnotatedError} */
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || '<unnamed>') + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }

          // edge case for when illegal matches $ (end of line) which is technically
          // a 0 width match but not a begin/end match so it's not caught by the
          // first handler (when ignoreIllegals is true)
          if (match.type === "illegal" && lexeme === "") {
            // advance so we aren't stuck in an infinite loop
            return 1;
          }

          // infinite loops are BAD, this is a last ditch catch all. if we have a
          // decent number of iterations yet our index (cursor position in our
          // parsing) still 3x behind our index then something is very wrong
          // so we bail
          if (iterations > 100000 && iterations > match.index * 3) {
            const err = new Error('potential infinite loop, way more iterations than matches');
            throw err;
          }

          /*
          Why might be find ourselves here?  An potential end match that was
          triggered but could not be completed.  IE, `doEndMatch` returned NO_MATCH.
          (this could be because a callback requests the match be ignored, etc)

          This causes no real harm other than stopping a few times too many.
          */

          modeBuffer += lexeme;
          return lexeme.length;
        }

        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }

        const md = compileLanguage(language);
        let result = '';
        /** @type {CompiledMode} */
        let top = continuation || md;
        /** @type Record<string,CompiledMode> */
        const continuations = {}; // keep continuations for sub-languages
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = '';
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;

        try {
          top.matcher.considerAll();

          for (;;) {
            iterations++;
            if (resumeScanAtSamePosition) {
              // only regexes not matched previously will now be
              // considered for a potential match
              resumeScanAtSamePosition = false;
            } else {
              top.matcher.considerAll();
            }
            top.matcher.lastIndex = index;

            const match = top.matcher.exec(codeToHighlight);
            // console.log("match", match[0], match.rule && match.rule.begin)

            if (!match) break;

            const beforeMatch = codeToHighlight.substring(index, match.index);
            const processedCount = processLexeme(beforeMatch, match);
            index = match.index + processedCount;
          }
          processLexeme(codeToHighlight.substr(index));
          emitter.closeAllNodes();
          emitter.finalize();
          result = emitter.toHTML();

          return {
            language: languageName,
            value: result,
            relevance: relevance,
            illegal: false,
            _emitter: emitter,
            _top: top
          };
        } catch (err) {
          if (err.message && err.message.includes('Illegal')) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: true,
              relevance: 0,
              _illegalBy: {
                message: err.message,
                index: index,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode,
                resultSoFar: result
              },
              _emitter: emitter
            };
          } else if (SAFE_MODE) {
            return {
              language: languageName,
              value: escape(codeToHighlight),
              illegal: false,
              relevance: 0,
              errorRaised: err,
              _emitter: emitter,
              _top: top
            };
          } else {
            throw err;
          }
        }
      }

      /**
       * returns a valid highlight result, without actually doing any actual work,
       * auto highlight starts with this and it's possible for small snippets that
       * auto-detection may not find a better match
       * @param {string} code
       * @returns {HighlightResult}
       */
      function justTextHighlightResult(code) {
        const result = {
          value: escape(code),
          illegal: false,
          relevance: 0,
          _top: PLAINTEXT_LANGUAGE,
          _emitter: new options.__emitter(options)
        };
        result._emitter.addText(code);
        return result;
      }

      /**
      Highlighting with language detection. Accepts a string with the code to
      highlight. Returns an object with the following properties:

      - language (detected language)
      - relevance (int)
      - value (an HTML string with highlighting markup)
      - secondBest (object with the same structure for second-best heuristically
        detected language, may be absent)

        @param {string} code
        @param {Array<string>} [languageSubset]
        @returns {AutoHighlightResult}
      */
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);

        const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
          _highlight(name, code, false)
        );
        results.unshift(plaintext); // plaintext is always an option

        const sorted = results.sort((a, b) => {
          // sort base on relevance
          if (a.relevance !== b.relevance) return b.relevance - a.relevance;

          // always award the tie to the base language
          // ie if C++ and Arduino are tied, it's more likely to be C++
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }

          // otherwise say they are equal, which has the effect of sorting on
          // relevance while preserving the original ordering - which is how ties
          // have historically been settled, ie the language that comes first always
          // wins in the case of a tie
          return 0;
        });

        const [best, secondBest] = sorted;

        /** @type {AutoHighlightResult} */
        const result = best;
        result.secondBest = secondBest;

        return result;
      }

      /**
       * Builds new class name for block given the language name
       *
       * @param {HTMLElement} element
       * @param {string} [currentLang]
       * @param {string} [resultLang]
       */
      function updateClassName(element, currentLang, resultLang) {
        const language = (currentLang && aliases[currentLang]) || resultLang;

        element.classList.add("hljs");
        element.classList.add(`language-${language}`);
      }

      /**
       * Applies highlighting to a DOM node containing code.
       *
       * @param {HighlightedHTMLElement} element - the HTML element to highlight
      */
      function highlightElement(element) {
        /** @type HTMLElement */
        let node = null;
        const language = blockLanguage(element);

        if (shouldNotHighlight(language)) return;

        fire("before:highlightElement",
          { el: element, language: language });

        // we should be all text, no child nodes
        if (!options.ignoreUnescapedHTML && element.children.length > 0) {
          console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
          console.warn("https://github.com/highlightjs/highlight.js/issues/2886");
          console.warn(element);
        }

        node = element;
        const text = node.textContent;
        const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

        element.innerHTML = result.value;
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          // TODO: remove with version 11.0
          re: result.relevance,
          relevance: result.relevance
        };
        if (result.secondBest) {
          element.secondBest = {
            language: result.secondBest.language,
            relevance: result.secondBest.relevance
          };
        }

        fire("after:highlightElement", { el: element, result, text });
      }

      /**
       * Updates highlight.js global options with the passed options
       *
       * @param {Partial<HLJSOptions>} userOptions
       */
      function configure(userOptions) {
        options = inherit(options, userOptions);
      }

      // TODO: remove v12, deprecated
      const initHighlighting = () => {
        highlightAll();
        deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
      };

      // TODO: remove v12, deprecated
      function initHighlightingOnLoad() {
        highlightAll();
        deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
      }

      let wantsHighlight = false;

      /**
       * auto-highlights all pre>code elements on the page
       */
      function highlightAll() {
        // if we are called too early in the loading process
        if (document.readyState === "loading") {
          wantsHighlight = true;
          return;
        }

        const blocks = document.querySelectorAll(options.cssSelector);
        blocks.forEach(highlightElement);
      }

      function boot() {
        // if a highlight was requested before DOM was loaded, do now
        if (wantsHighlight) highlightAll();
      }

      // make sure we are in the browser environment
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('DOMContentLoaded', boot, false);
      }

      /**
       * Register a language grammar module
       *
       * @param {string} languageName
       * @param {LanguageFn} languageDefinition
       */
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          // hard or soft error
          if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
          // languages that have serious errors are replaced with essentially a
          // "plaintext" stand-in so that the code blocks will still get normal
          // css classes applied to them - and one bad language won't break the
          // entire highlighter
          lang = PLAINTEXT_LANGUAGE;
        }
        // give it a temporary name if it doesn't have one in the meta-data
        if (!lang.name) lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs);

        if (lang.aliases) {
          registerAliases(lang.aliases, { languageName });
        }
      }

      /**
       * Remove a language grammar module
       *
       * @param {string} languageName
       */
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }

      /**
       * @returns {string[]} List of language internal names
       */
      function listLanguages() {
        return Object.keys(languages);
      }

      /**
       * @param {string} name - name of the language to retrieve
       * @returns {Language | undefined}
       */
      function getLanguage(name) {
        name = (name || '').toLowerCase();
        return languages[name] || languages[aliases[name]];
      }

      /**
       *
       * @param {string|string[]} aliasList - single alias or list of aliases
       * @param {{languageName: string}} opts
       */
      function registerAliases(aliasList, { languageName }) {
        if (typeof aliasList === 'string') {
          aliasList = [aliasList];
        }
        aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
      }

      /**
       * Determines if a given language has auto-detection enabled
       * @param {string} name - name of the language
       */
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }

      /**
       * Upgrades the old highlightBlock plugins to the new
       * highlightElement API
       * @param {HLJSPlugin} plugin
       */
      function upgradePluginAPI(plugin) {
        // TODO: remove with v12
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](
              Object.assign({ block: data.el }, data)
            );
          };
        }
      }

      /**
       * @param {HLJSPlugin} plugin
       */
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }

      /**
       *
       * @param {PluginEvent} event
       * @param {any} args
       */
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }

      /**
       * DEPRECATED
       * @param {HighlightedHTMLElement} el
       */
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");

        return highlightElement(el);
      }

      /* Interface definition */
      Object.assign(hljs, {
        highlight,
        highlightAuto,
        highlightAll,
        highlightElement,
        // TODO: Remove with v12 API
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        autoDetection,
        inherit,
        addPlugin
      });

      hljs.debugMode = function() { SAFE_MODE = false; };
      hljs.safeMode = function() { SAFE_MODE = true; };
      hljs.versionString = version;

      for (const key in MODES$1) {
        // @ts-ignore
        if (typeof MODES$1[key] === "object") {
          // @ts-ignore
          deepFreeze$1(MODES$1[key]);
        }
      }

      // merge all the modes/regexes into our main object
      Object.assign(hljs, MODES$1);

      return hljs;
    };

    // export an "instance" of the highlighter
    var highlight = HLJS({});

    var core = highlight;

    /**
     * @param {string} value
     * @returns {RegExp}
     * */

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source$2(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function lookahead$2(re) {
      return concat$2('(?=', re, ')');
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function optional(re) {
      return concat$2('(?:', re, ')?');
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat$2(...args) {
      const joined = args.map((x) => source$2(x)).join("");
      return joined;
    }

    function stripOptionsFromArgs(args) {
      const opts = args[args.length - 1];

      if (typeof opts === 'object' && opts.constructor === Object) {
        args.splice(args.length - 1, 1);
        return opts;
      } else {
        return {};
      }
    }

    /**
     * Any of the passed expresssions may match
     *
     * Creates a huge this | this | that | that match
     * @param {(RegExp | string)[] } args
     * @returns {string}
     */
    function either(...args) {
      const opts = stripOptionsFromArgs(args);
      const joined = '(' +
        (opts.capture ? "" : "?:") +
        args.map((x) => source$2(x)).join("|") + ")";
      return joined;
    }

    /*
    Language: HTML, XML
    Website: https://www.w3.org/XML/
    Category: common, web
    Audit: 2020
    */

    /** @type LanguageFn */
    function xml(hljs) {
      // Element names can contain letters, digits, hyphens, underscores, and periods
      const TAG_NAME_RE = concat$2(/[A-Z_]/, optional(/[A-Z0-9_.-]*:/), /[A-Z0-9_.-]*/);
      const XML_IDENT_RE = /[A-Za-z0-9._:-]+/;
      const XML_ENTITIES = {
        className: 'symbol',
        begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
      };
      const XML_META_KEYWORDS = {
        begin: /\s/,
        contains: [
          {
            className: 'keyword',
            begin: /#?[a-z_][a-z1-9_-]+/,
            illegal: /\n/
          }
        ]
      };
      const XML_META_PAR_KEYWORDS = hljs.inherit(XML_META_KEYWORDS, {
        begin: /\(/,
        end: /\)/
      });
      const APOS_META_STRING_MODE = hljs.inherit(hljs.APOS_STRING_MODE, {
        className: 'string'
      });
      const QUOTE_META_STRING_MODE = hljs.inherit(hljs.QUOTE_STRING_MODE, {
        className: 'string'
      });
      const TAG_INTERNALS = {
        endsWithParent: true,
        illegal: /</,
        relevance: 0,
        contains: [
          {
            className: 'attr',
            begin: XML_IDENT_RE,
            relevance: 0
          },
          {
            begin: /=\s*/,
            relevance: 0,
            contains: [
              {
                className: 'string',
                endsParent: true,
                variants: [
                  {
                    begin: /"/,
                    end: /"/,
                    contains: [ XML_ENTITIES ]
                  },
                  {
                    begin: /'/,
                    end: /'/,
                    contains: [ XML_ENTITIES ]
                  },
                  {
                    begin: /[^\s"'=<>`]+/
                  }
                ]
              }
            ]
          }
        ]
      };
      return {
        name: 'HTML, XML',
        aliases: [
          'html',
          'xhtml',
          'rss',
          'atom',
          'xjb',
          'xsd',
          'xsl',
          'plist',
          'wsf',
          'svg'
        ],
        case_insensitive: true,
        contains: [
          {
            className: 'meta',
            begin: /<![a-z]/,
            end: />/,
            relevance: 10,
            contains: [
              XML_META_KEYWORDS,
              QUOTE_META_STRING_MODE,
              APOS_META_STRING_MODE,
              XML_META_PAR_KEYWORDS,
              {
                begin: /\[/,
                end: /\]/,
                contains: [
                  {
                    className: 'meta',
                    begin: /<![a-z]/,
                    end: />/,
                    contains: [
                      XML_META_KEYWORDS,
                      XML_META_PAR_KEYWORDS,
                      QUOTE_META_STRING_MODE,
                      APOS_META_STRING_MODE
                    ]
                  }
                ]
              }
            ]
          },
          hljs.COMMENT(
            /<!--/,
            /-->/,
            {
              relevance: 10
            }
          ),
          {
            begin: /<!\[CDATA\[/,
            end: /\]\]>/,
            relevance: 10
          },
          XML_ENTITIES,
          {
            className: 'meta',
            begin: /<\?xml/,
            end: /\?>/,
            relevance: 10
          },
          {
            className: 'tag',
            /*
            The lookahead pattern (?=...) ensures that 'begin' only matches
            '<style' as a single word, followed by a whitespace or an
            ending bracket.
            */
            begin: /<style(?=\s|>)/,
            end: />/,
            keywords: {
              name: 'style'
            },
            contains: [ TAG_INTERNALS ],
            starts: {
              end: /<\/style>/,
              returnEnd: true,
              subLanguage: [
                'css',
                'xml'
              ]
            }
          },
          {
            className: 'tag',
            // See the comment in the <style tag about the lookahead pattern
            begin: /<script(?=\s|>)/,
            end: />/,
            keywords: {
              name: 'script'
            },
            contains: [ TAG_INTERNALS ],
            starts: {
              end: /<\/script>/,
              returnEnd: true,
              subLanguage: [
                'javascript',
                'handlebars',
                'xml'
              ]
            }
          },
          // we need this for now for jSX
          {
            className: 'tag',
            begin: /<>|<\/>/
          },
          // open tag
          {
            className: 'tag',
            begin: concat$2(
              /</,
              lookahead$2(concat$2(
                TAG_NAME_RE,
                // <tag/>
                // <tag>
                // <tag ...
                either(/\/>/, />/, /\s/)
              ))
            ),
            end: /\/?>/,
            contains: [
              {
                className: 'name',
                begin: TAG_NAME_RE,
                relevance: 0,
                starts: TAG_INTERNALS
              }
            ]
          },
          // close tag
          {
            className: 'tag',
            begin: concat$2(
              /<\//,
              lookahead$2(concat$2(
                TAG_NAME_RE, />/
              ))
            ),
            contains: [
              {
                className: 'name',
                begin: TAG_NAME_RE,
                relevance: 0
              },
              {
                begin: />/,
                relevance: 0,
                endsParent: true
              }
            ]
          }
        ]
      };
    }

    const IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
    const KEYWORDS = [
      "as", // for exports
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      // JS handles these with a special rule
      // "get",
      // "set",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends"
    ];
    const LITERALS = [
      "true",
      "false",
      "null",
      "undefined",
      "NaN",
      "Infinity"
    ];

    const TYPES = [
      "Intl",
      "DataView",
      "Number",
      "Math",
      "Date",
      "String",
      "RegExp",
      "Object",
      "Function",
      "Boolean",
      "Error",
      "Symbol",
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      "Proxy",
      "Reflect",
      "JSON",
      "Promise",
      "Float64Array",
      "Int16Array",
      "Int32Array",
      "Int8Array",
      "Uint16Array",
      "Uint32Array",
      "Float32Array",
      "Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "ArrayBuffer",
      "BigInt64Array",
      "BigUint64Array",
      "BigInt"
    ];

    const ERROR_TYPES = [
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ];

    const BUILT_IN_GLOBALS = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",

      "require",
      "exports",

      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape"
    ];

    const BUILT_IN_VARIABLES = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "module",
      "global" // Node.js
    ];

    const BUILT_INS = [].concat(
      BUILT_IN_GLOBALS,
      TYPES,
      ERROR_TYPES
    );

    /**
     * @param {string} value
     * @returns {RegExp}
     * */

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source$1(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function lookahead$1(re) {
      return concat$1('(?=', re, ')');
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat$1(...args) {
      const joined = args.map((x) => source$1(x)).join("");
      return joined;
    }

    /*
    Language: JavaScript
    Description: JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.
    Category: common, scripting, web
    Website: https://developer.mozilla.org/en-US/docs/Web/JavaScript
    */

    /** @type LanguageFn */
    function javascript(hljs) {
      /**
       * Takes a string like "<Booger" and checks to see
       * if we can find a matching "</Booger" later in the
       * content.
       * @param {RegExpMatchArray} match
       * @param {{after:number}} param1
       */
      const hasClosingTag = (match, { after }) => {
        const tag = "</" + match[0].slice(1);
        const pos = match.input.indexOf(tag, after);
        return pos !== -1;
      };

      const IDENT_RE$1 = IDENT_RE;
      const FRAGMENT = {
        begin: '<>',
        end: '</>'
      };
      const XML_TAG = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        /**
         * @param {RegExpMatchArray} match
         * @param {CallbackResponse} response
         */
        isTrulyOpeningTag: (match, response) => {
          const afterMatchIndex = match[0].length + match.index;
          const nextChar = match.input[afterMatchIndex];
          // nested type?
          // HTML should not include another raw `<` inside a tag
          // But a type might: `<Array<Array<number>>`, etc.
          if (nextChar === "<") {
            response.ignoreMatch();
            return;
          }
          // <something>
          // This is now either a tag or a type.
          if (nextChar === ">") {
            // if we cannot find a matching closing tag, then we
            // will ignore it
            if (!hasClosingTag(match, { after: afterMatchIndex })) {
              response.ignoreMatch();
            }
          }
        }
      };
      const KEYWORDS$1 = {
        $pattern: IDENT_RE,
        keyword: KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_INS,
        "variable.language": BUILT_IN_VARIABLES
      };

      // https://tc39.es/ecma262/#sec-literals-numeric-literals
      const decimalDigits = '[0-9](_?[0-9])*';
      const frac = `\\.(${decimalDigits})`;
      // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
      const NUMBER = {
        className: 'number',
        variants: [
          // DecimalLiteral
          { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
            `[eE][+-]?(${decimalDigits})\\b` },
          { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

          // DecimalBigIntegerLiteral
          { begin: `\\b(0|[1-9](_?[0-9])*)n\\b` },

          // NonDecimalIntegerLiteral
          { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
          { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
          { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },

          // LegacyOctalIntegerLiteral (does not include underscore separators)
          // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
          { begin: "\\b0[0-7]+n?\\b" },
        ],
        relevance: 0
      };

      const SUBST = {
        className: 'subst',
        begin: '\\$\\{',
        end: '\\}',
        keywords: KEYWORDS$1,
        contains: [] // defined later
      };
      const HTML_TEMPLATE = {
        begin: 'html`',
        end: '',
        starts: {
          end: '`',
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: 'xml'
        }
      };
      const CSS_TEMPLATE = {
        begin: 'css`',
        end: '',
        starts: {
          end: '`',
          returnEnd: false,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: 'css'
        }
      };
      const TEMPLATE_STRING = {
        className: 'string',
        begin: '`',
        end: '`',
        contains: [
          hljs.BACKSLASH_ESCAPE,
          SUBST
        ]
      };
      const JSDOC_COMMENT = hljs.COMMENT(
        /\/\*\*(?!\/)/,
        '\\*/',
        {
          relevance: 0,
          contains: [
            {
              begin: '(?=@[A-Za-z]+)',
              relevance: 0,
              contains: [
                {
                  className: 'doctag',
                  begin: '@[A-Za-z]+'
                },
                {
                  className: 'type',
                  begin: '\\{',
                  end: '\\}',
                  excludeEnd: true,
                  excludeBegin: true,
                  relevance: 0
                },
                {
                  className: 'variable',
                  begin: IDENT_RE$1 + '(?=\\s*(-)|$)',
                  endsParent: true,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      );
      const COMMENT = {
        className: "comment",
        variants: [
          JSDOC_COMMENT,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.C_LINE_COMMENT_MODE
        ]
      };
      const SUBST_INTERNALS = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        TEMPLATE_STRING,
        NUMBER,
        hljs.REGEXP_MODE
      ];
      SUBST.contains = SUBST_INTERNALS
        .concat({
          // we need to pair up {} inside our subst to prevent
          // it from ending too early by matching another }
          begin: /\{/,
          end: /\}/,
          keywords: KEYWORDS$1,
          contains: [
            "self"
          ].concat(SUBST_INTERNALS)
        });
      const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
      const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
        // eat recursive parens in sub expressions
        {
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS$1,
          contains: ["self"].concat(SUBST_AND_COMMENTS)
        }
      ]);
      const PARAMS = {
        className: 'params',
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS$1,
        contains: PARAMS_CONTAINS
      };

      // ES6 classes
      const CLASS_OR_EXTENDS = {
        variants: [
          {
            match: [
              /class/,
              /\s+/,
              IDENT_RE$1
            ],
            scope: {
              1: "keyword",
              3: "title.class"
            }
          },
          {
            match: [
              /extends/,
              /\s+/,
              concat$1(IDENT_RE$1, "(", concat$1(/\./, IDENT_RE$1), ")*")
            ],
            scope: {
              1: "keyword",
              3: "title.class.inherited"
            }
          }
        ]
      };

      const CLASS_REFERENCE = {
        relevance: 0,
        match: /\b[A-Z][a-z]+([A-Z][a-z]+)*/,
        className: "title.class",
        keywords: {
          _: [
            // se we still get relevance credit for JS library classes
            ...TYPES,
            ...ERROR_TYPES
          ]
        }
      };

      const USE_STRICT = {
        label: "use_strict",
        className: 'meta',
        relevance: 10,
        begin: /^\s*['"]use (strict|asm)['"]/
      };

      const FUNCTION_DEFINITION = {
        variants: [
          {
            match: [
              /function/,
              /\s+/,
              IDENT_RE$1,
              /(?=\s*\()/
            ]
          },
          // anonymous function
          {
            match: [
              /function/,
              /\s*(?=\()/
            ]
          }
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        label: "func.def",
        contains: [ PARAMS ],
        illegal: /%/
      };

      const UPPER_CASE_CONSTANT = {
        relevance: 0,
        match: /\b[A-Z][A-Z_0-9]+\b/,
        className: "variable.constant"
      };

      function noneOf(list) {
        return concat$1("(?!", list.join("|"), ")");
      }

      const FUNCTION_CALL = {
        match: concat$1(
          /\b/,
          noneOf([
            ...BUILT_IN_GLOBALS,
            "super"
          ]),
          IDENT_RE$1, lookahead$1(/\(/)),
        className: "title.function",
        relevance: 0
      };

      const PROPERTY_ACCESS = {
        begin: concat$1(/\./, lookahead$1(
          concat$1(IDENT_RE$1, /(?![0-9A-Za-z$_(])/)
        )),
        end: IDENT_RE$1,
        excludeBegin: true,
        keywords: "prototype",
        className: "property",
        relevance: 0
      };

      const GETTER_OR_SETTER = {
        match: [
          /get|set/,
          /\s+/,
          IDENT_RE$1,
          /(?=\()/
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        contains: [
          { // eat to avoid empty params
            begin: /\(\)/
          },
          PARAMS
        ]
      };

      const FUNC_LEAD_IN_RE = '(\\(' +
        '[^()]*(\\(' +
        '[^()]*(\\(' +
        '[^()]*' +
        '\\)[^()]*)*' +
        '\\)[^()]*)*' +
        '\\)|' + hljs.UNDERSCORE_IDENT_RE + ')\\s*=>';

      const FUNCTION_VARIABLE = {
        match: [
          /const|var|let/, /\s+/,
          IDENT_RE$1, /\s*/,
          /=\s*/,
          lookahead$1(FUNC_LEAD_IN_RE)
        ],
        className: {
          1: "keyword",
          3: "title.function"
        },
        contains: [
          PARAMS
        ]
      };

      return {
        name: 'Javascript',
        aliases: ['js', 'jsx', 'mjs', 'cjs'],
        keywords: KEYWORDS$1,
        // this will be extended by TypeScript
        exports: { PARAMS_CONTAINS },
        illegal: /#(?![$_A-z])/,
        contains: [
          hljs.SHEBANG({
            label: "shebang",
            binary: "node",
            relevance: 5
          }),
          USE_STRICT,
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          HTML_TEMPLATE,
          CSS_TEMPLATE,
          TEMPLATE_STRING,
          COMMENT,
          NUMBER,
          CLASS_REFERENCE,
          {
            className: 'attr',
            begin: IDENT_RE$1 + lookahead$1(':'),
            relevance: 0
          },
          FUNCTION_VARIABLE,
          { // "value" container
            begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
            keywords: 'return throw case',
            relevance: 0,
            contains: [
              COMMENT,
              hljs.REGEXP_MODE,
              {
                className: 'function',
                // we have to count the parens to make sure we actually have the
                // correct bounding ( ) before the =>.  There could be any number of
                // sub-expressions inside also surrounded by parens.
                begin: FUNC_LEAD_IN_RE,
                returnBegin: true,
                end: '\\s*=>',
                contains: [
                  {
                    className: 'params',
                    variants: [
                      {
                        begin: hljs.UNDERSCORE_IDENT_RE,
                        relevance: 0
                      },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: true
                      },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        keywords: KEYWORDS$1,
                        contains: PARAMS_CONTAINS
                      }
                    ]
                  }
                ]
              },
              { // could be a comma delimited list of params to a function call
                begin: /,/,
                relevance: 0
              },
              {
                match: /\s+/,
                relevance: 0
              },
              { // JSX
                variants: [
                  { begin: FRAGMENT.begin, end: FRAGMENT.end },
                  {
                    begin: XML_TAG.begin,
                    // we carefully check the opening tag to see if it truly
                    // is a tag and not a false positive
                    'on:begin': XML_TAG.isTrulyOpeningTag,
                    end: XML_TAG.end
                  }
                ],
                subLanguage: 'xml',
                contains: [
                  {
                    begin: XML_TAG.begin,
                    end: XML_TAG.end,
                    skip: true,
                    contains: ['self']
                  }
                ]
              }
            ],
          },
          FUNCTION_DEFINITION,
          {
            // prevent this from getting swallowed up by function
            // since they appear "function like"
            beginKeywords: "while if switch catch for"
          },
          {
            // we have to count the parens to make sure we actually have the correct
            // bounding ( ).  There could be any number of sub-expressions inside
            // also surrounded by parens.
            begin: '\\b(?!function)' + hljs.UNDERSCORE_IDENT_RE +
              '\\(' + // first parens
              '[^()]*(\\(' +
                '[^()]*(\\(' +
                  '[^()]*' +
                '\\)[^()]*)*' +
              '\\)[^()]*)*' +
              '\\)\\s*\\{', // end parens
            returnBegin:true,
            label: "func.def",
            contains: [
              PARAMS,
              hljs.inherit(hljs.TITLE_MODE, { begin: IDENT_RE$1, className: "title.function" })
            ]
          },
          // catch ... so it won't trigger the property rule below
          {
            match: /\.\.\./,
            relevance: 0
          },
          PROPERTY_ACCESS,
          // hack: prevents detection of keywords in some circumstances
          // .keyword()
          // $keyword = x
          {
            match: '\\$' + IDENT_RE$1,
            relevance: 0
          },
          {
            match: [ /\bconstructor(?=\s*\()/ ],
            className: { 1: "title.function" },
            contains: [ PARAMS ]
          },
          FUNCTION_CALL,
          UPPER_CASE_CONSTANT,
          CLASS_OR_EXTENDS,
          GETTER_OR_SETTER,
          {
            match: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
          }
        ]
      };
    }

    const MODES = (hljs) => {
      return {
        IMPORTANT: {
          scope: 'meta',
          begin: '!important'
        },
        HEXCOLOR: {
          scope: 'number',
          begin: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})'
        },
        ATTRIBUTE_SELECTOR_MODE: {
          scope: 'selector-attr',
          begin: /\[/,
          end: /\]/,
          illegal: '$',
          contains: [
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE
          ]
        },
        CSS_NUMBER_MODE: {
          scope: 'number',
          begin: hljs.NUMBER_RE + '(' +
            '%|em|ex|ch|rem' +
            '|vw|vh|vmin|vmax' +
            '|cm|mm|in|pt|pc|px' +
            '|deg|grad|rad|turn' +
            '|s|ms' +
            '|Hz|kHz' +
            '|dpi|dpcm|dppx' +
            ')?',
          relevance: 0
        },
        CSS_VARIABLE: {
          className: "attr",
          begin: /--[A-Za-z][A-Za-z0-9_-]*/
        }
      };
    };

    const TAGS = [
      'a',
      'abbr',
      'address',
      'article',
      'aside',
      'audio',
      'b',
      'blockquote',
      'body',
      'button',
      'canvas',
      'caption',
      'cite',
      'code',
      'dd',
      'del',
      'details',
      'dfn',
      'div',
      'dl',
      'dt',
      'em',
      'fieldset',
      'figcaption',
      'figure',
      'footer',
      'form',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'header',
      'hgroup',
      'html',
      'i',
      'iframe',
      'img',
      'input',
      'ins',
      'kbd',
      'label',
      'legend',
      'li',
      'main',
      'mark',
      'menu',
      'nav',
      'object',
      'ol',
      'p',
      'q',
      'quote',
      'samp',
      'section',
      'span',
      'strong',
      'summary',
      'sup',
      'table',
      'tbody',
      'td',
      'textarea',
      'tfoot',
      'th',
      'thead',
      'time',
      'tr',
      'ul',
      'var',
      'video'
    ];

    const MEDIA_FEATURES = [
      'any-hover',
      'any-pointer',
      'aspect-ratio',
      'color',
      'color-gamut',
      'color-index',
      'device-aspect-ratio',
      'device-height',
      'device-width',
      'display-mode',
      'forced-colors',
      'grid',
      'height',
      'hover',
      'inverted-colors',
      'monochrome',
      'orientation',
      'overflow-block',
      'overflow-inline',
      'pointer',
      'prefers-color-scheme',
      'prefers-contrast',
      'prefers-reduced-motion',
      'prefers-reduced-transparency',
      'resolution',
      'scan',
      'scripting',
      'update',
      'width',
      // TODO: find a better solution?
      'min-width',
      'max-width',
      'min-height',
      'max-height'
    ];

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
    const PSEUDO_CLASSES = [
      'active',
      'any-link',
      'blank',
      'checked',
      'current',
      'default',
      'defined',
      'dir', // dir()
      'disabled',
      'drop',
      'empty',
      'enabled',
      'first',
      'first-child',
      'first-of-type',
      'fullscreen',
      'future',
      'focus',
      'focus-visible',
      'focus-within',
      'has', // has()
      'host', // host or host()
      'host-context', // host-context()
      'hover',
      'indeterminate',
      'in-range',
      'invalid',
      'is', // is()
      'lang', // lang()
      'last-child',
      'last-of-type',
      'left',
      'link',
      'local-link',
      'not', // not()
      'nth-child', // nth-child()
      'nth-col', // nth-col()
      'nth-last-child', // nth-last-child()
      'nth-last-col', // nth-last-col()
      'nth-last-of-type', //nth-last-of-type()
      'nth-of-type', //nth-of-type()
      'only-child',
      'only-of-type',
      'optional',
      'out-of-range',
      'past',
      'placeholder-shown',
      'read-only',
      'read-write',
      'required',
      'right',
      'root',
      'scope',
      'target',
      'target-within',
      'user-invalid',
      'valid',
      'visited',
      'where' // where()
    ];

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
    const PSEUDO_ELEMENTS = [
      'after',
      'backdrop',
      'before',
      'cue',
      'cue-region',
      'first-letter',
      'first-line',
      'grammar-error',
      'marker',
      'part',
      'placeholder',
      'selection',
      'slotted',
      'spelling-error'
    ];

    const ATTRIBUTES = [
      'align-content',
      'align-items',
      'align-self',
      'animation',
      'animation-delay',
      'animation-direction',
      'animation-duration',
      'animation-fill-mode',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
      'auto',
      'backface-visibility',
      'background',
      'background-attachment',
      'background-clip',
      'background-color',
      'background-image',
      'background-origin',
      'background-position',
      'background-repeat',
      'background-size',
      'border',
      'border-bottom',
      'border-bottom-color',
      'border-bottom-left-radius',
      'border-bottom-right-radius',
      'border-bottom-style',
      'border-bottom-width',
      'border-collapse',
      'border-color',
      'border-image',
      'border-image-outset',
      'border-image-repeat',
      'border-image-slice',
      'border-image-source',
      'border-image-width',
      'border-left',
      'border-left-color',
      'border-left-style',
      'border-left-width',
      'border-radius',
      'border-right',
      'border-right-color',
      'border-right-style',
      'border-right-width',
      'border-spacing',
      'border-style',
      'border-top',
      'border-top-color',
      'border-top-left-radius',
      'border-top-right-radius',
      'border-top-style',
      'border-top-width',
      'border-width',
      'bottom',
      'box-decoration-break',
      'box-shadow',
      'box-sizing',
      'break-after',
      'break-before',
      'break-inside',
      'caption-side',
      'clear',
      'clip',
      'clip-path',
      'color',
      'column-count',
      'column-fill',
      'column-gap',
      'column-rule',
      'column-rule-color',
      'column-rule-style',
      'column-rule-width',
      'column-span',
      'column-width',
      'columns',
      'content',
      'counter-increment',
      'counter-reset',
      'cursor',
      'direction',
      'display',
      'empty-cells',
      'filter',
      'flex',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-wrap',
      'float',
      'font',
      'font-display',
      'font-family',
      'font-feature-settings',
      'font-kerning',
      'font-language-override',
      'font-size',
      'font-size-adjust',
      'font-smoothing',
      'font-stretch',
      'font-style',
      'font-variant',
      'font-variant-ligatures',
      'font-variation-settings',
      'font-weight',
      'height',
      'hyphens',
      'icon',
      'image-orientation',
      'image-rendering',
      'image-resolution',
      'ime-mode',
      'inherit',
      'initial',
      'justify-content',
      'left',
      'letter-spacing',
      'line-height',
      'list-style',
      'list-style-image',
      'list-style-position',
      'list-style-type',
      'margin',
      'margin-bottom',
      'margin-left',
      'margin-right',
      'margin-top',
      'marks',
      'mask',
      'max-height',
      'max-width',
      'min-height',
      'min-width',
      'nav-down',
      'nav-index',
      'nav-left',
      'nav-right',
      'nav-up',
      'none',
      'normal',
      'object-fit',
      'object-position',
      'opacity',
      'order',
      'orphans',
      'outline',
      'outline-color',
      'outline-offset',
      'outline-style',
      'outline-width',
      'overflow',
      'overflow-wrap',
      'overflow-x',
      'overflow-y',
      'padding',
      'padding-bottom',
      'padding-left',
      'padding-right',
      'padding-top',
      'page-break-after',
      'page-break-before',
      'page-break-inside',
      'perspective',
      'perspective-origin',
      'pointer-events',
      'position',
      'quotes',
      'resize',
      'right',
      'src', // @font-face
      'tab-size',
      'table-layout',
      'text-align',
      'text-align-last',
      'text-decoration',
      'text-decoration-color',
      'text-decoration-line',
      'text-decoration-style',
      'text-indent',
      'text-overflow',
      'text-rendering',
      'text-shadow',
      'text-transform',
      'text-underline-position',
      'top',
      'transform',
      'transform-origin',
      'transform-style',
      'transition',
      'transition-delay',
      'transition-duration',
      'transition-property',
      'transition-timing-function',
      'unicode-bidi',
      'vertical-align',
      'visibility',
      'white-space',
      'widows',
      'width',
      'word-break',
      'word-spacing',
      'word-wrap',
      'z-index'
      // reverse makes sure longer attributes `font-weight` are matched fully
      // instead of getting false positives on say `font`
    ].reverse();

    /**
     * @param {string} value
     * @returns {RegExp}
     * */

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function source(re) {
      if (!re) return null;
      if (typeof re === "string") return re;

      return re.source;
    }

    /**
     * @param {RegExp | string } re
     * @returns {string}
     */
    function lookahead(re) {
      return concat('(?=', re, ')');
    }

    /**
     * @param {...(RegExp | string) } args
     * @returns {string}
     */
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }

    /*
    Language: CSS
    Category: common, css, web
    Website: https://developer.mozilla.org/en-US/docs/Web/CSS
    */

    /** @type LanguageFn */
    function css(hljs) {
      const modes = MODES(hljs);
      const FUNCTION_DISPATCH = {
        className: "built_in",
        begin: /[\w-]+(?=\()/
      };
      const VENDOR_PREFIX = {
        begin: /-(webkit|moz|ms|o)-(?=[a-z])/
      };
      const AT_MODIFIERS = "and or not only";
      const AT_PROPERTY_RE = /@-?\w[\w]*(-\w+)*/; // @-webkit-keyframes
      const IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
      const STRINGS = [
        hljs.APOS_STRING_MODE,
        hljs.QUOTE_STRING_MODE
      ];

      return {
        name: 'CSS',
        case_insensitive: true,
        illegal: /[=|'\$]/,
        keywords: {
          keyframePosition: "from to"
        },
        classNameAliases: {
          // for visual continuity with `tag {}` and because we
          // don't have a great class for this?
          keyframePosition: "selector-tag"
        },
        contains: [
          hljs.C_BLOCK_COMMENT_MODE,
          VENDOR_PREFIX,
          // to recognize keyframe 40% etc which are outside the scope of our
          // attribute value mode
          modes.CSS_NUMBER_MODE,
          {
            className: 'selector-id',
            begin: /#[A-Za-z0-9_-]+/,
            relevance: 0
          },
          {
            className: 'selector-class',
            begin: '\\.' + IDENT_RE,
            relevance: 0
          },
          modes.ATTRIBUTE_SELECTOR_MODE,
          {
            className: 'selector-pseudo',
            variants: [
              {
                begin: ':(' + PSEUDO_CLASSES.join('|') + ')'
              },
              {
                begin: '::(' + PSEUDO_ELEMENTS.join('|') + ')'
              }
            ]
          },
          // we may actually need this (12/2020)
          // { // pseudo-selector params
          //   begin: /\(/,
          //   end: /\)/,
          //   contains: [ hljs.CSS_NUMBER_MODE ]
          // },
          modes.CSS_VARIABLE,
          {
            className: 'attribute',
            begin: '\\b(' + ATTRIBUTES.join('|') + ')\\b'
          },
          // attribute values
          {
            begin: ':',
            end: '[;}]',
            contains: [
              modes.HEXCOLOR,
              modes.IMPORTANT,
              modes.CSS_NUMBER_MODE,
              ...STRINGS,
              // needed to highlight these as strings and to avoid issues with
              // illegal characters that might be inside urls that would tigger the
              // languages illegal stack
              {
                begin: /(url|data-uri)\(/,
                end: /\)/,
                relevance: 0, // from keywords
                keywords: {
                  built_in: "url data-uri"
                },
                contains: [
                  {
                    className: "string",
                    // any character other than `)` as in `url()` will be the start
                    // of a string, which ends with `)` (from the parent mode)
                    begin: /[^)]/,
                    endsWithParent: true,
                    excludeEnd: true
                  }
                ]
              },
              FUNCTION_DISPATCH
            ]
          },
          {
            begin: lookahead(/@/),
            end: '[{;]',
            relevance: 0,
            illegal: /:/, // break on Less variables @var: ...
            contains: [
              {
                className: 'keyword',
                begin: AT_PROPERTY_RE
              },
              {
                begin: /\s/,
                endsWithParent: true,
                excludeEnd: true,
                relevance: 0,
                keywords: {
                  $pattern: /[a-z-]+/,
                  keyword: AT_MODIFIERS,
                  attribute: MEDIA_FEATURES.join(" ")
                },
                contains: [
                  {
                    begin: /[a-z-]+(?=:)/,
                    className: "attribute"
                  },
                  ...STRINGS,
                  modes.CSS_NUMBER_MODE
                ]
              }
            ]
          },
          {
            className: 'selector-tag',
            begin: '\\b(' + TAGS.join('|') + ')\\b'
          }
        ]
      };
    }

    /* node_modules/svelte-highlight/src/HighlightSvelte.svelte generated by Svelte v3.40.2 */
    const file$3 = "node_modules/svelte-highlight/src/HighlightSvelte.svelte";
    const get_default_slot_changes = dirty => ({ highlighted: dirty & /*highlighted*/ 1 });
    const get_default_slot_context = ctx => ({ highlighted: /*highlighted*/ ctx[0] });

    // (32:34)    
    function fallback_block(ctx) {
    	let pre;
    	let code_1;
    	let pre_levels = [/*$$restProps*/ ctx[1]];
    	let pre_data = {};

    	for (let i = 0; i < pre_levels.length; i += 1) {
    		pre_data = assign(pre_data, pre_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			code_1 = element("code");
    			add_location(code_1, file$3, 35, 4, 897);
    			set_attributes(pre, pre_data);
    			toggle_class(pre, "hljs", true);
    			add_location(pre, file$3, 32, 2, 842);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, code_1);
    			code_1.innerHTML = /*highlighted*/ ctx[0];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*highlighted*/ 1) code_1.innerHTML = /*highlighted*/ ctx[0];			set_attributes(pre, pre_data = get_spread_update(pre_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
    			toggle_class(pre, "hljs", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(32:34)    ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, highlighted*/ 9)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], !current ? -1 : dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*$$restProps, highlighted*/ 3)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let highlighted;
    	const omit_props_names = ["code"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HighlightSvelte', slots, ['default']);
    	let { code = undefined } = $$props;
    	const dispatch = createEventDispatcher();
    	core.registerLanguage("xml", xml);
    	core.registerLanguage("javascript", javascript);
    	core.registerLanguage("css", css);

    	afterUpdate(() => {
    		if (highlighted) dispatch("highlight", { highlighted });
    	});

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('code' in $$new_props) $$invalidate(2, code = $$new_props.code);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		code,
    		hljs: core,
    		xml,
    		javascript,
    		css,
    		createEventDispatcher,
    		afterUpdate,
    		dispatch,
    		highlighted
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('code' in $$props) $$invalidate(2, code = $$new_props.code);
    		if ('highlighted' in $$props) $$invalidate(0, highlighted = $$new_props.highlighted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*code*/ 4) {
    			$$invalidate(0, highlighted = core.highlightAuto(code).value);
    		}
    	};

    	return [highlighted, $$restProps, code, $$scope, slots];
    }

    class HighlightSvelte extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { code: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HighlightSvelte",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get code() {
    		throw new Error("<HighlightSvelte>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<HighlightSvelte>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const github = `<style>/*!
  Theme: GitHub
  Description: Light theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-light
  Current colors taken from GitHub's CSS
*/

.hljs {
  color: #24292e;
  background: #ffffff;
}

.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #d73a49;
}

.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #6f42c1;
}

.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #005cc5;
}

.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #032f62;
}

.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #e36209;
}

.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #6a737d;
}

.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #22863a;
}

.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #24292e;
}

.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #005cc5;
  font-weight: bold;
}

.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #735c0f;
}

.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #24292e;
  font-style: italic;
}

.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #24292e;
  font-weight: bold;
}

.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #22863a;
  background-color: #f0fff4;
}

.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #b31d28;
  background-color: #ffeef0;
}

.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
}
</style>`;

    /* src/Example.svelte generated by Svelte v3.40.2 */
    const file$2 = "src/Example.svelte";

    function create_fragment$2(ctx) {
    	let html_tag;
    	let html_anchor;
    	let t0;
    	let div;
    	let highlightsvelte;
    	let t1;
    	let current;

    	highlightsvelte = new HighlightSvelte({
    			props: { code: /*code*/ ctx[0] },
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			t0 = space();
    			div = element("div");
    			create_component(highlightsvelte.$$.fragment);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			html_tag.a = html_anchor;
    			attr_dev(div, "class", "code svelte-1yrjn1q");
    			add_location(div, file$2, 10, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(github, document.head);
    			append_dev(document.head, html_anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(highlightsvelte, div, null);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const highlightsvelte_changes = {};
    			if (dirty & /*code*/ 1) highlightsvelte_changes.code = /*code*/ ctx[0];
    			highlightsvelte.$set(highlightsvelte_changes);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[1], !current ? -1 : dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(highlightsvelte.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(highlightsvelte.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(highlightsvelte);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Example', slots, ['default']);
    	let { code } = $$props;
    	const writable_props = ['code'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Example> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('code' in $$props) $$invalidate(0, code = $$props.code);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ HighlightSvelte, github, code });

    	$$self.$inject_state = $$props => {
    		if ('code' in $$props) $$invalidate(0, code = $$props.code);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [code, $$scope, slots];
    }

    class Example extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { code: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Example",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*code*/ ctx[0] === undefined && !('code' in props)) {
    			console.warn("<Example> was created without expected prop 'code'");
    		}
    	}

    	get code() {
    		throw new Error("<Example>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<Example>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/examples/Templates.svelte generated by Svelte v3.40.2 */

    const file$1 = "src/examples/Templates.svelte";

    // (19:2) {:else}
    function create_else_block(ctx) {
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Done!\n    ");
    			button = element("button");
    			button.textContent = "reset";
    			add_location(button, file$1, 20, 4, 345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*reset*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(19:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:22) 
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Keep clicking...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(17:22) ",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if value == 0}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Start clicking!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(15:2) {#if value == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let progress;
    	let t0;
    	let t1;
    	let div;
    	let button;
    	let t2;
    	let button_disabled_value;
    	let t3;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*value*/ ctx[0] == 0) return create_if_block;
    		if (/*value*/ ctx[0] < 5) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			progress = element("progress");
    			t0 = text(/*value*/ ctx[0]);
    			t1 = space();
    			div = element("div");
    			button = element("button");
    			t2 = text("Work");
    			t3 = space();
    			if_block.c();
    			progress.value = /*value*/ ctx[0];
    			attr_dev(progress, "max", "5");
    			add_location(progress, file$1, 11, 0, 120);
    			button.disabled = button_disabled_value = /*value*/ ctx[0] >= 5;
    			add_location(button, file$1, 13, 2, 173);
    			add_location(div, file$1, 12, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, progress, anchor);
    			append_dev(progress, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t2);
    			append_dev(div, t3);
    			if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*increment*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) set_data_dev(t0, /*value*/ ctx[0]);

    			if (dirty & /*value*/ 1) {
    				prop_dev(progress, "value", /*value*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 1 && button_disabled_value !== (button_disabled_value = /*value*/ ctx[0] >= 5)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(progress);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Templates', slots, []);
    	let value = 0;

    	function increment() {
    		$$invalidate(0, value++, value);
    	}

    	function reset() {
    		$$invalidate(0, value = 0);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Templates> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ value, increment, reset });

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, increment, reset];
    }

    class Templates extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Templates",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.40.2 */
    const file = "src/App.svelte";

    // (58:8) <Col>
    function create_default_slot_100(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "SVELTE";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Cybernetically enhanced web apps";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Leon Kowarschick (Mtrk. Nachname), Nils Mangold (202477), Philipp\n              Walter (203149)";
    			t5 = space();
    			div0 = element("div");
    			attr_dev(h1, "class", "title svelte-7awd56");
    			add_location(h1, file, 59, 12, 1793);
    			attr_dev(p0, "class", "subheader svelte-7awd56");
    			add_location(p0, file, 60, 12, 1835);
    			add_location(p1, file, 61, 12, 1905);
    			attr_dev(div0, "id", "parallelogram");
    			attr_dev(div0, "class", "svelte-7awd56");
    			add_location(div0, file, 66, 12, 2049);
    			attr_dev(div1, "class", "header-container svelte-7awd56");
    			add_location(div1, file, 58, 10, 1750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, p0);
    			append_dev(div1, t3);
    			append_dev(div1, p1);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_100.name,
    		type: "slot",
    		source: "(58:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (57:6) <Row>
    function create_default_slot_99(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_100] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_99.name,
    		type: "slot",
    		source: "(57:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (56:4) <Container class="text-center">
    function create_default_slot_98(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_99] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_98.name,
    		type: "slot",
    		source: "(56:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (55:2) <FullpageSection center>
    function create_default_slot_97(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_98] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_97.name,
    		type: "slot",
    		source: "(55:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (82:14) 
    function create_long_slot_18(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "Svelte ist ein Komponenten-Framework - wie React oder Vue - aber mit einem wichtigen Unterschied. Traditionelle Frameworks erlauben es Ihnen, deklarativen zustandsgesteuerten Code zu schreiben, aber es gibt einen Nachteil: Der Browser muss zusätzliche Arbeit leisten, um diese deklarativen Strukturen in DOM-Operationen umzuwandeln, wobei Techniken wie diese Ihr Frame-Budget auffressen und den Garbage Collector belasten.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Stattdessen läuft Svelte zur Build-Zeit und konvertiert Ihre Komponenten in hocheffizienten imperativen Code, der das DOM chirurgisch aktualisiert. Das Ergebnis ist, dass Sie in der Lage sind, anspruchsvolle Anwendungen mit hervorragenden Leistungsmerkmalen zu schreiben.";
    			add_location(p0, file, 82, 16, 2462);
    			add_location(p1, file, 85, 16, 2959);
    			attr_dev(div, "slot", "long");
    			add_location(div, file, 81, 14, 2428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_18.name,
    		type: "slot",
    		source: "(82:14) ",
    		ctx
    	});

    	return block;
    }

    // (90:14) 
    function create_short_slot_5(ctx) {
    	let div;
    	let p;
    	let t0;
    	let br0;
    	let t1;
    	let br1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text("Komponenten-Framework \n                  ");
    			br0 = element("br");
    			t1 = text(" Es ist ein Compiler, der Ihre deklarativen Komponenten in effizientes JavaScript umwandelt, das das DOM aktualisiert.\n                  ");
    			br1 = element("br");
    			t2 = text(" Reaktives UI-Konzept");
    			add_location(br0, file, 92, 18, 3407);
    			add_location(br1, file, 93, 18, 3549);
    			add_location(p, file, 90, 16, 3344);
    			attr_dev(div, "slot", "short");
    			add_location(div, file, 89, 14, 3309);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(p, br0);
    			append_dev(p, t1);
    			append_dev(p, br1);
    			append_dev(p, t2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_short_slot_5.name,
    		type: "slot",
    		source: "(90:14) ",
    		ctx
    	});

    	return block;
    }

    // (76:8) <Col>
    function create_default_slot_96(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let t3;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: {
    					short: [create_short_slot_5],
    					long: [create_long_slot_18]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Was ist ");
    			span = element("span");
    			span.textContent = "Svelte";
    			t2 = text(" ?");
    			t3 = space();
    			create_component(content.$$.fragment);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 78, 22, 2324);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 77, 12, 2297);
    			attr_dev(div, "class", "block-middle svelte-7awd56");
    			add_location(div, file, 76, 10, 2258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			append_dev(h1, t2);
    			append_dev(div, t3);
    			mount_component(content, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_96.name,
    		type: "slot",
    		source: "(76:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (75:6) <Row>
    function create_default_slot_95(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_96] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_95.name,
    		type: "slot",
    		source: "(75:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (74:4) <Container class="text-center">
    function create_default_slot_94(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_95] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_94.name,
    		type: "slot",
    		source: "(74:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (73:2) <FullpageSection center>
    function create_default_slot_93(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_94] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_93.name,
    		type: "slot",
    		source: "(73:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (106:8) <Col>
    function create_default_slot_92(ctx) {
    	let h1;
    	let t1;
    	let div;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "VORTEILE";
    			t1 = space();
    			div = element("div");
    			attr_dev(h1, "class", "title-section svelte-7awd56");
    			add_location(h1, file, 106, 10, 3823);
    			attr_dev(div, "id", "parallelogram");
    			attr_dev(div, "class", "svelte-7awd56");
    			add_location(div, file, 107, 10, 3873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_92.name,
    		type: "slot",
    		source: "(106:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (105:6) <Row>
    function create_default_slot_91(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_92] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_91.name,
    		type: "slot",
    		source: "(105:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (104:4) <Container class="text-center">
    function create_default_slot_90(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_91] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_90.name,
    		type: "slot",
    		source: "(104:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (103:2) <FullpageSection center>
    function create_default_slot_89(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_90] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_89.name,
    		type: "slot",
    		source: "(103:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (123:14) 
    function create_long_slot_17(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Ein Compiler zu sein und das VirtualDOM loszuwerden ist der\n                wichtigste Vorteil von Svelte, der viele der anderen Vorteile\n                ermöglicht, die wir weiter unten sehen werden. Das Konzept erfreut\n                sich so großer Beliebtheit, dass Angular und Ember in ihren\n                jüngsten Versionen auf Compiler umgestellt haben.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 122, 14, 4271);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_17.name,
    		type: "slot",
    		source: "(123:14) ",
    		ctx
    	});

    	return block;
    }

    // (116:8) <Col>
    function create_default_slot_88(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "1";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Compiler vs. ");
    			span = element("span");
    			span.textContent = "Virtuelles DOM";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 117, 12, 4083);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 119, 27, 4161);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 118, 12, 4129);
    			add_location(div1, file, 116, 10, 4065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_88.name,
    		type: "slot",
    		source: "(116:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (141:14) 
    function create_long_slot_16(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Svelte erzeugt hochoptimiertes Vanilla JS mit einem sehr geringen\n              Overhead zur Laufzeit. Das bedeutet kleine Bundle-Größen, einen\n              geringen Speicherbedarf und eine schnell ladende und schnell\n              laufende Anwendung. Schauen Sie sich die Performance-Benchmarks\n              hier an, um den Unterschied zu sehen. All dies ist \"out of the\n              box\", ohne dass Sie irgendwelche Einstellungen vornehmen müssen,\n              und es gibt viele Möglichkeiten, die Leistung noch weiter zu\n              verbessern.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 140, 14, 4972);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_16.name,
    		type: "slot",
    		source: "(141:14) ",
    		ctx
    	});

    	return block;
    }

    // (133:8) <Col>
    function create_default_slot_87(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "2";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Leichtgewichtig & ");
    			span = element("span");
    			span.textContent = "Performant";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 134, 12, 4782);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 136, 32, 4865);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 135, 12, 4828);
    			add_location(div1, file, 133, 10, 4764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_87.name,
    		type: "slot",
    		source: "(133:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (115:6) <Row>
    function create_default_slot_86(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_88] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_87] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_86.name,
    		type: "slot",
    		source: "(115:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (114:4) <Container class="text-center">
    function create_default_slot_85(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_86] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_85.name,
    		type: "slot",
    		source: "(114:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:2) <FullpageSection center>
    function create_default_slot_84(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_85] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_84.name,
    		type: "slot",
    		source: "(113:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (167:14) 
    function create_long_slot_15(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Mit Svelte gibt es keine Notwendigkeit für das Hinzufügen von Glue\n              Code wie Hooks oder komplexes State Management und so weiter. Die\n              Boilerplate, die für Komponenten benötigt wird, ist sehr minimal\n              und kommt fast an Vanilla HTML/JS heran. Svelte unterstützt auch\n              optionale Zwei-Wege-Bindungen, die es einfacher machen, Formulare\n              zu erstellen.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 166, 14, 5974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_15.name,
    		type: "slot",
    		source: "(167:14) ",
    		ctx
    	});

    	return block;
    }

    // (160:8) <Col>
    function create_default_slot_83(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "3";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Weniger ");
    			span = element("span");
    			span.textContent = "Boilerplate";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 161, 12, 5794);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 163, 22, 5867);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 162, 12, 5840);
    			add_location(div1, file, 160, 10, 5776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_83.name,
    		type: "slot",
    		source: "(160:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (185:14) 
    function create_long_slot_14(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Svelte ist standardmäßig reaktiv. Das DOM wird automatisch bei\n              Zustandsänderungen in jeder Top-Level-Variablen einer Komponente\n              aktualisiert. Sie müssen dafür nicht einmal speziellen Code\n              hinzufügen. Nur direkte Top-Level-Zuweisungen funktionieren auf\n              diese Weise und Referenzmutationen wie array.push funktionieren\n              nicht. Das bedeutet, dass Mutationen meiner Meinung nach\n              expliziter und einfacher zu verstehen sind.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 184, 14, 6710);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_14.name,
    		type: "slot",
    		source: "(185:14) ",
    		ctx
    	});

    	return block;
    }

    // (178:8) <Col>
    function create_default_slot_82(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "4";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Wirklich ");
    			span = element("span");
    			span.textContent = "reaktiv";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 179, 12, 6533);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 181, 23, 6607);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 180, 12, 6579);
    			add_location(div1, file, 178, 10, 6515);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_82.name,
    		type: "slot",
    		source: "(178:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (159:6) <Row>
    function create_default_slot_81(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_83] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_82] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_81.name,
    		type: "slot",
    		source: "(159:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (158:4) <Container class="text-center">
    function create_default_slot_80(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_81] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_80.name,
    		type: "slot",
    		source: "(158:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (157:2) <FullpageSection center>
    function create_default_slot_79(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_80] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_79.name,
    		type: "slot",
    		source: "(157:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (210:14) 
    function create_long_slot_13(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Da es sich um einen Compiler handelt, ist es einfach, die\n              Ausgabeziele zu ändern, ohne den Code Ihrer Komponente ändern zu\n              müssen. Zum Beispiel unterstützt Svelte das serverseitige\n              Rendering von Haus aus, indem es einen Compiler-Modus dafür\n              bereitstellt (dom vs. ssr). Es gibt sogar eine\n              NativeScript-Integration für Svelte, die von dieser Flexibilität\n              Gebrauch macht, um Ziele jenseits von dom und ssr zu erzeugen. Es\n              gibt auch das Sapper-Framework, bald SvelteKit, vom Svelte-Team,\n              das ähnlich wie Next.js ist, aber für die Philosophie von Svelte\n              optimiert ist. Sapper unterstützt SSR, Progressive Web Apps,\n              Code-Splitting, und so weiter.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 209, 14, 7662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_13.name,
    		type: "slot",
    		source: "(210:14) ",
    		ctx
    	});

    	return block;
    }

    // (203:8) <Col>
    function create_default_slot_78(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "5";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Mehrere ");
    			span = element("span");
    			span.textContent = "Ausgabeziele";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 204, 12, 7481);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 206, 22, 7554);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 205, 12, 7527);
    			add_location(div1, file, 203, 10, 7463);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_78.name,
    		type: "slot",
    		source: "(203:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (233:14) 
    function create_long_slot_12(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Svelte folgt einem Component-First-Pattern, was es ideal für die\n              Erstellung neuer Webanwendungen oder für das Hinzufügen von\n              Webkomponenten zu bestehenden Anwendungen macht. Stile sind\n              standardmäßig auf Komponenten skaliert, was Svelte ideal für\n              Web-Komponenten macht.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 232, 14, 8766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_12.name,
    		type: "slot",
    		source: "(233:14) ",
    		ctx
    	});

    	return block;
    }

    // (226:8) <Col>
    function create_default_slot_77(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "6";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Komponenten-");
    			span = element("span");
    			span.textContent = "Muster";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 227, 12, 8587);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 229, 26, 8664);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 228, 12, 8633);
    			add_location(div1, file, 226, 10, 8569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_77.name,
    		type: "slot",
    		source: "(226:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (202:6) <Row>
    function create_default_slot_76(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_78] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_77] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_76.name,
    		type: "slot",
    		source: "(202:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (201:4) <Container class="text-center">
    function create_default_slot_75(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_76] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_75.name,
    		type: "slot",
    		source: "(201:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (200:2) <FullpageSection center>
    function create_default_slot_74(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_75] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_74.name,
    		type: "slot",
    		source: "(200:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (258:14) 
    function create_long_slot_11(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Svelte bietet eingebaute Animationen und Effekte, die es einfacher\n              machen, glatte Benutzeroberflächen und interaktive\n              Visualisierungen zu erstellen. Nun, das Framework wurde\n              ursprünglich für die Erstellung interaktiver Grafiken für The\n              Guardian entwickelt. Dieser Ansatz bietet eine viel schönere\n              Entwicklererfahrung als etwas wie React und ist viel einfacher zu\n              verwenden.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 257, 14, 9588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_11.name,
    		type: "slot",
    		source: "(258:14) ",
    		ctx
    	});

    	return block;
    }

    // (249:8) <Col>
    function create_default_slot_73(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "7";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Eingebaute Animationen und ");
    			span = element("span");
    			span.textContent = "Effekte";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 250, 12, 9361);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 252, 41, 9453);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 251, 12, 9407);
    			add_location(div1, file, 249, 10, 9343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_73.name,
    		type: "slot",
    		source: "(249:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (277:14) 
    function create_long_slot_10(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Svelte bietet sowohl veränderliche als auch unveränderliche\n              reaktive Speicher, die es einfacher machen, komplexere\n              Zustandsverwaltung in Ihrer Anwendung durchzuführen. Die Stores\n              unterstützen manuelle und automatische Subskriptionen und\n              bidirektionale Bindungen, was sie sehr flexibel macht. Die\n              Implementierung ermöglicht auch den Wechsel zu einer anderen\n              Zustandsverwaltungslösung wie z. B. RxJS.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 276, 14, 10381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_10.name,
    		type: "slot",
    		source: "(277:14) ",
    		ctx
    	});

    	return block;
    }

    // (270:8) <Col>
    function create_default_slot_72(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "8";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Eingebauter reaktiver ");
    			span = element("span");
    			span.textContent = "Speicher";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 271, 12, 10190);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 273, 36, 10277);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 272, 12, 10236);
    			add_location(div1, file, 270, 10, 10172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_72.name,
    		type: "slot",
    		source: "(270:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (248:6) <Row>
    function create_default_slot_71(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_73] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_72] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_71.name,
    		type: "slot",
    		source: "(248:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (247:4) <Container class="text-center">
    function create_default_slot_70(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_71] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_70.name,
    		type: "slot",
    		source: "(247:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (246:2) <FullpageSection center>
    function create_default_slot_69(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_70] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_69.name,
    		type: "slot",
    		source: "(246:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (302:14) 
    function create_long_slot_9(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Im Gegensatz zu React oder Angular ist die Lernkurve für Svelte\n              recht niedrig. Es gibt keine spezielle Syntax wie JSX zu lernen\n              oder komplexe APIs wie bei Angular, die man sich merken muss.\n              Alles ist in standardkonformem JS/TS, CSS und HTML geschrieben,\n              mit etwas zusätzlichem Syntaxzucker für Direktiven und\n              Template-Logik. Die Komponenten-API ist einfach und überschaubar.\n              Die Dokumentation ist ebenfalls sehr gut und leicht\n              nachvollziehbar. Ich habe zum Beispiel nur ein paar Tage\n              gebraucht, um mich mit Svelte vertraut zu machen, selbst für\n              fortgeschrittene Konzepte wie Lebenszyklen, Komposition und so\n              weiter. Im Gegensatz dazu hat es Monate gedauert, bis ich mich in\n              React wirklich zurechtgefunden habe und ich kenne immer noch nicht\n              einmal die Hälfte der Angular-APIs, nachdem ich es fast ein Jahr\n              lang benutzt habe. Natürlich hilft die Kenntnis von React oder\n              Angular dabei, Svelte leichter zu erlernen, da es eine Menge\n              ähnlicher Konzepte gibt.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 301, 14, 11313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_9.name,
    		type: "slot",
    		source: "(302:14) ",
    		ctx
    	});

    	return block;
    }

    // (295:8) <Col>
    function create_default_slot_68(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "9";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Niedrige ");
    			span = element("span");
    			span.textContent = "Lernkurve";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 296, 12, 11134);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 298, 23, 11208);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 297, 12, 11180);
    			add_location(div1, file, 295, 10, 11116);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_68.name,
    		type: "slot",
    		source: "(295:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (294:6) <Row>
    function create_default_slot_67(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_68] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_67.name,
    		type: "slot",
    		source: "(294:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (293:4) <Container class="text-center">
    function create_default_slot_66(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_67] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_66.name,
    		type: "slot",
    		source: "(293:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (292:2) <FullpageSection center>
    function create_default_slot_65(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_66] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_65.name,
    		type: "slot",
    		source: "(292:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (329:8) <Col>
    function create_default_slot_64(ctx) {
    	let h1;
    	let t1;
    	let div;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "NACHTEILE";
    			t1 = space();
    			div = element("div");
    			attr_dev(h1, "class", "title-section svelte-7awd56");
    			add_location(h1, file, 329, 10, 12730);
    			attr_dev(div, "id", "parallelogram");
    			attr_dev(div, "class", "svelte-7awd56");
    			add_location(div, file, 330, 10, 12781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_64.name,
    		type: "slot",
    		source: "(329:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (328:6) <Row>
    function create_default_slot_63(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_64] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_63.name,
    		type: "slot",
    		source: "(328:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (327:4) <Container class="text-center">
    function create_default_slot_62(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_63] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_62.name,
    		type: "slot",
    		source: "(327:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (326:2) <FullpageSection center>
    function create_default_slot_61(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_62] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_61.name,
    		type: "slot",
    		source: "(326:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (346:14) 
    function create_long_slot_8(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Svelte ist sehr jung und das bedeutet, dass es noch nicht so\n              kampferprobt ist wie React oder Angular und Sie vielleicht\n              manchmal gegen einige Mauern laufen. Das bedeutet, dass es\n              wahrscheinlich nicht für sehr komplexe oder unternehmenskritische\n              Anwendungen geeignet ist, von denen erwartet wird, dass sie\n              skalieren. Dies könnte kein langfristiges Problem sein, da das\n              Framework in seiner Popularität explodiert und die Einführung von\n              Sapper bei den Skalierungsproblemen geholfen hat. Allerdings hätte\n              die Verwirrung um Sapper vs. SvelteKit meiner Meinung nach\n              vermieden werden können.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 345, 14, 13168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_8.name,
    		type: "slot",
    		source: "(346:14) ",
    		ctx
    	});

    	return block;
    }

    // (339:8) <Col>
    function create_default_slot_60(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "1";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Junges ");
    			span = element("span");
    			span.textContent = "Framework";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 340, 12, 12991);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 342, 21, 13063);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 341, 12, 13037);
    			add_location(div1, file, 339, 10, 12973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_60.name,
    		type: "slot",
    		source: "(339:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (370:14) 
    function create_long_slot_7(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Ein junges Framework zu sein bedeutet, dass es eine kleinere\n              Community und Benutzerbasis sowie ein kleineres Ökosystem hat.\n              Daher finden Sie vielleicht nicht so viele Tools oder Bibliotheken\n              wie in React oder so viel Hilfe auf Stack Overflow, wenn Sie bei\n              einem komplexen Problem nicht weiterkommen.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 369, 14, 14258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_7.name,
    		type: "slot",
    		source: "(370:14) ",
    		ctx
    	});

    	return block;
    }

    // (361:8) <Col>
    function create_default_slot_59(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "2";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Kleinere Community und ");
    			span = element("span");
    			span.textContent = "kleineres Ökosystem";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 362, 12, 14023);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 364, 37, 14111);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 363, 12, 14069);
    			add_location(div1, file, 361, 10, 14005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_59.name,
    		type: "slot",
    		source: "(361:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (338:6) <Row>
    function create_default_slot_58(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_60] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_59] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_58.name,
    		type: "slot",
    		source: "(338:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (337:4) <Container class="text-center">
    function create_default_slot_57(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_58] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_57.name,
    		type: "slot",
    		source: "(337:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (336:2) <FullpageSection center>
    function create_default_slot_56(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_57] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_56.name,
    		type: "slot",
    		source: "(336:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (393:14) 
    function create_long_slot_6(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Wenn Sie wie ich schon eine Weile im Bereich der\n              Frontend-Entwicklung tätig sind, können Sie zurückblicken und\n              sehen, dass sich die UX meilenweit verbessert hat, aber die\n              Toolchain, um das zu produzieren, ist sehr komplex geworden. Bei\n              JHipster versuchen wir zum Beispiel, das klassenbeste\n              Production-Grade-Setup für eine Full-Stack-Web-App mit\n              React/Vue/Angular-Frontend und Java/Kotlin/.NET/NodeJS-Backend\n              anzubieten. Wenn Sie eine neue App erstellen und kompilieren,\n              werden Sie feststellen, dass das Frontend 10x mehr Zeit zum\n              Kompilieren benötigt als das Backend. Das ist heutzutage das neue\n              Normal in jeder Full-Stack-Web-Applikation und auch Svelte hat das\n              gleiche Problem. Es ist Compiler-lastig und je komplexer Ihre App\n              wird, desto komplexer und zeitaufwändiger wird der Build. Das\n              bedeutet auch, dass man nicht einfach eine JS-Datei in eine\n              Webseite einfügen kann und erwarten kann, dass es eine Svelte-App\n              wird, wie man es mit Vue machen kann.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 392, 14, 15062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_6.name,
    		type: "slot",
    		source: "(393:14) ",
    		ctx
    	});

    	return block;
    }

    // (386:8) <Col>
    function create_default_slot_55(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "3";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Compilation ");
    			span = element("span");
    			span.textContent = "heavy";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 387, 12, 14884);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 389, 26, 14961);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 388, 12, 14930);
    			add_location(div1, file, 386, 10, 14866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_55.name,
    		type: "slot",
    		source: "(386:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (421:14) 
    function create_long_slot_5(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Svelte ist konform mit den Webstandards, es führt nichts Neues wie\n              JSX ein. Aber es ändert einige der Standard-Semantiken, um auf\n              eine andere Art und Weise zu arbeiten und das könnte für neue\n              Benutzer verwirrend sein. Zum Beispiel verwendet es das\n              Schlüsselwort export anders und es gibt Macken wie die Verwendung\n              von on:click statt onClick und so weiter. Aber diese sind in jedem\n              Framework fast unvermeidbar. Es verwendet auch ein JS-Label ($:),\n              damit abgeleitete Anweisungen/Deklarationen funktionieren. Das\n              könnte befremdlich wirken, da einige JS-Entwickler wahrscheinlich\n              nicht einmal wissen, dass Labels in JS existieren, da wir sie\n              selten verwenden.";
    			attr_dev(p, "slot", "long");
    			add_location(p, file, 420, 14, 16538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_5.name,
    		type: "slot",
    		source: "(421:14) ",
    		ctx
    	});

    	return block;
    }

    // (414:8) <Col>
    function create_default_slot_54(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let h1;
    	let t2;
    	let span;
    	let t4;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: { long: [create_long_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "4";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text("Mac");
    			span = element("span");
    			span.textContent = "ken";
    			t4 = space();
    			create_component(content.$$.fragment);
    			attr_dev(div0, "class", "number-title svelte-7awd56");
    			add_location(div0, file, 415, 12, 16371);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 417, 17, 16439);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 416, 12, 16417);
    			add_location(div1, file, 414, 10, 16353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(h1, span);
    			append_dev(div1, t4);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_54.name,
    		type: "slot",
    		source: "(414:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (385:6) <Row>
    function create_default_slot_53(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_55] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_54] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_53.name,
    		type: "slot",
    		source: "(385:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (384:4) <Container class="text-center">
    function create_default_slot_52(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_53] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_52.name,
    		type: "slot",
    		source: "(384:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (383:2) <FullpageSection center>
    function create_default_slot_51(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_52] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_51.name,
    		type: "slot",
    		source: "(383:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (443:8) <Col>
    function create_default_slot_50(ctx) {
    	let h1;
    	let t1;
    	let div;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Sapper";
    			t1 = space();
    			div = element("div");
    			attr_dev(h1, "class", "title-section svelte-7awd56");
    			add_location(h1, file, 443, 10, 17586);
    			attr_dev(div, "id", "parallelogram");
    			attr_dev(div, "class", "svelte-7awd56");
    			add_location(div, file, 444, 10, 17634);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_50.name,
    		type: "slot",
    		source: "(443:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (442:6) <Row>
    function create_default_slot_49(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_50] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_49.name,
    		type: "slot",
    		source: "(442:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (441:4) <Container class="text-center">
    function create_default_slot_48(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_49] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_48.name,
    		type: "slot",
    		source: "(441:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (440:2) <FullpageSection center>
    function create_default_slot_47(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_48] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_47.name,
    		type: "slot",
    		source: "(440:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (456:12) 
    function create_long_slot_4(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Sapper ist ein app framework oder auch metaframework aufbauend\n                auf Svelte. Die Aufgabe von Sapper ist es, das Bauen von Svelte\n                Apps so einfach wie möglich zu gestalten in der Entwicklung von\n                modernen best practice Applikationen. Diese best practice\n                Applikationen enthalten beispielsweise server side rendering\n                (SSR) und code-splitting. Sapper nutzt zudem eine\n                “filesystem-based routing” wie von Next.js bekannt gemacht. Es\n                gibt zwei grundlegenden Konzepte: jede Seite einer App ist eine\n                Svelte Komponentet man erstellt Seiten in dem mal Dateien zu\n                src/routes hinzufügt. Diese werden vom server gerendert sodass\n                der initiale Besuch des Users so schnell wie möglich ist. HTML\n                im Browser wird eine SPA Single Page Application html templates\n                können geprerendert werden auf node server → optimierung von SEO\n                Search Engine Optimization svelte ohne sapper: anfrage zu\n                mysite.com/about → server about server → empty html page with\n                svelte js bundle und about component rendered in browser mit\n                sapper: mysite.com/about → server der about component\n                pr-rendered on server und dann prerendered html und compiled js\n                bundle an browser schickt nur initiale Anfrage nutzt Server Side\n                rendering, sonst render im browser direkt. Alle weiteren Quelles\n                und Anfragen werden vom frontend java script bundle gehandelt\n                und dynamisch anzeigen von Komponenten.";
    			add_location(p, file, 456, 14, 17956);
    			attr_dev(div, "slot", "long");
    			add_location(div, file, 455, 12, 17924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_4.name,
    		type: "slot",
    		source: "(456:12) ",
    		ctx
    	});

    	return block;
    }

    // (482:12) 
    function create_short_slot_4(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;
    	let t7;
    	let li4;
    	let t9;
    	let li5;
    	let t11;
    	let li6;
    	let t13;
    	let li7;
    	let t15;
    	let li8;
    	let t17;
    	let li9;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Auf Svelte aufbauendes Metaframework für \"best practice\"\n                  Applikationen";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Server Side Rendering (SSR)";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Code Splitting";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "Ähnlich wie bei Next.js Filesystem-based routing";
    			t7 = space();
    			li4 = element("li");
    			li4.textContent = "Zwei grundlegende Konzepte";
    			t9 = space();
    			li5 = element("li");
    			li5.textContent = "jede Seite einer App ist eine Svelte Komponentet";
    			t11 = space();
    			li6 = element("li");
    			li6.textContent = "man erstellt Seiten in dem mal Dateien zu src/routes\n                  hinzufügt. Diese werden vom server gerendert sodass der\n                  initiale Besuch des Users so schnell wie möglich ist.";
    			t13 = space();
    			li7 = element("li");
    			li7.textContent = "HTML wird im Browser zu Single Page Applikation (SPA)";
    			t15 = space();
    			li8 = element("li");
    			li8.textContent = "durch prerender von html templates, Optimierung von Search\n                  Engine Optimization (SEO)";
    			t17 = space();
    			li9 = element("li");
    			li9.textContent = "Nur initiale Anfrage nutzt Server Side rendering, sonst im\n                  Browser direkt gerendert";
    			attr_dev(li0, "class", "svelte-7awd56");
    			add_location(li0, file, 483, 16, 19750);
    			attr_dev(li1, "class", "svelte-7awd56");
    			add_location(li1, file, 487, 16, 19900);
    			attr_dev(li2, "class", "svelte-7awd56");
    			add_location(li2, file, 488, 16, 19953);
    			attr_dev(li3, "class", "svelte-7awd56");
    			add_location(li3, file, 489, 16, 19993);
    			attr_dev(li4, "class", "svelte-7awd56");
    			add_location(li4, file, 490, 16, 20067);
    			attr_dev(li5, "class", "svelte-7awd56");
    			add_location(li5, file, 491, 16, 20119);
    			attr_dev(li6, "class", "svelte-7awd56");
    			add_location(li6, file, 492, 16, 20193);
    			attr_dev(li7, "class", "svelte-7awd56");
    			add_location(li7, file, 497, 16, 20453);
    			attr_dev(li8, "class", "svelte-7awd56");
    			add_location(li8, file, 498, 16, 20532);
    			attr_dev(li9, "class", "svelte-7awd56");
    			add_location(li9, file, 502, 16, 20696);
    			attr_dev(ul, "class", "svelte-7awd56");
    			add_location(ul, file, 482, 14, 19729);
    			attr_dev(div, "slot", "short");
    			add_location(div, file, 481, 12, 19696);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    			append_dev(ul, t11);
    			append_dev(ul, li6);
    			append_dev(ul, t13);
    			append_dev(ul, li7);
    			append_dev(ul, t15);
    			append_dev(ul, li8);
    			append_dev(ul, t17);
    			append_dev(ul, li9);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_short_slot_4.name,
    		type: "slot",
    		source: "(482:12) ",
    		ctx
    	});

    	return block;
    }

    // (453:8) <Col>
    function create_default_slot_46(ctx) {
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: {
    					short: [create_short_slot_4],
    					long: [create_long_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Was ist ");
    			span = element("span");
    			span.textContent = "Sapper?";
    			t2 = space();
    			create_component(content.$$.fragment);
    			attr_dev(span, "class", "sapper-color svelte-7awd56");
    			add_location(span, file, 453, 22, 17838);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 453, 10, 17826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			insert_dev(target, t2, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_46.name,
    		type: "slot",
    		source: "(453:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (452:6) <Row>
    function create_default_slot_45(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_46] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_45.name,
    		type: "slot",
    		source: "(452:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (451:4) <Container class="text-center">
    function create_default_slot_44(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_45] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_44.name,
    		type: "slot",
    		source: "(451:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (450:2) <FullpageSection center>
    function create_default_slot_43(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_44] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_43.name,
    		type: "slot",
    		source: "(450:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (521:14) 
    function create_long_slot_3(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Der Name Sapper stammt vom Militär. Zu deutsch Sappeur vom\n                  französischen sapeur Steinhauer abgeleitet. Ein Sappeur war\n                  ein Belagerungspionier oder Truppenhandwerker. Tätigkeiten\n                  waren beispielsweise Brückenbau, Straßenbau/Reparaturen alles\n                  unter Kriegsbedingungen. Sapper, was kurz für Svelte App maker\n                  steht ist ein mutiger und pflichtbewusster Verbündeter wenn es\n                  um die Herausforderungen der Webentwicklung geht. Für\n                  Webentwickler sind beispielsweise schwache Geräte, schlechte\n                  Netzwerkverbindungen und Komplexität in der Frontend\n                  Entwicklung Herausforderungen.";
    			add_location(p, file, 521, 16, 21220);
    			attr_dev(div, "slot", "long");
    			add_location(div, file, 520, 14, 21186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_3.name,
    		type: "slot",
    		source: "(521:14) ",
    		ctx
    	});

    	return block;
    }

    // (535:14) 
    function create_short_slot_3(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Name stammt vom Militär engl. Sapper deutsch Sappeur";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Soldaten im Kriegsgebiet für Brücken und\n                    Straßenbau/Brückenbau";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Sapper kurz für Svelte App maker";
    			attr_dev(li0, "class", "svelte-7awd56");
    			add_location(li0, file, 536, 18, 22083);
    			attr_dev(li1, "class", "svelte-7awd56");
    			add_location(li1, file, 537, 18, 22163);
    			attr_dev(li2, "class", "svelte-7awd56");
    			add_location(li2, file, 541, 18, 22313);
    			attr_dev(ul, "class", "svelte-7awd56");
    			add_location(ul, file, 535, 16, 22060);
    			attr_dev(div, "slot", "short");
    			add_location(div, file, 534, 14, 22025);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_short_slot_3.name,
    		type: "slot",
    		source: "(535:14) ",
    		ctx
    	});

    	return block;
    }

    // (517:8) <Col>
    function create_default_slot_42(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: {
    					short: [create_short_slot_3],
    					long: [create_long_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Warum ");
    			span = element("span");
    			span.textContent = "Sapper?";
    			t2 = space();
    			create_component(content.$$.fragment);
    			attr_dev(span, "class", "sapper-color svelte-7awd56");
    			add_location(span, file, 518, 22, 21096);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 518, 12, 21086);
    			add_location(div, file, 517, 10, 21068);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			append_dev(div, t2);
    			mount_component(content, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_42.name,
    		type: "slot",
    		source: "(517:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (554:14) 
    function create_long_slot_2(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "wie Next.js für React ist Sapper für Svelte Unterschiede\n                  zwischen Sapper und Next.js: - Sapper wird betrieben von\n                  Svelte statt React und ist somit schneller und die Apps sind\n                  kleiner - Seiten und Routen im src/routes Verzeichnis machen\n                  es sehr einfach eine JSON API hizuzufügen - Quelles sind nur\n                  ein a-tag Element im Gegensatz zu einer frameworkspezifischen\n                  Quelle-tag Komponente";
    			add_location(p, file, 554, 16, 22661);
    			attr_dev(div, "slot", "long");
    			add_location(div, file, 553, 14, 22627);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_2.name,
    		type: "slot",
    		source: "(554:14) ",
    		ctx
    	});

    	return block;
    }

    // (565:14) 
    function create_short_slot_2(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Sapper wird betrieben von Svelte statt React und ist somit\n                    schneller und die Apps sind kleiner";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Seiten und Routen im src/routes Verzeichnis machen es sehr\n                    einfach eine JSON API hizuzufügen";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Quelles sind nur ein a-tag Element im Gegensatz zu einer\n                    frameworkspezifischen Quelle-tag Komponente";
    			attr_dev(li0, "class", "svelte-7awd56");
    			add_location(li0, file, 566, 18, 23286);
    			attr_dev(li1, "class", "svelte-7awd56");
    			add_location(li1, file, 570, 18, 23468);
    			attr_dev(li2, "class", "svelte-7awd56");
    			add_location(li2, file, 574, 18, 23648);
    			attr_dev(ul, "class", "svelte-7awd56");
    			add_location(ul, file, 565, 16, 23263);
    			attr_dev(div, "slot", "short");
    			add_location(div, file, 564, 14, 23228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_short_slot_2.name,
    		type: "slot",
    		source: "(565:14) ",
    		ctx
    	});

    	return block;
    }

    // (548:8) <Col>
    function create_default_slot_41(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: {
    					short: [create_short_slot_2],
    					long: [create_long_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Vergleich ");
    			span = element("span");
    			span.textContent = "Next.js";
    			t2 = space();
    			create_component(content.$$.fragment);
    			attr_dev(span, "class", "sapper-color svelte-7awd56");
    			add_location(span, file, 550, 24, 22524);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 549, 12, 22495);
    			add_location(div, file, 548, 10, 22477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			append_dev(div, t2);
    			mount_component(content, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_41.name,
    		type: "slot",
    		source: "(548:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (516:6) <Row>
    function create_default_slot_40(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_42] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	col1 = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_41] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(col1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_40.name,
    		type: "slot",
    		source: "(516:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (515:4) <Container class="text-center">
    function create_default_slot_39(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_40] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_39.name,
    		type: "slot",
    		source: "(515:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (514:2) <FullpageSection center>
    function create_default_slot_38(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_39] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_38.name,
    		type: "slot",
    		source: "(514:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (590:8) <Col>
    function create_default_slot_37(ctx) {
    	let h1;
    	let t1;
    	let div;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Zukunftsausblick";
    			t1 = space();
    			div = element("div");
    			attr_dev(h1, "class", "title-section svelte-7awd56");
    			add_location(h1, file, 590, 10, 24066);
    			attr_dev(div, "id", "parallelogram");
    			attr_dev(div, "class", "svelte-7awd56");
    			add_location(div, file, 591, 10, 24124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_37.name,
    		type: "slot",
    		source: "(590:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (589:6) <Row>
    function create_default_slot_36(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_37] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_36.name,
    		type: "slot",
    		source: "(589:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (588:4) <Container class="text-center">
    function create_default_slot_35(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_36] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_35.name,
    		type: "slot",
    		source: "(588:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (587:2) <FullpageSection center>
    function create_default_slot_34(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_35] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_34.name,
    		type: "slot",
    		source: "(587:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (604:14) 
    function create_long_slot_1(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Vor allem für Einsteiger ist der Unterschied von zwei\n                  empfohlenen Wegen eine App zu starten sehr verwirrend. Auf der\n                  einen Seite gab es die Sapper App und auf der anderen Seite\n                  die Svelte App. Mit den Neuerungen, soll ein einheitlicher Weg\n                  empfohlen werden, sodass es zu einer deutlich besseren\n                  Übersichtlichkeit beim Einstieg, Onboarding als auch bei der\n                  Wartung und Instandhaltung von Code und dem ganzen Projekt\n                  kommt. Zudem hat sich die Art und Weise Webentwicklung zu\n                  betreiben drastisch geändert, womit es an der Zeit ist, einige\n                  fundamentale Annahmen zu überdenken.";
    			add_location(p, file, 604, 16, 24471);
    			attr_dev(div, "slot", "long");
    			add_location(div, file, 603, 14, 24437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot_1.name,
    		type: "slot",
    		source: "(604:14) ",
    		ctx
    	});

    	return block;
    }

    // (618:14) 
    function create_short_slot_1(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Leichterer Einstieg in Svelte";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "einheitlich eine Empfehlung wie Beginner einsteigen";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Übersichtlichkeit und Wartbarkeit im Code verbessern";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "Aufgrund der Art und Weise wie Webentwicklung sich geändert\n                    hat, fundamentale Annahmen überdenken";
    			attr_dev(li0, "class", "svelte-7awd56");
    			add_location(li0, file, 619, 18, 25342);
    			attr_dev(li1, "class", "svelte-7awd56");
    			add_location(li1, file, 620, 18, 25399);
    			attr_dev(li2, "class", "svelte-7awd56");
    			add_location(li2, file, 621, 18, 25478);
    			attr_dev(li3, "class", "svelte-7awd56");
    			add_location(li3, file, 622, 18, 25558);
    			attr_dev(ul, "class", "svelte-7awd56");
    			add_location(ul, file, 618, 16, 25319);
    			attr_dev(div, "slot", "short");
    			add_location(div, file, 617, 14, 25284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_short_slot_1.name,
    		type: "slot",
    		source: "(618:14) ",
    		ctx
    	});

    	return block;
    }

    // (600:8) <Col>
    function create_default_slot_33(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: {
    					short: [create_short_slot_1],
    					long: [create_long_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Warum ");
    			span = element("span");
    			span.textContent = "SvelteKit?";
    			t2 = space();
    			create_component(content.$$.fragment);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 601, 22, 24344);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 601, 12, 24334);
    			add_location(div, file, 600, 10, 24316);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			append_dev(div, t2);
    			mount_component(content, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_33.name,
    		type: "slot",
    		source: "(600:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (599:6) <Row>
    function create_default_slot_32(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_33] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_32.name,
    		type: "slot",
    		source: "(599:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (598:4) <Container class="text-center">
    function create_default_slot_31(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_32] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_31.name,
    		type: "slot",
    		source: "(598:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (597:2) <FullpageSection center>
    function create_default_slot_30(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_31] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_30.name,
    		type: "slot",
    		source: "(597:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (642:14) 
    function create_long_slot(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "Um bei den eben genannten fundamentalen Annahmen zu bleiben,\n                  eine davon ist es, dass man einen \"module bunderl\" wie\n                  beispielsweise webpack oder Rollup brauchst um app zu bauen.\n                  Diese Werkzeuge tracken die Abhängigkeiten einer Applikation\n                  und analysieren und transformieren Code (machen Svelte\n                  Komponenten zu JS Modulen). Vor einigen Jahren brauchte man\n                  die Bundler auf jeden Fall noch, da die Browser noch nicht\n                  nativ im Stande waren, “import” Keywords zu unterstützen.\n                  Aktuell sehen wir einen zunehmenden Anstieg von “unbundled\n                  development workflow” welcher deutlich einfacher ist, als das\n                  Bündeln von Apps. Ein Development Server kann ”on-demand”\n                  Module bereitstellen (umgewandelt in JavaScript, wenn nötig).\n                  Das bedeutet, dass der Start im Wesentlichen sofort erfolgt,\n                  egal wie groß Ihre App wird. Einer der Vorreiter in diesem\n                  Bereich ist Snowpack. Snowpack ist erstaunlich schnell und\n                  bietet eine hervorragende Entwicklungserfahrung\n                  (Hot-Modul-Reload, Fehlerüberlagerungen usw.), und für\n                  SvelteKit wurde eng mit dem Snowpack-Team an Funktionen wie\n                  SSR zusammengearbeitet. Besonders aufschlussreich ist das\n                  Hot-Module-Reloading, wenn man es gewohnt ist, Sapper mit\n                  Rollup zu verwenden (das aufgrund seiner Architektur, die die\n                  effizienteste Ausgabe priorisiert, noch nie eine erstklassige\n                  HMR-Unterstützung hatte). Um App in Produktion zu bringen\n                  werden nach wie vor Bundler verwendet. SvelteKit verwendet\n                  Rollup, um Apps so schnell und schlank wie möglich zu machen\n                  (was beispielsweise das Extrahieren von Stilen in statische\n                  .css-Dateien umfasst). Die andere grundlegende Annahme ist,\n                  dass eine vom Server gerenderte App einen Server benötigt.\n                  Sapper hat effektiv zwei Modi – Sapper Build, der eine\n                  eigenständige App erstellt, die auf einem Node-Server\n                  ausgeführt werden muss, und Sapper-Export, der die App als\n                  Sammlung statischer Dateien ausgibt, die für das Hosten auf\n                  Diensten wie GitHub Pages geeignet sind. Es ist weiterhin\n                  möglich, sowohl Node-Apps als auch vollständig vorgerenderte\n                  (auch exportierte) Sites zu erstellen SvelteKit umfasst das\n                  serverlose Paradigma vollständig und wird mit Unterstützung\n                  für alle großen serverlosen Anbieter gestartet, mit einer\n                  'Adapter'-API für alle Plattformen, die offiziell nicht\n                  bedient werden. Darüber hinaus wird man in der Lage sein,\n                  partielles Pre-Rendering durchzuführen, was bedeutet, dass\n                  statische Seiten zur Erstellungszeit generiert werden können,\n                  während dynamische Seiten bei Bedarf gerendert werden.";
    			add_location(p, file, 642, 16, 26135);
    			attr_dev(div, "slot", "long");
    			add_location(div, file, 641, 14, 26101);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_long_slot.name,
    		type: "slot",
    		source: "(642:14) ",
    		ctx
    	});

    	return block;
    }

    // (688:14) 
    function create_short_slot(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;
    	let t7;
    	let li4;
    	let t9;
    	let li5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Für Development kein Bundler mehr";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Snowpack für deutliche Zeitersparnis bei Entwicklung";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "Hot-Module Reload und Fehlerüberlagerung";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "In Produktion Rollup als Bundler";
    			t7 = space();
    			li4 = element("li");
    			li4.textContent = "vollständige Unterstützung serverloses Paradigma";
    			t9 = space();
    			li5 = element("li");
    			li5.textContent = "Für großen Anbieter Plattformen -> Adapter API";
    			attr_dev(li0, "class", "svelte-7awd56");
    			add_location(li0, file, 689, 18, 29474);
    			attr_dev(li1, "class", "svelte-7awd56");
    			add_location(li1, file, 690, 18, 29535);
    			attr_dev(li2, "class", "svelte-7awd56");
    			add_location(li2, file, 691, 18, 29615);
    			attr_dev(li3, "class", "svelte-7awd56");
    			add_location(li3, file, 692, 18, 29683);
    			attr_dev(li4, "class", "svelte-7awd56");
    			add_location(li4, file, 693, 18, 29743);
    			attr_dev(li5, "class", "svelte-7awd56");
    			add_location(li5, file, 694, 18, 29819);
    			attr_dev(ul, "class", "svelte-7awd56");
    			add_location(ul, file, 688, 16, 29451);
    			attr_dev(div, "slot", "short");
    			add_location(div, file, 687, 14, 29416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_short_slot.name,
    		type: "slot",
    		source: "(688:14) ",
    		ctx
    	});

    	return block;
    }

    // (638:8) <Col>
    function create_default_slot_29(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let content;
    	let current;

    	content = new Content({
    			props: {
    				long: /*long*/ ctx[1],
    				$$slots: {
    					short: [create_short_slot],
    					long: [create_long_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Änderungen in ");
    			span = element("span");
    			span.textContent = "SvelteKit";
    			t2 = space();
    			create_component(content.$$.fragment);
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 639, 30, 26009);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 639, 12, 25991);
    			add_location(div, file, 638, 10, 25973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			append_dev(div, t2);
    			mount_component(content, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const content_changes = {};
    			if (dirty & /*long*/ 2) content_changes.long = /*long*/ ctx[1];

    			if (dirty & /*$$scope*/ 128) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_29.name,
    		type: "slot",
    		source: "(638:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (637:6) <Row>
    function create_default_slot_28(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_29] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_28.name,
    		type: "slot",
    		source: "(637:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (636:4) <Container class="text-center">
    function create_default_slot_27(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_28] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_27.name,
    		type: "slot",
    		source: "(636:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (635:2) <FullpageSection center>
    function create_default_slot_26(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_27] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_26.name,
    		type: "slot",
    		source: "(635:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (712:16) <Tab>
    function create_default_slot_25(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Counter");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(712:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (713:16) <Tab>
    function create_default_slot_24(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Templates");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(713:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (714:16) <Tab>
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Two way binding");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(714:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (715:16) <Tab>
    function create_default_slot_22(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Motion");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(715:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (716:16) <Tab>
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Componenten");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(716:16) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (711:14) <TabList>
    function create_default_slot_20(ctx) {
    	let tab0;
    	let t0;
    	let tab1;
    	let t1;
    	let tab2;
    	let t2;
    	let tab3;
    	let t3;
    	let tab4;
    	let current;

    	tab0 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab2 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_23] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab3 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_22] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab4 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_21] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab0.$$.fragment);
    			t0 = space();
    			create_component(tab1.$$.fragment);
    			t1 = space();
    			create_component(tab2.$$.fragment);
    			t2 = space();
    			create_component(tab3.$$.fragment);
    			t3 = space();
    			create_component(tab4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tab1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tab2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tab3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(tab4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    			const tab2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab2_changes.$$scope = { dirty, ctx };
    			}

    			tab2.$set(tab2_changes);
    			const tab3_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab3_changes.$$scope = { dirty, ctx };
    			}

    			tab3.$set(tab3_changes);
    			const tab4_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tab4_changes.$$scope = { dirty, ctx };
    			}

    			tab4.$set(tab4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			transition_in(tab2.$$.fragment, local);
    			transition_in(tab3.$$.fragment, local);
    			transition_in(tab4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			transition_out(tab2.$$.fragment, local);
    			transition_out(tab3.$$.fragment, local);
    			transition_out(tab4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tab1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tab2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tab3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(tab4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(711:14) <TabList>",
    		ctx
    	});

    	return block;
    }

    // (719:16) <Example code={code.counterCode}>
    function create_default_slot_19(ctx) {
    	let counter;
    	let current;
    	counter = new Counter({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(counter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(counter, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(counter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(counter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(counter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(719:16) <Example code={code.counterCode}>",
    		ctx
    	});

    	return block;
    }

    // (718:14) <TabPanel>
    function create_default_slot_18(ctx) {
    	let example;
    	let current;

    	example = new Example({
    			props: {
    				code: counterCode,
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(example.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(example, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const example_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				example_changes.$$scope = { dirty, ctx };
    			}

    			example.$set(example_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(example.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(example.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(example, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(718:14) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (724:16) <Example code={code.templatesCode}>
    function create_default_slot_17(ctx) {
    	let templates;
    	let current;
    	templates = new Templates({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(templates.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(templates, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(templates.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(templates.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(templates, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(724:16) <Example code={code.templatesCode}>",
    		ctx
    	});

    	return block;
    }

    // (723:14) <TabPanel>
    function create_default_slot_16(ctx) {
    	let example;
    	let current;

    	example = new Example({
    			props: {
    				code: templatesCode,
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(example.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(example, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const example_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				example_changes.$$scope = { dirty, ctx };
    			}

    			example.$set(example_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(example.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(example.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(example, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(723:14) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (729:16) <Example code={code.twowaybinding}>
    function create_default_slot_15(ctx) {
    	let twowaybinding;
    	let current;
    	twowaybinding = new TwoWayBinding({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(twowaybinding.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(twowaybinding, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(twowaybinding.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(twowaybinding.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(twowaybinding, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(729:16) <Example code={code.twowaybinding}>",
    		ctx
    	});

    	return block;
    }

    // (728:14) <TabPanel>
    function create_default_slot_14(ctx) {
    	let example;
    	let current;

    	example = new Example({
    			props: {
    				code: twowaybinding,
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(example.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(example, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const example_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				example_changes.$$scope = { dirty, ctx };
    			}

    			example.$set(example_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(example.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(example.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(example, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(728:14) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (734:16) <Example code={code.motion}>
    function create_default_slot_13(ctx) {
    	let motion;
    	let current;
    	motion = new Motion({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(motion.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(motion, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(motion.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(motion.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(motion, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(734:16) <Example code={code.motion}>",
    		ctx
    	});

    	return block;
    }

    // (733:14) <TabPanel>
    function create_default_slot_12(ctx) {
    	let example;
    	let current;

    	example = new Example({
    			props: {
    				code: motion,
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(example.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(example, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const example_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				example_changes.$$scope = { dirty, ctx };
    			}

    			example.$set(example_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(example.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(example.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(example, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(733:14) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (739:16) <Example code={code.components}>
    function create_default_slot_11(ctx) {
    	let componentsouter;
    	let current;
    	componentsouter = new ComponentsOuter({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(componentsouter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(componentsouter, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(componentsouter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(componentsouter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(componentsouter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(739:16) <Example code={code.components}>",
    		ctx
    	});

    	return block;
    }

    // (738:14) <TabPanel>
    function create_default_slot_10(ctx) {
    	let example;
    	let current;

    	example = new Example({
    			props: {
    				code: components,
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(example.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(example, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const example_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				example_changes.$$scope = { dirty, ctx };
    			}

    			example.$set(example_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(example.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(example.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(example, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(738:14) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (710:12) <Tabs>
    function create_default_slot_9(ctx) {
    	let tablist;
    	let t0;
    	let tabpanel0;
    	let t1;
    	let tabpanel1;
    	let t2;
    	let tabpanel2;
    	let t3;
    	let tabpanel3;
    	let t4;
    	let tabpanel4;
    	let current;

    	tablist = new TabList({
    			props: {
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel0 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel1 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel2 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel3 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel4 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablist.$$.fragment);
    			t0 = space();
    			create_component(tabpanel0.$$.fragment);
    			t1 = space();
    			create_component(tabpanel1.$$.fragment);
    			t2 = space();
    			create_component(tabpanel2.$$.fragment);
    			t3 = space();
    			create_component(tabpanel3.$$.fragment);
    			t4 = space();
    			create_component(tabpanel4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablist, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tabpanel0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tabpanel1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tabpanel2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(tabpanel3, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(tabpanel4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablist_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tablist_changes.$$scope = { dirty, ctx };
    			}

    			tablist.$set(tablist_changes);
    			const tabpanel0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabpanel0_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel0.$set(tabpanel0_changes);
    			const tabpanel1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabpanel1_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel1.$set(tabpanel1_changes);
    			const tabpanel2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabpanel2_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel2.$set(tabpanel2_changes);
    			const tabpanel3_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabpanel3_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel3.$set(tabpanel3_changes);
    			const tabpanel4_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabpanel4_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel4.$set(tabpanel4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablist.$$.fragment, local);
    			transition_in(tabpanel0.$$.fragment, local);
    			transition_in(tabpanel1.$$.fragment, local);
    			transition_in(tabpanel2.$$.fragment, local);
    			transition_in(tabpanel3.$$.fragment, local);
    			transition_in(tabpanel4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablist.$$.fragment, local);
    			transition_out(tabpanel0.$$.fragment, local);
    			transition_out(tabpanel1.$$.fragment, local);
    			transition_out(tabpanel2.$$.fragment, local);
    			transition_out(tabpanel3.$$.fragment, local);
    			transition_out(tabpanel4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablist, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tabpanel0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tabpanel1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tabpanel2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(tabpanel3, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(tabpanel4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(710:12) <Tabs>",
    		ctx
    	});

    	return block;
    }

    // (707:8) <Col>
    function create_default_slot_8(ctx) {
    	let h1;
    	let t1;
    	let p;
    	let tabs;
    	let current;

    	tabs = new Tabs({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Code";
    			t1 = space();
    			p = element("p");
    			create_component(tabs.$$.fragment);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 707, 10, 30119);
    			add_location(p, file, 708, 10, 30143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			mount_component(tabs, p, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabs_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				tabs_changes.$$scope = { dirty, ctx };
    			}

    			tabs.$set(tabs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			destroy_component(tabs);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(707:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (706:6) <Row>
    function create_default_slot_7(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(706:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (705:4) <Container class="text-left">
    function create_default_slot_6(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(705:4) <Container class=\\\"text-left\\\">",
    		ctx
    	});

    	return block;
    }

    // (704:2) <FullpageSection left>
    function create_default_slot_5(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-left",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(704:2) <FullpageSection left>",
    		ctx
    	});

    	return block;
    }

    // (752:8) <Col>
    function create_default_slot_4(ctx) {
    	let h1;
    	let span;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let t9;
    	let li4;
    	let a4;
    	let t11;
    	let li5;
    	let a5;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span = element("span");
    			span.textContent = "Quellen";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Svelte Doc";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Wikipedia Svelte";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Sapper";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Sapper";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Wikipedia Sappeur";
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "SvelteKit";
    			attr_dev(span, "class", "svelte-color svelte-7awd56");
    			add_location(span, file, 752, 14, 31410);
    			attr_dev(h1, "class", "svelte-7awd56");
    			add_location(h1, file, 752, 10, 31406);
    			attr_dev(a0, "href", "https://kit.svelte.dev/docs");
    			add_location(a0, file, 755, 14, 31503);
    			attr_dev(li0, "class", "svelte-7awd56");
    			add_location(li0, file, 754, 12, 31484);
    			attr_dev(a1, "href", "https://de.wikipedia.org/wiki/Svelte_(Framework)");
    			add_location(a1, file, 758, 14, 31605);
    			attr_dev(li1, "class", "svelte-7awd56");
    			add_location(li1, file, 757, 12, 31586);
    			attr_dev(a2, "href", "https://sapper.svelte.dev/docs/");
    			add_location(a2, file, 763, 14, 31766);
    			attr_dev(li2, "class", "svelte-7awd56");
    			add_location(li2, file, 762, 12, 31747);
    			attr_dev(a3, "href", "https://sapper.svelte.dev/docs.json");
    			add_location(a3, file, 766, 14, 31868);
    			attr_dev(li3, "class", "svelte-7awd56");
    			add_location(li3, file, 765, 12, 31849);
    			attr_dev(a4, "href", "https://de.wikipedia.org/wiki/Sappeur");
    			add_location(a4, file, 769, 14, 31974);
    			attr_dev(li4, "class", "svelte-7awd56");
    			add_location(li4, file, 768, 12, 31955);
    			attr_dev(a5, "href", "https://svelte.dev/blog/whats-the-deal-with-sveltekit");
    			add_location(a5, file, 774, 14, 32125);
    			attr_dev(li5, "class", "svelte-7awd56");
    			add_location(li5, file, 773, 12, 32106);
    			attr_dev(ul, "class", "svelte-7awd56");
    			add_location(ul, file, 753, 10, 31467);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t11);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(752:8) <Col>",
    		ctx
    	});

    	return block;
    }

    // (751:6) <Row>
    function create_default_slot_3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(col.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(col, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(751:6) <Row>",
    		ctx
    	});

    	return block;
    }

    // (750:4) <Container class="text-center">
    function create_default_slot_2(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(750:4) <Container class=\\\"text-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (749:2) <FullpageSection center>
    function create_default_slot_1(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				class: "text-center",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(749:2) <FullpageSection center>",
    		ctx
    	});

    	return block;
    }

    // (54:0) <Fullpage bind:activeSection arrows drag transitionDuration="10">
    function create_default_slot(ctx) {
    	let fullpagesection0;
    	let t0;
    	let fullpagesection1;
    	let t1;
    	let fullpagesection2;
    	let t2;
    	let fullpagesection3;
    	let t3;
    	let fullpagesection4;
    	let t4;
    	let fullpagesection5;
    	let t5;
    	let fullpagesection6;
    	let t6;
    	let fullpagesection7;
    	let t7;
    	let fullpagesection8;
    	let t8;
    	let fullpagesection9;
    	let t9;
    	let fullpagesection10;
    	let t10;
    	let fullpagesection11;
    	let t11;
    	let fullpagesection12;
    	let t12;
    	let fullpagesection13;
    	let t13;
    	let fullpagesection14;
    	let t14;
    	let fullpagesection15;
    	let t15;
    	let fullpagesection16;
    	let t16;
    	let fullpagesection17;
    	let t17;
    	let fullpagesection18;
    	let current;

    	fullpagesection0 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_97] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection1 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_93] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection2 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_89] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection3 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_84] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection4 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_79] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection5 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_74] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection6 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_69] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection7 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_65] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection8 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_61] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection9 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_56] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection10 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_51] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection11 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_47] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection12 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_43] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection13 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_38] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection14 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_34] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection15 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_30] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection16 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_26] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection17 = new FullpageSection({
    			props: {
    				left: true,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fullpagesection18 = new FullpageSection({
    			props: {
    				center: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fullpagesection0.$$.fragment);
    			t0 = space();
    			create_component(fullpagesection1.$$.fragment);
    			t1 = space();
    			create_component(fullpagesection2.$$.fragment);
    			t2 = space();
    			create_component(fullpagesection3.$$.fragment);
    			t3 = space();
    			create_component(fullpagesection4.$$.fragment);
    			t4 = space();
    			create_component(fullpagesection5.$$.fragment);
    			t5 = space();
    			create_component(fullpagesection6.$$.fragment);
    			t6 = space();
    			create_component(fullpagesection7.$$.fragment);
    			t7 = space();
    			create_component(fullpagesection8.$$.fragment);
    			t8 = space();
    			create_component(fullpagesection9.$$.fragment);
    			t9 = space();
    			create_component(fullpagesection10.$$.fragment);
    			t10 = space();
    			create_component(fullpagesection11.$$.fragment);
    			t11 = space();
    			create_component(fullpagesection12.$$.fragment);
    			t12 = space();
    			create_component(fullpagesection13.$$.fragment);
    			t13 = space();
    			create_component(fullpagesection14.$$.fragment);
    			t14 = space();
    			create_component(fullpagesection15.$$.fragment);
    			t15 = space();
    			create_component(fullpagesection16.$$.fragment);
    			t16 = space();
    			create_component(fullpagesection17.$$.fragment);
    			t17 = space();
    			create_component(fullpagesection18.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fullpagesection0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fullpagesection1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fullpagesection2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(fullpagesection3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fullpagesection4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(fullpagesection5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(fullpagesection6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(fullpagesection7, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(fullpagesection8, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(fullpagesection9, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(fullpagesection10, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(fullpagesection11, target, anchor);
    			insert_dev(target, t11, anchor);
    			mount_component(fullpagesection12, target, anchor);
    			insert_dev(target, t12, anchor);
    			mount_component(fullpagesection13, target, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(fullpagesection14, target, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(fullpagesection15, target, anchor);
    			insert_dev(target, t15, anchor);
    			mount_component(fullpagesection16, target, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(fullpagesection17, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(fullpagesection18, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fullpagesection0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				fullpagesection0_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection0.$set(fullpagesection0_changes);
    			const fullpagesection1_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection1_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection1.$set(fullpagesection1_changes);
    			const fullpagesection2_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				fullpagesection2_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection2.$set(fullpagesection2_changes);
    			const fullpagesection3_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection3_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection3.$set(fullpagesection3_changes);
    			const fullpagesection4_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection4_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection4.$set(fullpagesection4_changes);
    			const fullpagesection5_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection5_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection5.$set(fullpagesection5_changes);
    			const fullpagesection6_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection6_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection6.$set(fullpagesection6_changes);
    			const fullpagesection7_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection7_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection7.$set(fullpagesection7_changes);
    			const fullpagesection8_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				fullpagesection8_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection8.$set(fullpagesection8_changes);
    			const fullpagesection9_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection9_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection9.$set(fullpagesection9_changes);
    			const fullpagesection10_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection10_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection10.$set(fullpagesection10_changes);
    			const fullpagesection11_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				fullpagesection11_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection11.$set(fullpagesection11_changes);
    			const fullpagesection12_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection12_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection12.$set(fullpagesection12_changes);
    			const fullpagesection13_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection13_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection13.$set(fullpagesection13_changes);
    			const fullpagesection14_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				fullpagesection14_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection14.$set(fullpagesection14_changes);
    			const fullpagesection15_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection15_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection15.$set(fullpagesection15_changes);
    			const fullpagesection16_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpagesection16_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection16.$set(fullpagesection16_changes);
    			const fullpagesection17_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				fullpagesection17_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection17.$set(fullpagesection17_changes);
    			const fullpagesection18_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				fullpagesection18_changes.$$scope = { dirty, ctx };
    			}

    			fullpagesection18.$set(fullpagesection18_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullpagesection0.$$.fragment, local);
    			transition_in(fullpagesection1.$$.fragment, local);
    			transition_in(fullpagesection2.$$.fragment, local);
    			transition_in(fullpagesection3.$$.fragment, local);
    			transition_in(fullpagesection4.$$.fragment, local);
    			transition_in(fullpagesection5.$$.fragment, local);
    			transition_in(fullpagesection6.$$.fragment, local);
    			transition_in(fullpagesection7.$$.fragment, local);
    			transition_in(fullpagesection8.$$.fragment, local);
    			transition_in(fullpagesection9.$$.fragment, local);
    			transition_in(fullpagesection10.$$.fragment, local);
    			transition_in(fullpagesection11.$$.fragment, local);
    			transition_in(fullpagesection12.$$.fragment, local);
    			transition_in(fullpagesection13.$$.fragment, local);
    			transition_in(fullpagesection14.$$.fragment, local);
    			transition_in(fullpagesection15.$$.fragment, local);
    			transition_in(fullpagesection16.$$.fragment, local);
    			transition_in(fullpagesection17.$$.fragment, local);
    			transition_in(fullpagesection18.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullpagesection0.$$.fragment, local);
    			transition_out(fullpagesection1.$$.fragment, local);
    			transition_out(fullpagesection2.$$.fragment, local);
    			transition_out(fullpagesection3.$$.fragment, local);
    			transition_out(fullpagesection4.$$.fragment, local);
    			transition_out(fullpagesection5.$$.fragment, local);
    			transition_out(fullpagesection6.$$.fragment, local);
    			transition_out(fullpagesection7.$$.fragment, local);
    			transition_out(fullpagesection8.$$.fragment, local);
    			transition_out(fullpagesection9.$$.fragment, local);
    			transition_out(fullpagesection10.$$.fragment, local);
    			transition_out(fullpagesection11.$$.fragment, local);
    			transition_out(fullpagesection12.$$.fragment, local);
    			transition_out(fullpagesection13.$$.fragment, local);
    			transition_out(fullpagesection14.$$.fragment, local);
    			transition_out(fullpagesection15.$$.fragment, local);
    			transition_out(fullpagesection16.$$.fragment, local);
    			transition_out(fullpagesection17.$$.fragment, local);
    			transition_out(fullpagesection18.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fullpagesection0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fullpagesection1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fullpagesection2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(fullpagesection3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fullpagesection4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(fullpagesection5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(fullpagesection6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(fullpagesection7, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(fullpagesection8, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(fullpagesection9, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(fullpagesection10, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(fullpagesection11, detaching);
    			if (detaching) detach_dev(t11);
    			destroy_component(fullpagesection12, detaching);
    			if (detaching) detach_dev(t12);
    			destroy_component(fullpagesection13, detaching);
    			if (detaching) detach_dev(t13);
    			destroy_component(fullpagesection14, detaching);
    			if (detaching) detach_dev(t14);
    			destroy_component(fullpagesection15, detaching);
    			if (detaching) detach_dev(t15);
    			destroy_component(fullpagesection16, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(fullpagesection17, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(fullpagesection18, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(54:0) <Fullpage bind:activeSection arrows drag transitionDuration=\\\"10\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t0;
    	let label;
    	let input;
    	let t1;
    	let span;
    	let t2;
    	let fullpage;
    	let updating_activeSection;
    	let current;
    	let mounted;
    	let dispose;

    	function fullpage_activeSection_binding(value) {
    		/*fullpage_activeSection_binding*/ ctx[3](value);
    	}

    	let fullpage_props = {
    		arrows: true,
    		drag: true,
    		transitionDuration: "10",
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*activeSection*/ ctx[0] !== void 0) {
    		fullpage_props.activeSection = /*activeSection*/ ctx[0];
    	}

    	fullpage = new Fullpage({ props: fullpage_props, $$inline: true });
    	binding_callbacks.push(() => bind(fullpage, 'activeSection', fullpage_activeSection_binding));

    	const block = {
    		c: function create() {
    			t0 = space();
    			label = element("label");
    			input = element("input");
    			t1 = space();
    			span = element("span");
    			t2 = space();
    			create_component(fullpage.$$.fragment);
    			document.title = "Präsentation";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-7awd56");
    			add_location(input, file, 48, 2, 1492);
    			attr_dev(span, "class", "slider round svelte-7awd56");
    			add_location(span, file, 49, 2, 1539);
    			attr_dev(label, "class", "switch svelte-7awd56");
    			attr_dev(label, "id", "enable_long");
    			add_location(label, file, 47, 0, 1449);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = /*long*/ ctx[1];
    			append_dev(label, t1);
    			append_dev(label, span);
    			insert_dev(target, t2, anchor);
    			mount_component(fullpage, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*long*/ 2) {
    				input.checked = /*long*/ ctx[1];
    			}

    			const fullpage_changes = {};

    			if (dirty & /*$$scope, long*/ 130) {
    				fullpage_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_activeSection && dirty & /*activeSection*/ 1) {
    				updating_activeSection = true;
    				fullpage_changes.activeSection = /*activeSection*/ ctx[0];
    				add_flush_callback(() => updating_activeSection = false);
    			}

    			fullpage.$set(fullpage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t2);
    			destroy_component(fullpage, detaching);
    			mounted = false;
    			dispose();
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
    	const sections = ["WhatIsSvelte", "Advantages", "Disadvantages", "Code", "Sapper"];

    	//Have to set to 0 (or section you wish to display as default), otherwise section will not display
    	let activeSection = 0;

    	//Same mechanics as in sections
    	const slides = [
    		"Compiler vs. Virtuelles DOM",
    		"Leichtgewichtig & Performant",
    		"Weniger Boilerplate",
    		"Wirklich reaktiv",
    		"Niedrige Lernkurve",
    		"Komponenten-Muster",
    		"Eingebaute Animationen und Effekte",
    		"Eingebauter reaktiver Speicher",
    		"Mehrere Ausgabeziele"
    	];

    	//Also has to be 0 or specific id of slide
    	let activeSlide = 0;

    	let long = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		long = this.checked;
    		$$invalidate(1, long);
    	}

    	function fullpage_activeSection_binding(value) {
    		activeSection = value;
    		$$invalidate(0, activeSection);
    	}

    	$$self.$capture_state = () => ({
    		Fullpage,
    		FullpageSection,
    		FullpageSlide,
    		Container,
    		Row,
    		Col,
    		Tabs,
    		Tab,
    		TabList,
    		TabPanel,
    		Content,
    		code,
    		Counter,
    		TwoWayBinding,
    		ComponentsOuter,
    		Motion,
    		Example,
    		Templates,
    		sections,
    		activeSection,
    		slides,
    		activeSlide,
    		long
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeSection' in $$props) $$invalidate(0, activeSection = $$props.activeSection);
    		if ('activeSlide' in $$props) activeSlide = $$props.activeSlide;
    		if ('long' in $$props) $$invalidate(1, long = $$props.long);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeSection, long, input_change_handler, fullpage_activeSection_binding];
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

}());
//# sourceMappingURL=bundle.js.map
