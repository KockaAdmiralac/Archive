(function() {
    'use strict';
    var lib = mw.libs.diagramGenerator;
    var fileContents = {};

    function msg(message) {
        var prefixedMessage = 'gadget-diagram-generator-' + message;
        var args = Array.prototype.slice.call(arguments, 1);
        var mwMsg = mw.message.apply(mw.message, [prefixedMessage].concat(args));
        return mwMsg.plain();
    }

    function updateSubmitEnabled() {
        if (fileContents.microcode && fileContents.configuration) {
            $('.diagram-generator-action')
                .removeAttr('disabled')
                .parent()
                .removeClass('oo-ui-widget-disabled')
                .addClass('oo-ui-widget-enabled');
        } else {
            $('.diagram-generator-action')
                .attr('disabled', '')
                .parent()
                .removeClass('oo-ui-widget-enabled')
                .addClass('oo-ui-widget-disabled');
        }
    }

    function fileLoaded(id) {
        fileContents[id] = this.result;
        updateSubmitEnabled();
    }

    function updateFile(event) {
        var input = event.target;
        delete fileContents[input.id];
        var files = input.files;
        if (files.length === 0) {
            return;
        }
        var reader = new FileReader();
        reader.addEventListener('load', fileLoaded.bind(reader, input.id));
        reader.readAsText(files[0]);
        updateSubmitEnabled();
    }

    function downloadSVG(svg) {
        var contents = [
            '<?xml version="1.0" encoding="utf-8"?>',
            '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
            svg.outerHTML
        ].join('\n');
        var blob = new Blob([contents], {
            type: 'image/svg+xml'
        });
        var blobUrl = URL.createObjectURL(blob);
        var downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'Diagram.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        URL.revokeObjectURL(blobUrl);
        downloadLink.remove();
    }

    function printPages(width, height, pages) {
        var imageWindow = window.open('');
        pages.forEach(function(page) {
            var svg = lib.createSVG(width, height);
            svg.appendChild(page);
            svg.style.breakAfter = 'page';
            imageWindow.document.write(svg.outerHTML);
        });
        imageWindow.document.close();
        imageWindow.focus();
        imageWindow.print();
    }

    function postGeneration(parameters, actionId, pages) {
        switch (actionId) {
            case 'diagram-generator-this-page':
                var svg = lib.createSVGWithPages(parameters.width, parameters.height, pages);
                $('#diagram-generator-result').html(svg.outerHTML);
                break;
            case 'diagram-generator-new-page':
                printPages(parameters.width, parameters.height, pages);
                break;
            case 'diagram-generator-download-svg':
                downloadSVG(lib.createSVGWithPages(parameters.width, parameters.height, pages));
                break;
            default:
                // ???
                break;
        }
    }

    function getParameters() {
        return {
            arrowHeight: Number($('#diagram-generator-arrow-height').val()),
            columnHeaderLeft: $('#diagram-generator-left-column-header').val(),
            columnHeaderMiddle: $('#diagram-generator-middle-column-header').val(),
            columnHeaderRight: $('#diagram-generator-right-column-header').val(),
            headerHeight: Number($('#diagram-generator-header-height').val()),
            height: Number($('#diagram-generator-page-height').val()),
            ignoreErrors: false,
            indexNum: $('#diagram-generator-student-index').val(),
            footerRowHeight: Number($('#diagram-generator-footer-row-height').val()),
            margin: Number($('#diagram-generator-margin').val()),
            nameSurname: $('#diagram-generator-student-name').val(),
            subjectName: $('#diagram-generator-subject-name').val(),
            width: Number($('#diagram-generator-page-width').val())
        };
    }

    function logError(error) {
        $('#diagram-generator-error').val($('#diagram-generator-error').val() + error + '\n');
    }

    function generate(event) {
        event.preventDefault();
        $('#diagram-generator-error').val('');
        var config = lib.parseConfig(fileContents.configuration);
        if (!config) {
            logError(msg('error-parse-config'));
            return;
        }
        var instructionsResult = lib.getInstructions(config, fileContents.microcode);
        if (instructionsResult.errors.length > 0) {
            instructionsResult.errors.forEach(logError);
            return;
        }
        var instructions = instructionsResult.result;
        var parameters = getParameters();
        var pagesResult = lib.getPages(parameters, config, instructions);
        pagesResult.errors.forEach(logError);
        postGeneration(parameters, event.currentTarget.id, pagesResult.result);
    }

    function createFieldset(text, contents) {
        var $icon = $('<span>').addClass([
            'oo-ui-widget',
            'oo-ui-widget-enabled',
            'oo-ui-iconElement-icon',
            'oo-ui-iconElement',
            'oo-ui-labelElement-invisible',
            'oo-ui-iconWidget'
        ]);
        return $('<fieldset>', {
            html: [
                $('<legend>', {
                    html: [
                        $('<span>', {
                            'class': 'oo-ui-labelElement-label',
                            'text': text
                        }),
                        $icon.clone().addClass('oo-ui-icon-expand'),
                        $icon.clone().addClass('oo-ui-icon-collapse')
                    ],
                    role: 'button',
                    tabindex: 0
                }).addClass([
                    'oo-ui-fieldsetLayout-header',
                    'mw-collapsible-toggle',
                    'mw-collapsible-toggle-expanded'
                ]),
                $('<div>', {
                    'class': 'oo-ui-fieldsetLayout-group mw-collapsible-content',
                    'html': $('<div>', {
                        'class': 'oo-ui-widget oo-ui-widget-enabled',
                        'html': contents
                    })
                })
            ]
        }).addClass([
            'oo-ui-layout',
            'oo-ui-labelElement',
            'oo-ui-fieldsetLayout',
            'mw-collapsible',
            'mw-made-collapsible'
        ]);
    }

    function createFormRow(text, options) {
        var inputOptions = $.extend({}, options, {
            'class': 'oo-ui-inputWidget-input',
            'name': options.id
        });
        return $('<div>', {
            html: $('<div>', {
                'class': 'oo-ui-fieldLayout-body',
                'html': [
                    $('<span>', {
                        'class': 'oo-ui-fieldLayout-header',
                        'html': $('<label>', {
                            'class': 'oo-ui-labelElement-label',
                            'for': options.id,
                            'text': text + ':'
                        })
                    }),
                    $('<div>', {
                        'class': 'oo-ui-fieldLayout-field',
                        'html': $('<div>', {
                            html: $('<input>', inputOptions)
                        }).addClass([
                            'oo-ui-widget',
                            'oo-ui-widget-enabled',
                            'oo-ui-inputWidget',
                            'oo-ui-textInputWidget',
                            'oo-ui-textInputWidget-type-text'
                        ])
                    })
                ]
            })
        }).addClass([
            'mw-htmlform-field-HTMLTextField',
            'oo-ui-layout',
            'oo-ui-labelElement',
            'oo-ui-fieldLayout',
            'oo-ui-fieldLayout-align-top'
        ]);
    }

    function createFormButton(text, options) {
        return $('<span>', $.extend({
            'class': [
                'oo-ui-buttonElement',
                'oo-ui-buttonElement-framed',
                'oo-ui-flaggedElement-primary',
                'oo-ui-flaggedElement-progressive',
                'oo-ui-labelElement',
                'oo-ui-widget-enabled',
                'oo-ui-inputWidget'
            ].join(' ')
        }, options)).append(
            $('<button>', {
                'class': 'oo-ui-buttonElement-button diagram-generator-action',
                'tabindex': '0'
            }).append(
                $('<span>', {
                    'class': 'oo-ui-labelElement-label label',
                    'text': text
                })
            )
        );
    }

    function collapsibleShim(event) {
        if (event.keyCode && ![13, 32].includes(event.keyCode)) {
            return;
        }
        $(event.currentTarget)
            .parent()
            .find('.mw-collapsible-content')
            .toggle();
    }

    function init() {
        if ($('#diagram-generator').hasClass('initialized')) {
            return;
        }
        var $optionsFieldset = createFieldset(msg('options'), [
            createFormRow(msg('microcode'), {
                change: updateFile,
                id: 'microcode',
                type: 'file'
            }),
            createFormRow(msg('configuration'), {
                change: updateFile,
                id: 'configuration',
                type: 'file'
            }),
            createFormRow(msg('student-name'), {
                id: 'diagram-generator-student-name',
                placeholder: 'Pera Pisar',
                type: 'text'
            }),
            createFormRow(msg('student-index'), {
                id: 'diagram-generator-student-index',
                placeholder: '2021/0000',
                type: 'text'
            })
        ]);
        var $advancedFieldset = createFieldset(msg('advanced-options'), [
            createFormRow(msg('page-width'), {
                id: 'diagram-generator-page-width',
                type: 'number',
                value: 1200
            }),
            createFormRow(msg('page-height'), {
                id: 'diagram-generator-page-height',
                type: 'number',
                value: 1680
            }),
            createFormRow(msg('left-column-header'), {
                id: 'diagram-generator-left-column-header',
                type: 'text',
                value: 'Dijagram toka mikrooperacija'
            }),
            createFormRow(msg('middle-column-header'), {
                id: 'diagram-generator-middle-column-header',
                type: 'text',
                value: 'Dijagram toka upravljačkih signala'
            }),
            createFormRow(msg('right-column-header'), {
                id: 'diagram-generator-right-column-header',
                type: 'text',
                value: 'Sekvenca upravljačkih signala'
            }),
            createFormRow(msg('arrow-height'), {
                id: 'diagram-generator-arrow-height',
                type: 'number',
                value: 15
            }),
            createFormRow(msg('header-height'), {
                id: 'diagram-generator-header-height',
                type: 'number',
                value: 20
            }),
            createFormRow(msg('footer-row-height'), {
                id: 'diagram-generator-footer-row-height',
                type: 'number',
                value: 50
            }),
            createFormRow(msg('margin'), {
                id: 'diagram-generator-margin',
                type: 'number',
                value: 50
            }),
            createFormRow(msg('subject-name'), {
                id: 'diagram-generator-subject-name',
                type: 'text',
                value: 'Osnovi računarske tehnike 2'
            })
        ]);
        var $actionsFieldset = createFieldset(msg('actions'), [
            createFormButton(msg('generate-this-page'), {
                click: generate,
                id: 'diagram-generator-this-page'
            }),
            createFormButton(msg('generate-new-page'), {
                click: generate,
                id: 'diagram-generator-new-page'
            }),
            createFormButton(msg('generate-download-svg'), {
                click: generate,
                id: 'diagram-generator-download-svg'
            })
        ]);
        $('#diagram-generator').html([
            $('<div>', {
                html: $('<form>', {
                    html: [
                        $optionsFieldset,
                        $advancedFieldset,
                        $actionsFieldset,
                        $('<textarea>', {
                            id: 'diagram-generator-error',
                            placeholder: msg('errors-area'),
                            readonly: true,
                            rows: 10
                        })
                    ]
                }).addClass(['mw-htmlform', 'mw-htmlform-ooui', 'oo-ui-layout', 'oo-ui-formLayout'])
            }).addClass([
                'mw-htmlform-ooui-wrapper',
                'oo-ui-layout',
                'oo-ui-panelLayout',
                'oo-ui-panelLayout-padded',
                'oo-ui-panelLayout-framed'
            ]),
            $('<div>', {
                id: 'diagram-generator-result'
            })
        ]).addClass('initialized');
        if ($.fn.makeCollapsible) {
            $optionsFieldset.makeCollapsible();
            $advancedFieldset.makeCollapsible({
                collapsed: true
            });
            $actionsFieldset.makeCollapsible();
        } else {
            $('.mw-collapsible-toggle')
                .click(collapsibleShim)
                .keydown(collapsibleShim);
            $advancedFieldset
                .find('.mw-collapsible-content')
                .hide();
        }
        updateSubmitEnabled();
    }

    lib.msg = msg;
    if (window.mw && window.mw.hook) {
        mw.hook('wikipage.content').add(init);
    } else {
        $(init);
    }
})();
