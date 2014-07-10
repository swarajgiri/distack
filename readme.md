# Distributed Storage Stack

Read and write to multiple storage systems through one simple API.
Currently supports serial and parallel writes to:
* Amazon S3
* Local disk

### Installation

npm install dss

### Quick Start
```js
var DSS = require('dss');

// init
var store = new DSS({
    {
        'tag' : 'local',
        'type': 'Disk',
        'cfg' : {...}
    },
    {
        'tag' : 'cloud',
        'type': 'S3',
        'cfg' : {...}
    }
});

// write
store.write(['local', 'cloud'], 'myKey', 'my/file', function (err) {...});

// read
try {
  var readStream = store.read('local', 'myKey');
} catch(e) {...}

## Storage services

### Amazon S3
```js
var store = new DSS({
    {
        'tag' : 'cloud',
        'type': 'S3',
        'cfg' : {
            'key'   : '<ACCESS_KEY>',
            'secret': '<SECRET>',
            'region': '<REGION>1',
            'bucket': '<BUCKET_NAME>'
        }
    }
});

### Local Disk Storage
```js
var store = new DSS({
    {
        'tag' : 'local',
        'type': 'Disk',
        'cfg' : {
            'basedir': './uploads'
        }
    }
});

### License
[MIT](LICENSE)

