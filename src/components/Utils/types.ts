export type svg = 'PR' | 'US' | 'JA'
export type trackType = 'local' | 'youtube' | "spotify"

export type track = {
    id: number
    url: string,
    title: string,
    duration?: string,
    queue: {
        pos: number,
        played: boolean
    }
    type: trackType
}

export type UI = {
    key: string,
    tooltip: string,
    icon: JSX.Element,
    onClick: () => void
}

export type setting = {
    language: string,
    homePath: string,
    darkMode: boolean,
    viewportHeight: number,
    viewportWidth: number,
    volume: number,
    maxSaveTimer: number,
}