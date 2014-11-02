'use strict';

/** @module nopress */

var
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    Q = require('q'),
    mkdirp = require('mkdirp'),
    rimraf = require('rimraf'),
    yaml = require('js-yaml'),
    moment = require('moment'),
    data = null,
    meta = null,
    config = {
        //dataDir: path.join(process.cwd(), 'data')
        //metaDir: path.join(process.cwd(), 'meta')
        //tempDir: path.join(process.cwd(), 'temp')
        //encoding: 'utf8',
        frontMatter: 'auto',//'yaml','json',...
        frontMatterSeparator: '\n---\n'
    },
    debug = require('debug')('nopress'),
    DEBUG = debug.enabled;

function init(opts) {
    config = _.merge(config, opts);
    DEBUG && debug('***init nopress...', config);
    module.exports.data = data = require('./data')(config);
    module.exports.meta = meta = require('./meta')(config);
    mkdirp.sync(config.dataDir);
    mkdirp.sync(config.metaDir);
    mkdirp.sync(config.tempDir);
    process.once('SIGTERM', destroy);
    return module.exports;
}

function destroy() {
    DEBUG && debug('***destroy nopress...');
}

//---------------------------------------------------------

function readTree(dir, filterFunc, callback) {
    fs.readdir(dir, function (err, names) {
        if (err) {
            return callback(err);
        }
        var remaining = names.length;
        if (!remaining) {
            return callback(null, []);
        }
        var result = [];
        names.forEach(function (name) {
            var file = path.join(dir, name);
            fs.stat(file, function (err, stat) {
                if (err) {
                    return callback(err);
                }
                if (stat.isDirectory(file)) {
                    // NOTE: recursion!!!
                    readTree(file, filterFunc, function (err, files) {
                        if (err) {
                            callback(err);
                            callback = _.noop;
                            return;
                        }
                        result = result.concat(files);
                        if (--remaining === 0) {
                            callback(null, result);
                        }
                    });
                } else if (stat.isFile(file)) {
                    if (!filterFunc || filterFunc(name)) {
                        result.push(file);
                    }
                    if (--remaining === 0) {
                        callback(null, result);
                    }
                }
            });
        });
    });
}

//---------------------------------------------------------

function parseYamlFrontMatter(data, file) {
    DEBUG && debug('parse yaml front matter...', file);
    if (data.substring(0, 4) !== '---\n') {
        data = '---\n' + data;
    }
    return yaml.safeLoad(data, {filename: file});
}

function parseJsonFrontMatter(data, file) {
    DEBUG && debug('parse json front matter...', file);
    if (data.substring(0, 1) !== '{') {
        data = '{' + data + '}';
    }
    return JSON.parse(data);
}

function parseFrontMatter(format, data, file) {
    try {
        switch (format) {
            case 'yaml':
                return parseYamlFrontMatter(data, file);
            case 'json':
                return parseJsonFrontMatter(data, file);
            default: //'auto'
                try {
                    return parseJsonFrontMatter(data, file);
                } catch (e) {
                    return parseYamlFrontMatter(data, file);
                }
        }
    } catch (e) {
        DEBUG && debug('failed to parse front matter...', file, 'error=', e);
        return {};
    }
}

function parseFile(file, callback) {
    fs.readFile(file, config.encoding, function (err, data) {
        if (err) {
            return callback(err);
        }
        var entry = {
            id: path.relative(config.dataDir, file),
            file: file
        };
        if (config.frontMatter) {
            var pos = data.indexOf(config.frontMatterSeparator);
            if (pos > 0) {
                entry = _.merge(entry, parseFrontMatter(config.frontMatter, data.substring(0, pos), file));
                //entry.content = data.substring(pos + config.frontMatterSeparator.length);
            }
        } else {
            //entry.content = data;
        }
        return callback(null, entry);
    });
}

//---------------------------------------------------------

