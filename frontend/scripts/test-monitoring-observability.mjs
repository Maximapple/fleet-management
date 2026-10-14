#!/usr/bin/env node
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {
    formatBackendObservabilityLevel,
    parseBackendObservabilityLevel
} from '../src/helpers/monitoringObservability.ts';

const labels = ['OFF', 'Light', 'Medium', 'Full'];

test('backend collection is displayed independently of browser-local level', () => {
    assert.equal(formatBackendObservabilityLevel(2, labels), 'Medium');
    assert.equal(formatBackendObservabilityLevel(0, labels), 'OFF');
    assert.equal(formatBackendObservabilityLevel(3, labels), 'Full');
    assert.equal(parseBackendObservabilityLevel(2), 2);
});

test('missing and malformed health metrics cannot impersonate a valid level', () => {
    for (const value of [null, undefined, -1, 4, NaN, Infinity, 1.1, '2', true]) {
        assert.equal(formatBackendObservabilityLevel(value, labels), 'not available');
        assert.equal(parseBackendObservabilityLevel(value), null);
    }
});

test('settings component enforces the same permission as the protected RPC', () => {
    const source = readFileSync(
        fileURLToPath(new URL('../src/pages/settings/monitoring/control-panel.vue', import.meta.url)),
        'utf8'
    );
    assert.match(source, /rpc\.canCall\('System\.Observability\.Set'\)/);
    assert.match(source, /:disabled="!canSetObservability"/);
    assert.match(source, /Backend collection \(actual\): \{\{ backendObservabilityLabel \}\}/);
    assert.match(source, /Browser telemetry \(this browser\): \{\{ OBS_LEVEL_LABELS\[store\.obsLevel\] \}\}/);
    assert.match(source, /:class="backendObservabilityLevel === i \? levelActiveClass\(i\)/);
    assert.match(source, /:aria-pressed="backendObservabilityLevel === i"/);
    assert.doesNotMatch(source, /:class="store\.obsLevel === i \? levelActiveClass\(i\)/);
});
