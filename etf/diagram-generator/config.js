(function() {
    'use strict';

    function parseConfig(config) {
        try {
            return config.split('\n').map(function(line) {
                return line.replace(/\/\/.*/g, '').replace(/"/g, '').trim();
            }).filter(Boolean).map(function(line) {
                return line.split(',').map(function(part) {
                    return part.trim();
                });
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    function findConfig(config, prefix) {
        return config.filter(function(line) {
            return !line.slice(0, prefix.length).some(function(value, index) {
                return value !== prefix[index];
            });
        }).map(function(line) {
            return line.slice(prefix.length);
        });
    }

    function parseConditions(config) {
        return findConfig(config, ['CONTRODC']).filter(function(option) {
            return option[1];
        }).map(function(option) {
            var segments = option[1].split('.');
            return option[2] + segments[segments.length - 1];
        });
    }

    window.mw = $.extend(true, window.mw, {
        libs: {
            diagramGenerator: {
                parseConditions: parseConditions,
                parseConfig: parseConfig
            }
        }
    });
})();
