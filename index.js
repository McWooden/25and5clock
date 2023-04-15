function App() {
    const [brk, setBrk] = React.useState(5)
    const [ses, setSes] = React.useState(25)
    const [isPlay, setIsPlay] = React.useState(false)
    const [timeLeft, setTimeLeft] = React.useState(1500)
    const [mode, setMode] = React.useState('Session')
    const audioRef = React.useRef()
    
    React.useEffect(() => {
        let timer
        if (isPlay) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev < 1) {
                        audioRef.current.play()
                        if (mode === 'Session') {
                            setMode('Break')
                            return brk * 60
                        } else {
                            setMode('Session')
                            return ses * 60
                        }
                    } else {
                        return prev - 1
                    }
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [isPlay, brk, ses, mode])
    
    React.useEffect(() => {
        setTimeLeft(ses * 60)
    }, [ses])
    
    function reset() {
        setBrk(5)
        setSes(25)
        setIsPlay(false)
        setTimeLeft(ses*60)
        setMode('Session')
        if (audioRef.current && audioRef.current.paused === false) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }        
    }
    return (
        <>
        <div className="container d-flex flex-wrap justify-content-center">
            <Control isPlay={isPlay} cb={setBrk} name={'break'} number={brk} icon={'fa-mug-saucer'} color={'bg-success-subtle'}/>
            <Control isPlay={isPlay} cb={setSes} name={'session'} number={ses} icon={'fa-person-hiking'} color={'bg-primary-subtle'}/>
        </div>
        <div className={`container bg-white shadow rounded text-center p-0 pt-2 rounded bg-${mode === 'Session'?'primary':'success'}-subtle`}>
            <div className={`shadow rounded py-2 mx-4 border bg-light`}>
                <p id="timer-label" className="fs-3 mb-3">{mode}</p>
                <p id="time-left" className="fs-1">{`${Math.floor(timeLeft / 60) < 10 ? '0' : ''}${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`}</p>
            </div>
            <div className="buttons py-3 d-flex justify-content-center">
                <div className={`btn btn-info`} id="start_stop" onClick={() => setIsPlay(x => !x)}>
                    {isPlay?
                        <i class="fa-solid fa-pause"></i>
                    :
                        <i class="fa-solid fa-play"></i>
                    }
                </div>
                <div className="btn btn-warning" id="reset" onClick={reset}>
                    <i class="fa-solid fa-arrows-rotate"></i>
                </div>
            </div>
        </div>
        <footer className="text-center text-white mt-4">by Huddin</footer>
        <audio ref={audioRef} id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
        </>
    )
}
function Control({name, number, color, icon, cb, isPlay}) {
    function ment(x) {
        if (isPlay) return
        switch(x) {
            case 'INCREMENT':
                if (number >= 60) break
                cb(number + 1)
                break
            case 'DECREMENT':
                if(number <= 1) break
                cb(number - 1)
                break
            default:
                break
        }
    }
    return (
        <div id={`${name}-label`} className={`${color} shadow m-3 rounded p-4 control flex-fill`}>
            <div><i className={`fa-solid ${icon}`}></i> <span className="text-center text-capitalize">{name} Length</span></div>
            <div className="d-flex justify-content-center mt-3">
                {!isPlay && <div className="btn btn-primary" id={`${name}-decrement`} onClick={() => ment('DECREMENT')}>
                    <i className="fa-solid fa-caret-down fs-2"></i>
                </div>}
                <p className="mx-3 my-0 fs-2" id={`${name}-length`}>{number}</p>
                {!isPlay && <div className="btn btn-primary" id={`${name}-increment`} onClick={() => ment('INCREMENT')}>
                    <i className="fa-solid fa-caret-up fs-2"></i>
                </div>}
            </div>
        </div>
    )
}
ReactDOM.render(<App/>, document.getElementById('root'))