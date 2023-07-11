/* eslint {"max-statements": ["error", 50]} */
(function() {
    'use strict';
    var ALU_SIGNALS = ['add', 'sub', 'inc', 'dec', 'and', 'or', 'xor', 'not', 'shr', 'shl'];
    var MAX_ITER_DEPENDENT_SIGNALS = 10;

    function translateRegName(regName) {
        var regPrefix = regName.slice(0, -1);
        var regSuffix = regName.slice(-1);
        if (regSuffix === 'H') {
            return regPrefix + '15..8';
        }
        if (regName.endsWith('L')) {
            return regPrefix + '7..0';
        }
        if (regName.endsWith('0')) {
            return regPrefix + '31..24';
        }
        if (regName.endsWith('1')) {
            return regPrefix + '23..16';
        }
        if (regName.endsWith('2')) {
            return regPrefix + '15..8';
        }
        if (regName.endsWith('3')) {
            return regPrefix + '7..0';
        }
        if (regName === 'GPR') {
            return 'GPR[AR]';
        }
        if (regName === 'IVTDSP') {
            return 'BR << 1';
        }
        return regName;
    }

    function classifySignals(signals) {
        var classification = {
            bridge: [],
            cl: [],
            dec: [],
            errors: [],
            inc: [],
            ld: [],
            ldPSW: [],
            map: {},
            out: [],
            st: []
        };
        signals.forEach(function(signal) {
            classification.map[signal] = true;
            var regName;
            if (ALU_SIGNALS.includes(signal)) {
                if (classification.alu) {
                    classification.errors.push(mw.libs.diagramGenerator.msg('error-2-alu', signal, classification.alu));
                } else {
                    classification.alu = signal;
                }
            }
            if (signal.includes('out')) {
                var splitOutSignal = signal.split('out');
                regName = translateRegName(splitOutSignal[0]);
                if (regName === 'ALU' || regName === 'ADD') {
                    // Dependent output signals
                    return;
                }
                var busNum = Number(splitOutSignal[1]);
                if (!isNaN(busNum)) {
                    classification.out.push([regName, busNum]);
                }
            }
            if (signal.startsWith('ld') || signal === 'wrGPR') {
                regName = signal.substring(2);
                if (regName.length === 1) {
                    classification.ldPSW.push(regName);
                } else {
                    classification.ld.push(translateRegName(regName));
                }
            }
            if (signal.startsWith('MOST')) {
                var bridgeData = signal.substring(4).split('_');
                var srcBridge = Number(bridgeData[0]);
                var dstBridge = Number(bridgeData[1]);
                classification.bridge.push([srcBridge, dstBridge]);
            }
            if (signal.startsWith('inc') && signal !== 'inc') {
                classification.inc.push(translateRegName(signal.substring(3)));
            }
            if (signal.startsWith('dec') && signal !== 'dec') {
                classification.dec.push(translateRegName(signal.substring(3)));
            }
            if (signal.startsWith('st')) {
                classification.st.push(translateRegName(signal.substring(2)));
            }
            if (signal.startsWith('cl')) {
                classification.cl.push(translateRegName(signal.substring(2)));
            }
        });
        return classification;
    }

    function calculateMemory(clsSignals, buses) {
        var rd = clsSignals.map.rdCPU;
        var wr = clsSignals.map.wrCPU;
        if (rd && wr) {
            clsSignals.errors.push(mw.libs.diagramGenerator.msg('error-rd-wr'));
            return;
        }
        if (rd) {
            if (clsSignals.map.eMDR) {
                clsSignals.errors.push(mw.libs.diagramGenerator.msg('error-dbus-conflict'));
                return;
            }
            if (!clsSignals.map.eMAR) {
                clsSignals.errors.push(mw.libs.diagramGenerator.msg('error-rd-no-mar'));
                return;
            }
            buses.mdrI = 'MEM[MAR]';
            if (!clsSignals.ld.includes('MDR')) {
                clsSignals.ld.push('MDR');
            }
        } else if (wr) {
            if (!clsSignals.map.eMDR) {
                clsSignals.errors.push(mw.libs.diagramGenerator.msg('error-wr-no-mdr'));
                return;
            }
            if (!clsSignals.map.eMAR) {
                clsSignals.errors.push(mw.libs.diagramGenerator.msg('error-wr-no-mar'));
                return;
            }
            buses.mdrI = 'MDR';
            return 'MEM[MAR] <= MDR';
        }
    }

    function calculateIndependentBusOutput(clsSignals, buses) {
        clsSignals.out.forEach(function(outData) {
            var regName = outData[0];
            var busNum = outData[1];
            var busName = 'iBus' + busNum;
            var hadValue = buses[busName] !== 'HiZ' && buses[busName] !== regName;
            if (hadValue) {
                var errMsg = mw.libs.diagramGenerator.msg('error-conflict', busName, buses[busName], regName);
                clsSignals.errors.push(errMsg);
            }
            buses[busName] = hadValue ? 'CONFLICT' : regName;
        });
    }

    function isConstantOperation(A, B) {
        return !isNaN(Number(A)) && !isNaN(Number(B));
    }

    function evaluateConstantOperation(operation, A, B) {
        var a = Number(A);
        var b = Number(B);
        switch (operation) {
            case 'add':
                return a + b;
            case 'sub':
                return a - b;
            case 'inc':
                return a + 1;
            case 'dec':
                return a - 1;
            case 'and':
                return a & b;
            case 'or':
                return a | b;
            case 'xor':
                return a ^ b;
            case 'not':
                return ~a;
            case 'shr':
                return a >> b;
            case 'shl':
                return a << b;
            default:
                return 0;
        }
    }

    function getAluOutput(buses, signal) {
        // ALU inputs on HiZ are treated as 0.
        var A = buses.iBus3 === 'HiZ' ? '0' : buses.iBus3;
        var B = buses.iBus2 === 'HiZ' ? '0' : buses.iBus2;
        if (isConstantOperation(A, B)) {
            return String(evaluateConstantOperation(signal, A, B));
        }
        switch (signal) {
            case 'add':
                return A + ' + ' + B;
            case 'sub':
                return A + ' - ' + B;
            case 'inc':
                return A + ' + 1';
            case 'dec':
                return A + ' - 1';
            case 'and':
                return A + ' & ' + B;
            case 'or':
                return A + ' | ' + B;
            case 'xor':
                return A + ' ^ ' + B;
            case 'not':
                return '~' + A;
            case 'shr':
                return A + ' >> ' + B;
            case 'shl':
                return A + ' << ' + B;
            default:
                return '0';
        }
    }

    function writeBus(buses, busName, value) {
        if (buses[busName] === value) {
            return false;
        }
        buses[busName] = value;
        return true;
    }

    function getValueToLoad(buses, regName) {
        switch (regName) {
            case 'MDR':
                return buses.mdrI;
            case 'DW15..8':
            case 'DW7..0':
            case 'GPRAR':
            case 'IR31..24':
            case 'IR23..16':
            case 'IR15..8':
            case 'IR7..0':
            case 'AB':
            case 'BB':
            case 'PSW15..8':
            case 'PSW7..0':
                return buses.iBus1;
            case 'MAR':
            case 'CW':
            case 'PC':
            case 'AW':
            case 'BW':
                return buses.iBus2;
            case 'GPR[AR]':
            case 'SP':
            case 'IMR':
            case 'BR':
            case 'IVTP':
                return buses.iBus3;
            default:
                return 'HiZ';
        }
    }

    function calculateDependentBusOutput(clsSignals, buses) {
        var diffFound = 1;
        for (var iter = 0; iter < MAX_ITER_DEPENDENT_SIGNALS && diffFound; ++iter) {
            diffFound = 0;
            diffFound |= writeBus(buses, 'aluOut', getAluOutput(buses, clsSignals.alu));
            if (clsSignals.map.ALUout1) {
                diffFound |= writeBus(buses, 'iBus1', buses.aluOut);
            }
            if (clsSignals.map.ADDout2) {
                // If any adder input is HiZ, the output is zero.
                if (buses.iBus1 === 'HiZ' || buses.iBus3 === 'HiZ') {
                    diffFound |= writeBus(buses, 'iBus2', '0');
                } else if (isConstantOperation(buses.iBus1, buses.iBus3)) {
                    var result = evaluateConstantOperation('add', buses.iBus1, buses.iBus3);
                    diffFound |= writeBus(buses, 'iBus2', String(result));
                } else {
                    diffFound |= writeBus(buses, 'iBus2', buses.iBus1 + ' + ' + buses.iBus3);
                }
            }
            diffFound |= clsSignals.bridge.map(function(bridge) {
                var busValue = buses['iBus' + bridge[0]];
                // Tri-state buffers output -1 if their input is HiZ.
                return writeBus(buses, 'iBus' + bridge[1], busValue === 'HiZ' ? '-1' : busValue);
            }).reduce(function(a, b) {
                return a + b;
            }, 0);
        }
        if (diffFound) {
            clsSignals.errors.push(mw.libs.diagramGenerator.msg('error-infinite-loop'));
        }
        if (clsSignals.map.mxMDR) {
            // Multiplexer outputs zero if the selected input is HiZ.
            buses.mdrI = buses.iBus3 === 'HiZ' ? '0' : buses.iBus3;
        }
    }

    function executeActions(clsSignals, buses) {
        var ldActions = clsSignals.ld.map(function(regName) {
            return regName + ' <= ' + getValueToLoad(buses, regName);
        });
        var ldPSWActions = clsSignals.ldPSW.map(function(bitName) {
            return 'PSW' + bitName + ' <= ' + bitName;
        });
        var incActions = clsSignals.inc.map(function(regName) {
            return regName + '++';
        });
        var decActions = clsSignals.dec.map(function(regName) {
            return regName + '--';
        });
        var stActions = clsSignals.st.map(function(regName) {
            return regName + ' <= 1';
        });
        var clActions = clsSignals.cl.map(function(regName) {
            return regName + ' <= 0';
        });
        return ldActions
            .concat(ldPSWActions)
            .concat(incActions)
            .concat(decActions)
            .concat(stActions)
            .concat(clActions);
    }

    function main(signals) {
        var actions = [];
        var clsSignals = classifySignals(signals);
        // Initial bus state
        var buses = {
            aluOut: '0',
            iBus1: 'HiZ',
            iBus2: 'HiZ',
            iBus3: 'HiZ',
            mdrI: 'HiZ'
        };
        // Calculate memory-related values
        var memoryAction = calculateMemory(clsSignals, buses);
        if (memoryAction) {
            actions.push(memoryAction);
        }
        // Calculate independent register bus output values
        calculateIndependentBusOutput(clsSignals, buses);
        // Calculate bus output values that depend on each other
        calculateDependentBusOutput(clsSignals, buses);
        // All signals are calculated, decide which actions these signals result in
        actions = actions.concat(executeActions(clsSignals, buses));
        // All done, check and report errors
        if (actions.some(function(action) {
            return action.includes('HiZ');
        })) {
            clsSignals.errors.push();
        }
        return {
            errors: clsSignals.errors,
            result: actions
        };
    }

    window.mw = $.extend(true, window.mw, {
        libs: {
            diagramGenerator: {
                signalsToActions: main
            }
        }
    });
})();
