export type svg = 'PR' | 'US' | 'JA'

export type track = {
    id: number
    url: string,
    title: string,
    duration?: string,
    queue: {
        pos: number,
        played: boolean
    }
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