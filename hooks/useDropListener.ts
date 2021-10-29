import {useEffect} from 'react'

const useDropListener = ({onDragEnter, onDragLeave}) => {
  useEffect(() => {
    let counter = 0
    const dragenter = (e) => {
      if (e.dataTransfer.types[0] === 'Files') {
        counter += 1
        if (counter === 1) {
          // document.body.style.pointerEvents = 'none'
          onDragEnter()
        }
      }
    }
    const dragleave = (e) => {
      if (e.dataTransfer.types[0] === 'Files') {
        counter -= 1
        if (counter === 0) {
          // document.body.style.pointerEvents = ''
          onDragLeave()
        }
      }
    }

    const drop = (e) => {
      if (e.dataTransfer.types[0] === 'Files') {
        counter -= 1
        if (counter === 0) {
          // document.body.style.pointerEvents = ''
          onDragLeave()
        }
      }
    }
    document.addEventListener('dragenter', dragenter)
    document.addEventListener('dragleave', dragleave)
    document.addEventListener('drop', drop)
    return () => {
      document.removeEventListener('dragenter', dragenter)
      document.removeEventListener('dragleave', dragleave)
      document.removeEventListener('drop', drop)
    }
  }, [])
}

export default useDropListener
