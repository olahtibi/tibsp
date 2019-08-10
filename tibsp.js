var Lambda = function(parameters, expression) {
    this.parameters = parameters;
    this.expression = expression;
};

var Scope = function(parent, map) {
    this.parent = parent;
    this.map = map;
};

Scope.prototype.find = function(key) {
    var currentScope = this;
    while(currentScope != null) {
        if(currentScope.map[key] != null && currentScope.map[key] != undefined) {
            return currentScope.map[key];
        }
        else{
            currentScope = currentScope.parent;
        }
    }
    throw (key + " is undefined!");
};

var tibsp = {

    builtin: {

        multiply: function(list) {
            var result = Number(list[0]);
            for(var i = 1; i < list.length; i++) {
                result *= Number(list[i]);
            }
            return result;
        },

        divide: function(list) {
            var result = Number(list[0]);
            for(var i = 1; i < list.length; i++) {
                result /= Number(list[i]);
            }
            return result;
        },

        add: function(list) {
            var result = Number(list[0]);
            for(var i = 1; i < list.length; i++) {
                result += Number(list[i]);
            }
            return result;
        },

        substract: function(list) {
            var result = Number(list[0]);
            for(var i = 1; i < list.length; i++) {
                result -= Number(list[i]);
            }
            return result;
        },

        block: function(list) {
            var result = [];
            for(var i = 0; i < list.length; i++) {
                if(list[i] != null) {
                    result.push(list[i]);
                }
            }
            return result;
        },

        eq: function(list) {
            if(Array.isArray(list[0])) {
                var a = list[0];
                var b = list[1];
                if (a === b) return 1;
                if (a == null || b == null) return 0;
                if (a.length != b.length) return 0;
                for (var i = 0; i < a.length; ++i) {
                    if (a[i] != b[i]) return 0;
                }
                return 1;
            }
            else {
                return (list[0] == list[1] ? 1 : 0);
            }
        },

        lt: function(list) {
            return (list[0] < list[1] ? 1 : 0);
        },

        lte: function(list) {
            return (list[0] <= list[1] ? 1 : 0);
        },

        gt: function(list) {
            return (list[0] > list[1] ? 1 : 0);
        },

        gte: function(list) {
            return (list[0] >= list[1] ? 1 : 0);
        },

        head: function(list) {
            return list[0][0];
        },

        tail: function(list) {
            var result = [];
            for(var i = 1; i < list[0].length; i++) {
                result.push(list[0][i]);
            }
            return result;
        },

        push: function(list) {
            var result = [list[0]];
            for(var i = 0; i < list[1].length; i++) {
                result.push(list[1][i]);
            }
            return result;
        },

        append: function(list) {
            var result = [];
            for(var i = 0; i < list.length; i++) {
                for(var j = 0; j < list[i].length; j++) {
                    result.push(list[i][j]);
                }
            }
            return result;
        },

        wrap: function(list) {
            var result = [];
            for (var i = 0; i < list.length; i++) {
                result.push(list[i]);
            }
            return result
        },

        length: function(list) {
            return list[0].length;
        },

        cat: function(list) {
            var str = "";
            for(var i = 0; i < list.length; i++) {
                str+=list[i];
            }
            return str;
        },

        throw: function(list) {
            throw(list[0]);
        }

    },

    // https://stackoverflow.com/questions/15420504/how-do-i-split-a-string-by-space-in-javascript-except-when-the-spaces-occur-bet
    tokenize: function(str) {
        str = str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ');
        var re = /(?:")([^"]+)(?:")|([^\s"]+)(?=\s+|$)/g;
        var res = [], arr = null;
        while (arr = re.exec(str)) {
            res.push(arr[1] ? arr[1] : arr[0]);
        }
        return res;
    },

    buildExpressionTree: function(tokens) {
        if(tokens.length == 0) {
            throw("unexpected EOF while reading");
        }
        var token = tokens.shift();
        if("(" == token) {
            var list = [];
            while(tokens[0] != ")") {
                list.push(tibsp.buildExpressionTree(tokens));
            }
            tokens.shift();
            return list;
        }
        else if(")" == token) {
            throw("unexpected )");
        }
        else {
            return token;
        }
    },

    exec: function(proc, args, scope) {
        if (typeof proc === 'string' || proc instanceof String || Array.isArray(proc)) {
            proc = tibsp.eval(proc, scope);
        }
        if(proc instanceof Lambda) {
            var map = {};
            for(var i = 0; i < proc.parameters.length; i++) {
                map[proc.parameters[i]] = args[i];
            }
            var childScope = new Scope(scope, map);
            return tibsp.eval(proc.expression, childScope);
        }
        else {
            return proc(args);
        }
    },

    eval: function(node, scope) {
        if(Array.isArray(node)) {
            if(node[0] == 'quote' || node[0] == '\'') {
                var res = [];
                for(var i = 1; i < node.length; i++) {
                    res.push(node[i]);
                }
                return res.length == 1 ? res[0] : res;
            }
            else if(node[0] == 'define') {
                // variable definition
                scope.map[node[1]] = tibsp.eval(node[2], scope);
                return null;
            }
            else if(node[0] == 'lambda') {
                // lambda definition
                return new Lambda(node[1], node[2]);
            }
            else if(node[0] == 'if') {
                var expr = tibsp.eval(node[1], scope);
                if(expr == 1) {
                    return tibsp.eval(node[2], scope);
                }
                else {
                    return tibsp.eval(node[3], scope);
                }
            }
            else if(node[0] == 'switch') {
                for(var i = 0; i < (node.length - 1) / 2; i++) {
                    var expr = tibsp.eval(node[i * 2 + 1], scope);
                    if(expr == 1) {
                        return tibsp.eval(node[i * 2 + 2], scope);
                    }
                }
                return null;
            }
            else if(node[0] == 'and') {
                for(var i = 1; i < node.length; i++) {
                    var expr = tibsp.eval(node[i], scope);
                    if(expr != 1) {
                        return 0;
                    }
                }
                return 1;
            }
            else if(node[0] == 'or') {
                for(var i = 1; i < node.length; i++) {
                    var expr = tibsp.eval(node[i], scope);
                    if(expr == 1) {
                        return 1;
                    }
                }
                return 0;
            }
            else if(node[0] == 'apply') {
                var proc = tibsp.eval(node[1], scope);
                var args = [];
                for(var i = 2; i < node.length; i++) {
                    args.push(tibsp.eval(node[i], scope));
                }
                return tibsp.exec(proc, args, scope);
            }
            else {
                // procedure call
                var args = [];
                for(var i = 1; i < node.length; i++) {
                    args.push(tibsp.eval(node[i], scope));
                }
                return tibsp.exec(node[0], args, scope);
            }
        }
        if(isNaN(node)) {
            // variable reference
            return scope.find(node);
        }
        else {
            // constant literal
            return node;
        }
    },

    run: function(source) {
        var tokens = tibsp.tokenize(source);
        var tree = tibsp.buildExpressionTree(tokens);
        return tibsp.eval(tree, tibsp.defaultScope);
    }

};

tibsp.defaultScope = new Scope(null, {
    "block": tibsp.builtin.block,
    "*": tibsp.builtin.multiply,
    "/": tibsp.builtin.divide,
    "+": tibsp.builtin.add,
    "-": tibsp.builtin.substract,
    "<": tibsp.builtin.lt,
    "<=": tibsp.builtin.lte,
    ">": tibsp.builtin.gt,
    ">=": tibsp.builtin.gte,
    "=": tibsp.builtin.eq,
    "head": tibsp.builtin.head,
    "tail": tibsp.builtin.tail,
    "push": tibsp.builtin.push,
    "append": tibsp.builtin.append,
    "wrap": tibsp.builtin.wrap,
    "length": tibsp.builtin.length,
    "cat": tibsp.builtin.cat,
    "throw": tibsp.builtin.throw
})
