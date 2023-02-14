import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { useTldrawApp } from '~hooks'
import { styled } from '~styles'
import type { TDSnapshot } from '~types'

const isRunningModelSelector = (s: TDSnapshot) => s.appState.isRunningModel

export function ProgressBar() {
  const app = useTldrawApp()
  const isRunningModel = app.useStore(isRunningModelSelector)

  return (
    <StyledProgressPanelContainer hidden={!isRunningModel}>
      <FormattedMessage id="Diffusion" values={{ dots: '...' }} />
    </StyledProgressPanelContainer>
  )
}

const StyledProgressPanelContainer = styled('div', {
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: `translate(-50%, 0)`,
  borderBottomLeftRadius: '12px',
  borderBottomRightRadius: '12px',
  padding: '8px 16px',
  fontFamily: 'var(--fonts-ui)',
  fontSize: 'var(--fontSizes-1)',
  boxShadow: 'var(--shadows-panel)',
  backgroundColor: 'white',
  zIndex: 200,
  pointerEvents: 'none',
  '& > div > *': {
    pointerEvents: 'all',
  },
  variants: {
    transform: {
      hidden: {
        transform: `translate(-50%, 100%)`,
      },
      visible: {
        transform: `translate(-50%, 0%)`,
      },
    },
  },
})
