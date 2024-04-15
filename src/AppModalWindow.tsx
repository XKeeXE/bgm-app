import { Card, CardBody } from '@nextui-org/react';
import './App.css'
import TrackPauseModal from './components/modalWindow/TrackPauseModal';
import TrackProgress from './components/modalWindow/TrackProgress';
import TrackThumbnailModal from './components/modalWindow/TrackThumbnailModal';
import TrackTitle from './components/modalWindow/TrackTitle';
import TrackSkipModal from './components/modalWindow/TrackSkipModal';
import TrackLoopModal from './components/modalWindow/TrackLoopModal';
import TracksQueue from './components/modalWindow/TracksQueue';
import TrackPreviousModal from './components/modalWindow/TrackPreviousModal';

import MinimizeIcon from '@mui/icons-material/Minimize';
import ModalButtons from './components/modalWindow/ModalButtons';
import CloseIcon from '@mui/icons-material/Close';
import BGMSQModal from './components/modalWindow/BGMSQModal';

function App() {

    // const [playing, setPlaying] = useState<boolean>(true);

    // interface UIButton {
    //     key: string,
    //     radius: string,
    //     size: string,
    //     variant: string,
    //     ipcRemove: boolean,
    //     data?: any,

    //     icon: JSX.Element
    // }

    // const UIButtons: UIButton[] = [{
    //     key: '',
    //     radius: '',
    //     size: '',
    //     variant: '',
    //     icon: undefined
    // }];

    interface UIButton {
        key: string,
        radius: string,
        size: string,
        variant: string,
        ipcName: string,
        icon: JSX.Element
    }

    const UIButtons: UIButton[] = [{
        key: 'minimize',
        radius: 'full',
        size: 'sm',
        variant: 'light',
        ipcName: 'minimizeModal',
        icon: <MinimizeIcon/>
    },
    {
        key: 'close',
        radius: 'full',
        size: 'sm',
        variant: 'light',
        ipcName: 'closeApp',
        icon: <CloseIcon/>
    }]
    
    return (
        <>  
        <Card className='relative min-h-screen bg-gradient-to-b from-[#2f026da2] to-[#15162ca8] '>
            <CardBody className='w-full h-full flex flex-row gap-5'>
                <TrackThumbnailModal/>
                <div className='absolute top-0 right-0 flex'>
                    {UIButtons.map(button => (
                        <ModalButtons radius={button.radius} size={button.size} variant={button.variant} ipcName={button.ipcName} icon={button.icon}/>
                    ))}
                </div>
                <div className='w-full align-middle self-center flex flex-col gap-1'>
                    <TrackTitle/>
                    <TracksQueue/>
                    <TrackProgress/>
                    <div className='w-full flex flex-row items-center justify-center gap-1'>
                        <BGMSQModal/>
                        <TrackPreviousModal/>
                        <TrackPauseModal/>
                        <TrackSkipModal/>
                        <TrackLoopModal/>
                    </div>
                </div>
            </CardBody>
        </Card>
        </>
    )
}

export default App;