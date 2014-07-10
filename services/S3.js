var fs   = require('fs'),
    AWS  = require('aws-sdk'),
    mime = require('mime');

function S3(cfg) {
    AWS.config.update({
        'accessKeyId'    : cfg.key,
        'secretAccessKey': cfg.secret,
        'region'         : cfg.region
    });
    this.s3     = new AWS.S3();
    this.bucket = cfg.bucket;
}
S3.prototype = {
    'write': function (key, file, cb) {
        var outfile = null, stream = null;

        try {
            stream = fs.createReadStream(file);
        } catch(e) {
            return cb(e);
        }

        try {
            mimetype = mime.lookup(file);
        } catch(e) {
            return cb(e);
        }

        this.s3.putObject({
            'Bucket'     : this.bucket,
            'Key'        : key,
            'Body'       : stream,
            'ContentType': mimetype
        }, function (err, data) {
            if (err) {
                return cb(err);
            }

            cb();
        });
    },

    'read': function (key) {
        return this.s3.getObject({
            'Bucket': this.bucket,
            'Key'   : key,
        }).createReadStream();
    }
};
module.exports = S3;
