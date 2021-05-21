// Sleep for n ms
function sleep(delay: number, { signal }: { signal: AbortSignal }): Promise<string> {
    if (signal.aborted) {
        return Promise.reject(new DOMException('aborted', 'AbortError'));
    }

    if (delay <= 0) {
        return Promise.resolve('resolved');
    }

    return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(resolve, delay, 'resolved');

        signal.addEventListener('abort', () => {
            window.clearTimeout(timeout);
            reject(new DOMException('aborted', 'AbortError'));
        });
    });
}

export default sleep;
