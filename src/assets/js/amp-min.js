! function(n) {
    "use strict";
    if ("object" == typeof module && module && "object" == typeof module.exports) module.exports = n();
    else {
        if ("undefined" == typeof window && "undefined" == typeof self) throw new Error("Environment was not anticipated.");
        var t = "undefined" != typeof window ? window : self,
            e = t.amp;
        t.amp = n(), t.amp.noConflict = function() { return t.amp = e, this }
    }
}(function() {
    "use strict";

    function n(n) {
        var e = [],
            o = {};
        return n && (r(n["@graph"], function(n) { o[n["@id"]] = n }), r(n.result, function(n) {
            if (n["@id"]) {
                var r = t({ "@id": n["@id"] }, o);
                r && e.push(r)
            }
        })), e
    }

    function t(n, i) {
        return r(o(n), function(t) {
            var e = n[t];
            if ("@id" === t) {
                if (!i[e]) return;
                r(o(i[e]), function(t) { n[t] = i[e][t] })
            }
        }), r(o(n), function(o) {
            var f = n[o];
            null !== f && "object" == typeof f ? n[o] = t(n[o], i) : e(f) && r(f, function(e, r) { n[o][r] = t(n[o][r], i) })
        }), n
    }
    var e = Array.isArray || function(n) { return "[object Array]" === Object.prototype.toString.call(n) },
        o = Object.keys || function(n) { var t = []; for (var e in n) n.hasOwnProperty(e) && t.push(e); return t },
        r = function(n, t, o) {
            if (e(n))
                if (n.forEach) n.forEach(t, o);
                else
                    for (var r = 0, i = n.length; i > r; r++) t.call(o, n[r], r, n)
        };
    return { inlineContent: n }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNtcy1qYXZhc2NyaXB0LXNkay5qcyJdLCJuYW1lcyI6WyJkZWZpbml0aW9uIiwibW9kdWxlIiwiZXhwb3J0cyIsIndpbmRvdyIsInNlbGYiLCJFcnJvciIsImdsb2JhbCIsInByZXZpb3VzQW1wIiwiYW1wIiwibm9Db25mbGljdCIsInRoaXMiLCJpbmxpbmVDb250ZW50IiwiZGVsaXZlcnkiLCJpbmxpbmVkQ29udGVudCIsImNvbnRlbnRLZXlNYXAiLCJfZm9yRWFjaCIsImNvbnRlbnQiLCJyZXN1bHQiLCJpbmxpbmVDaGlsZENvbnRlbnQiLCJAaWQiLCJwdXNoIiwicGFyZW50Tm9kZSIsIl9rZXlzIiwia2V5IiwidmFsdWUiLCJjaGlsZEtleSIsIl9pc0FycmF5IiwiaXRlbSIsImkiLCJBcnJheSIsImlzQXJyYXkiLCJhcmciLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJrZXlzIiwib2JqIiwiayIsImhhc093blByb3BlcnR5IiwiYXJyIiwiaXRlcmF0b3IiLCJjb250ZXh0IiwiZm9yRWFjaCIsImxlbiIsImxlbmd0aCJdLCJtYXBwaW5ncyI6IkNBRUEsU0FBV0EsR0FDUCxZQUVBLElBQXNCLGdCQUFYQyxTQUF1QkEsUUFBb0MsZ0JBQW5CQSxRQUFPQyxRQUN0REQsT0FBT0MsUUFBVUYsUUFDZCxDQUFBLEdBQXNCLG1CQUFYRyxTQUEwQyxtQkFBVEMsTUFVL0MsS0FBTSxJQUFJQyxPQUFNLG1DQVRoQixJQUFJQyxHQUEyQixtQkFBWEgsUUFBeUJBLE9BQVNDLEtBRWxERyxFQUFjRCxFQUFPRSxHQUN6QkYsR0FBT0UsSUFBTVIsSUFDYk0sRUFBT0UsSUFBSUMsV0FBYSxXQUVwQixNQURBSCxHQUFPRSxJQUFNRCxFQUNORyxRQU1oQixXQUNDLFlBOEJBLFNBQVNDLEdBQWNDLEdBQ25CLEdBQUlDLE1BQ0FDLElBbUJKLE9BakJJRixLQUNBRyxFQUFTSCxFQUFTLFVBQVcsU0FBVUksR0FDbkNGLEVBQWNFLEVBQVEsUUFBVUEsSUFHcENELEVBQVNILEVBQVNLLE9BQVEsU0FBVUEsR0FDaEMsR0FBS0EsRUFBTyxPQUFaLENBSUEsR0FBSUQsR0FBVUUsR0FBb0JDLE1BQU9GLEVBQU8sUUFBU0gsRUFDckRFLElBQ0FILEVBQWVPLEtBQUtKLE9BS3pCSCxFQUdYLFFBQVNLLEdBQW1CRyxFQUFZUCxHQXdCcEMsTUF2QkFDLEdBQVNPLEVBQU1ELEdBQWEsU0FBVUUsR0FDbEMsR0FBSUMsR0FBUUgsRUFBV0UsRUFDdkIsSUFBWSxRQUFSQSxFQUFlLENBQ2YsSUFBS1QsRUFBY1UsR0FDZixNQUVKVCxHQUFTTyxFQUFNUixFQUFjVSxJQUFTLFNBQVVDLEdBQzVDSixFQUFXSSxHQUFZWCxFQUFjVSxHQUFPQyxRQUt4RFYsRUFBU08sRUFBTUQsR0FBYSxTQUFVRSxHQUNsQyxHQUFJQyxHQUFRSCxFQUFXRSxFQUNULFFBQVZDLEdBQW1DLGdCQUFWQSxHQUN6QkgsRUFBV0UsR0FBT0wsRUFBbUJHLEVBQVdFLEdBQU1ULEdBQy9DWSxFQUFTRixJQUNoQlQsRUFBU1MsRUFBTyxTQUFVRyxFQUFNQyxHQUM1QlAsRUFBV0UsR0FBS0ssR0FBS1YsRUFBbUJHLEVBQVdFLEdBQUtLLEdBQUlkLE9BS2pFTyxFQTVFWCxHQUFJSyxHQUFXRyxNQUFNQyxTQUFXLFNBQVVDLEdBQ3RDLE1BQStDLG1CQUF4Q0MsT0FBT0MsVUFBVUMsU0FBU0MsS0FBS0osSUFHdENULEVBQVFVLE9BQU9JLE1BQVEsU0FBVUMsR0FDakMsR0FBSUQsS0FDSixLQUFLLEdBQUlFLEtBQUtELEdBQ05BLEVBQUlFLGVBQWVELElBQ25CRixFQUFLaEIsS0FBS2tCLEVBR2xCLE9BQU9GLElBR1ByQixFQUFXLFNBQVV5QixFQUFLQyxFQUFVQyxHQUNwQyxHQUFLaEIsRUFBU2MsR0FJZCxHQUFJQSxFQUFJRyxRQUNKSCxFQUFJRyxRQUFRRixFQUFVQyxPQUV0QixLQUFLLEdBQUluQixHQUFNLEVBQUdxQixFQUFNSixFQUFJSyxPQUFjRCxFQUFOckIsRUFBV0EsSUFDM0NrQixFQUFTTixLQUFLTyxFQUFTRixFQUFJakIsR0FBTUEsRUFBS2lCLEdBd0RsRCxRQUNJN0IsY0FBZUEiLCJmaWxlIjoiY21zLWphdmFzY3JpcHQtc2RrLm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qZ2xvYmFsIHdpbmRvdyBzZWxmKi9cclxuXHJcbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB2YXIgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBzZWxmO1xyXG5cclxuICAgICAgICB2YXIgcHJldmlvdXNBbXAgPSBnbG9iYWwuYW1wO1xyXG4gICAgICAgIGdsb2JhbC5hbXAgPSBkZWZpbml0aW9uKCk7XHJcbiAgICAgICAgZ2xvYmFsLmFtcC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBnbG9iYWwuYW1wID0gcHJldmlvdXNBbXA7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRW52aXJvbm1lbnQgd2FzIG5vdCBhbnRpY2lwYXRlZC4nKTtcclxuICAgIH1cclxuXHJcbn0pKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcmcpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyZykgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBfa2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICB2YXIga2V5cyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcclxuICAgICAgICAgICAgICAgIGtleXMucHVzaChrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ga2V5cztcclxuICAgIH07XHJcblxyXG4gICAgdmFyIF9mb3JFYWNoID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIGNvbnRleHQpIHtcclxuICAgICAgICBpZiAoIV9pc0FycmF5KGFycikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFyci5mb3JFYWNoKSB7XHJcbiAgICAgICAgICAgIGFyci5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBrZXkgPCBsZW47IGtleSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycltrZXldLCBrZXksIGFycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGlubGluZUNvbnRlbnQoZGVsaXZlcnkpIHtcclxuICAgICAgICB2YXIgaW5saW5lZENvbnRlbnQgPSBbXTtcclxuICAgICAgICB2YXIgY29udGVudEtleU1hcCA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoZGVsaXZlcnkpIHtcclxuICAgICAgICAgICAgX2ZvckVhY2goZGVsaXZlcnlbJ0BncmFwaCddLCBmdW5jdGlvbiAoY29udGVudCkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudEtleU1hcFtjb250ZW50WydAaWQnXV0gPSBjb250ZW50O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIF9mb3JFYWNoKGRlbGl2ZXJ5LnJlc3VsdCwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRbJ0BpZCddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gaW5saW5lQ2hpbGRDb250ZW50KHsnQGlkJzogcmVzdWx0WydAaWQnXX0sIGNvbnRlbnRLZXlNYXApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmxpbmVkQ29udGVudC5wdXNoKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbmxpbmVkQ29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbmxpbmVDaGlsZENvbnRlbnQocGFyZW50Tm9kZSwgY29udGVudEtleU1hcCkge1xyXG4gICAgICAgIF9mb3JFYWNoKF9rZXlzKHBhcmVudE5vZGUpLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcmVudE5vZGVba2V5XTtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ0BpZCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY29udGVudEtleU1hcFt2YWx1ZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfZm9yRWFjaChfa2V5cyhjb250ZW50S2V5TWFwW3ZhbHVlXSksIGZ1bmN0aW9uIChjaGlsZEtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGVbY2hpbGRLZXldID0gY29udGVudEtleU1hcFt2YWx1ZV1bY2hpbGRLZXldO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfZm9yRWFjaChfa2V5cyhwYXJlbnROb2RlKSwgZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJlbnROb2RlW2tleV07XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlW2tleV0gPSBpbmxpbmVDaGlsZENvbnRlbnQocGFyZW50Tm9kZVtrZXldLCBjb250ZW50S2V5TWFwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChfaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIF9mb3JFYWNoKHZhbHVlLCBmdW5jdGlvbiAoaXRlbSwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudE5vZGVba2V5XVtpXSA9IGlubGluZUNoaWxkQ29udGVudChwYXJlbnROb2RlW2tleV1baV0sIGNvbnRlbnRLZXlNYXApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbmxpbmVDb250ZW50OiBpbmxpbmVDb250ZW50XHJcbiAgICB9O1xyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=