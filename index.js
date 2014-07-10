var async = require('async');
var _     = require('lodash');

var services = {};
_.each(['Disk', 'S3'], function (name) {
    services[name] = require('./services/' + name);
});

function serviceWrite(name, cfg, key, file, cb) {
    var service = new services[name](cfg);
    service.write(key, file, cb);
}

function getServiceStackObj(tag) {
    return _.first(_.where(this.stack, {'tag': tag}));
}

function genWriteTasks(tags, key, file) {
    var that   = this;
    var stack  = [];

    _.each(tags, function (tag) {
        var matching = _.filter(that.stack, function (x) {
            return x.tag === tag;
        }, []);

        _.each(matching, function (x) {
            stack.push(x);
        });
    });

    return _.map(stack, function (x) {
        return function (cb) {
            serviceWrite(x.type, x.cfg, key, file, cb);
        };
    });
}

function SS(stack) {
    this.stack = stack;
}
SS.prototype = {
    'write': function (tags, key, file, cb) {
        async.series(genWriteTasks.call(this, tags, key, file), cb);
    },

    'writep': function (tags, key, file, cb) {
        async.parallel(genWriteTasks.call(this, tags, key, file), cb);
    },

    'read': function (tag, key) {
        var stackElement = getServiceStackObj.call(this, tag);
        var service = new services[stackElement.type](stackElement.cfg);
        return service.read(key);
    }
};

module.exports = SS;