function parseFiles(baseDir, callback) {
    readTree(baseDir, function (name) {
        // only markdown files not started with '_' or '.'
        return /^[^_\.].+\.md$/i.test(name);
    }, function (err, files) {
        if (err) {
            return callback(err);
        }
        var entries = [];
        var remaining = files.length;
        files.forEach(function (file) {
            parseFile(file, function (err, entry) {
                if (err) {
                    console.error('***ignore*** failed to parse file', file, 'error=', err);
                } else {
                    entries.push(entry);
                }
                remaining -= 1;
                if (remaining === 0) {
                    return callback(null, entries);
                }
            });
        });
    });
}

function readMetaFile(file, callback) {
    fs.readFile(file, config.encoding, function (err, data) {
        return callback(err, !err && JSON.parse(data));
    });
}

function writeMetaFile(file, obj, callback) {
    var dir = path.dirname(file);
    fs.exists(dir, function (exists) {
        if (!exists) {
            mkdirp.sync(dir);
        }
        fs.writeFile(file, JSON.stringify(obj), config.encoding, callback);
    });
}

function generatePages(entries, callback) {
    DEBUG && debug('***generate pages...');

    var index = entries.filter(function (entry) {
        // only published pages
        return entry.type === 'page' && entry.published;
    }).map(function (entry) {
        return {
            id: entry.id,
            title: entry.title,
            tags: entry.tags,
            published: entry.published,
            summary: entry.summary
        };
    });

    var name = meta.pages();
    DEBUG && debug('write pages index -->', name);
    writeMetaFile(name, index, callback);
}

function generatePosts(entries, callback) {
    DEBUG && debug('***generate posts...');

    var index = entries.filter(function (entry) {
        // only published posts(not pages)
        return entry.type !== 'page' && entry.published;
    }).map(function (entry) {
        return {
            id: entry.id,
            title: entry.title,
            tags: entry.tags,
            published: entry.published,
            summary: entry.summary
        };
    });

    var name = meta.posts();
    DEBUG && debug('write posts index -->', name);
    writeMetaFile(name, index, callback);
}

function generateTags(entries, callback) {
    DEBUG && debug('***generate tags...');

    var grouped = entries.filter(function (entry) {
        // only published posts has tags
        return entry.type !== 'page' && entry.tags;
    }).reduce(function (grouped, entry) {
        entry.tags && entry.tags.forEach(function (tag) {
            grouped[tag] = grouped[tag] || [];
            grouped[tag].push(entry);
        });
        return grouped;
    }, {});

    var keys = Object.keys(grouped);

    var file = meta.tags();
    var remaining = keys.length;
    if (remaining === 0) {
        DEBUG && debug('write **empty** tags index -->', file);
        return writeMetaFile(file, [], callback);
    }

    var index = keys.map(function (tag) {
        return {tag: tag, count: grouped[tag].length};
    }).sort(function (a, b) {
        return a.count < b.count;
    });

    index.forEach(function (tag) {
        var groupFile = meta.tag(tag.tag);
        DEBUG && debug('write tag index of', tag.tag, '-->', groupFile);
        writeMetaFile(groupFile, grouped[tag.tag], function (err) {
            if (err) {
                console.log('***ignore*** failed to generate tag index of', tag.tag, 'error=', err);
            }
            if (--remaining === 0) {
                DEBUG && debug('write tags index -->', file);
                return writeMetaFile(file, index, callback);
            }
        });
    });
}

function generateArchives(entries, callback) {
    DEBUG && debug('***generate archives...');

    var grouped = entries.filter(function (entry) {
        // only published posts
        return entry.type !== 'page' && entry.published;
    }).reduce(function (grouped, entry) {
        var date = moment(entry.published);
        console.log(date.format('YYYY-MM'));
        var year = date.year();
        var month = date.month() + 1;
        grouped[year] = grouped[year] || {};
        grouped[year][month] = grouped[year][month] || [];
        grouped[year][month].push(entry);
        return grouped;
    }, {});

    var keys = Object.keys(grouped);

    var file = meta.archives();
    var remaining = keys.length;
    if (remaining === 0) {
        DEBUG && debug('write **empty** archives index -->', file);
        return writeMetaFile(file, [], callback);
    }

    var index = keys.reduce(function (flatten, year) {
        return flatten.concat(Object.keys(grouped[year]).map(function (month) {
            return {year: year, month: month, count: grouped[year][month].length};
        }));
    }, []).sort(function (a, b) {
        return a.count < b.count;
    });

    keys.forEach(function (year) {
        Object.keys(grouped[year]).forEach(function (month) {
            var groupFile = meta.archives(year, month);
            DEBUG && debug('write archive index of', year, month, '-->', groupFile);
            writeMetaFile(groupFile, grouped[year][month], function (err) {
                if (err) {
                    console.log('***ignore*** failed to generate archive index of', year, month, 'error=', err);
                }
                if (--remaining === 0) {
                    DEBUG && debug('write archives index -->', file);
                    return writeMetaFile(file, index, callback);
                }
            });
        });
    });
}

