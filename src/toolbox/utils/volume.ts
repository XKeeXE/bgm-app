export function addVolume(currentVolume: number): number {
    const newVolume = Math.round(currentVolume * 100) + 5;
    if (newVolume === 5) return 0.01;
    if (newVolume >= 100) return 1;
    return newVolume / 100;
}

export function removeVolume(currentVolume: number): number {
    const rounded = Math.round(currentVolume * 100);
    if (rounded === 0) return 0;
    if (rounded === 1) return 0;
    const newVolume = rounded - 5;
    if (newVolume < 1) return 1 / 100;
    return newVolume / 100;
}