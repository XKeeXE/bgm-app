// import React from 'react'
import ReactDOM from 'react-dom/client'
import PlayerApp from '../src/components/PlayerApp'
import { NextUIProvider } from '@nextui-org/react'

/*
<React.StrictMode>
    <NextUIProvider>
        <main>
            <PlayerApp />
        </main>
    </NextUIProvider>
</React.StrictMode>,
*/

ReactDOM.createRoot(document.getElementById('player-root')!).render(
<NextUIProvider>
    <main>
        <PlayerApp />
    </main>
</NextUIProvider>
)