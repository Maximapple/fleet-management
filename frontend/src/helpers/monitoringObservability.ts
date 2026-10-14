/**
 * The authoritative collection level comes from the backend health snapshot.
 * Browser-local observability is separate and may have another level.
 */
export function formatBackendObservabilityLevel(
    backendLevel: unknown,
    labels: readonly string[]
): string {
    const level = parseBackendObservabilityLevel(backendLevel, labels.length);
    return level === null ? 'not available' : labels[level];
}

export function parseBackendObservabilityLevel(
    backendLevel: unknown,
    levels = 4
): number | null {
    return typeof backendLevel === 'number' &&
        Number.isInteger(backendLevel) &&
        backendLevel >= 0 &&
        backendLevel < levels
        ? backendLevel
        : null;
}
