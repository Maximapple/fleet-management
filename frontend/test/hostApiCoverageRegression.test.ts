import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {methodSetDiff} from '../scripts/check-host-api-coverage.mjs';

const FRONTEND_ROOT = join(__dirname, '..');
const REPO_ROOT = join(FRONTEND_ROOT, '..');

describe('REGRESSION: public release Host API coverage', () => {
    it('runs from live Describe sources without backend test fixtures', () => {
        expect(
            existsSync(join(REPO_ROOT, 'backend/test/fixtures/golden'))
        ).toBe(false);

        const stdout = execFileSync(
            process.execPath,
            ['--import', 'tsx', 'scripts/check-host-api-coverage.mjs'],
            {cwd: FRONTEND_ROOT, encoding: 'utf8'}
        );

        expect(stdout).toMatch(
            /Host API coverage passed: \d+ live Describe methods match the generated HostContract/
        );
    });

    it('reports both missing and stale generated methods', () => {
        expect(
            methodSetDiff(
                ['device.list', 'location.list'],
                ['device.list', 'dashboard.list']
            )
        ).toEqual({
            missing: ['location.list'],
            stale: ['dashboard.list']
        });
    });
});
