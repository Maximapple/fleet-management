/**
 * The authoritative collection level comes from the backend health snapshot.
 * Browser-local observability is separate and may have another level.
 */
export function formatBackendObservabilityLevel(
    backendLevel: unknown,
    labels: readonly string[]
): string {
    return typeof backendLevel === 'number' &&
        Number.isInteger(backendLevel) &&
        backendLevel >= 0 &&
        backendLevel < labels.length
        ? labels[backendLevel]
        : 'not available';
}
