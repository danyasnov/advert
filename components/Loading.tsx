import React from 'react'
import {useNProgress} from '@tanem/react-nprogress'
import Lottie from 'react-lottie'
import Loader from '../lottie/vooxee_loader.json'

const Loading: React.FC<{isRouteChanging: boolean}> = ({isRouteChanging}) => {
  const {animationDuration, isFinished, progress} = useNProgress({
    isAnimating: isRouteChanging,
  })

  return (
    <>
      <style jsx>{`
        .container {
          opacity: ${isFinished ? 0 : 1};
          pointer-events: none;
          transition: opacity ${animationDuration}ms linear;
        }

        .bar {
          background: #7210ff;
          height: 2px;
          left: 0;
          margin-left: ${(-1 + progress) * 100}%;
          position: fixed;
          top: 0;
          transition: margin-left ${animationDuration}ms linear;
          width: 100%;
          z-index: 1031;
        }
      `}</style>
      <div className='container'>
        <div className='bar' />
        <div className='flex justify-center items-center absolute -right-3 -top-3'>
          <Lottie options={{animationData: Loader}} height={100} width={100} />
        </div>
      </div>
    </>
  )
}

export default Loading
