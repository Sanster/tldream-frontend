import * as React from 'react'
import { useIntl } from 'react-intl'
import { Input } from '~components/Primitives/AlertDialog'
import { Panel } from '~components/Primitives/Panel'
import { ToolButton, ToolButtonWithTooltip } from '~components/Primitives/ToolButton'
import { UndoIcon } from '~components/Primitives/icons'
import { useTldrawApp } from '~hooks'
import { styled } from '~styles'
import { TDExportType, TDShapeType } from '~types'
import { Menu } from './Menu/Menu'
import { MultiplayerMenu } from './MultiplayerMenu'
import { PageMenu } from './PageMenu'
import { StyleMenu } from './StyleMenu'
import { ZoomMenu } from './ZoomMenu'

interface TopPanelProps {
  readOnly: boolean
  showPages: boolean
  showMenu: boolean
  showStyles: boolean
  showZoom: boolean
  showMultiplayerMenu: boolean
}

export function _TopPanel({
  readOnly,
  showPages,
  showMenu,
  showStyles,
  showZoom,
  showMultiplayerMenu,
}: TopPanelProps) {
  const app = useTldrawApp()
  const intl = useIntl()
  const [prompt, setPrompt] = React.useState(app.appState.prompt)

  const onDreamButtonClick = React.useCallback(() => {
    const shapes = app.getShapes()
    const ids = shapes
      .filter(
        (s) =>
          s.type !== TDShapeType.Image &&
          s.type !== TDShapeType.Video &&
          s.type !== TDShapeType.Sticky
      )
      .map((s) => s.id)
    app.runControlNet(TDExportType.JPG, { scale: 2, quality: 1, ids: ids })
  }, [app])

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart()
    setPrompt(value)
  }, [])

  const handleTextFieldKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter': {
        onDreamButtonClick()
        break
      }
    }
  }, [])

  return (
    <StyledTopPanel>
      {(showMenu || showPages) && (
        <SubPanel side="left">
          {showMenu && <Menu readOnly={readOnly} />}
          {showMultiplayerMenu && <MultiplayerMenu />}
          {showPages && <PageMenu />}
        </SubPanel>
      )}
      <StyledPromptWrapper>
        <Input
          style={{ width: 600 }}
          placeholder="Prompt"
          value={prompt}
          onChange={handleChange}
          onKeyDown={handleTextFieldKeyDown}
        />
        <ToolButtonWithTooltip
          label="dream"
          onClick={onDreamButtonClick}
          isActive={false}
          variant="text"
          id="TD-PrimaryTools-Dream"
        >
          Dream
        </ToolButtonWithTooltip>
      </StyledPromptWrapper>
      {(showStyles || showZoom) && (
        <SubPanel side="right">
          {app.readOnly ? (
            <ReadOnlyLabel>Read Only</ReadOnlyLabel>
          ) : (
            <>
              <ToolButtonWithTooltip
                kbd={'#Z'}
                label={intl.formatMessage({ id: 'undo' })}
                onClick={app.undo}
                id="TD-TopPanel-Undo"
                aria-label={intl.formatMessage({ id: 'undo' })}
              >
                <UndoIcon />
              </ToolButtonWithTooltip>
              <ToolButtonWithTooltip
                kbd={'#⇧Z'}
                label={intl.formatMessage({ id: 'redo' })}
                onClick={app.redo}
                id="TD-TopPanel-Redo"
                aria-label={intl.formatMessage({ id: 'redo' })}
              >
                <UndoIcon flipHorizontal />
              </ToolButtonWithTooltip>
            </>
          )}
          {showZoom && <ZoomMenu />}
          {showStyles && !readOnly && <StyleMenu />}
        </SubPanel>
      )}
    </StyledTopPanel>
  )
}

const StyledPromptWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
})

const StyledTopPanel = styled('div', {
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  // pointerEvents: 'none',
  // '& > *': {
  //   pointerEvents: 'all',
  // },
  backgroundColor: '$panel',
  boxShadow: '$panel',
  border: '1px solid $panelContrast',
})

const StyledSpacer = styled('div', {
  flexGrow: 2,
  pointerEvents: 'none',
})

const ReadOnlyLabel = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '$ui',
  fontSize: '$1',
  paddingLeft: '$4',
  paddingRight: '$1',
  userSelect: 'none',
})

export const SubPanel = styled('div', {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: 0,
  top: 0,
  overflow: 'hidden',
  variants: {
    side: {
      left: {
        left: 0,
        padding: 0,
        borderTop: 0,
        borderLeft: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 9,
        borderBottomLeftRadius: 0,
      },
      right: {
        right: 0,
        padding: 0,
        borderTop: 0,
        borderRight: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 0,
      },
    },
  },
})

export const TopPanel = React.memo(_TopPanel)
