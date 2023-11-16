import './App.css'
import TrackPauseModal from './components/modalWindow/TrackPauseModal';
import TrackProgress from './components/modalWindow/TrackProgress';
import TrackThumbnailModal from './components/modalWindow/TrackThumbnailModal';
import TrackTitle from './components/modalWindow/TrackTitle';

function App() {
    
    return (
        <>
        <TrackTitle/>
        <div className='flex '>
            <TrackThumbnailModal width={230} height={230}/>
            <TrackProgress/>
            <TrackPauseModal/>
        </div>
        </>
    )
}

export default App;