/** layui-v2.5.5 MIT License By https://www.layui.com */ ;
layui.define("jquery", function(e) { "use strict"; var a = layui.jquery,
        i = { config: {}, index: layui.rate ? layui.rate.index + 1e4 : 0, set: function(e) { var i = this; return i.config = a.extend({}, i.config, e), i }, on: function(e, a) { return layui.onevent.call(this, n, e, a) } },
        l = function() { var e = this,
                a = e.config; return { setvalue: function(a) { e.setvalue.call(e, a) }, config: a } },
        n = "rate",
        t = "layui-rate",
        o = "layui-icon-rate",
        s = "layui-icon-rate-solid",
        u = "layui-icon-rate-half",
        r = "layui-icon-rate-solid layui-icon-rate-half",
        c = "layui-icon-rate-solid layui-icon-rate",
        f = "layui-icon-rate layui-icon-rate-half",
        v = function(e) { var l = this;
            l.index = ++i.index, l.config = a.extend({}, l.config, i.config, e), l.render() };
    v.prototype.config = { length: 5, text: !1, readonly: !1, half: !1, value: 0, theme: "" }, v.prototype.render = function() { var e = this,
            i = e.config,
            l = i.theme ? 'style="color: ' + i.theme + ';"' : "";
        i.elem = a(i.elem), parseInt(i.value) !== i.value && (i.half || (i.value = Math.ceil(i.value) - i.value < .5 ? Math.ceil(i.value) : Math.floor(i.value))); for (var n = '<ul class="layui-rate" ' + (i.readonly ? "readonly" : "") + ">", u = 1; u <= i.length; u++) { var r = '<li class="layui-inline"><i class="layui-icon ' + (u > Math.floor(i.value) ? o : s) + '" ' + l + "></i></li>";
            i.half && parseInt(i.value) !== i.value && u == Math.ceil(i.value) ? n = n + '<li><i class="layui-icon layui-icon-rate-half" ' + l + "></i></li>" : n += r }
        n += "</ul>" + (i.text ? '<span class="layui-inline">' + i.value + "星" : "") + "</span>"; var c = i.elem,
            f = c.next("." + t);
        f[0] && f.remove(), e.elemTemp = a(n), i.span = e.elemTemp.next("span"), i.setText && i.setText(i.value), c.html(e.elemTemp), c.addClass("layui-inline"), i.readonly || e.action() }, v.prototype.setvalue = function(e) { var a = this,
            i = a.config;
        i.value = e, a.render() }, v.prototype.action = function() { var e = this,
            i = e.config,
            l = e.elemTemp,
            n = l.find("i").width();
        l.children("li").each(function(e) { var t = e + 1,
                v = a(this);
            v.on("click", function(e) { if (i.value = t, i.half) { var o = e.pageX - a(this).offset().left;
                    o <= n / 2 && (i.value = i.value - .5) }
                i.text && l.next("span").text(i.value + "星"), i.choose && i.choose(i.value), i.setText && i.setText(i.value) }), v.on("mousemove", function(e) { if (l.find("i").each(function() { a(this).addClass(o).removeClass(r) }), l.find("i:lt(" + t + ")").each(function() { a(this).addClass(s).removeClass(f) }), i.half) { var c = e.pageX - a(this).offset().left;
                    c <= n / 2 && v.children("i").addClass(u).removeClass(s) } }), v.on("mouseleave", function() { l.find("i").each(function() { a(this).addClass(o).removeClass(r) }), l.find("i:lt(" + Math.floor(i.value) + ")").each(function() { a(this).addClass(s).removeClass(f) }), i.half && parseInt(i.value) !== i.value && l.children("li:eq(" + Math.floor(i.value) + ")").children("i").addClass(u).removeClass(c) }) }) }, v.prototype.events = function() { var e = this;
        e.config }, i.render = function(e) { var a = new v(e); return l.call(a) }, e(n, i) });