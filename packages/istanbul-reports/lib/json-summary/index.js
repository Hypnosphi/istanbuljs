/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
const { ReportBase } = require('istanbul-lib-report');

class JsonSummaryReport extends ReportBase {
    constructor(opts) {
        super();

        this.file = opts.file || 'coverage-summary.json';
        this.contentWriter = null;
        this.first = true;
        this.reportDirectories = opts.reportDirectories;
        this.skipCommonParent = opts.skipCommonParent;
    }

    onStart(root, context) {
        this.contentWriter = context.writer.writeFile(this.file);
        this.contentWriter.write('{');
    }

    writeSummary(filePath, sc) {
        const cw = this.contentWriter;
        if (this.first) {
            this.first = false;
        } else {
            cw.write(',');
        }
        cw.write(JSON.stringify(filePath));
        cw.write(': ');
        cw.write(JSON.stringify(sc));
        cw.println('');
    }

    onSummary(node) {
        if (!node.isRoot() && !this.reportDirectories) {
            return;
        }
        this.writeSummary(
            node.path.toString() || 'total',
            node.getCoverageSummary()
        );
    }

    onDetail(node) {
        this.writeSummary(
            this.skipCommonParent
                ? node.path.toString()
                : node.getFileCoverage().path,
            node.getCoverageSummary()
        );
    }

    onEnd() {
        const cw = this.contentWriter;
        cw.println('}');
        cw.close();
    }
}

module.exports = JsonSummaryReport;
