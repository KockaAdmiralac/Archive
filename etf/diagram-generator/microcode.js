/* eslint {"max-statements": ["error", 40]} */
(function() {
    'use strict';
    var lib = mw.libs.diagramGenerator;
    var signals = [
        'MOST1_2',
        'MOST1_3',
        'MOST2_1',
        'MOST3_2',
        'rdCPU',
        'wrCPU',
        'ldMDR',
        'mxMDR',
        'MDRout1',
        'eMDR',
        'ldMAR',
        'incMAR',
        'eMAR',
        'ldDWL',
        'ldDWH',
        'DWout2',
        'wrGPR',
        'GPRout1',
        'ldGPRAR',
        'incGPRAR',
        'ldSP',
        'SPout2',
        'incSP',
        'decSP',
        'ldCW',
        'CWout3',
        'ADDout2',
        'ldPC',
        'incPC',
        'PCHout3',
        'PCLout3',
        'PCout1',
        'ldIR0',
        'ldIR1',
        'ldIR2',
        'ldIR3',
        'IRPOMout3',
        'IRJAout2',
        'IRDAout3',
        'IRBRout3',
        'add',
        'sub',
        'inc',
        'dec',
        'and',
        'or',
        'xor',
        'not',
        'ALUout1',
        'ldAB',
        'ABout3',
        'shr',
        'shl',
        'ldBB',
        'BBout2',
        'ldAW',
        'AWout3',
        'AWHout3',
        'ldBW',
        'BWout2',
        'ldPSWH',
        'ldPSWL',
        'ldN',
        'ldZ',
        'ldC',
        'ldV',
        'ldL',
        'stPSWI',
        'clPSWI',
        'stPSWT',
        'clPSWT',
        'PSWHout3',
        'PSWLout3',
        'clSTART',
        'ldIMR',
        'IMRout2',
        'ldBR',
        'IVTDSPout3',
        'ldIVTP',
        'IVTPout1',
        'UINTout3',
        'UEXTout3',
        'stPRCOD',
        'stPRADR',
        'stPRINS',
        'clPRCOD',
        'clPRADR',
        'clPRINS',
        'clPRINM',
        'clINTR',
        'stPSWR',
        'clPSWR'
    ];
    var BranchType = {
        NONE: 'none',
        CONDITIONAL: 'conditional',
        UNCONDITIONAL: 'unconditional',
        BRADR: 'bradr',
        BROPR: 'bropr'
    };
    var CONDITIONAL_BRANCH = /^br\s*\(\s*if\s+(\S+)\s+then\s+(\S+)\s*\)$/;
    var UNCONDITIONAL_BRANCH = /^br\s+(\S+)$/;

    function prepareLine(line) {
        return line
            .toLowerCase()
            .replace(/\(/g, ' ( ')
            .replace(/\)/g, ' ) ')
            .replace(/\s+/g, ' ')
            .replace(/if !/g, 'if #')
            .replace(/(.*?)!.*/g, '$1')
            .replace(/(.*?);.*/, '$1')
            .replace(/\t/g, ' ')
            .replace(/\s+:/g, ': ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function parseAddress(line) {
        if (line === '') {
            return -1;
        }
        var addressLine = line.split(' ')[0];
        if (addressLine.endsWith(':') || !addressLine.startsWith('madr')) {
            return -1;
        }
        var address = parseInt(addressLine.substring(4), 16);
        if (isNaN(address)) {
            return -1;
        }
        return address;
    }

    function parseLabels(line) {
        var labels = [];
        var splitLine = line.split(' ');
        for (var i = 0, l = splitLine.length; i < l; ++i) {
            if (!splitLine[i].endsWith(':')) {
                break;
            }
            var label = splitLine[i].slice(0, -1);
            if (!labels.includes(label)) {
                labels.push(label);
            }
        }
        return labels;
    }

    function fixSignalNames(signalsToFix) {
        return signalsToFix.map(function(signal) {
            return signals.find(function(signal2) {
                return signal.toLowerCase() === signal2.toLowerCase();
            }) || signal;
        });
    }

    function parseLine(comment, line, config) {
        var preparedLine = prepareLine(line);
        var instruction = {
            address: parseAddress(preparedLine),
            comment: comment,
            errors: [],
            line: line
        };
        var unparsedLine = preparedLine;
        if (instruction.address >= 0) {
            unparsedLine = unparsedLine.split(' ').slice(1).join(' ');
        }
        instruction.labels = parseLabels(unparsedLine);
        instruction.signals = [];
        instruction.branchType = BranchType.NONE;
        unparsedLine = unparsedLine.split(' ').slice(instruction.labels.length).join(' ');
        var hadBranch = false;
        var conditionsLowercase = lib.parseConditions(config).map(function(condition) {
            return condition.toLowerCase();
        });
        unparsedLine.split(',').map(function(segment) {
            return segment.trim();
        }).forEach(function(arg) {
            var isBropr = arg === 'bropr';
            var isBradr = arg === 'bradr';
            var isAddressBranch = arg.includes('br ');
            var isConditional = arg.includes('if ');
            var isBranch = isBropr || isBradr || isAddressBranch;
            var isSignal = signals.find(function(signal) {
                return signal.toLowerCase() === arg;
            });
            // Check for multiple branches.
            if (isBranch && hadBranch) {
                instruction.errors.push(lib.msg('error-more-1-cond'));
            } else if (isBranch) {
                hadBranch = true;
            }
            // Set relevant instruction fields.
            var res;
            if (isSignal) {
                if (!instruction.signals.includes(arg)) {
                    instruction.signals.push(arg);
                }
            } else if (isBropr) {
                instruction.branchType = BranchType.BROPR;
            } else if (isBradr) {
                instruction.branchType = BranchType.BRADR;
            } else if (isBranch && isConditional) {
                res = CONDITIONAL_BRANCH.exec(arg);
                if (!res) {
                    instruction.errors.push(lib.msg('error-invalid-cond-branch'));
                    return;
                }
                instruction.branchType = BranchType.CONDITIONAL;
                var splitCondition = res[1].split('.');
                var complement = res[1].startsWith('#') && splitCondition.length > 1 ? '#' : '';
                instruction.condition = complement + splitCondition[splitCondition.length - 1];
                if (!conditionsLowercase.includes(instruction.condition)) {
                    instruction.errors.push(lib.msg('error-unknown-condition', instruction.condition));
                    return;
                }
                instruction.destination = res[2];
                // TODO: Destination validation
            } else if (isBranch && !isConditional) {
                res = UNCONDITIONAL_BRANCH.exec(arg);
                if (!res) {
                    instruction.errors.push(lib.msg('error-invalid-uncond-branch'));
                    return;
                }
                instruction.branchType = BranchType.UNCONDITIONAL;
                instruction.destination = res[1];
                // TODO: Destination validation
            } else {
                instruction.errors.push(lib.msg('error-unknown-operation', arg));
            }
        });
        instruction.signals = fixSignalNames(instruction.signals);
        return instruction;
    }

    function getInstructions(config, contents) {
        var instructions = [];
        var comment = '';
        var lines = contents.split('\n');
        var labels = {};
        var errors = [];
        for (var i = 0, l = lines.length; i < l; ++i) {
            var line = lines[i].trim();
            if (!line) {
                continue;
            }
            if (line.startsWith('!')) {
                comment = line;
            } else {
                var instruction = parseLine(comment, line, config);
                comment = '';
                for (var j = 0, l2 = instruction.labels.length; j < l2; ++j) {
                    var label = instruction.labels[j];
                    if (labels[label]) {
                        instruction.errors.push(lib.msg('duplicate-label', label));
                        break;
                    }
                    labels[label] = instruction.address;
                }
                if (instruction.errors.length > 0) {
                    errors = errors.concat(instruction.errors.map(function(lineNum, error) {
                        return lib.msg('error-microcode', error, lineNum);
                    }.bind(null, i + 1)));
                    errors.push();
                } else {
                    instructions.push(instruction);
                }
            }
        }
        return {
            errors: errors,
            result: instructions
        };
    }

    window.mw = $.extend(true, window.mw, {
        libs: {
            diagramGenerator: {
                BranchType: BranchType,
                getInstructions: getInstructions
            }
        }
    });
})();
