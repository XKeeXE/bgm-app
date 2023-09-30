declare module 'list-react-files' {
    function listReactFiles(cwd: string): Promise<Array<string>>
}