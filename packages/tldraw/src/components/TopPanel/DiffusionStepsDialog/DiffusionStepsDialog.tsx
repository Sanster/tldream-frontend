import * as Dialog from '@radix-ui/react-alert-dialog'
import * as React from 'react'
import io from 'socket.io-client'
import { TextAreaField } from '~components/Primitives/TextAreaField'
import { TextField } from '~components/Primitives/TextField'
import { useContainer, useTldrawApp } from '~hooks'
import * as Progress from '@radix-ui/react-progress'
import { styled } from '~styles'
import { TDSnapshot } from '~types'

const socket = io('ws://localhost:4242', {
  path: '/ws/socket.io/',
  transports: ['websocket', 'polling'],
})

const currentPageParamsSelector = (s: TDSnapshot) =>
  s.document.pageDiffusionParams[s.appState.currentPageId]

const DiffusionStepsDialog = () => {
  const app = useTldrawApp()
  const container = useContainer()
  const [isConnected, setIsConnected] = React.useState(socket.connected)
  const isRunningModel = app.useStore(s => s.appState.isRunningModel)
  const diffusionParams = app.useStore(currentPageParamsSelector)
  const [step, setStep] = React.useState(0)

  const progress = Math.round((step / diffusionParams.steps) * 100)

  React.useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('progress', data => {
      if (data) {
        setStep(data.step + 1)
      }
    })

    socket.on('finish', data => {
      setStep(0)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('progress')
      socket.off('finish')
    }
  }, [])

  function stopPropagation(e: React.KeyboardEvent<HTMLDivElement>) {
    e.stopPropagation()
  }

  return (
    <Dialog.Root open={isRunningModel && isConnected}>
      <Dialog.Portal container={container.current}>
        <StyledDialogOverlay />
        <StyledDialogContent dir="ltr" onKeyDown={stopPropagation} onKeyUp={stopPropagation}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <ProgressRoot value={progress}>
              <ProgressIndicator style={{ transform: `translateX(-${100 - progress}%)` }} />
            </ProgressRoot>
            <div style={{ fontSize: 14 }}>
              {diffusionParams.width}x{diffusionParams.height}({step}/{diffusionParams.steps})
            </div>
          </div>
        </StyledDialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DiffusionStepsDialog

const StyledDialogContent = styled(Dialog.Content, {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 300,
  maxWidth: 'fit-content',
  maxHeight: '85vh',
  marginTop: '-5vh',
  pointerEvents: 'all',
  backgroundColor: '$panel',
  padding: '$3',
  borderRadius: '$2',
  font: '$ui',
  zIndex: 999999,
  '&:focus': {
    outline: 'none',
  },
})

const StyledDialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: 'rgba(0, 0, 0, .15)',
  position: 'absolute',
  pointerEvents: 'all',
  inset: 0,
  zIndex: 999998,
})

export const Input = styled(TextField, {
  background: '$hover',
})

export const InputArea = styled(TextAreaField, {
  backgroundColor: '$hover',
})

const ProgressRoot = styled(Progress.Root, {
  position: 'relative',
  overflow: 'hidden',
  background: '$overlay',
  borderRadius: '99999px',
  width: 300,
  height: 18,

  // Fix overflow clipping in Safari
  // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
  transform: 'translateZ(0)',
})

const ProgressIndicator = styled(Progress.Indicator, {
  backgroundColor: '$selected',
  width: '100%',
  height: '100%',
  transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
})
