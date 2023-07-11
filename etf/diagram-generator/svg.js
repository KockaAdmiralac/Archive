/* eslint {"max-statements": ["error", 100]} */
(function() {
    'use strict';
    var lib = mw.libs.diagramGenerator;
    var MAX_LINE_LENGTH = 22;
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var FIELDS = [
        ['Ime i prezime', 'Indeks', 'Potpis'],
        ['Naziv', 'Datum', 'Strana']
    ];

    function createRect(startX, startY, width, height) {
        var rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttributeNS(SVG_NS, 'x', startX);
        rect.setAttributeNS(SVG_NS, 'y', startY);
        rect.setAttributeNS(SVG_NS, 'width', width);
        rect.setAttributeNS(SVG_NS, 'height', height);
        rect.setAttributeNS(SVG_NS, 'stroke-width', '1');
        rect.setAttributeNS(SVG_NS, 'fill-opacity', '0');
        rect.style.stroke = 'black';
        return rect;
    }

    function createConditionRect(startX, startY, width, height) {
        var rect = document.createElementNS(SVG_NS, 'polygon');
        var points = [
            [startX, startY + height / 2],
            [startX + width * 1 / 20, startY],
            [startX + width * 19 / 20, startY],
            [startX + width, startY + height / 2],
            [startX + width * 19 / 20, startY + height],
            [startX + width * 1 / 20, startY + height]
        ];
        rect.setAttributeNS(SVG_NS, 'points', points.map(function(point) {
            return point.join(',');
        }).join(' '));
        rect.style.fill = 'none';
        rect.style.stroke = 'black';
        return rect;
    }

    function createTextLine(x, y, text) {
        var line = document.createElementNS(SVG_NS, 'tspan');
        line.textContent = text;
        line.setAttributeNS(SVG_NS, 'x', x);
        line.setAttributeNS(SVG_NS, 'y', y);
        return line;
    }

    function wrapText(textSegments, maxLineLength, joinChar) {
        var lines = [];
        var currentLine = '';
        textSegments.forEach(function(segment, index) {
            var segmentWithJoinChar = segment.trim();
            if (index !== textSegments.length - 1) {
                segmentWithJoinChar += joinChar;
            }
            if (segmentWithJoinChar.length + currentLine.length > maxLineLength && currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = '';
            }
            currentLine += segmentWithJoinChar;
        });
        lines.push(currentLine);
        return lines;
    }

    function createText(startX, startY, line) {
        var lines = typeof line === 'string' ? [line] : line;
        var text = document.createElementNS(SVG_NS, 'text');
        text.setAttributeNS(SVG_NS, 'x', startX);
        text.setAttributeNS(SVG_NS, 'y', startY);
        text.setAttributeNS(SVG_NS, 'alignment-baseline', 'middle');
        text.setAttributeNS(SVG_NS, 'font-family', 'monospace');
        text.setAttributeNS(SVG_NS, 'text-anchor', 'middle');
        lines.forEach(function(currentLine, index) {
            text.appendChild(createTextLine(startX, startY + index * 15, currentLine));
        });
        return text;
    }

    function createTextNotCentered(startX, startY, text) {
        var textNode = createText(startX, startY, text);
        textNode.removeAttribute('text-anchor');
        return textNode;
    }

    function createLine(startX, startY, endX, endY) {
        var line = document.createElementNS(SVG_NS, 'line');
        line.setAttributeNS(SVG_NS, 'x1', startX);
        line.setAttributeNS(SVG_NS, 'y1', startY);
        line.setAttributeNS(SVG_NS, 'x2', endX);
        line.setAttributeNS(SVG_NS, 'y2', endY);
        line.style.stroke = 'black';
        return line;
    }

    function createArrow(startX, startY, endX, endY) {
        var arrow = document.createElementNS(SVG_NS, 'polygon');
        var points = [[endX, endY], [endX, endY], [endX, endY]];
        if (startX === endX) {
            // Vertical
            points[0][0] -= 2.5;
            points[1][0] += 2.5;
            if (endY > startY) {
                // Down
                points[0][1] -= 2.5;
                points[1][1] -= 2.5;
            } else {
                // Up
                points[0][1] += 2.5;
                points[1][1] += 2.5;
            }
        } else {
            // Horizontal
            points[0][1] -= 2.5;
            points[1][1] += 2.5;
            if (endX > startX) {
                // Right
                points[0][0] -= 2.5;
                points[1][0] -= 2.5;
            } else {
                // Left
                points[0][0] += 2.5;
                points[1][0] += 2.5;
            }
        }
        arrow.setAttributeNS(SVG_NS, 'points', points.map(function(point) {
            return point.join(',');
        }).join(' '));
        arrow.style.fill = 'black';
        var group = document.createElementNS(SVG_NS, 'g');
        group.appendChild(createLine(startX, startY, endX, endY));
        group.appendChild(arrow);
        return group;
    }

    function hasSelfBranch(instruction) {
        if (instruction.destination.startsWith('madr')) {
            return parseInt(instruction.destination.substring(4), 16) === instruction.address;
        }
        return instruction.labels.includes(instruction.destination);
    }

    function fixConditionName(condition, conditions) {
        var properlyCasedName = conditions.find(function(condition2) {
            return condition2.toLowerCase() === condition.toLowerCase();
        }) || condition;
        if (properlyCasedName.startsWith('#')) {
            return '!' + properlyCasedName.substring(1);
        }
        return properlyCasedName;
    }

    function generateInstructionDiagram(parameters, config, instruction, currentY) {
        var y = currentY;
        var arrowHeight = parameters.arrowHeight;
        var group = document.createElementNS(SVG_NS, 'g');
        var columnWidth = (parameters.width - 2 * parameters.margin) / 3;
        var columnOffset = (columnWidth - 200 - 100 - 20) / 2;
        var offL = parameters.margin + columnOffset;
        var offM = offL + columnWidth;
        var offR = offM + columnWidth;
        // Draw label.
        if (instruction.labels.length > 0) {
            // TODO: Support more than one label and also label wrapping
            group.appendChild(createRect(offM + 220, y, 100, 27.5));
            group.appendChild(createRect(offL + 220, y, 100, 27.5));
            group.appendChild(createText(offM + 270, y + 17.5, instruction.labels[0]));
            group.appendChild(createText(offL + 270, y + 17.5, instruction.labels[0]));
            group.appendChild(createArrow(offM + 220, y + 13.75, offM + 200, y + 13.75));
            group.appendChild(createArrow(offL + 220, y + 13.75, offL + 200, y + 13.75));
        }
        // Draw signals.
        var actionsResult = lib.signalsToActions(instruction.signals);
        var wrappedTextLeft = wrapText(actionsResult.result, MAX_LINE_LENGTH, ', ');
        var wrappedTextMiddle = wrapText(instruction.signals, MAX_LINE_LENGTH, ', ');
        var wrappedTextRightComment = instruction.comment.length > 0 ?
            wrapText(instruction.comment.split(' '), columnWidth / 10, ' ') :
            [];
        var wrappedTextRightLine = wrapText(instruction.line.split(','), columnWidth / 10, ', ');
        var wrappedTextRight = wrappedTextRightComment.concat(wrappedTextRightLine);
        var yDiffLeft = (wrappedTextLeft.length - 1) * 15 + 17.5;
        var yDiffMiddle = (wrappedTextMiddle.length - 1) * 15 + 17.5;
        var yDiff = Math.max(yDiffLeft, yDiffMiddle);
        group.appendChild(createText(offM + 100, y + 17.5, wrappedTextMiddle));
        group.appendChild(createText(offL + 100, y + 17.5, wrappedTextLeft));
        group.appendChild(createTextNotCentered(offR, y + 17.5, wrappedTextRight));
        var rectHeight = yDiff + 10;
        group.appendChild(createRect(offM, y, 200, rectHeight));
        var leftRect = createRect(offL, y, 200, rectHeight);
        if (!parameters.ignoreErrors && actionsResult.errors.length > 0) {
            // Point out that an error happened to the user.
            leftRect.setAttributeNS(SVG_NS, 'fill-opacity', '0.5');
            leftRect.style.fill = 'red';
        }
        group.appendChild(leftRect);
        group.appendChild(createArrow(offM + 100, y + rectHeight, offM + 100, y + rectHeight + arrowHeight));
        group.appendChild(createArrow(offL + 100, y + rectHeight, offL + 100, y + rectHeight + arrowHeight));
        y += rectHeight + arrowHeight;
        // Draw condition.
        switch (instruction.branchType) {
            case lib.BranchType.BRADR:
            case lib.BranchType.BROPR:
                group.appendChild(createText(offM + 100, y + 17.5, instruction.branchType));
                group.appendChild(createText(offL + 100, y + 17.5, instruction.branchType));
                group.appendChild(createConditionRect(offM, y, 200, 27.5));
                group.appendChild(createConditionRect(offL, y, 200, 27.5));
                y += 50;
                break;
            case lib.BranchType.CONDITIONAL:
                var conditions = lib.parseConditions(config);
                var conditionName = fixConditionName(instruction.condition, conditions);
                group.appendChild(createText(offM + 100, y + 17.5, conditionName));
                group.appendChild(createText(offL + 100, y + 17.5, conditionName));
                group.appendChild(createConditionRect(offM, y, 200, 27.5));
                group.appendChild(createConditionRect(offL, y, 200, 27.5));
                group.appendChild(createArrow(offM + 100, y + 27.5, offM + 100, y + 27.5 + arrowHeight));
                group.appendChild(createArrow(offL + 100, y + 27.5, offL + 100, y + 27.5 + arrowHeight));
                group.appendChild(createText(offM + 90, y + 27.5 + arrowHeight * 3 / 4, '0'));
                group.appendChild(createText(offL + 90, y + 27.5 + arrowHeight * 3 / 4, '0'));
                group.appendChild(createText(offM + 203, y + 10, '1'));
                group.appendChild(createText(offL + 203, y + 10, '1'));
                if (hasSelfBranch(instruction)) {
                    group.appendChild(createLine(offM + 200, y + 13.75, offM + 210, y + 13.75));
                    group.appendChild(createLine(offL + 200, y + 13.75, offL + 210, y + 13.75));
                    group.appendChild(createLine(offM + 210, y + 13.75, offM + 210, y - 20));
                    group.appendChild(createLine(offL + 210, y + 13.75, offL + 210, y - 20));
                    group.appendChild(createLine(offM + 210, y + 13.75, offM + 210, y - 20));
                    group.appendChild(createLine(offL + 210, y + 13.75, offL + 210, y - 20));
                    group.appendChild(createArrow(offM + 210, y - 20, offM + 200, y - 20));
                    group.appendChild(createArrow(offL + 210, y - 20, offL + 200, y - 20));
                } else {
                    group.appendChild(createArrow(offM + 200, y + 13.75, offM + 220, y + 13.75));
                    group.appendChild(createArrow(offL + 200, y + 13.75, offL + 220, y + 13.75));
                    group.appendChild(createRect(offM + 220, y, 100, 27.5));
                    group.appendChild(createRect(offL + 220, y, 100, 27.5));
                    group.appendChild(createText(offM + 270, y + 17.5, instruction.destination));
                    group.appendChild(createText(offL + 270, y + 17.5, instruction.destination));
                }
                y += 27.5 + arrowHeight;
            break;
            case lib.BranchType.UNCONDITIONAL:
                // TODO: Support label wrapping
                group.appendChild(createRect(offM + 50, y, 100, 27.5));
                group.appendChild(createRect(offL + 50, y, 100, 27.5));
                group.appendChild(createText(offM + 100, y + 17.5, instruction.destination));
                group.appendChild(createText(offL + 100, y + 17.5, instruction.destination));
                y += 40;
                break;
            default:
                // Do nothing.
                break;
        }
        // Draw separator.
        var separator = createLine(parameters.margin, y, parameters.width - parameters.margin, y);
        separator.setAttributeNS(SVG_NS, 'stroke-dasharray', '10,10');
        group.appendChild(separator);
        return {
            errors: actionsResult.errors.map(function(error) {
                return lib.msg('error-actions', instruction.line, error);
            }),
            result: group,
            y: y
        };
    }

    function createPage(parameters, config, instructions) {
        var group = document.createElementNS(SVG_NS, 'g');
        var width = parameters.width;
        var height = parameters.height;
        var margin = parameters.margin;
        var headerHeight = parameters.headerHeight;
        var footerRowHeight = parameters.footerRowHeight;
        var pageWidth = width - 2 * margin;
        var columnWidth = pageWidth / 3;
        var columnHalfWidth = columnWidth / 2;
        group.append(createLine(margin, margin, width - margin, margin));
        group.append(createLine(margin, margin, margin, height - margin));
        group.append(createLine(width - margin, margin, width - margin, height - margin));
        group.append(createLine(margin, height - margin, width - margin, height - margin));
        group.append(createLine(margin, margin + headerHeight, width - margin, margin + headerHeight));
        group.append(createLine(margin, margin + headerHeight, width - margin, margin + headerHeight));
        group.append(createLine(margin + columnWidth, margin, margin + columnWidth, height - margin));
        group.append(createLine(margin + columnWidth * 2, margin, margin + columnWidth * 2, height - margin));
        group.append(createText(margin + columnHalfWidth, margin + 15, parameters.columnHeaderLeft));
        group.append(createText(margin + columnHalfWidth * 3, margin + 15, parameters.columnHeaderMiddle));
        group.append(createText(margin + columnHalfWidth * 5, margin + 15, parameters.columnHeaderRight));
        var lowerRowMargin = height - margin - footerRowHeight;
        var upperRowMargin = lowerRowMargin - footerRowHeight;
        group.append(createLine(margin, lowerRowMargin, width - margin, lowerRowMargin));
        group.append(createLine(margin, upperRowMargin, width - margin, upperRowMargin));
        var pageHeight = height - 2 * margin - FIELDS.length * footerRowHeight;
        var currentY = margin + headerHeight;
        var errors = [];
        pageHeight -= currentY;
        while (pageHeight > 0 && instructions.length > 0) {
            var instruction = instructions.shift();
            var generationResult = generateInstructionDiagram(parameters, config, instruction, currentY);
            var heightDiff = generationResult.y - currentY;
            currentY = generationResult.y;
            pageHeight -= heightDiff;
            if (pageHeight >= 0) {
                group.appendChild(generationResult.result);
            } else {
                instructions.unshift(instruction);
            }
            errors = errors.concat(generationResult.errors);
        }
        FIELDS.forEach(function(row, rowIndex) {
            row.forEach(function(cell, columnIndex) {
                var textX = margin + columnIndex * columnWidth + 10;
                var textY = height - margin - (FIELDS.length - rowIndex - 0.5) * footerRowHeight;
                group.append(createTextNotCentered(textX, textY, cell + ':'));
            });
        });
        return {
            errors: errors,
            result: group
        };
    }

    function createSVG(width, height) {
        var svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttributeNS(SVG_NS, 'width', width);
        svg.setAttributeNS(SVG_NS, 'height', height);
        svg.setAttributeNS(SVG_NS, 'viewBox', '0 0 ' + width + ' ' + height);
        svg.setAttributeNS(SVG_NS, 'version', '1.1');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        svg.setAttribute('xmlns', SVG_NS);
        return svg;
    }

    function createSVGWithPages(width, height, pages) {
        var svg = createSVG(width, pages.length * height);
        pages.forEach(function(page, pageIndex) {
            page.setAttributeNS(SVG_NS, 'transform', 'translate(0, ' + pageIndex * height + ')');
            svg.appendChild(page);
        });
        return svg;
    }

    function getPages(parameters, config, instructions) {
        var pages = [];
        var errors = [];
        while (instructions.length > 0) {
            var createPageResult = createPage(parameters, config, instructions);
            pages.push(createPageResult.result);
            errors = errors.concat(createPageResult.errors);
        }
        var numFieldRows = FIELDS.length;
        var numFieldColumns = FIELDS[0].length;
        var numFields = numFieldRows * numFieldColumns;
        pages.forEach(function(page, pageIndex) {
            var fieldNodes = Array.prototype.slice.call(page.children, -numFields);
            var fields = [];
            for (var rowIndex = 0; rowIndex < numFieldRows; ++rowIndex) {
                var fieldRow = [];
                for (var columnIndex = 0; columnIndex < numFieldColumns; ++columnIndex) {
                    fieldRow.push(fieldNodes[rowIndex * numFieldColumns + columnIndex]);
                }
                fields.push(fieldRow);
            }
            var today = new Date();
            var formattedDate = today.getDate() + '. ' + (today.getMonth() + 1) + '. ' + today.getFullYear() + '.';
            fields[0][0].textContent += ' ' + parameters.nameSurname;
            fields[0][1].textContent += ' ' + parameters.indexNum;
            fields[1][0].textContent += ' ' + parameters.subjectName;
            fields[1][1].textContent += ' ' + formattedDate;
            fields[1][2].textContent += ' ' + (pageIndex + 1) + '/' + pages.length;
        });
        return {
            errors: errors,
            result: pages
        };
    }

    window.mw = $.extend(true, window.mw, {
        libs: {
            diagramGenerator: {
                createSVG: createSVG,
                createSVGWithPages: createSVGWithPages,
                getPages: getPages
            }
        }
    });
})();
