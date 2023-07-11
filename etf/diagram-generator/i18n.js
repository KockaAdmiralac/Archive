/* eslint-disable max-len */
(function() {
    'use strict';
    if (window.mw && window.mw.message) {
        return;
    }
    var i18n = {
        'gadget-diagram-generator-options': 'Опције',
        'gadget-diagram-generator-microcode': 'Микрокод',
        'gadget-diagram-generator-configuration': 'Конфигурација',
        'gadget-diagram-generator-student-name': 'Име и презиме',
        'gadget-diagram-generator-student-index': 'Број индекса',
        'gadget-diagram-generator-advanced-options': 'Напредне опције',
        'gadget-diagram-generator-page-width': 'Ширина странице (са маргином)',
        'gadget-diagram-generator-page-height': 'Висина странице (са маргином)',
        'gadget-diagram-generator-left-column-header': 'Наслов леве колоне',
        'gadget-diagram-generator-middle-column-header': 'Наслов средње колоне',
        'gadget-diagram-generator-right-column-header': 'Наслов десне колоне',
        'gadget-diagram-generator-arrow-height': 'Висина стрелице',
        'gadget-diagram-generator-header-height': 'Висина заглавља',
        'gadget-diagram-generator-footer-row-height': 'Висина једног реда подножја',
        'gadget-diagram-generator-margin': 'Маргина',
        'gadget-diagram-generator-subject-name': 'Назив предмета',
        'gadget-diagram-generator-actions': 'Акције',
        'gadget-diagram-generator-generate-this-page': 'Генериши (на овој страници)',
        'gadget-diagram-generator-generate-new-page': 'Штампај (на новој страници)',
        'gadget-diagram-generator-generate-download-svg': 'Преузми као SVG',
        'gadget-diagram-generator-error-2-alu': 'ALU сигнали $1 и $2 су активни у исто време',
        'gadget-diagram-generator-error-dbus-conflict': 'Конфликт на DBUS магистрали приликом читања податка',
        'gadget-diagram-generator-error-rd-no-mar': 'Покушано је читање без MAR регистра на ABUS магистрали',
        'gadget-diagram-generator-error-wr-no-mdr': 'Покушан је упис без MDR регистра на DBUS магистрали',
        'gadget-diagram-generator-error-wr-no-mar': 'Покушан је упис без MAR регистра на ABUS магистрали',
        'gadget-diagram-generator-error-conflict': 'Конфликт на магистрали $1, претходна вредност је била $2 а нова је $3',
        'gadget-diagram-generator-error-infinite-loop': 'Вредности на магистралама се не могу израчунати, вероватно постоје цикличне зависности између сигнала',
        'gadget-diagram-generator-error-has-hiz': 'Микрооперација садржи вредности на високој импеданси',
        'gadget-diagram-generator-error-actions': 'Грешка у микрооперацијама на линији $1: $2',
        'gadget-diagram-generator-error-parse-config': 'Парсирање конфигурације неуспешно.',
        'gadget-diagram-generator-errors-area': 'Овде ће се појавити све грешке на које генератор наиђе.',
        'gadget-diagram-generator-error-microcode': 'Грешка у парсирању микрокода: $1 на линији $2',
        'gadget-diagram-generator-error-duplicate-label': 'Дуплицирана лабела: $1',
        'gadget-diagram-generator-error-unknown-operation': 'Непозната операција $1',
        'gadget-diagram-generator-error-invalid-cond-branch': 'Неисправан формат инструкције условног гранања',
        'gadget-diagram-generator-error-invalid-uncond-branch': 'Неисправан формат инструкције безусловног гранања',
        'gadget-diagram-generator-error-unknown-condition': 'Непознат услов гранања $1',
        'gadget-diagram-generator-error-more-1-cond': 'Присутно је више од једног услова',
        'gadget-diagram-generator-': '',
        'gadget-diagram-generator-': '',
        'gadget-diagram-generator-': '',
        'gadget-diagram-generator-': '',
        'gadget-diagram-generator-': '',
        'gadget-diagram-generator-': '',
        'gadget-diagram-generator-': '',
        'gadget-diagram-generator-': ''
    };
    window.mw = window.mw || {};
    mw.message = function(msg) {
        var args = Array.prototype.slice.call(arguments, 1);
        var template = i18n[msg];
        args.forEach(function(arg, index) {
            template = template.replace(new RegExp('\\$' + (index + 1)), arg);
        });
        return {
            plain: function() {
                return template;
            }
        };
    };
})();
