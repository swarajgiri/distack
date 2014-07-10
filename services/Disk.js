var fs     = require('fs'),
    path   = require('path'),
    mkdirp = require('mkdirp');

function Disk(cfg) {
    this.cfg = cfg;
}
Disk.prototype = {
    'write': function (key, file, cb) {
        var outfile = null, stream = null;

        try {
            outfile = resolveKey.call(this, key);
        } catch (e) {
            return cb(e);
        }

        mkdirp(path.dirname(outfile), function (err) {
            if (err) {
                return cb(err);
            }

            try {
                stream = fs.createReadStream(file);
            } catch (e) {
                return cb(e);
            }

            stream.on('error', function (err) {
                cb(err);
            }).on('end', function () {
                cb();
            }).pipe(fs.createWriteStream(outfile));
        });
    },

    'read': function (key) {
        var file = resolveKey.call(this, key);
        return fs.createReadStream(file);
    }
};

function resolveKey(key) {
    return path.resolve(this.cfg.basedir + '/' + key);
}

module.exports = Disk;
