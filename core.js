(function($) {
    $.transit = {version: "0.9.9",propertyMap: {marginLeft: "margin",marginRight: "margin",marginBottom: "margin",marginTop: "margin",paddingLeft: "padding",paddingRight: "padding",paddingBottom: "padding",paddingTop: "padding"},enabled: true,useTransitionEnd: false};
    var div = document.createElement("div");
    var support = {};
    function getVendorPropertyName(prop) {
        if (prop in div.style)
            return prop;
        var prefixes = ["Moz", "Webkit", "O", "ms"];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);
        if (prop in div.style) {
            return prop
        }
        for (var i = 0; i < prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) {
                return vendorProp
            }
        }
    }
    function checkTransform3dSupport() {
        div.style[support.transform] = "";
        div.style[support.transform] = "rotateY(90deg)";
        return div.style[support.transform] !== ""
    }
    var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    support.transition = getVendorPropertyName("transition");
    support.transitionDelay = getVendorPropertyName("transitionDelay");
    support.transform = getVendorPropertyName("transform");
    support.transformOrigin = getVendorPropertyName("transformOrigin");
    support.transform3d = checkTransform3dSupport();
    var eventNames = {transition: "transitionEnd",MozTransition: "transitionend",OTransition: "oTransitionEnd",WebkitTransition: "webkitTransitionEnd",msTransition: "MSTransitionEnd"};
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;
    for (var key in support) {
        if (support.hasOwnProperty(key) && typeof $.support[key] === "undefined") {
            $.support[key] = support[key]
        }
    }
    div = null;
    $.cssEase = {_default: "ease","in": "ease-in",out: "ease-out","in-out": "ease-in-out",snap: "cubic-bezier(0,1,.5,1)",easeOutCubic: "cubic-bezier(.215,.61,.355,1)",easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",easeInCirc: "cubic-bezier(.6,.04,.98,.335)",easeOutCirc: "cubic-bezier(.075,.82,.165,1)",easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",easeInExpo: "cubic-bezier(.95,.05,.795,.035)",easeOutExpo: "cubic-bezier(.19,1,.22,1)",easeInOutExpo: "cubic-bezier(1,0,0,1)",easeInQuad: "cubic-bezier(.55,.085,.68,.53)",easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",easeInQuart: "cubic-bezier(.895,.03,.685,.22)",easeOutQuart: "cubic-bezier(.165,.84,.44,1)",easeInOutQuart: "cubic-bezier(.77,0,.175,1)",easeInQuint: "cubic-bezier(.755,.05,.855,.06)",easeOutQuint: "cubic-bezier(.23,1,.32,1)",easeInOutQuint: "cubic-bezier(.86,0,.07,1)",easeInSine: "cubic-bezier(.47,0,.745,.715)",easeOutSine: "cubic-bezier(.39,.575,.565,1)",easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",easeInBack: "cubic-bezier(.6,-.28,.735,.045)",easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"};
    $.cssHooks["transit:transform"] = {get: function(elem) {
            return $(elem).data("transform") || new Transform
        },set: function(elem, v) {
            var value = v;
            if (!(value instanceof Transform)) {
                value = new Transform(value)
            }
            if (support.transform === "WebkitTransform" && !isChrome) {
                elem.style[support.transform] = value.toString(true)
            } else {
                elem.style[support.transform] = value.toString()
            }
            $(elem).data("transform", value)
        }};
    $.cssHooks.transform = {set: $.cssHooks["transit:transform"].set};
    if ($.fn.jquery < "1.8") {
        $.cssHooks.transformOrigin = {get: function(elem) {
                return elem.style[support.transformOrigin]
            },set: function(elem, value) {
                elem.style[support.transformOrigin] = value
            }};
        $.cssHooks.transition = {get: function(elem) {
                return elem.style[support.transition]
            },set: function(elem, value) {
                elem.style[support.transition] = value
            }}
    }
    registerCssHook("scale");
    registerCssHook("translate");
    registerCssHook("rotate");
    registerCssHook("rotateX");
    registerCssHook("rotateY");
    registerCssHook("rotate3d");
    registerCssHook("perspective");
    registerCssHook("skewX");
    registerCssHook("skewY");
    registerCssHook("x", true);
    registerCssHook("y", true);
    function Transform(str) {
        if (typeof str === "string") {
            this.parse(str)
        }
        return this
    }
    Transform.prototype = {setFromString: function(prop, val) {
            var args = typeof val === "string" ? val.split(",") : val.constructor === Array ? val : [val];
            args.unshift(prop);
            Transform.prototype.set.apply(this, args)
        },set: function(prop) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[prop]) {
                this.setter[prop].apply(this, args)
            } else {
                this[prop] = args.join(",")
            }
        },get: function(prop) {
            if (this.getter[prop]) {
                return this.getter[prop].apply(this)
            } else {
                return this[prop] || 0
            }
        },setter: {rotate: function(theta) {
                this.rotate = unit(theta, "deg")
            },rotateX: function(theta) {
                this.rotateX = unit(theta, "deg")
            },rotateY: function(theta) {
                this.rotateY = unit(theta, "deg")
            },scale: function(x, y) {
                if (y === undefined) {
                    y = x
                }
                this.scale = x + "," + y
            },skewX: function(x) {
                this.skewX = unit(x, "deg")
            },skewY: function(y) {
                this.skewY = unit(y, "deg")
            },perspective: function(dist) {
                this.perspective = unit(dist, "px")
            },x: function(x) {
                this.set("translate", x, null)
            },y: function(y) {
                this.set("translate", null, y)
            },translate: function(x, y) {
                if (this._translateX === undefined) {
                    this._translateX = 0
                }
                if (this._translateY === undefined) {
                    this._translateY = 0
                }
                if (x !== null && x !== undefined) {
                    this._translateX = unit(x, "px")
                }
                if (y !== null && y !== undefined) {
                    this._translateY = unit(y, "px")
                }
                this.translate = this._translateX + "," + this._translateY
            }},getter: {x: function() {
                return this._translateX || 0
            },y: function() {
                return this._translateY || 0
            },scale: function() {
                var s = (this.scale || "1,1").split(",");
                if (s[0]) {
                    s[0] = parseFloat(s[0])
                }
                if (s[1]) {
                    s[1] = parseFloat(s[1])
                }
                return s[0] === s[1] ? s[0] : s
            },rotate3d: function() {
                var s = (this.rotate3d || "0,0,0,0deg").split(",");
                for (var i = 0; i <= 3; ++i) {
                    if (s[i]) {
                        s[i] = parseFloat(s[i])
                    }
                }
                if (s[3]) {
                    s[3] = unit(s[3], "deg")
                }
                return s
            }},parse: function(str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(x, prop, val) {
                self.setFromString(prop, val)
            })
        },toString: function(use3d) {
            var re = [];
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    if (!support.transform3d && (i === "rotateX" || i === "rotateY" || i === "perspective" || i === "transformOrigin")) {
                        continue
                    }
                    if (i[0] !== "_") {
                        if (use3d && i === "scale") {
                            re.push(i + "3d(" + this[i] + ",1)")
                        } else if (use3d && i === "translate") {
                            re.push(i + "3d(" + this[i] + ",0)")
                        } else {
                            re.push(i + "(" + this[i] + ")")
                        }
                    }
                }
            }
            return re.join(" ")
        }};
    function callOrQueue(self, queue, fn) {
        if (queue === true) {
            self.queue(fn)
        } else if (queue) {
            self.queue(queue, fn)
        } else {
            fn()
        }
    }
    function getProperties(props) {
        var re = [];
        $.each(props, function(key) {
            key = $.camelCase(key);
            key = $.transit.propertyMap[key] || $.cssProps[key] || key;
            key = uncamel(key);
            if ($.inArray(key, re) === -1) {
                re.push(key)
            }
        });
        return re
    }
    function getTransition(properties, duration, easing, delay) {
        var props = getProperties(properties);
        if ($.cssEase[easing]) {
            easing = $.cssEase[easing]
        }
        var attribs = "" + toMS(duration) + " " + easing;
        if (parseInt(delay, 10) > 0) {
            attribs += " " + toMS(delay)
        }
        var transitions = [];
        $.each(props, function(i, name) {
            transitions.push(name + " " + attribs)
        });
        return transitions.join(", ")
    }
    $.fn.transition = $.fn.transit = function(properties, duration, easing, callback) {
        var self = this;
        var delay = 0;
        var queue = true;
        if (typeof duration === "function") {
            callback = duration;
            duration = undefined
        }
        if (typeof easing === "function") {
            callback = easing;
            easing = undefined
        }
        if (typeof properties.easing !== "undefined") {
            easing = properties.easing;
            delete properties.easing
        }
        if (typeof properties.duration !== "undefined") {
            duration = properties.duration;
            delete properties.duration
        }
        if (typeof properties.complete !== "undefined") {
            callback = properties.complete;
            delete properties.complete
        }
        if (typeof properties.queue !== "undefined") {
            queue = properties.queue;
            delete properties.queue
        }
        if (typeof properties.delay !== "undefined") {
            delay = properties.delay;
            delete properties.delay
        }
        if (typeof duration === "undefined") {
            duration = $.fx.speeds._default
        }
        if (typeof easing === "undefined") {
            easing = $.cssEase._default
        }
        duration = toMS(duration);
        var transitionValue = getTransition(properties, duration, easing, delay);
        var work = $.transit.enabled && support.transition;
        var i = work ? parseInt(duration, 10) + parseInt(delay, 10) : 0;
        if (i === 0) {
            var fn = function(next) {
                self.css(properties);
                if (callback) {
                    callback.apply(self)
                }
                if (next) {
                    next()
                }
            };
            callOrQueue(self, queue, fn);
            return self
        }
        var oldTransitions = {};
        var run = function(nextCall) {
            var bound = false;
            var cb = function() {
                if (bound) {
                    self.unbind(transitionEnd, cb)
                }
                if (i > 0) {
                    self.each(function() {
                        this.style[support.transition] = oldTransitions[this] || null
                    })
                }
                if (typeof callback === "function") {
                    callback.apply(self)
                }
                if (typeof nextCall === "function") {
                    nextCall()
                }
            };
            if (i > 0 && transitionEnd && $.transit.useTransitionEnd) {
                bound = true;
                self.bind(transitionEnd, cb)
            } else {
                window.setTimeout(cb, i)
            }
            self.each(function() {
                if (i > 0) {
                    this.style[support.transition] = transitionValue
                }
                $(this).css(properties)
            })
        };
        var deferredRun = function(next) {
            this.offsetWidth;
            run(next)
        };
        callOrQueue(self, queue, deferredRun);
        return this
    };
    function registerCssHook(prop, isPixels) {
        if (!isPixels) {
            $.cssNumber[prop] = true
        }
        $.transit.propertyMap[prop] = support.transform;
        $.cssHooks[prop] = {get: function(elem) {
                var t = $(elem).css("transit:transform");
                return t.get(prop)
            },set: function(elem, value) {
                var t = $(elem).css("transit:transform");
                t.setFromString(prop, value);
                $(elem).css({"transit:transform": t})
            }}
    }
    function uncamel(str) {
        return str.replace(/([A-Z])/g, function(letter) {
            return "-" + letter.toLowerCase()
        })
    }
    function unit(i, units) {
        if (typeof i === "string" && !i.match(/^[\-0-9\.]+$/)) {
            return i
        } else {
            return "" + i + units
        }
    }
    function toMS(duration) {
        var i = duration;
        if ($.fx.speeds[i]) {
            i = $.fx.speeds[i]
        }
        return unit(i, "ms")
    }
    $.transit.getTransitionValue = getTransition
})(jQuery);
(function(factory) {
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define(["jquery"], factory)
    } else {
        factory(jQuery)
    }
})(function($) {
    var pluses = /\+/g;
    function raw(s) {
        return s
    }
    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, " "))
    }
    function converted(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
        }
        try {
            return config.json ? JSON.parse(s) : s
        } catch (er) {
        }
    }
    var config = $.cookie = function(key, value, options) {
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === "number") {
                var days = options.expires, t = options.expires = new Date;
                t.setDate(t.getDate() + days)
            }
            value = config.json ? JSON.stringify(value) : String(value);
            return document.cookie = [encodeURIComponent(key), "=", config.raw ? value : encodeURIComponent(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join("")
        }
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split("; ");
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split("=");
            var name = decode(parts.shift());
            var cookie = decode(parts.join("="));
            if (key && key === name) {
                result = converted(cookie);
                break
            }
            if (!key) {
                result[name] = converted(cookie)
            }
        }
        return result
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) !== undefined) {
            $.cookie(key, "", $.extend(options, {expires: -1}));
            return true
        }
        return false
    }
});
!function(window, document, undefined) {
    var prefixes = ["webkit", "Moz", "ms", "O"], animations = {}, useCssAnimations;
    function createEl(tag, prop) {
        var el = document.createElement(tag || "div"), n;
        for (n in prop)
            el[n] = prop[n];
        return el
    }
    function ins(parent) {
        for (var i = 1, n = arguments.length; i < n; i++)
            parent.appendChild(arguments[i]);
        return parent
    }
    var sheet = function() {
        var el = createEl("style", {type: "text/css"});
        ins(document.getElementsByTagName("head")[0], el);
        return el.sheet || el.styleSheet
    }();
    function addAnimation(alpha, trail, i, lines) {
        var name = ["opacity", trail, ~~(alpha * 100), i, lines].join("-"), start = .01 + i / lines * 100, z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha), prefix = useCssAnimations.substring(0, useCssAnimations.indexOf("Animation")).toLowerCase(), pre = prefix && "-" + prefix + "-" || "";
        if (!animations[name]) {
            sheet.insertRule("@" + pre + "keyframes " + name + "{" + "0%{opacity:" + z + "}" + start + "%{opacity:" + alpha + "}" + (start + .01) + "%{opacity:1}" + (start + trail) % 100 + "%{opacity:" + alpha + "}" + "100%{opacity:" + z + "}" + "}", sheet.cssRules.length);
            animations[name] = 1
        }
        return name
    }
    function vendor(el, prop) {
        var s = el.style, pp, i;
        if (s[prop] !== undefined)
            return prop;
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i] + prop;
            if (s[pp] !== undefined)
                return pp
        }
    }
    function css(el, prop) {
        for (var n in prop)
            el.style[vendor(el, n) || n] = prop[n];
        return el
    }
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var n in def)
                if (obj[n] === undefined)
                    obj[n] = def[n]
        }
        return obj
    }
    function pos(el) {
        var o = {x: el.offsetLeft,y: el.offsetTop};
        while (el = el.offsetParent)
            o.x += el.offsetLeft, o.y += el.offsetTop;
        return o
    }
    var defaults = {lines: 12,length: 7,width: 5,radius: 10,rotate: 0,corners: 1,color: "#000",speed: 1,trail: 100,opacity: 1 / 4,fps: 20,zIndex: 2e9,className: "spinner",top: "auto",left: "auto",position: "relative"};
    var Spinner = function Spinner(o) {
        if (!this.spin)
            return new Spinner(o);
        this.opts = merge(o || {}, Spinner.defaults, defaults)
    };
    Spinner.defaults = {};
    merge(Spinner.prototype, {spin: function(target) {
            this.stop();
            var self = this, o = self.opts, el = self.el = css(createEl(0, {className: o.className}), {position: o.position,width: 0,zIndex: o.zIndex}), mid = o.radius + o.length + o.width, ep, tp;
            if (target) {
                target.insertBefore(el, target.firstChild || null);
                tp = pos(target);
                ep = pos(el);
                css(el, {left: (o.left == "auto" ? tp.x - ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + "px",top: (o.top == "auto" ? tp.y - ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid) + "px"})
            }
            el.setAttribute("aria-role", "progressbar");
            self.lines(el, self.opts);
            if (!useCssAnimations) {
                var i = 0, fps = o.fps, f = fps / o.speed, ostep = (1 - o.opacity) / (f * o.trail / 100), astep = f / o.lines;
                (function anim() {
                    i++;
                    for (var s = o.lines; s; s--) {
                        var alpha = Math.max(1 - (i + s * astep) % f * ostep, o.opacity);
                        self.opacity(el, o.lines - s, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1e3 / fps))
                })()
            }
            return self
        },stop: function() {
            var el = this.el;
            if (el) {
                clearTimeout(this.timeout);
                if (el.parentNode)
                    el.parentNode.removeChild(el);
                this.el = undefined
            }
            return this
        },lines: function(el, o) {
            var i = 0, seg;
            function fill(color, shadow) {
                return css(createEl(), {position: "absolute",width: o.length + o.width + "px",height: o.width + "px",background: color,boxShadow: shadow,transformOrigin: "left",transform: "rotate(" + ~~(360 / o.lines * i + o.rotate) + "deg) translate(" + o.radius + "px" + ",0)",borderRadius: (o.corners * o.width >> 1) + "px"})
            }
            for (; i < o.lines; i++) {
                seg = css(createEl(), {position: "absolute",top: 1 + ~(o.width / 2) + "px",transform: o.hwaccel ? "translate3d(0,0,0)" : "",opacity: o.opacity,animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + " " + 1 / o.speed + "s linear infinite"});
                if (o.shadow)
                    ins(seg, css(fill("#000", "0 0 4px " + "#000"), {top: 2 + "px"}));
                ins(el, ins(seg, fill(o.color, "0 0 1px rgba(0,0,0,.1)")))
            }
            return el
        },opacity: function(el, i, val) {
            if (i < el.childNodes.length)
                el.childNodes[i].style.opacity = val
        }});
    (function() {
        function vml(tag, attr) {
            return createEl("<" + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }
        var s = css(createEl("group"), {behavior: "url(#default#VML)"});
        if (!vendor(s, "transform") && s.adj) {
            sheet.addRule(".spin-vml", "behavior:url(#default#VML)");
            Spinner.prototype.lines = function(el, o) {
                var r = o.length + o.width, s = 2 * r;
                function grp() {
                    return css(vml("group", {coordsize: s + " " + s,coordorigin: -r + " " + -r}), {width: s,height: s})
                }
                var margin = -(o.width + o.length) * 2 + "px", g = css(grp(), {position: "absolute",top: margin,left: margin}), i;
                function seg(i, dx, filter) {
                    ins(g, ins(css(grp(), {rotation: 360 / o.lines * i + "deg",left: ~~dx}), ins(css(vml("roundrect", {arcsize: o.corners}), {width: r,height: o.width,left: o.radius,top: -o.width >> 1,filter: filter}), vml("fill", {color: o.color,opacity: o.opacity}), vml("stroke", {opacity: 0}))))
                }
                if (o.shadow)
                    for (i = 1; i <= o.lines; i++)
                        seg(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
                for (i = 1; i <= o.lines; i++)
                    seg(i);
                return ins(el, g)
            };
            Spinner.prototype.opacity = function(el, i, val, o) {
                var c = el.firstChild;
                o = o.shadow && o.lines || 0;
                if (c && i + o < c.childNodes.length) {
                    c = c.childNodes[i + o];
                    c = c && c.firstChild;
                    c = c && c.firstChild;
                    if (c)
                        c.opacity = val
                }
            }
        } else
            useCssAnimations = vendor(s, "animation")
    })();
    if (typeof define == "function" && define.amd)
        define(function() {
            return Spinner
        });
    else
        window.Spinner = Spinner
}(window, document);
(function(undefined) {
    var moment, VERSION = "1.7.2", round = Math.round, i, languages = {}, currentLanguage = "en", hasModule = typeof module !== "undefined" && module.exports, langConfigProperties = "months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"), aspNetJsonRegex = /^\/?Date\((\-?\d+)/i, formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?)/g, parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi, parseTokenOneOrTwoDigits = /\d\d?/, parseTokenOneToThreeDigits = /\d{1,3}/, parseTokenThreeDigits = /\d{3}/, parseTokenFourDigits = /\d{1,4}/, parseTokenWord = /[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i, parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, parseTokenT = /T/i, isoRegex = /^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, isoFormat = "YYYY-MM-DDTHH:mm:ssZ", isoTimes = [["HH:mm:ss.S", /T\d\d:\d\d:\d\d\.\d{1,3}/], ["HH:mm:ss", /T\d\d:\d\d:\d\d/], ["HH:mm", /T\d\d:\d\d/], ["HH", /T\d\d/]], parseTimezoneChunker = /([\+\-]|\d\d)/gi, proxyGettersAndSetters = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"), unitMillisecondFactors = {Milliseconds: 1,Seconds: 1e3,Minutes: 6e4,Hours: 36e5,Days: 864e5,Months: 2592e6,Years: 31536e6}, formatFunctions = {}, ordinalizeTokens = "DDD w M D d".split(" "), paddedTokens = "M D H h m s w".split(" "), formatTokenFunctions = {M: function() {
            return this.month() + 1
        },MMM: function(format) {
            return getValueFromArray("monthsShort", this.month(), this, format)
        },MMMM: function(format) {
            return getValueFromArray("months", this.month(), this, format)
        },D: function() {
            return this.date()
        },DDD: function() {
            var a = new Date(this.year(), this.month(), this.date()), b = new Date(this.year(), 0, 1);
            return ~~((a - b) / 864e5 + 1.5)
        },d: function() {
            return this.day()
        },dd: function(format) {
            return getValueFromArray("weekdaysMin", this.day(), this, format)
        },ddd: function(format) {
            return getValueFromArray("weekdaysShort", this.day(), this, format)
        },dddd: function(format) {
            return getValueFromArray("weekdays", this.day(), this, format)
        },w: function() {
            var a = new Date(this.year(), this.month(), this.date() - this.day() + 5), b = new Date(a.getFullYear(), 0, 4);
            return ~~((a - b) / 864e5 / 7 + 1.5)
        },YY: function() {
            return leftZeroFill(this.year() % 100, 2)
        },YYYY: function() {
            return leftZeroFill(this.year(), 4)
        },a: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), true)
        },A: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), false)
        },H: function() {
            return this.hours()
        },h: function() {
            return this.hours() % 12 || 12
        },m: function() {
            return this.minutes()
        },s: function() {
            return this.seconds()
        },S: function() {
            return ~~(this.milliseconds() / 100)
        },SS: function() {
            return leftZeroFill(~~(this.milliseconds() / 10), 2)
        },SSS: function() {
            return leftZeroFill(this.milliseconds(), 3)
        },Z: function() {
            var a = -this.zone(), b = "+";
            if (a < 0) {
                a = -a;
                b = "-"
            }
            return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2)
        },ZZ: function() {
            var a = -this.zone(), b = "+";
            if (a < 0) {
                a = -a;
                b = "-"
            }
            return b + leftZeroFill(~~(10 * a / 6), 4)
        }};
    function getValueFromArray(key, index, m, format) {
        var lang = m.lang();
        return lang[key].call ? lang[key](m, format) : lang[key][index]
    }
    function padToken(func, count) {
        return function(a) {
            return leftZeroFill(func.call(this, a), count)
        }
    }
    function ordinalizeToken(func) {
        return function(a) {
            var b = func.call(this, a);
            return b + this.lang().ordinal(b)
        }
    }
    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + "o"] = ordinalizeToken(formatTokenFunctions[i])
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2)
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
    function Moment(date, isUTC, lang) {
        this._d = date;
        this._isUTC = !!isUTC;
        this._a = date._a || null;
        this._lang = lang || false
    }
    function Duration(duration) {
        var data = this._data = {}, years = duration.years || duration.y || 0, months = duration.months || duration.M || 0, weeks = duration.weeks || duration.w || 0, days = duration.days || duration.d || 0, hours = duration.hours || duration.h || 0, minutes = duration.minutes || duration.m || 0, seconds = duration.seconds || duration.s || 0, milliseconds = duration.milliseconds || duration.ms || 0;
        this._milliseconds = milliseconds + seconds * 1e3 + minutes * 6e4 + hours * 36e5;
        this._days = days + weeks * 7;
        this._months = months + years * 12;
        data.milliseconds = milliseconds % 1e3;
        seconds += absRound(milliseconds / 1e3);
        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);
        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);
        data.hours = hours % 24;
        days += absRound(hours / 24);
        days += weeks * 7;
        data.days = days % 30;
        months += absRound(days / 30);
        data.months = months % 12;
        years += absRound(months / 12);
        data.years = years;
        this._lang = false
    }
    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number)
        } else {
            return Math.floor(number)
        }
    }
    function leftZeroFill(number, targetLength) {
        var output = number + "";
        while (output.length < targetLength) {
            output = "0" + output
        }
        return output
    }
    function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
        var ms = duration._milliseconds, d = duration._days, M = duration._months, currentDate;
        if (ms) {
            mom._d.setTime(+mom + ms * isAdding)
        }
        if (d) {
            mom.date(mom.date() + d * isAdding)
        }
        if (M) {
            currentDate = mom.date();
            mom.date(1).month(mom.month() + M * isAdding).date(Math.min(currentDate, mom.daysInMonth()))
        }
    }
    function isArray(input) {
        return Object.prototype.toString.call(input) === "[object Array]"
    }
    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
        for (i = 0; i < len; i++) {
            if (~~array1[i] !== ~~array2[i]) {
                diffs++
            }
        }
        return diffs + lengthDiff
    }
    function dateFromArray(input, asUTC, hoursOffset, minutesOffset) {
        var i, date, forValid = [];
        for (i = 0; i < 7; i++) {
            forValid[i] = input[i] = input[i] == null ? i === 2 ? 1 : 0 : input[i]
        }
        input[7] = forValid[7] = asUTC;
        if (input[8] != null) {
            forValid[8] = input[8]
        }
        input[3] += hoursOffset || 0;
        input[4] += minutesOffset || 0;
        date = new Date(0);
        if (asUTC) {
            date.setUTCFullYear(input[0], input[1], input[2]);
            date.setUTCHours(input[3], input[4], input[5], input[6])
        } else {
            date.setFullYear(input[0], input[1], input[2]);
            date.setHours(input[3], input[4], input[5], input[6])
        }
        date._a = forValid;
        return date
    }
    function loadLang(key, values) {
        var i, m, parse = [];
        if (!values && hasModule) {
            values = require("./lang/" + key)
        }
        for (i = 0; i < langConfigProperties.length; i++) {
            values[langConfigProperties[i]] = values[langConfigProperties[i]] || languages.en[langConfigProperties[i]]
        }
        for (i = 0; i < 12; i++) {
            m = moment([2e3, i]);
            parse[i] = new RegExp("^" + (values.months[i] || values.months(m, "")) + "|^" + (values.monthsShort[i] || values.monthsShort(m, "")).replace(".", ""), "i")
        }
        values.monthsParse = values.monthsParse || parse;
        languages[key] = values;
        return values
    }
    function getLangDefinition(m) {
        var langKey = typeof m === "string" && m || m && m._lang || null;
        return langKey ? languages[langKey] || loadLang(langKey) : moment
    }
    function removeFormattingTokens(input) {
        if (input.match(/\[.*\]/)) {
            return input.replace(/^\[|\]$/g, "")
        }
        return input.replace(/\\/g, "")
    }
    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;
        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]]
            } else {
                array[i] = removeFormattingTokens(array[i])
            }
        }
        return function(mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += typeof array[i].call === "function" ? array[i].call(mom, format) : array[i]
            }
            return output
        }
    }
    function formatMoment(m, format) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
            return m.lang().longDateFormat[input] || input
        }
        while (i-- && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens)
        }
        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format)
        }
        return formatFunctions[format](m)
    }
    function getParseRegexForToken(token) {
        switch (token) {
            case "DDDD":
                return parseTokenThreeDigits;
            case "YYYY":
                return parseTokenFourDigits;
            case "S":
            case "SS":
            case "SSS":
            case "DDD":
                return parseTokenOneToThreeDigits;
            case "MMM":
            case "MMMM":
            case "dd":
            case "ddd":
            case "dddd":
            case "a":
            case "A":
                return parseTokenWord;
            case "Z":
            case "ZZ":
                return parseTokenTimezone;
            case "T":
                return parseTokenT;
            case "MM":
            case "DD":
            case "YY":
            case "HH":
            case "hh":
            case "mm":
            case "ss":
            case "M":
            case "D":
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
                return parseTokenOneOrTwoDigits;
            default:
                return new RegExp(token.replace("\\", ""))
        }
    }
    function addTimeToArrayFromToken(token, input, datePartArray, config) {
        var a, b;
        switch (token) {
            case "M":
            case "MM":
                datePartArray[1] = input == null ? 0 : ~~input - 1;
                break;
            case "MMM":
            case "MMMM":
                for (a = 0; a < 12; a++) {
                    if (getLangDefinition().monthsParse[a].test(input)) {
                        datePartArray[1] = a;
                        b = true;
                        break
                    }
                }
                if (!b) {
                    datePartArray[8] = false
                }
                break;
            case "D":
            case "DD":
            case "DDD":
            case "DDDD":
                if (input != null) {
                    datePartArray[2] = ~~input
                }
                break;
            case "YY":
                datePartArray[0] = ~~input + (~~input > 70 ? 1900 : 2e3);
                break;
            case "YYYY":
                datePartArray[0] = ~~Math.abs(input);
                break;
            case "a":
            case "A":
                config.isPm = (input + "").toLowerCase() === "pm";
                break;
            case "H":
            case "HH":
            case "h":
            case "hh":
                datePartArray[3] = ~~input;
                break;
            case "m":
            case "mm":
                datePartArray[4] = ~~input;
                break;
            case "s":
            case "ss":
                datePartArray[5] = ~~input;
                break;
            case "S":
            case "SS":
            case "SSS":
                datePartArray[6] = ~~(("0." + input) * 1e3);
                break;
            case "Z":
            case "ZZ":
                config.isUTC = true;
                a = (input + "").match(parseTimezoneChunker);
                if (a && a[1]) {
                    config.tzh = ~~a[1]
                }
                if (a && a[2]) {
                    config.tzm = ~~a[2]
                }
                if (a && a[0] === "+") {
                    config.tzh = -config.tzh;
                    config.tzm = -config.tzm
                }
                break
        }
        if (input == null) {
            datePartArray[8] = false
        }
    }
    function makeDateFromStringAndFormat(string, format) {
        var datePartArray = [0, 0, 1, 0, 0, 0, 0], config = {tzh: 0,tzm: 0}, tokens = format.match(formattingTokens), i, parsedInput;
        for (i = 0; i < tokens.length; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            if (parsedInput) {
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length)
            }
            if (formatTokenFunctions[tokens[i]]) {
                addTimeToArrayFromToken(tokens[i], parsedInput, datePartArray, config)
            }
        }
        if (config.isPm && datePartArray[3] < 12) {
            datePartArray[3] += 12
        }
        if (config.isPm === false && datePartArray[3] === 12) {
            datePartArray[3] = 0
        }
        return dateFromArray(datePartArray, config.isUTC, config.tzh, config.tzm)
    }
    function makeDateFromStringAndArray(string, formats) {
        var output, inputParts = string.match(parseMultipleFormatChunker) || [], formattedInputParts, scoreToBeat = 99, i, currentDate, currentScore;
        for (i = 0; i < formats.length; i++) {
            currentDate = makeDateFromStringAndFormat(string, formats[i]);
            formattedInputParts = formatMoment(new Moment(currentDate), formats[i]).match(parseMultipleFormatChunker) || [];
            currentScore = compareArrays(inputParts, formattedInputParts);
            if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                output = currentDate
            }
        }
        return output
    }
    function makeDateFromString(string) {
        var format = "YYYY-MM-DDT", i;
        if (isoRegex.exec(string)) {
            for (i = 0; i < 4; i++) {
                if (isoTimes[i][1].exec(string)) {
                    format += isoTimes[i][0];
                    break
                }
            }
            return parseTokenTimezone.exec(string) ? makeDateFromStringAndFormat(string, format + " Z") : makeDateFromStringAndFormat(string, format)
        }
        return new Date(string)
    }
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        var rt = lang.relativeTime[string];
        return typeof rt === "function" ? rt(number || 1, !!withoutSuffix, string, isFuture) : rt.replace(/%d/i, number || 1)
    }
    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1e3), minutes = round(seconds / 60), hours = round(minutes / 60), days = round(hours / 24), years = round(days / 365), args = seconds < 45 && ["s", seconds] || minutes === 1 && ["m"] || minutes < 45 && ["mm", minutes] || hours === 1 && ["h"] || hours < 22 && ["hh", hours] || days === 1 && ["d"] || days <= 25 && ["dd", days] || days <= 45 && ["M"] || days < 345 && ["MM", round(days / 30)] || years === 1 && ["y"] || ["yy", years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args)
    }
    moment = function(input, format) {
        if (input === null || input === "") {
            return null
        }
        var date, matched;
        if (moment.isMoment(input)) {
            return new Moment(new Date(+input._d), input._isUTC, input._lang)
        } else if (format) {
            if (isArray(format)) {
                date = makeDateFromStringAndArray(input, format)
            } else {
                date = makeDateFromStringAndFormat(input, format)
            }
        } else {
            matched = aspNetJsonRegex.exec(input);
            date = input === undefined ? new Date : matched ? new Date(+matched[1]) : input instanceof Date ? input : isArray(input) ? dateFromArray(input) : typeof input === "string" ? makeDateFromString(input) : new Date(input)
        }
        return new Moment(date)
    };
    moment.utc = function(input, format) {
        if (isArray(input)) {
            return new Moment(dateFromArray(input, true), true)
        }
        if (typeof input === "string" && !parseTokenTimezone.exec(input)) {
            input += " +0000";
            if (format) {
                format += " Z"
            }
        }
        return moment(input, format).utc()
    };
    moment.unix = function(input) {
        return moment(input * 1e3)
    };
    moment.duration = function(input, key) {
        var isDuration = moment.isDuration(input), isNumber = typeof input === "number", duration = isDuration ? input._data : isNumber ? {} : input, ret;
        if (isNumber) {
            if (key) {
                duration[key] = input
            } else {
                duration.milliseconds = input
            }
        }
        ret = new Duration(duration);
        if (isDuration) {
            ret._lang = input._lang
        }
        return ret
    };
    moment.humanizeDuration = function(num, type, withSuffix) {
        return moment.duration(num, type === true ? null : type).humanize(type === true ? true : withSuffix)
    };
    moment.version = VERSION;
    moment.defaultFormat = isoFormat;
    moment.lang = function(key, values) {
        var i;
        if (!key) {
            return currentLanguage
        }
        if (values || !languages[key]) {
            loadLang(key, values)
        }
        if (languages[key]) {
            for (i = 0; i < langConfigProperties.length; i++) {
                moment[langConfigProperties[i]] = languages[key][langConfigProperties[i]]
            }
            moment.monthsParse = languages[key].monthsParse;
            currentLanguage = key
        }
    };
    moment.langData = getLangDefinition;
    moment.isMoment = function(obj) {
        return obj instanceof Moment
    };
    moment.isDuration = function(obj) {
        return obj instanceof Duration
    };
    moment.lang("en", {months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat: {LT: "h:mm A",L: "MM/DD/YYYY",LL: "MMMM D YYYY",LLL: "MMMM D YYYY LT",LLLL: "dddd, MMMM D YYYY LT"},meridiem: function(hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? "pm" : "PM"
            } else {
                return isLower ? "am" : "AM"
            }
        },calendar: {sameDay: "[Today at] LT",nextDay: "[Tomorrow at] LT",nextWeek: "dddd [at] LT",lastDay: "[Yesterday at] LT",lastWeek: "[last] dddd [at] LT",sameElse: "L"},relativeTime: {future: "in %s",past: "%s ago",s: "a few seconds",m: "a minute",mm: "%d minutes",h: "an hour",hh: "%d hours",d: "a day",dd: "%d days",M: "a month",MM: "%d months",y: "a year",yy: "%d years"},ordinal: function(number) {
            var b = number % 10;
            return ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th"
        }});
    moment.fn = Moment.prototype = {clone: function() {
            return moment(this)
        },valueOf: function() {
            return +this._d
        },unix: function() {
            return Math.floor(+this._d / 1e3)
        },toString: function() {
            return this._d.toString()
        },toDate: function() {
            return this._d
        },toArray: function() {
            var m = this;
            return [m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds(), !!this._isUTC]
        },isValid: function() {
            if (this._a) {
                if (this._a[8] != null) {
                    return !!this._a[8]
                }
                return !compareArrays(this._a, (this._a[7] ? moment.utc(this._a) : moment(this._a)).toArray())
            }
            return !isNaN(this._d.getTime())
        },utc: function() {
            this._isUTC = true;
            return this
        },local: function() {
            this._isUTC = false;
            return this
        },format: function(inputString) {
            return formatMoment(this, inputString ? inputString : moment.defaultFormat)
        },add: function(input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this
        },subtract: function(input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this
        },diff: function(input, val, asFloat) {
            var inputMoment = this._isUTC ? moment(input).utc() : moment(input).local(), zoneDiff = (this.zone() - inputMoment.zone()) * 6e4, diff = this._d - inputMoment._d - zoneDiff, year = this.year() - inputMoment.year(), month = this.month() - inputMoment.month(), date = this.date() - inputMoment.date(), output;
            if (val === "months") {
                output = year * 12 + month + date / 30
            } else if (val === "years") {
                output = year + (month + date / 30) / 12
            } else {
                output = val === "seconds" ? diff / 1e3 : val === "minutes" ? diff / 6e4 : val === "hours" ? diff / 36e5 : val === "days" ? diff / 864e5 : val === "weeks" ? diff / 6048e5 : diff
            }
            return asFloat ? output : round(output)
        },from: function(time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this._lang).humanize(!withoutSuffix)
        },fromNow: function(withoutSuffix) {
            return this.from(moment(), withoutSuffix)
        },calendar: function() {
            var diff = this.diff(moment().sod(), "days", true), calendar = this.lang().calendar, allElse = calendar.sameElse, format = diff < -6 ? allElse : diff < -1 ? calendar.lastWeek : diff < 0 ? calendar.lastDay : diff < 1 ? calendar.sameDay : diff < 2 ? calendar.nextDay : diff < 7 ? calendar.nextWeek : allElse;
            return this.format(typeof format === "function" ? format.apply(this) : format)
        },isLeapYear: function() {
            var year = this.year();
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
        },isDST: function() {
            return this.zone() < moment([this.year()]).zone() || this.zone() < moment([this.year(), 5]).zone()
        },day: function(input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return input == null ? day : this.add({d: input - day})
        },startOf: function(val) {
            switch (val.replace(/s$/, "")) {
                case "year":
                    this.month(0);
                case "month":
                    this.date(1);
                case "day":
                    this.hours(0);
                case "hour":
                    this.minutes(0);
                case "minute":
                    this.seconds(0);
                case "second":
                    this.milliseconds(0)
            }
            return this
        },endOf: function(val) {
            return this.startOf(val).add(val.replace(/s?$/, "s"), 1).subtract("ms", 1)
        },sod: function() {
            return this.clone().startOf("day")
        },eod: function() {
            return this.clone().endOf("day")
        },zone: function() {
            return this._isUTC ? 0 : this._d.getTimezoneOffset()
        },daysInMonth: function() {
            return moment.utc([this.year(), this.month() + 1, 0]).date()
        },lang: function(lang) {
            if (lang === undefined) {
                return getLangDefinition(this)
            } else {
                this._lang = lang;
                return this
            }
        }};
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = function(input) {
            var utc = this._isUTC ? "UTC" : "";
            if (input != null) {
                this._d["set" + utc + key](input);
                return this
            } else {
                return this._d["get" + utc + key]()
            }
        }
    }
    for (i = 0; i < proxyGettersAndSetters.length; i++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase(), proxyGettersAndSetters[i])
    }
    makeGetterAndSetter("year", "FullYear");
    moment.duration.fn = Duration.prototype = {weeks: function() {
            return absRound(this.days() / 7)
        },valueOf: function() {
            return this._milliseconds + this._days * 864e5 + this._months * 2592e6
        },humanize: function(withSuffix) {
            var difference = +this, rel = this.lang().relativeTime, output = relativeTime(difference, !withSuffix, this.lang()), fromNow = difference <= 0 ? rel.past : rel.future;
            if (withSuffix) {
                if (typeof fromNow === "function") {
                    output = fromNow(output)
                } else {
                    output = fromNow.replace(/%s/i, output)
                }
            }
            return output
        },lang: moment.fn.lang};
    function makeDurationGetter(name) {
        moment.duration.fn[name] = function() {
            return this._data[name]
        }
    }
    function makeDurationAsGetter(name, factor) {
        moment.duration.fn["as" + name] = function() {
            return +this / factor
        }
    }
    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase())
        }
    }
    makeDurationAsGetter("Weeks", 6048e5);
    if (hasModule) {
        module.exports = moment
    }
    if (typeof ender === "undefined") {
        this["moment"] = moment
    }
    if (typeof define === "function" && define.amd) {
        define("moment", [], function() {
            return moment
        })
    }
}).call(this);
var io = "undefined" === typeof module ? {} : module.exports;
(function() {
    (function(exports, global) {
        var io = exports;
        io.version = "0.9.11";
        io.protocol = 1;
        io.transports = [];
        io.j = [];
        io.sockets = {};
        io.connect = function(host, details) {
            var uri = io.util.parseUri(host), uuri, socket;
            if (global && global.location) {
                uri.protocol = uri.protocol || global.location.protocol.slice(0, -1);
                uri.host = uri.host || (global.document ? global.document.domain : global.location.hostname);
                uri.port = uri.port || global.location.port
            }
            uuri = io.util.uniqueUri(uri);
            var options = {host: uri.host,secure: "https" == uri.protocol,port: uri.port || ("https" == uri.protocol ? 443 : 80),query: uri.query || ""};
            io.util.merge(options, details);
            if (options["force new connection"] || !io.sockets[uuri]) {
                socket = new io.Socket(options)
            }
            if (!options["force new connection"] && socket) {
                io.sockets[uuri] = socket
            }
            socket = socket || io.sockets[uuri];
            return socket.of(uri.path.length > 1 ? uri.path : "")
        }
    })("object" === typeof module ? module.exports : this.io = {}, this);
    (function(exports, global) {
        var util = exports.util = {};
        var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
        var parts = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        util.parseUri = function(str) {
            var m = re.exec(str || ""), uri = {}, i = 14;
            while (i--) {
                uri[parts[i]] = m[i] || ""
            }
            return uri
        };
        util.uniqueUri = function(uri) {
            var protocol = uri.protocol, host = uri.host, port = uri.port;
            if ("document" in global) {
                host = host || document.domain;
                port = port || (protocol == "https" && document.location.protocol !== "https:" ? 443 : document.location.port)
            } else {
                host = host || "localhost";
                if (!port && protocol == "https") {
                    port = 443
                }
            }
            return (protocol || "http") + "://" + host + ":" + (port || 80)
        };
        util.query = function(base, addition) {
            var query = util.chunkQuery(base || ""), components = [];
            util.merge(query, util.chunkQuery(addition || ""));
            for (var part in query) {
                if (query.hasOwnProperty(part)) {
                    components.push(part + "=" + query[part])
                }
            }
            return components.length ? "?" + components.join("&") : ""
        };
        util.chunkQuery = function(qs) {
            var query = {}, params = qs.split("&"), i = 0, l = params.length, kv;
            for (; i < l; ++i) {
                kv = params[i].split("=");
                if (kv[0]) {
                    query[kv[0]] = kv[1]
                }
            }
            return query
        };
        var pageLoaded = false;
        util.load = function(fn) {
            if ("document" in global && document.readyState === "complete" || pageLoaded) {
                return fn()
            }
            util.on(global, "load", fn, false)
        };
        util.on = function(element, event, fn, capture) {
            if (element.attachEvent) {
                element.attachEvent("on" + event, fn)
            } else if (element.addEventListener) {
                element.addEventListener(event, fn, capture)
            }
        };
        util.request = function(xdomain) {
            if (xdomain && "undefined" != typeof XDomainRequest && !util.ua.hasCORS) {
                return new XDomainRequest
            }
            if ("undefined" != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
                return new XMLHttpRequest
            }
            if (!xdomain) {
                try {
                    return new (window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                } catch (e) {
                }
            }
            return null
        };
        if ("undefined" != typeof window) {
            util.load(function() {
                pageLoaded = true
            })
        }
        util.defer = function(fn) {
            if (!util.ua.webkit || "undefined" != typeof importScripts) {
                return fn()
            }
            util.load(function() {
                setTimeout(fn, 100)
            })
        };
        util.merge = function merge(target, additional, deep, lastseen) {
            var seen = lastseen || [], depth = typeof deep == "undefined" ? 2 : deep, prop;
            for (prop in additional) {
                if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
                    if (typeof target[prop] !== "object" || !depth) {
                        target[prop] = additional[prop];
                        seen.push(additional[prop])
                    } else {
                        util.merge(target[prop], additional[prop], depth - 1, seen)
                    }
                }
            }
            return target
        };
        util.mixin = function(ctor, ctor2) {
            util.merge(ctor.prototype, ctor2.prototype)
        };
        util.inherit = function(ctor, ctor2) {
            function f() {
            }
            f.prototype = ctor2.prototype;
            ctor.prototype = new f
        };
        util.isArray = Array.isArray || function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]"
        };
        util.intersect = function(arr, arr2) {
            var ret = [], longest = arr.length > arr2.length ? arr : arr2, shortest = arr.length > arr2.length ? arr2 : arr;
            for (var i = 0, l = shortest.length; i < l; i++) {
                if (~util.indexOf(longest, shortest[i]))
                    ret.push(shortest[i])
            }
            return ret
        };
        util.indexOf = function(arr, o, i) {
            for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0; i < j && arr[i] !== o; i++) {
            }
            return j <= i ? -1 : i
        };
        util.toArray = function(enu) {
            var arr = [];
            for (var i = 0, l = enu.length; i < l; i++)
                arr.push(enu[i]);
            return arr
        };
        util.ua = {};
        util.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
            try {
                var a = new XMLHttpRequest
            } catch (e) {
                return false
            }
            return a.withCredentials != undefined
        }();
        util.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent);
        util.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)
    })("undefined" != typeof io ? io : module.exports, this);
    (function(exports, io) {
        exports.EventEmitter = EventEmitter;
        function EventEmitter() {
        }
        EventEmitter.prototype.on = function(name, fn) {
            if (!this.$events) {
                this.$events = {}
            }
            if (!this.$events[name]) {
                this.$events[name] = fn
            } else if (io.util.isArray(this.$events[name])) {
                this.$events[name].push(fn)
            } else {
                this.$events[name] = [this.$events[name], fn]
            }
            return this
        };
        EventEmitter.prototype.addListener = EventEmitter.prototype.on;
        EventEmitter.prototype.once = function(name, fn) {
            var self = this;
            function on() {
                self.removeListener(name, on);
                fn.apply(this, arguments)
            }
            on.listener = fn;
            this.on(name, on);
            return this
        };
        EventEmitter.prototype.removeListener = function(name, fn) {
            if (this.$events && this.$events[name]) {
                var list = this.$events[name];
                if (io.util.isArray(list)) {
                    var pos = -1;
                    for (var i = 0, l = list.length; i < l; i++) {
                        if (list[i] === fn || list[i].listener && list[i].listener === fn) {
                            pos = i;
                            break
                        }
                    }
                    if (pos < 0) {
                        return this
                    }
                    list.splice(pos, 1);
                    if (!list.length) {
                        delete this.$events[name]
                    }
                } else if (list === fn || list.listener && list.listener === fn) {
                    delete this.$events[name]
                }
            }
            return this
        };
        EventEmitter.prototype.removeAllListeners = function(name) {
            if (name === undefined) {
                this.$events = {};
                return this
            }
            if (this.$events && this.$events[name]) {
                this.$events[name] = null
            }
            return this
        };
        EventEmitter.prototype.listeners = function(name) {
            if (!this.$events) {
                this.$events = {}
            }
            if (!this.$events[name]) {
                this.$events[name] = []
            }
            if (!io.util.isArray(this.$events[name])) {
                this.$events[name] = [this.$events[name]]
            }
            return this.$events[name]
        };
        EventEmitter.prototype.emit = function(name) {
            if (!this.$events) {
                return false
            }
            var handler = this.$events[name];
            if (!handler) {
                return false
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if ("function" == typeof handler) {
                handler.apply(this, args)
            } else if (io.util.isArray(handler)) {
                var listeners = handler.slice();
                for (var i = 0, l = listeners.length; i < l; i++) {
                    listeners[i].apply(this, args)
                }
            } else {
                return false
            }
            return true
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, nativeJSON) {
        "use strict";
        if (nativeJSON && nativeJSON.parse) {
            return exports.JSON = {parse: nativeJSON.parse,stringify: nativeJSON.stringify}
        }
        var JSON = exports.JSON = {};
        function f(n) {
            return n < 10 ? "0" + n : n
        }
        function date(d, key) {
            return isFinite(d.valueOf()) ? d.getUTCFullYear() + "-" + f(d.getUTCMonth() + 1) + "-" + f(d.getUTCDate()) + "T" + f(d.getUTCHours()) + ":" + f(d.getUTCMinutes()) + ":" + f(d.getUTCSeconds()) + "Z" : null
        }
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b","    ": "\\t","\n": "\\n","\f": "\\f","\r": "\\r",'"': '\\"',"\\": "\\\\"}, rep;
        function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + string + '"'
        }
        function str(key, holder) {
            var i, k, v, length, mind = gap, partial, value = holder[key];
            if (value instanceof Date) {
                value = date(key)
            }
            if (typeof rep === "function") {
                value = rep.call(holder, key, value)
            }
            switch (typeof value) {
                case "string":
                    return quote(value);
                case "number":
                    return isFinite(value) ? String(value) : "null";
                case "boolean":
                case "null":
                    return String(value);
                case "object":
                    if (!value) {
                        return "null"
                    }
                    gap += indent;
                    partial = [];
                    if (Object.prototype.toString.apply(value) === "[object Array]") {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || "null"
                        }
                        v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                        gap = mind;
                        return v
                    }
                    if (rep && typeof rep === "object") {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === "string") {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v)
                                }
                            }
                        }
                    } else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ": " : ":") + v)
                                }
                            }
                        }
                    }
                    v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                    gap = mind;
                    return v
            }
        }
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else if (typeof space === "string") {
                indent = space
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {"": value})
        };
        JSON.parse = function(text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({"": j}, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    })("undefined" != typeof io ? io : module.exports, typeof JSON !== "undefined" ? JSON : undefined);
    (function(exports, io) {
        var parser = exports.parser = {};
        var packets = parser.packets = ["disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop"];
        var reasons = parser.reasons = ["transport not supported", "client not handshaken", "unauthorized"];
        var advice = parser.advice = ["reconnect"];
        var JSON = io.JSON, indexOf = io.util.indexOf;
        parser.encodePacket = function(packet) {
            var type = indexOf(packets, packet.type), id = packet.id || "", endpoint = packet.endpoint || "", ack = packet.ack, data = null;
            switch (packet.type) {
                case "error":
                    var reason = packet.reason ? indexOf(reasons, packet.reason) : "", adv = packet.advice ? indexOf(advice, packet.advice) : "";
                    if (reason !== "" || adv !== "")
                        data = reason + (adv !== "" ? "+" + adv : "");
                    break;
                case "message":
                    if (packet.data !== "")
                        data = packet.data;
                    break;
                case "event":
                    var ev = {name: packet.name};
                    if (packet.args && packet.args.length) {
                        ev.args = packet.args
                    }
                    data = JSON.stringify(ev);
                    break;
                case "json":
                    data = JSON.stringify(packet.data);
                    break;
                case "connect":
                    if (packet.qs)
                        data = packet.qs;
                    break;
                case "ack":
                    data = packet.ackId + (packet.args && packet.args.length ? "+" + JSON.stringify(packet.args) : "");
                    break
            }
            var encoded = [type, id + (ack == "data" ? "+" : ""), endpoint];
            if (data !== null && data !== undefined)
                encoded.push(data);
            return encoded.join(":")
        };
        parser.encodePayload = function(packets) {
            var decoded = "";
            if (packets.length == 1)
                return packets[0];
            for (var i = 0, l = packets.length; i < l; i++) {
                var packet = packets[i];
                decoded += "�" + packet.length + "�" + packets[i]
            }
            return decoded
        };
        var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
        parser.decodePacket = function(data) {
            var pieces = data.match(regexp);
            if (!pieces)
                return {};
            var id = pieces[2] || "", data = pieces[5] || "", packet = {type: packets[pieces[1]],endpoint: pieces[4] || ""};
            if (id) {
                packet.id = id;
                if (pieces[3])
                    packet.ack = "data";
                else
                    packet.ack = true
            }
            switch (packet.type) {
                case "error":
                    var pieces = data.split("+");
                    packet.reason = reasons[pieces[0]] || "";
                    packet.advice = advice[pieces[1]] || "";
                    break;
                case "message":
                    packet.data = data || "";
                    break;
                case "event":
                    try {
                        var opts = JSON.parse(data);
                        packet.name = opts.name;
                        packet.args = opts.args
                    } catch (e) {
                    }
                    packet.args = packet.args || [];
                    break;
                case "json":
                    try {
                        packet.data = JSON.parse(data)
                    } catch (e) {
                    }
                    break;
                case "connect":
                    packet.qs = data || "";
                    break;
                case "ack":
                    var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
                    if (pieces) {
                        packet.ackId = pieces[1];
                        packet.args = [];
                        if (pieces[3]) {
                            try {
                                packet.args = pieces[3] ? JSON.parse(pieces[3]) : []
                            } catch (e) {
                            }
                        }
                    }
                    break;
                case "disconnect":
                case "heartbeat":
                    break
            }
            return packet
        };
        parser.decodePayload = function(data) {
            if (data.charAt(0) == "�") {
                var ret = [];
                for (var i = 1, length = ""; i < data.length; i++) {
                    if (data.charAt(i) == "�") {
                        ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
                        i += Number(length) + 1;
                        length = ""
                    } else {
                        length += data.charAt(i)
                    }
                }
                return ret
            } else {
                return [parser.decodePacket(data)]
            }
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, io) {
        exports.Transport = Transport;
        function Transport(socket, sessid) {
            this.socket = socket;
            this.sessid = sessid
        }
        io.util.mixin(Transport, io.EventEmitter);
        Transport.prototype.heartbeats = function() {
            return true
        };
        Transport.prototype.onData = function(data) {
            this.clearCloseTimeout();
            if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
                this.setCloseTimeout()
            }
            if (data !== "") {
                var msgs = io.parser.decodePayload(data);
                if (msgs && msgs.length) {
                    for (var i = 0, l = msgs.length; i < l; i++) {
                        this.onPacket(msgs[i])
                    }
                }
            }
            return this
        };
        Transport.prototype.onPacket = function(packet) {
            this.socket.setHeartbeatTimeout();
            if (packet.type == "heartbeat") {
                return this.onHeartbeat()
            }
            if (packet.type == "connect" && packet.endpoint == "") {
                this.onConnect()
            }
            if (packet.type == "error" && packet.advice == "reconnect") {
                this.isOpen = false
            }
            this.socket.onPacket(packet);
            return this
        };
        Transport.prototype.setCloseTimeout = function() {
            if (!this.closeTimeout) {
                var self = this;
                this.closeTimeout = setTimeout(function() {
                    self.onDisconnect()
                }, this.socket.closeTimeout)
            }
        };
        Transport.prototype.onDisconnect = function() {
            if (this.isOpen)
                this.close();
            this.clearTimeouts();
            this.socket.onDisconnect();
            return this
        };
        Transport.prototype.onConnect = function() {
            this.socket.onConnect();
            return this
        };
        Transport.prototype.clearCloseTimeout = function() {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null
            }
        };
        Transport.prototype.clearTimeouts = function() {
            this.clearCloseTimeout();
            if (this.reopenTimeout) {
                clearTimeout(this.reopenTimeout)
            }
        };
        Transport.prototype.packet = function(packet) {
            this.send(io.parser.encodePacket(packet))
        };
        Transport.prototype.onHeartbeat = function(heartbeat) {
            this.packet({type: "heartbeat"})
        };
        Transport.prototype.onOpen = function() {
            this.isOpen = true;
            this.clearCloseTimeout();
            this.socket.onOpen()
        };
        Transport.prototype.onClose = function() {
            var self = this;
            this.isOpen = false;
            this.socket.onClose();
            this.onDisconnect()
        };
        Transport.prototype.prepareUrl = function() {
            var options = this.socket.options;
            return this.scheme() + "://" + options.host + ":" + options.port + "/" + options.resource + "/" + io.protocol + "/" + this.name + "/" + this.sessid
        };
        Transport.prototype.ready = function(socket, fn) {
            fn.call(this)
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, io, global) {
        exports.Socket = Socket;
        function Socket(options) {
            this.options = {port: 80,secure: false,document: "document" in global ? document : false,resource: "socket.io",transports: io.transports,"connect timeout": 1e4,"try multiple transports": true,reconnect: true,"reconnection delay": 500,"reconnection limit": Infinity,"reopen delay": 3e3,"max reconnection attempts": 10,"sync disconnect on unload": false,"auto connect": true,"flash policy port": 10843,manualFlush: false};
            io.util.merge(this.options, options);
            this.connected = false;
            this.open = false;
            this.connecting = false;
            this.reconnecting = false;
            this.namespaces = {};
            this.buffer = [];
            this.doBuffer = false;
            if (this.options["sync disconnect on unload"] && (!this.isXDomain() || io.util.ua.hasCORS)) {
                var self = this;
                io.util.on(global, "beforeunload", function() {
                    self.disconnectSync()
                }, false)
            }
            if (this.options["auto connect"]) {
                this.connect()
            }
        }
        io.util.mixin(Socket, io.EventEmitter);
        Socket.prototype.of = function(name) {
            if (!this.namespaces[name]) {
                this.namespaces[name] = new io.SocketNamespace(this, name);
                if (name !== "") {
                    this.namespaces[name].packet({type: "connect"})
                }
            }
            return this.namespaces[name]
        };
        Socket.prototype.publish = function() {
            this.emit.apply(this, arguments);
            var nsp;
            for (var i in this.namespaces) {
                if (this.namespaces.hasOwnProperty(i)) {
                    nsp = this.of(i);
                    nsp.$emit.apply(nsp, arguments)
                }
            }
        };
        function empty() {
        }
        Socket.prototype.handshake = function(fn) {
            var self = this, options = this.options;
            function complete(data) {
                if (data instanceof Error) {
                    self.connecting = false;
                    self.onError(data.message)
                } else {
                    fn.apply(null, data.split(":"))
                }
            }
            var url = ["http" + (options.secure ? "s" : "") + ":/", options.host + ":" + options.port, options.resource, io.protocol, io.util.query(this.options.query, "t=" + +new Date)].join("/");
            if (this.isXDomain() && !io.util.ua.hasCORS) {
                var insertAt = document.getElementsByTagName("script")[0], script = document.createElement("script");
                script.src = url + "&jsonp=" + io.j.length;
                insertAt.parentNode.insertBefore(script, insertAt);
                io.j.push(function(data) {
                    complete(data);
                    script.parentNode.removeChild(script)
                })
            } else {
                var xhr = io.util.request();
                xhr.open("GET", url, true);
                if (this.isXDomain()) {
                    xhr.withCredentials = true
                }
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        xhr.onreadystatechange = empty;
                        if (xhr.status == 200) {
                            complete(xhr.responseText)
                        } else if (xhr.status == 403) {
                            self.onError(xhr.responseText)
                        } else {
                            self.connecting = false;
                            !self.reconnecting && self.onError(xhr.responseText)
                        }
                    }
                };
                xhr.send(null)
            }
        };
        Socket.prototype.getTransport = function(override) {
            var transports = override || this.transports, match;
            for (var i = 0, transport; transport = transports[i]; i++) {
                if (io.Transport[transport] && io.Transport[transport].check(this) && (!this.isXDomain() || io.Transport[transport].xdomainCheck(this))) {
                    return new io.Transport[transport](this, this.sessionid)
                }
            }
            return null
        };
        Socket.prototype.connect = function(fn) {
            if (this.connecting) {
                return this
            }
            var self = this;
            self.connecting = true;
            this.handshake(function(sid, heartbeat, close, transports) {
                self.sessionid = sid;
                self.closeTimeout = close * 1e3;
                self.heartbeatTimeout = heartbeat * 1e3;
                if (!self.transports)
                    self.transports = self.origTransports = transports ? io.util.intersect(transports.split(","), self.options.transports) : self.options.transports;
                self.setHeartbeatTimeout();
                function connect(transports) {
                    if (self.transport)
                        self.transport.clearTimeouts();
                    self.transport = self.getTransport(transports);
                    if (!self.transport)
                        return self.publish("connect_failed");
                    self.transport.ready(self, function() {
                        self.connecting = true;
                        self.publish("connecting", self.transport.name);
                        self.transport.open();
                        if (self.options["connect timeout"]) {
                            self.connectTimeoutTimer = setTimeout(function() {
                                if (!self.connected) {
                                    self.connecting = false;
                                    if (self.options["try multiple transports"]) {
                                        var remaining = self.transports;
                                        while (remaining.length > 0 && remaining.splice(0, 1)[0] != self.transport.name) {
                                        }
                                        if (remaining.length) {
                                            connect(remaining)
                                        } else {
                                            self.publish("connect_failed")
                                        }
                                    }
                                }
                            }, self.options["connect timeout"])
                        }
                    })
                }
                connect(self.transports);
                self.once("connect", function() {
                    clearTimeout(self.connectTimeoutTimer);
                    fn && typeof fn == "function" && fn()
                })
            });
            return this
        };
        Socket.prototype.setHeartbeatTimeout = function() {
            clearTimeout(this.heartbeatTimeoutTimer);
            if (this.transport && !this.transport.heartbeats())
                return;
            var self = this;
            this.heartbeatTimeoutTimer = setTimeout(function() {
                self.transport.onClose()
            }, this.heartbeatTimeout)
        };
        Socket.prototype.packet = function(data) {
            if (this.connected && !this.doBuffer) {
                this.transport.packet(data)
            } else {
                this.buffer.push(data)
            }
            return this
        };
        Socket.prototype.setBuffer = function(v) {
            this.doBuffer = v;
            if (!v && this.connected && this.buffer.length) {
                if (!this.options["manualFlush"]) {
                    this.flushBuffer()
                }
            }
        };
        Socket.prototype.flushBuffer = function() {
            this.transport.payload(this.buffer);
            this.buffer = []
        };
        Socket.prototype.disconnect = function() {
            if (this.connected || this.connecting) {
                if (this.open) {
                    this.of("").packet({type: "disconnect"})
                }
                this.onDisconnect("booted")
            }
            return this
        };
        Socket.prototype.disconnectSync = function() {
            var xhr = io.util.request();
            var uri = ["http" + (this.options.secure ? "s" : "") + ":/", this.options.host + ":" + this.options.port, this.options.resource, io.protocol, "", this.sessionid].join("/") + "/?disconnect=1";
            xhr.open("GET", uri, false);
            xhr.send(null);
            this.onDisconnect("booted")
        };
        Socket.prototype.isXDomain = function() {
            var port = global.location.port || ("https:" == global.location.protocol ? 443 : 80);
            return this.options.host !== global.location.hostname || this.options.port != port
        };
        Socket.prototype.onConnect = function() {
            if (!this.connected) {
                this.connected = true;
                this.connecting = false;
                if (!this.doBuffer) {
                    this.setBuffer(false)
                }
                this.emit("connect")
            }
        };
        Socket.prototype.onOpen = function() {
            this.open = true
        };
        Socket.prototype.onClose = function() {
            this.open = false;
            clearTimeout(this.heartbeatTimeoutTimer)
        };
        Socket.prototype.onPacket = function(packet) {
            this.of(packet.endpoint).onPacket(packet)
        };
        Socket.prototype.onError = function(err) {
            if (err && err.advice) {
                if (err.advice === "reconnect" && (this.connected || this.connecting)) {
                    this.disconnect();
                    if (this.options.reconnect) {
                        this.reconnect()
                    }
                }
            }
            this.publish("error", err && err.reason ? err.reason : err)
        };
        Socket.prototype.onDisconnect = function(reason) {
            var wasConnected = this.connected, wasConnecting = this.connecting;
            this.connected = false;
            this.connecting = false;
            this.open = false;
            if (wasConnected || wasConnecting) {
                this.transport.close();
                this.transport.clearTimeouts();
                if (wasConnected) {
                    this.publish("disconnect", reason);
                    if ("booted" != reason && this.options.reconnect && !this.reconnecting) {
                        this.reconnect()
                    }
                }
            }
        };
        Socket.prototype.reconnect = function() {
            this.reconnecting = true;
            this.reconnectionAttempts = 0;
            this.reconnectionDelay = this.options["reconnection delay"];
            var self = this, maxAttempts = this.options["max reconnection attempts"], tryMultiple = this.options["try multiple transports"], limit = this.options["reconnection limit"];
            function reset() {
                if (self.connected) {
                    for (var i in self.namespaces) {
                        if (self.namespaces.hasOwnProperty(i) && "" !== i) {
                            self.namespaces[i].packet({type: "connect"})
                        }
                    }
                    self.publish("reconnect", self.transport.name, self.reconnectionAttempts)
                }
                clearTimeout(self.reconnectionTimer);
                self.removeListener("connect_failed", maybeReconnect);
                self.removeListener("connect", maybeReconnect);
                self.reconnecting = false;
                delete self.reconnectionAttempts;
                delete self.reconnectionDelay;
                delete self.reconnectionTimer;
                delete self.redoTransports;
                self.options["try multiple transports"] = tryMultiple
            }
            function maybeReconnect() {
                if (!self.reconnecting) {
                    return
                }
                if (self.connected) {
                    return reset()
                }
                if (self.connecting && self.reconnecting) {
                    return self.reconnectionTimer = setTimeout(maybeReconnect, 1e3)
                }
                if (self.reconnectionAttempts++ >= maxAttempts) {
                    if (!self.redoTransports) {
                        self.on("connect_failed", maybeReconnect);
                        self.options["try multiple transports"] = true;
                        self.transports = self.origTransports;
                        self.transport = self.getTransport();
                        self.redoTransports = true;
                        self.connect()
                    } else {
                        self.publish("reconnect_failed");
                        reset()
                    }
                } else {
                    if (self.reconnectionDelay < limit) {
                        self.reconnectionDelay *= 2
                    }
                    self.connect();
                    self.publish("reconnecting", self.reconnectionDelay, self.reconnectionAttempts);
                    self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay)
                }
            }
            this.options["try multiple transports"] = false;
            this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);
            this.on("connect", maybeReconnect)
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    (function(exports, io) {
        exports.SocketNamespace = SocketNamespace;
        function SocketNamespace(socket, name) {
            this.socket = socket;
            this.name = name || "";
            this.flags = {};
            this.json = new Flag(this, "json");
            this.ackPackets = 0;
            this.acks = {}
        }
        io.util.mixin(SocketNamespace, io.EventEmitter);
        SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;
        SocketNamespace.prototype.of = function() {
            return this.socket.of.apply(this.socket, arguments)
        };
        SocketNamespace.prototype.packet = function(packet) {
            packet.endpoint = this.name;
            this.socket.packet(packet);
            this.flags = {};
            return this
        };
        SocketNamespace.prototype.send = function(data, fn) {
            var packet = {type: this.flags.json ? "json" : "message",data: data};
            if ("function" == typeof fn) {
                packet.id = ++this.ackPackets;
                packet.ack = true;
                this.acks[packet.id] = fn
            }
            return this.packet(packet)
        };
        SocketNamespace.prototype.emit = function(name) {
            var args = Array.prototype.slice.call(arguments, 1), lastArg = args[args.length - 1], packet = {type: "event",name: name};
            if ("function" == typeof lastArg) {
                packet.id = ++this.ackPackets;
                packet.ack = "data";
                this.acks[packet.id] = lastArg;
                args = args.slice(0, args.length - 1)
            }
            packet.args = args;
            return this.packet(packet)
        };
        SocketNamespace.prototype.disconnect = function() {
            if (this.name === "") {
                this.socket.disconnect()
            } else {
                this.packet({type: "disconnect"});
                this.$emit("disconnect")
            }
            return this
        };
        SocketNamespace.prototype.onPacket = function(packet) {
            var self = this;
            function ack() {
                self.packet({type: "ack",args: io.util.toArray(arguments),ackId: packet.id})
            }
            switch (packet.type) {
                case "connect":
                    this.$emit("connect");
                    break;
                case "disconnect":
                    if (this.name === "") {
                        this.socket.onDisconnect(packet.reason || "booted")
                    } else {
                        this.$emit("disconnect", packet.reason)
                    }
                    break;
                case "message":
                case "json":
                    var params = ["message", packet.data];
                    if (packet.ack == "data") {
                        params.push(ack)
                    } else if (packet.ack) {
                        this.packet({type: "ack",ackId: packet.id})
                    }
                    this.$emit.apply(this, params);
                    break;
                case "event":
                    var params = [packet.name].concat(packet.args);
                    if (packet.ack == "data")
                        params.push(ack);
                    this.$emit.apply(this, params);
                    break;
                case "ack":
                    if (this.acks[packet.ackId]) {
                        this.acks[packet.ackId].apply(this, packet.args);
                        delete this.acks[packet.ackId]
                    }
                    break;
                case "error":
                    if (packet.advice) {
                        this.socket.onError(packet)
                    } else {
                        if (packet.reason == "unauthorized") {
                            this.$emit("connect_failed", packet.reason)
                        } else {
                            this.$emit("error", packet.reason)
                        }
                    }
                    break
            }
        };
        function Flag(nsp, name) {
            this.namespace = nsp;
            this.name = name
        }
        Flag.prototype.send = function() {
            this.namespace.flags[this.name] = true;
            this.namespace.send.apply(this.namespace, arguments)
        };
        Flag.prototype.emit = function() {
            this.namespace.flags[this.name] = true;
            this.namespace.emit.apply(this.namespace, arguments)
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(exports, io, global) {
        exports.XHR = XHR;
        function XHR(socket) {
            if (!socket)
                return;
            io.Transport.apply(this, arguments);
            this.sendBuffer = []
        }
        io.util.inherit(XHR, io.Transport);
        XHR.prototype.open = function() {
            this.socket.setBuffer(false);
            this.onOpen();
            this.get();
            this.setCloseTimeout();
            return this
        };
        XHR.prototype.payload = function(payload) {
            var msgs = [];
            for (var i = 0, l = payload.length; i < l; i++) {
                msgs.push(io.parser.encodePacket(payload[i]))
            }
            this.send(io.parser.encodePayload(msgs))
        };
        XHR.prototype.send = function(data) {
            this.post(data);
            return this
        };
        function empty() {
        }
        XHR.prototype.post = function(data) {
            var self = this;
            this.socket.setBuffer(true);
            function stateChange() {
                if (this.readyState == 4) {
                    this.onreadystatechange = empty;
                    self.posting = false;
                    if (this.status == 200) {
                        self.socket.setBuffer(false)
                    } else {
                        self.onClose()
                    }
                }
            }
            function onload() {
                this.onload = empty;
                self.socket.setBuffer(false)
            }
            this.sendXHR = this.request("POST");
            if (global.XDomainRequest && this.sendXHR instanceof XDomainRequest) {
                this.sendXHR.onload = this.sendXHR.onerror = onload
            } else {
                this.sendXHR.onreadystatechange = stateChange
            }
            this.sendXHR.send(data)
        };
        XHR.prototype.close = function() {
            this.onClose();
            return this
        };
        XHR.prototype.request = function(method) {
            var req = io.util.request(this.socket.isXDomain()), query = io.util.query(this.socket.options.query, "t=" + +new Date);
            req.open(method || "GET", this.prepareUrl() + query, true);
            if (method == "POST") {
                try {
                    if (req.setRequestHeader) {
                        req.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                    } else {
                        req.contentType = "text/plain"
                    }
                } catch (e) {
                }
            }
            return req
        };
        XHR.prototype.scheme = function() {
            return this.socket.options.secure ? "https" : "http"
        };
        XHR.check = function(socket, xdomain) {
            try {
                var request = io.util.request(xdomain), usesXDomReq = global.XDomainRequest && request instanceof XDomainRequest, socketProtocol = socket && socket.options && socket.options.secure ? "https:" : "http:", isXProtocol = global.location && socketProtocol != global.location.protocol;
                if (request && !(usesXDomReq && isXProtocol)) {
                    return true
                }
            } catch (e) {
            }
            return false
        };
        XHR.xdomainCheck = function(socket) {
            return XHR.check(socket, true)
        }
    })("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    (function(exports, io, global) {
        exports["xhr-polling"] = XHRPolling;
        function XHRPolling() {
            io.Transport.XHR.apply(this, arguments)
        }
        io.util.inherit(XHRPolling, io.Transport.XHR);
        io.util.merge(XHRPolling, io.Transport.XHR);
        XHRPolling.prototype.name = "xhr-polling";
        XHRPolling.prototype.heartbeats = function() {
            return false
        };
        XHRPolling.prototype.open = function() {
            var self = this;
            io.Transport.XHR.prototype.open.call(self);
            return false
        };
        function empty() {
        }
        XHRPolling.prototype.get = function() {
            if (!this.isOpen)
                return;
            var self = this;
            function stateChange() {
                if (this.readyState == 4) {
                    this.onreadystatechange = empty;
                    if (this.status == 200) {
                        self.onData(this.responseText);
                        self.get()
                    } else {
                        self.onClose()
                    }
                }
            }
            function onload() {
                this.onload = empty;
                this.onerror = empty;
                self.retryCounter = 1;
                self.onData(this.responseText);
                self.get()
            }
            function onerror() {
                self.retryCounter++;
                if (!self.retryCounter || self.retryCounter > 3) {
                    self.onClose()
                } else {
                    self.get()
                }
            }
            this.xhr = this.request();
            if (global.XDomainRequest && this.xhr instanceof XDomainRequest) {
                this.xhr.onload = onload;
                this.xhr.onerror = onerror
            } else {
                this.xhr.onreadystatechange = stateChange
            }
            this.xhr.send(null)
        };
        XHRPolling.prototype.onClose = function() {
            io.Transport.XHR.prototype.onClose.call(this);
            if (this.xhr) {
                this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = empty;
                try {
                    this.xhr.abort()
                } catch (e) {
                }
                this.xhr = null
            }
        };
        XHRPolling.prototype.ready = function(socket, fn) {
            var self = this;
            io.util.defer(function() {
                fn.call(self)
            })
        };
        io.transports.push("xhr-polling")
    })("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    if (typeof define === "function" && define.amd) {
        define([], function() {
            return io
        })
    }
})();
(function() {
    var bitAddress, curPage, depositPopup, emptyValue, errorPopupTimer, fieldBlur, fieldFocus, getAddress, hideDeposit, hideSettings, pages, settingsPopup, showDeposit, showSettings, spinner, toggleDeposit, toggleSettings;
    bitAddress = false;
    emptyValue = "Enter magnet URI, torrent URL or upload a torrent file";
    depositPopup = false;
    settingsPopup = false;
    errorPopupTimer = null;
    spinner = null;
    curPage = null;
    pages = ["features", "howitworks", "faq", "privacy"];
    if (!$.support.transition) {
        $.fn.transition = $.fn.animate
    }
    fieldFocus = function() {
        if ($("#field").val() === emptyValue) {
            $("#field").val("");
            return $("#field").addClass("whiter")
        }
    };
    fieldBlur = function() {
        if ($("#field").val() === emptyValue || $("#field").val() === "") {
            $("#field").removeClass("whiter");
            return $("#field").val(emptyValue)
        }
    };
    window.showPage = function(num) {
        var c, i, page, _i, _len;
        page = pages[num];
        if (page === curPage) {
            return
        }
        if (curPage === null) {
            $("#link-" + page).addClass("disabled");
            c = 0;
            for (_i = 0, _len = pages.length; _i < _len; _i++) {
                i = pages[_i];
                if (c === num) {
                    $("#text-" + i).css({display: "block"})
                } else {
                    if ($("#text-" + i).css("display") !== "none") {
                        $("#text-" + i).css({display: "none"})
                    }
                }
                c++
            }
            fadeIn("#textpane", 700);
            $("#bottom-menu").transit({top: "130px",left: "190px"}, 700);
            fadeOut("#menu-copy", 700)
        } else {
            $("#link-" + curPage).removeClass("disabled");
            $("#link-" + page).addClass("disabled");
            $("#text-" + curPage).css({display: "none"});
            $("#text-" + page).css({display: "block"})
        }
        return curPage = page
    };
    window.hidePage = function() {
        var torHeight;
        if (curPage === null) {
            return
        }
        $("#link-" + curPage).removeClass("disabled");
        fadeOut("#textpane", 700);
        if (torrentWindow()) {
            torHeight = $("#torrents").height();
            if (Math.abs($("#bottom-menu").offset().top - (torHeight + 238)) > 20) {
                $("#bottom-menu").transition({top: torHeight + 238 + "px",left: "0px"}, 1e3)
            }
        } else {
            $("#bottom-menu").transit({top: "420px",left: "0px"}, 700)
        }
        fadeIn("#menu-copy", 700);
        return curPage = null
    };
    window.pageShown = function() {
        if (curPage === null) {
            return false
        } else {
            return true
        }
    };
    showDeposit = function() {
        var opts;
        hideSettings();
        if (!depositPopup) {
            fadeIn("#deposit", 300);
            $("#deposit-button").addClass("pressed");
            depositPopup = true;
            if (bitAddress === false) {
                opts = {lines: 13,length: 7,width: 4,radius: 10,corners: 1,rotate: 0,color: "#ffffff",speed: 1.2,trail: 60,shadow: false,hwaccel: false,className: "spinnerbig",zIndex: 5,top: "auto",left: "auto"};
                spinner = new Spinner(opts).spin($("#deposit-address")[0]);
                return getAddress()
            }
        }
    };
    showSettings = function() {
        hideDeposit();
        if (!settingsPopup) {
            fadeIn("#settings", 300);
            $("#settings-button").addClass("pressed");
            return settingsPopup = true
        }
    };
    getAddress = function() {
        return $.ajax("/getaddress", {type: "POST",dataType: "json",success: function(res, status, xhr) {
                if (res.result === 1) {
                    if (spinner != null) {
                        spinner.stop()
                    }
                    $("#deposit-address").html(res.address);
                    $("#qrtext").html("Show QR code");
                    $("#qrtext").css("cursor", "pointer");
                    return bitAddress = res.address
                } else {
                    return $("#deposit-address").html("Error retrieving address")
                }
            },error: function(xhr, status, err) {
            }})
    };
    hideDeposit = function() {
        if (depositPopup) {
            fadeOut("#deposit", 300);
            $("#deposit-button").removeClass("pressed");
            return depositPopup = false
        }
    };
    hideSettings = function() {
        if (settingsPopup) {
            fadeOut("#settings", 300);
            $("#settings-button").removeClass("pressed");
            return settingsPopup = false
        }
    };
    toggleDeposit = function(event) {
        event.stopPropagation();
        if (depositPopup) {
            return hideDeposit()
        } else {
            return showDeposit()
        }
    };
    toggleSettings = function(event) {
        event.stopPropagation();
        if (settingsPopup) {
            return hideSettings()
        } else {
            return showSettings()
        }
    };
    window.escapeHTML = function(str) {
        return ("" + str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
    };
    window.captureClick = function(event) {
        return event.stopPropagation()
    };
    window.errorPopup = function(error) {
        var msg;
        if (!errorPopupTimer === null) {
            return
        }
        error = error != null ? error : 0;
        switch (error) {
            case 0:
                msg = "Query failed";
                break;
            case 1:
                msg = "Invalid length";
                break;
            case 2:
                msg = "Cannot connect to search provider";
                break;
            case 3:
                msg = "Cannot parse search results";
                break;
            case 4:
                msg = "No torrents found";
                break;
            case 5:
                msg = "Torrent fetch failed";
                break;
            case 6:
                msg = "Invalid torrent file";
                break;
            case 7:
                msg = "Search query timeout";
                break;
            case 8:
                msg = "Cannot connect to torrent client";
                break;
            case 9:
                msg = "Duplicate torrent - please try again later";
                break;
            case 10:
                msg = "You can add up to 100 torrents per hour - please try again later";
                break;
            case 11:
                msg = "Your browser does not support XHR file uploads";
                break;
            case 12:
                msg = "Error while uploading file";
                break;
            case 13:
                msg = "You can perform up to 300 searches per hour - please try again later";
                break;
            case 14:
                msg = "Please enter a magnet URI or torrent URL";
                break;
            default:
                msg = "Unknown error"
        }
        $("#fetchpopup").html('<span class="icon"></span>' + msg);
        fadeIn("#fetchpopup", 200, true);
        return errorPopupTimer = setTimeout(function() {
            return fadeOut("#fetchpopup", 700)
        }, 3e3)
    };
    window.fadeIn = function(item, duration, inline) {
        $(item).css({opacity: 0});
        if (inline) {
            $(item).css({display: "block"})
        } else {
            $(item).css({display: "inline-block"})
        }
        return $(item).transition({opacity: 1}, duration)
    };
    window.fadeOut = function(item, duration) {
        return $(item).transition({opacity: 0}, duration, function() {
            return $(item).css({display: "none"})
        })
    };
    window.showQR = function() {
        if (bitAddress === false) {
            return
        }
        $("#qrtext").css({display: "none"});
        $("#qrcode").css({display: "block"});
        return $("#qrcode").css({"background-image": "url('https://blockchain.info/qr?data=" + bitAddress + "&size=200')"})
    };
    $(function() {
        var i, out, wat, _i, _ref;
        loadSettings();
        $("#field").bind("focus", fieldFocus);
        $("#field").bind("blur", fieldBlur);
        $("#field").bind("click", function(e) {
            hideDeposit();
            hideSettings();
            hideFilepane();
            return captureClick(e)
        });
        $("#bottom-menu").bind("click", function(e) {
            return captureClick(e)
        });
        $("#field").keypress(function(e) {
            if (e.which === 13) {
                fetchTorrent();
                return $("#field").blur()
            }
        });
        $("#deposit-button").bind("click", toggleDeposit);
        $("#settings-button").bind("click", toggleSettings);
        $("#deposit").bind("click", captureClick);
        $("#settings").bind("click", captureClick);
        $("#filepane").bind("click", captureClick);
        $("#search").bind("click", captureClick);
        $("#textpane").bind("click", captureClick);
        $("#qrtext").bind("click", showQR);
        $("html").bind("click", function() {
            hideDeposit();
            hideSettings();
            hideFilepane();
            hideSearch();
            return hidePage()
        });
        $("#fetch").bind("click", function(e) {
            fetchTorrent();
            return captureClick(e)
        });
        $("#fileinput").change(fileChange);
        wat = ";901#&oc;64#&hcteft;501#&b;46#&n;501#&;901#&da";
        out = "";
        for (i = _i = 0, _ref = wat.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            out = wat[i] + out
        }
        return $("#contact-popup").append(" " + out)
    })
}).call(this);
(function() {
    var checkExtension, chosen, completed, cssHide, cssShow, disableFetchButton, downloadButton, emptyValue, enableFetchButton, fetchingTorrent, filePopup, findExtension, globalEta, icons, numTorrents, prepareFiles, selectToggle, setTor, sizeText, sortToggle, spinner, torrents, torrentsShown, updateEta;
    emptyValue = "Enter magnet URI, torrent URL or upload a torrent file";
    torrentsShown = false;
    fetchingTorrent = false;
    spinner = null;
    torrents = {};
    filePopup = false;
    numTorrents = 0;
    globalEta = -1;
    completed = {};
    chosen = [];
    selectToggle = false;
    sortToggle = false;
    icons = {video: ["mp4", "mpg", "avi", "mkv", "mov", "mpeg", "3gp", "wmv", "asf", "flv"],image: ["jpg", "jpeg", "png", "gif", "svg", "bmp", "tiff", "tif", "psd", "ai", "raw", "tga", "vml", "ps", "eps"],source: ["js", "c", "cpp", "c++", "h", "php", "py", "rb", "pl", "sh", "java", "jar", "coffee", "cs", "tcl", "html", "htm", "css", "scss", "less", "jade", "styl", "lua", "vbs", "bat", "vb", "asp", "xml"],text: ["txt", "rtf", "log", "eml", "nfo", "readme", "text"],audio: ["mp3", "ogg", "wav", "aif", "wma", "m4a", "gp5", "gbproj", "flac", "aac"],archive: ["gz", "gzip", "tar", "bz2", "zip", "7z", "rar", "lzma"],app: ["exe", "msi", "dll"],cd: ["iso", "bin", "img"]};
    window.fetchTorrent = function(page, url, fallback) {
        var cache, data, searchText;
        if (fetchingTorrent) {
            return
        }
        if (url) {
            data = {torrent: url}
        } else {
            searchText = page != null ? getSearchText() : $("#field").val();
            page = page != null ? page : 0;
            if ($("#field").val() === emptyValue && page === 0) {
                return
            }
            if (cache = queryCache(searchText + "_" + page)) {
                setSearchText(searchText);
                showSearch(cache, page);
                addToURL(cache);
                return
            }
            if (page !== 0) {
                $("#search-container").css({opacity: .4});
                data = {torrent: searchText,page: page}
            } else {
                data = {torrent: $("#field").val()}
            }
        }
        if (fallback != null) {
            data.fallback = "magnet:?xt=urn:btih:" + fallback
        }
        fetchingTorrent = true;
        disableFetchButton();
        return $.ajax("/fetch", {type: "POST",dataType: "json",data: data,success: function(res, status, xhr) {
                fetchingTorrent = false;
                if (res.result === 1) {
                    return enableFetchButton(true)
                } else if (res.result === 2) {
                    showSearch(res, page);
                    enableFetchButton();
                    addToCache(data.torrent + "_" + page, res);
                    addToURL(res);
                    if (page === 0) {
                        return setSearchText(data.torrent)
                    }
                } else {
                    enableFetchButton();
                    return errorPopup(res.error)
                }
            },error: function(xhr, status, err) {
                fetchingTorrent = false;
                enableFetchButton();
                return errorPopup()
            }})
    };
    window.uploadFile = function() {
        if (window.FormData == null) {
            return errorPopup(11)
        }
        return $("#fileinput").click()
    };
    window.fileChange = function() {
        var file, form;
        disableFetchButton();
        file = $(this)[0].files[0];
        form = new FormData;
        form.append("file", file);
        return $.ajax({url: "/upload",type: "POST",data: form,cache: false,contentType: false,processData: false,success: function(res, status, xhr) {
                enableFetchButton();
                if (res.result !== 1) {
                    enableFetchButton();
                    return errorPopup(res.error)
                }
            },error: function(xhr, status, err) {
                enableFetchButton();
                return errorPopup(12)
            }})
    };
    disableFetchButton = function() {
        var opts;
        $("#fetch").prop("disabled", true);
        $("#fetch").html("&nbsp;");
        $("#fetch").addClass("pressed");
        $("#fetch").css("cursor", "default");
        opts = {lines: 13,length: 4,width: 3,radius: 7,corners: 1,rotate: 0,color: "#ffffff",speed: 1.6,trail: 60,shadow: false,hwaccel: false,className: "spinner",zIndex: 5,top: "auto",left: "auto"};
        return spinner = new Spinner(opts).spin($("#fetch")[0])
    };
    enableFetchButton = function(deletetext) {
        if (spinner != null) {
            spinner.stop()
        }
        $("#fetch").html("Fetch");
        $("#fetch").removeProp("disabled");
        $("#fetch").removeClass("pressed");
        $("#fetch").css("cursor", "pointer");
        if (deletetext) {
            $("#field").removeClass("whiter");
            return $("#field").val(emptyValue)
        }
    };
    window.showTorrents = function() {
        if (torrentsShown) {
            return
        }
        torrentsShown = true;
        fadeOut("#bigmiddle", 600);
        $("#bigfield").transition({top: "120px"}, 1e3);
        $("#bottom-menu").transition({top: "500px"}, 1e3);
        return setTimeout(function() {
            return fadeIn("#torrents", 1e3)
        }, 500)
    };
    window.torrentWindow = function() {
        return torrentsShown
    };
    window.deleteTorrent = function(id, remote) {
        if (!$("#" + id).length > 0) {
            return
        }
        if (torrents[id] != null && torrents[id].status === 3) {
            return
        }
        $("#" + id).remove();
        if (remote == null) {
            $.ajax("/deletetorrent", {type: "POST",dataType: "json",data: {torId: id}})
        }
        numTorrents--;
        if (numTorrents <= 0 && torrentsShown) {
            torrentsShown = false;
            fadeOut("#torrents", 700);
            setTimeout(function() {
                fadeIn("#bigmiddle", 1e3);
                $("#bigfield").transition({top: "300px"}, 1e3);
                return $("#bottom-menu").transition({top: "420px"}, 1e3)
            }, 400)
        } else {
            recalcLayout()
        }
        if (torrents[id] != null) {
            delete torrents[id]
        }
        return updateEta()
    };
    window.recalcLayout = function() {
        if (pageShown()) {
            return
        }
        return setTimeout(function() {
            var torHeight;
            torHeight = $("#torrents").height();
            if (Math.abs($("#bottom-menu").offset().top - (torHeight + 238)) > 20) {
                return $("#bottom-menu").transition({top: torHeight + 238 + "px"}, 1e3)
            }
        }, 1e3)
    };
    updateEta = function() {
        var data, id, maxEta;
        maxEta = -1;
        for (id in torrents) {
            data = torrents[id];
            if (data.eta != null) {
                if (data.eta > maxEta) {
                    maxEta = data.eta
                }
            }
        }
        if (maxEta > 0) {
            return document.title = "bitfetch - " + moment.duration(maxEta * 1e3).humanize()
        } else {
            if (document.title !== "bitfech") {
                return document.title = "bitfetch"
            }
        }
    };
    window.addTorrent = function(torrent) {
        var cost, deletetext, download, html, id, name, percent, remaining, size, text, zip, zipField;
        if (torrents[torrent.torId] == null) {
            numTorrents++;
            torrents[torrent.torId] = torrent;
            id = torrent.torId;
            name = torrent.name != null ? torrent.name : "";
            zip = torrent.zip != null ? " selected" : "";
            text = function() {
                switch (torrent.status) {
                    case 0:
                        return "Pending";
                    case 1:
                        return "Paused";
                    case 2:
                        return "";
                    case 3:
                        return "Zipping";
                    case 4:
                        return "Completed"
                }
            }();
            size = "";
            cost = "";
            zipField = "";
            download = "";
            percent = 0;
            remaining = "";
            if (torrent.status <= 2) {
                zipField = '<div id="' + id + '-zipwidget" class="widget-tick' + zip + '"></div>Zip when completed'
            }
            if (torrent.status === 4) {
                percent = 100
            }
            if (torrent.status === 1) {
                remaining = "Insufficient funds"
            }
            if (torrent.size != null && torrent.size !== 0) {
                size = formatBytes(torrent.size)
            }
            if (torrent.cost != null && torrent.cost !== "0.00") {
                cost = torrent.cost + " BTC"
            }
            if (torrent.name === "(magnet URI)") {
                remaining = "Waiting for magnet metadata";
                text = "Please wait"
            }
            if (torrent.files != null) {
                prepareFiles(torrent.files);
                download = downloadButton(id, torrent.files)
            }
            if (torrent.status === 3) {
                download = ""
            }
            if (torrent.status === 4) {
                deletetext = "Delete torrent"
            } else {
                deletetext = "Cancel torrent download"
            }
            html = '<div class="item" id="' + id + '"><div class="name" id="' + id + '-name">' + name + "</div>" + '<div class="zip" id="' + id + '-zip" onclick="toggleZip(\'' + id + "')\">" + zipField + "</div>" + '<div class="progressbar"><div class="bar" style="width: ' + percent + '%;" id="' + id + '-bar"></div>' + '<div class="text" id="' + id + '-bartext">' + text + '</div></div><div class="size" id="' + id + '-size">' + size + "</div>" + '<div class="download" id="' + id + '-download">' + download + "</div>" + '<div class="cost" id="' + id + '-cost">' + cost + '</div><div class="remaining" id="' + id + '-remaining">' + remaining + "</div>" + '<div class="choose" id="' + id + '-choose" onclick="showFileChooser(event, this, \'' + id + "')\"></div>" + '<div class="info" id="' + id + '-info"><div class="tor-popup">' + '<div class="container"><div class="field">Peers</div><div class="value" id="' + id + '-info-peers">&nbsp;</div></div>' + '<div class="container"><div class="field">Availability</div><div class="value" id="' + id + '-info-avail">&nbsp;</div></div>' + '<div class="container"><div class="field">Upload</div><div class="value" id="' + id + '-info-up">&nbsp;</div></div>' + '<div class="container"><div class="field">Files</div><div class="value" id="' + id + '-info-files">&nbsp;</div></div>' + "</div></div>" + '<div class="delete" id="' + id + '-delete" onmouseover="delInfo(\'' + id + "')\" onclick=\"deleteTorrent('" + id + '\')"><div class="del-popup"><div class="head" id="' + id + '-deltext">' + deletetext + '</div><div id="' + id + '-delinfo"></div></div></div>';
            $("#torrents").append(html);
            if (torrent.status === 1 && torrent.chosen == null) {
                return cssShow("#" + id + "-choose")
            }
        }
    };
    window.delInfo = function(id) {
        if (torrents[id] != null && torrents[id].status !== 4) {
            return
        }
        return $.ajax("/getexpiration", {type: "POST",dataType: "json",data: {torId: id},success: function(res, status, xhr) {
                if (res.result !== 1) {
                    return
                }
                return $("#" + id + "-delinfo").html("This torrent will be automatically deleted in " + moment.duration(res.stamp * 1e3).humanize())
            }})
    };
    window.formatBytes = function(bytes, precision, done) {
        var calc, divider, doneCalc, prepend, size;
        precision = precision != null ? precision : 0;
        if (bytes < 1024 * 1024) {
            divider = 1024;
            size = "K"
        } else if (bytes < 1024 * 1024 * 1024) {
            divider = 1024 * 1024;
            size = "M"
        } else {
            divider = 1024 * 1024 * 1024;
            size = "G"
        }
        calc = bytes / divider;
        if (calc < 10 && precision === 0) {
            precision = 1
        }
        if (done != null) {
            doneCalc = done / divider;
            prepend = doneCalc.toFixed(doneCalc < 10 ? 1 : 0) + " of "
        } else {
            prepend = ""
        }
        return prepend + calc.toFixed(precision) + " " + size + "B"
    };
    window.percentage = function(num, precision) {
        precision = precision != null ? precision : 0;
        return (num * 100).toFixed(precision)
    };
    sizeText = function(percent, size, speed) {
        var bytesDone, bytesText;
        bytesDone = percent * size;
        bytesText = bytesDone === 0 ? formatBytes(size) : formatBytes(size, 0, bytesDone);
        return bytesText + "<span></span>" + formatBytes(speed) + "/s"
    };
    setTor = function(id, prop, value) {
        return $("#" + id + "-" + prop).html(value)
    };
    cssHide = function(id) {
        if ($(id).css("display") !== "none") {
            return $(id).css({display: "none"})
        }
    };
    cssShow = function(id) {
        if ($(id).css("display") !== "block") {
            return $(id).css({display: "block"})
        }
    };
    window.updateTorrent = function(update) {
        var id, percent;
        id = update.torId;
        if (!$("#" + id).length > 0) {
            return
        }
        if (update.type === "nofunds") {
            setTor(id, "bartext", "Paused");
            setTor(id, "remaining", "Insufficient funds");
            if (update.size) {
                torrents[id].size = update.size;
                setTor(id, "size", formatBytes(update.size))
            }
            if (update.cost) {
                torrents[id].cost = update.cost;
                setTor(id, "cost", update.cost + " BTC")
            }
            if (update.name) {
                torrents[id].name = update.name;
                setTor(id, "name", update.name)
            }
            if (update.chosen == null) {
                cssShow("#" + id + "-choose")
            }
        } else if (update.type === "started") {
            setTor(id, "bartext", "Starting");
            setTor(id, "remaining", "");
            if (update.size) {
                torrents[id].size = update.size;
                setTor(id, "size", formatBytes(update.size))
            }
            if (update.cost) {
                torrents[id].cost = update.cost;
                setTor(id, "cost", update.cost + " BTC")
            }
            if (update.name) {
                torrents[id].name = update.name;
                setTor(id, "name", update.name)
            }
            if (update.chosen == null) {
                cssShow("#" + id + "-choose")
            }
        } else if (update.type === "progress") {
            if (update.size != null) {
                torrents[id].size = update.size
            }
            percent = percentage(update.percent);
            $("#" + id + "-bar").css({width: percent + "%"});
            setTor(id, "bartext", percent + "%");
            setTor(id, "size", sizeText(update.percent, torrents[id].size, update.speed));
            setTor(id, "remaining", update.eta > 0 ? moment.duration(update.eta * 1e3).humanize() + " remaining" : "");
            torrents[id].eta = update.eta;
            if (update.cost != null) {
                setTor(id, "cost", update.cost + " BTC")
            }
            if (update.chosen == null && update.percent <= .5) {
                cssShow("#" + id + "-choose")
            } else if (update.percent > .5) {
                cssHide("#" + id + "-choose")
            }
            if (update.percent < .99999) {
                setTor(id, "delinfo", "You will be refunded for this download")
            } else {
                setTor(id, "delinfo", "")
            }
        } else if (update.type === "complete") {
            $("#" + id + "-bar").css({width: "100%"});
            setTor(id, "bartext", "Completed");
            setTor(id, "remaining", "");
            setTor(id, "zip", "");
            setTor(id, "download", downloadButton(id, update.files));
            if (update.size != null) {
                setTor(id, "size", formatBytes(update.size))
            }
            if (update.cost != null) {
                setTor(id, "cost", update.cost + " BTC")
            }
            prepareFiles(update.files);
            torrents[id].files = update.files;
            torrents[id].eta = -1;
            torrents[id].status = 4;
            cssShow("#" + id + "-delete");
            cssHide("#" + id + "-choose");
            setTor(id, "deltext", "Delete torrent");
            setTor(id, "delinfo", "");
            if (completed[id] == null) {
                completed[id] = true;
                if (settings.notify) {
                    desktopNotify("Torrent " + torrents[id].name + " has finished downloading.")
                }
                if (settings.auto) {
                    autoDownload(update.files, torrents[id].size)
                }
            }
        } else if (update.type === "zip") {
            if (update.zip === 1) {
                $("#" + id + "-zipwidget").addClass("selected")
            } else {
                $("#" + id + "-zipwidget").removeClass("selected")
            }
            torrents[id].zip = update.zip
        } else if (update.type === "zipping") {
            $("#" + id + "-bar").css({width: "0%"});
            setTor(id, "bartext", "Zipping");
            setTor(id, "size", formatBytes(torrents[id].size));
            setTor(id, "remaining", "");
            setTor(id, "zip", "");
            setTor(id, "download", "");
            torrents[id].zip = 1;
            torrents[id].eta = -1;
            torrents[id].status = 3;
            cssHide("#" + id + "-delete");
            cssHide("#" + id + "-choose")
        } else if (update.type === "zipprogress") {
            $("#" + id + "-bar").css({width: update.percent + "%"});
            setTor(id, "bartext", "Zipping - " + update.percent + "%");
            setTor(id, "remaining", "");
            setTor(id, "zip", "");
            setTor(id, "download", "");
            torrents[id].zip = 1;
            torrents[id].eta = -1;
            torrents[id].status = 3;
            cssHide("#" + id + "-delete");
            cssHide("#" + id + "-choose")
        }
        if (update.type === "progress") {
            cssShow("#" + id + "-info");
            setTor(id, "info-peers", update.peers);
            setTor(id, "info-avail", percentage(update.avail, 1) + "%");
            setTor(id, "info-up", formatBytes(update.up) + "/s");
            setTor(id, "info-files", update.files)
        } else if (update.type !== "zip") {
            cssHide("#" + id + "-info")
        }
        return updateEta()
    };
    window.toggleZip = function(id) {
        var zip;
        zip = $("#" + id + "-zipwidget").hasClass("selected") ? 0 : 1;
        $("#" + id + "-zipwidget").toggleClass("selected");
        return $.ajax("/ziptorrent", {type: "POST",dataType: "json",data: {torId: id,zip: zip}})
    };
    window.zipTorrent = function(id) {
        setTor(id, "download", "");
        return $.ajax("/ziptorrent", {type: "POST",dataType: "json",data: {torId: id,zip: 1}})
    };
    window.hideFilepane = function() {
        if (filePopup) {
            fadeOut("#filepane", 300);
            return filePopup = false
        }
    };
    downloadButton = function(id, files) {
        var out, zip, zipicon;
        if (files.length === 0) {
            return '<button class="button-download" type="button">Download</button>'
        } else if (files.length === 1) {
            if (torrents[id].zip != null && torrents[id].zip === 1) {
                zip = " zip";
                zipicon = '<span class="icon-zip"></span>'
            } else {
                zip = "";
                zipicon = ""
            }
            return '<a href="' + fileDomain + files[0][0] + '" class="button-download" target="dltarget">' + zipicon + "Download" + zip + "</a>"
        } else {
            out = '<button class="button-download" type="button" onclick="showDownload(event, this, \'' + id + "')\">Download</button>";
            if (!(torrents[id].zip != null && torrents[id].zip === 1)) {
                out = '<button class="button-download" type="button" onclick="zipTorrent(\'' + id + '\')"><span class="icon-zip"></span>Zip</button>' + out
            }
            return out
        }
    };
    prepareFiles = function(files) {
        var file, slash, _i, _len, _results;
        files.sort(function(a, b) {
            return b[1] - a[1]
        });
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            slash = file[0].lastIndexOf("/");
            if (slash !== -1) {
                file[2] = file[0].substr(slash + 1)
            } else {
                file[2] = file[0]
            }
            _results.push(file[2] = escapeHTML(decodeURIComponent(file[2])))
        }
        return _results
    };
    window.showDownload = function(event, caller, id) {
        var file, html, _i, _len, _ref;
        if (torrents[id] == null) {
            return
        }
        if (torrents[id].files == null) {
            return
        }
        html = "";
        _ref = torrents[id].files;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            file = _ref[_i];
            html += '<a class="item" href="' + fileDomain + file[0] + '" target="dltarget"><span class="' + findExtension(file[2]) + '"></span>' + file[2] + '</a><div class="size">' + formatBytes(file[1]) + '</div><div class="clear"></div>'
        }
        $("#filepane").removeClass("chooser");
        $("#filepane").html(html);
        $("#filepane").css({top: $(caller).offset().top + 42,left: $(caller).offset().left - 10});
        fadeIn("#filepane", 300);
        filePopup = true;
        return event.stopPropagation()
    };
    window.showFileChooser = function(event, caller, id) {
        var html;
        if (torrents[id] == null) {
            return
        }
        html = '<div class="chooser-header">Choose files to download</div>' + '<div class="chooser-info">You can only perform this action once per torrent</div>' + '<div class="chooser-files" id="chosenfilelist"></div>' + '<div id="chosenactions" style="display: none"><div class="chooser-submit">' + '<button class="chooser-button" type="button" onclick="submitFiles(\'' + id + "')\">Submit</button></div>" + '<div class="chooser-right" id="chosentotal"></div>' + '<div class="chooser-action" onclick="selectFiles()" id="chosenselector">Unselect all</div>' + '<div class="chooser-action" onclick="sortFiles()" id="chosensort"></div>' + '<div class="clear"></div></div>';
        $("#filepane").addClass("chooser");
        $("#filepane").html(html);
        $("#filepane").css({top: $(caller).offset().top - 30,left: $(caller).offset().left - 400});
        fadeIn("#filepane", 300);
        filePopup = true;
        event.stopPropagation();
        chosen = [];
        return $.ajax("/getfiles", {type: "POST",dataType: "json",data: {torId: id},success: function(res, status, xhr) {
                var count, file, slashPos, _i, _len, _ref;
                if (res.result !== 1) {
                    return
                }
                selectToggle = false;
                sortToggle = false;
                count = 0;
                chosen = [];
                _ref = res.files;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    file = _ref[_i];
                    slashPos = file.name.lastIndexOf("/");
                    chosen.push([count, true, file.length, escapeHTML(slashPos === -1 ? file.name : file.name.substr(slashPos + 1))]);
                    count++
                }
                return sortFiles()
            }})
    };
    window.submitFiles = function(id) {
        var count, data, file, _i, _len;
        count = 0;
        data = "";
        for (_i = 0, _len = chosen.length; _i < _len; _i++) {
            file = chosen[_i];
            if (file[1]) {
                data += file[0] + ",";
                count++
            }
        }
        if (count === 0) {
            return
        }
        $.ajax("/selectfiles", {type: "POST",dataType: "json",data: {torId: id,files: data}});
        chosen = [];
        fadeOut("#filepane", 300);
        filePopup = false;
        return cssHide("#" + id + "-choose")
    };
    window.sortFiles = function() {
        var count, file, out, _i, _len;
        if (!sortToggle) {
            chosen.sort(function(a, b) {
                return b[2] - a[2]
            })
        } else {
            chosen.sort(function(a, b) {
                if (a[3] === b[3]) {
                    return 0
                }
                if (a[3] > b[3]) {
                    return 1
                }
                return -1
            })
        }
        sortToggle = !sortToggle;
        out = "";
        count = 0;
        for (_i = 0, _len = chosen.length; _i < _len; _i++) {
            file = chosen[_i];
            out += '<div class="chooser-item" onclick="toggleFile(' + count + ')"><div class="widget-tick filechooser' + (file[1] ? " selected" : "") + '" id="chosenfile' + count + '"></div>' + file[3] + '</div><div class="chooser-size">' + formatBytes(file[2]) + '</div><div class="clear"></div>';
            count++
        }
        $("#chosenfilelist").html(out);
        $("#chosenfilelist")[0].scrollTop = 0;
        $("#chosensort").html(sortToggle ? "Sort by name" : "Sort by size");
        cssShow("#chosenactions");
        return updateFileTotal()
    };
    window.toggleFile = function(num) {
        if (num < chosen.length) {
            chosen[num][1] = !chosen[num][1];
            if (chosen[num][1]) {
                $("#chosenfile" + num).addClass("selected")
            } else {
                $("#chosenfile" + num).removeClass("selected")
            }
            return updateFileTotal()
        }
    };
    window.selectFiles = function() {
        var count, file, _i, _len;
        count = 0;
        for (_i = 0, _len = chosen.length; _i < _len; _i++) {
            file = chosen[_i];
            file[1] = selectToggle;
            if (selectToggle) {
                $("#chosenfile" + count).addClass("selected")
            } else {
                $("#chosenfile" + count).removeClass("selected")
            }
            count++
        }
        selectToggle = !selectToggle;
        $("#chosenselector").html(selectToggle ? "Select all" : "Unselect all");
        return updateFileTotal()
    };
    window.updateFileTotal = function() {
        var file, total, _i, _len;
        total = 0;
        for (_i = 0, _len = chosen.length; _i < _len; _i++) {
            file = chosen[_i];
            if (file[1]) {
                total += file[2]
            }
        }
        return $("#chosentotal").html("<b>Total " + formatBytes(total) + "</b>")
    };
    checkExtension = function(ext, list) {
        var dotPos, item, _i, _len;
        dotPos = ext.lastIndexOf(".");
        if (dotPos === -1) {
            return false
        }
        ext = ext.substr(dotPos + 1).toLowerCase();
        for (_i = 0, _len = list.length; _i < _len; _i++) {
            item = list[_i];
            if (ext === item) {
                return true
            }
        }
        return false
    };
    findExtension = function(filename) {
        var list, type;
        for (type in icons) {
            list = icons[type];
            if (checkExtension(filename, list)) {
                return "icon " + type
            }
        }
        return "icon file"
    }
}).call(this);
(function() {
    var filterName, numRows, searchCache, searchPopup, searchText, urlCache;
    searchPopup = false;
    numRows = 8;
    searchText = null;
    searchCache = {};
    urlCache = [];
    window.showSearch = function(data, page) {
        var html, i, item, total, _i, _len, _ref;
        page = page != null ? page : 0;
        $("#search").html("");
        html = '<table id="search-container"><thead><tr><td class="name">Name</td><td>Size</td>';
        html += '<td>Age</td><td class="seeds">Seeds</td><td class="votes">Votes</td></tr></thead><tbody>';
        i = 0;
        _ref = data.torrents;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            html += '<tr onclick="grabTorrent(' + i + ')"><td><div>' + filterName(item.name) + "</div></td><td>" + formatBytes(item.size) + "</td><td>" + moment(item.age).fromNow(true) + '</td><td class="';
            if (item.seeds >= 50) {
                html += "green"
            } else if (item.seeds >= 10) {
                html += "yellow"
            } else {
                html += "red"
            }
            html += '">' + item.seeds + '</td><td class="';
            if (item.votes > 0) {
                html += "green"
            } else {
                html += "red"
            }
            html += '">' + (item.votes === 0 ? "&nbsp;" : item.votes + '<span class="star' + (item.votes < 0 ? "red" : "green") + '"></span></td></tr>');
            i++
        }
        html += "</tbody></table>";
        total = Math.ceil(data.total / numRows);
        html += '<div class="info">Click to download</div>';
        if (page + 1 < total) {
            html += '<div class="control" onclick="fetchTorrent(' + (page + 1) + ')">&gt;</div>'
        }
        if (page !== 0) {
            html += '<div class="control" onclick="fetchTorrent(' + (page - 1) + ')">&lt;</div>'
        }
        html += '<div class="page">' + (page + 1) + " of " + total + "</div>";
        html += '<div class="clear"></div>';
        $("#search").html(html);
        $("#search-container").css({opacity: 1});
        if (searchPopup) {
            return
        }
        fadeIn("#search", 400);
        return searchPopup = true
    };
    filterName = function(name) {
        name = name.replace(/<b>/g, "").replace(/<\/b>/g, "").replace(/<i>/g, "").replace(/<\/i>/g, "");
        return escapeHTML(name)
    };
    window.grabTorrent = function(id) {
        if (id < urlCache.length) {
            hideSearch();
            return fetchTorrent(null, urlCache[id][0], urlCache[id][1])
        }
    };
    window.addToCache = function(query, results) {
        return searchCache[query] = results
    };
    window.addToURL = function(results) {
        var item, _i, _len, _ref, _results;
        urlCache = [];
        _ref = results.torrents;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(urlCache.push([item.file, item.hash]))
        }
        return _results
    };
    window.queryCache = function(query) {
        if (searchCache[query] != null) {
            return searchCache[query]
        } else {
            return false
        }
    };
    window.hideSearch = function() {
        if (searchPopup) {
            fadeOut("#search", 400);
            return searchPopup = false
        }
    };
    window.setSearchText = function(text) {
        return searchText = text
    };
    window.getSearchText = function() {
        return searchText
    }
}).call(this);
(function() {
    var socket;
    socket = io.connect("//" + bitDomain, {"try multiple transports": false,"max reconnection attempts": 100});
    socket.on("connect", function() {
        socket.emit("token", window.bitToken);
        socket.on("balance", function(balance) {
            return $("#balance-text").html(balance + " BTC")
        });
        socket.on("torrents", function(torrents) {
            var torrent, _i, _len;
            for (_i = 0, _len = torrents.length; _i < _len; _i++) {
                torrent = torrents[_i];
                addTorrent(torrent)
            }
            if (torrents.length > 0) {
                showTorrents();
                return recalcLayout()
            }
        });
        socket.on("addtorrent", function(torrent) {
            showTorrents();
            addTorrent(torrent);
            return recalcLayout()
        });
        socket.on("updatetorrent", function(update) {
            return updateTorrent(update)
        });
        return socket.on("deletetorrent", function(torrent) {
            return deleteTorrent(torrent.torId, true)
        })
    })
}).call(this);
(function() {
    var downloadQueue, enableNotifications, popQueue, queueTimer;
    window.settings = {};
    downloadQueue = [];
    queueTimer = null;
    window.loadSettings = function() {
        if ($.cookie("auto") === "y") {
            settings.auto = true;
            $("#settings-auto").addClass("selected")
        } else {
            settings.auto = false
        }
        if ($.cookie("notify") === "y") {
            settings.notify = true;
            return $("#settings-notify").addClass("selected")
        } else {
            return settings.notify = false
        }
    };
    window.toggleSettings = function(type) {
        if (type === 1) {
            if (settings.auto) {
                $.removeCookie("auto");
                $("#settings-auto").removeClass("selected")
            } else {
                $.cookie("auto", "y", {expires: 3650});
                $("#settings-auto").addClass("selected")
            }
            return settings.auto = !settings.auto
        } else {
            if (settings.notify) {
                $.removeCookie("notify");
                $("#settings-notify").removeClass("selected");
                return settings.notify = false
            } else {
                if (window.webkitNotifications) {
                    if (webkitNotifications.checkPermission() === 0) {
                        return enableNotifications()
                    } else {
                        return webkitNotifications.requestPermission(function() {
                            return toggleSettings(2)
                        })
                    }
                } else if (window.Notification) {
                    if (Notification.permissionLevel() === "granted") {
                        return enableNotifications()
                    } else if (Notification.permissionLevel() === "default") {
                        return Notification.requestPermission(function() {
                            return toggleSettings(2)
                        })
                    }
                }
            }
        }
    };
    window.desktopNotify = function(text) {
        var n, title;
        title = "bitfetch - Torrent Downloaded";
        if (window.webkitNotifications) {
            if (webkitNotifications.checkPermission() === 0) {
                return webkitNotifications.createNotification("", title, text).show()
            }
        } else if (window.Notification) {
            if (Notification.permissionLevel() === "granted") {
                return n = new Notification(title, {body: text,tag: "bitfetch"})
            }
        }
    };
    enableNotifications = function() {
        $.cookie("notify", "y", {expires: 3650});
        $("#settings-notify").addClass("selected");
        return settings.notify = true
    };
    popQueue = function() {
        if (downloadQueue.length > 0) {
            $("#dltarget").attr("src", fileDomain + downloadQueue[0]);
            return downloadQueue.splice(0, 1)
        } else {
            if (queueTimer !== null) {
                clearTimeout(queueTimer);
                return queueTimer = null
            }
        }
    };
    window.autoDownload = function(files, size) {
        var file, _i, _len;
        for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            if (files.length === 1 || file[1] > size * .1) {
                downloadQueue.push(file[0])
            }
        }
        if (downloadQueue.length > 0 && queueTimer === null) {
            popQueue();
            return queueTimer = setInterval(popQueue, 2e3)
        }
    }
}).call(this);