function generate(callback) {
    DEBUG && debug('***generate...', config.generate);

    if (config.generate.all) {
        DEBUG && debug('***clear existing meta...');
        rimraf.sync(config.metaDir);
    }

    parseFiles(config.dataDir, function (err, entries) {
        if (err) {
            return callback(err);
        }
        generatePosts(entries, function (err) {
            if (err) {
                return callback(err);
            }
            generatePages(entries, function (err) {
                if (err) {
                    return callback(err);
                }
                generateTags(entries, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    generateArchives(entries, function (err) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, entries);
                    });
                });
            });
        });
    });
}

//---------------------------------------------------------

function deployFile(file, target, callback) {
    DEBUG && debug('***deploy file', file, '-->', target);

    fs.stat(file, function (err, stat) {
        if (err) {
            return callback(err);
        }
        if (stat.isFile()) {
            fs.createReadStream(file).pipe(fs.createWriteStream(target));
            return callback(null, stat.size);
        }
        return callback(null, 0);
    });
}

function deploy(callback) {
    DEBUG && debug('***deploy...', config.deploy);

    readTree(config.metaDir, null, function (err, files) {
        var remaining = files.length;
        var total = 0;
        files.forEach(function (file) {
            remaining -= 1;
            var target = config.deploy.path + path.relative(config.metaDir, file);
            deployFile(file, target, function (err, size) {
                if (err) {
                    console.log('***ignore*** failed to deploy', file);
                } else {
                    total += size;
                }
                if (--remaining === 0) {
                    return callback(null, files.length, total);
                }
            });
        });
    });
}

//---------------------------------------------------------

function getFile(id, callback) {
    var file = data.file(id);
    DEBUG && debug('getFile', file);
    fs.stat(file, function (err, stat) {
        if (err) {
            return callback(err);
        }
        if (stat.isDirectory()) {
            return fs.readdir(file, function (err, names) {
                return callback(err, names && names.map(function (name) {
                    return path.relative(config.dataDir, path.join(file, name));
                }));
            });
        }
        if (stat.isFile()) {
            return fs.readFile(file, function (err, data) {
                return callback(err, !err && {id: id, file: file, content: data});
            });
        }
        return callback('invalid file');
    });
}

function createFile(id, data, callback) {
    var file = data.file(id);
    DEBUG && debug('createFile', file);
    fs.exists(file, function (exists) {
        if (exists) {
            return callback('exists');
        }
        if (data) {
            return fs.writeFile(file, data, config.encoding, callback);
        }
        return fs.mkdir(file, callback);
    });
}

function updateFile(id, data, callback) {
    var file = data.file(id);
    DEBUG && debug('updateFile', file);
    fs.exists(file, function (exists) {
        if (!exists) {
            return callback('not exists');
        }
        fs.unlink(file, function (err) {
            if (err) {
                return callback(err);
            }
            if (data) {
                fs.writeFile(file, data, config.encoding, callback);
            } else {
                fs.mkdir(file, callback);
            }
        });
    });
}

function deleteFile(id, callback) {
    var file = data.file(id);
    DEBUG && debug('deleteFile', file);
    rimraf(file, callback);
}

module.exports = {
    init: init,
    destroy: destroy,
    //
    parseFiles: parseFiles,
    generatePosts: generatePosts,
    generatePages: generatePages,
    generateTags: generateTags,
    generateArchives: generateArchives,
    generate: generate,
    //
    deployFile: deployFile,
    deploy: deploy,
    //
    createFile: createFile,
    getFile: getFile,
    updateFile: updateFile,
    deleteFile: deleteFile
};

