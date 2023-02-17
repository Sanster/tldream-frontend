import * as Dialog from '@radix-ui/react-alert-dialog'
import { GearIcon } from '@radix-ui/react-icons'
import * as React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from '~components/Primitives/AlertDialog'
import { TextAreaField } from '~components/Primitives/TextAreaField'
import { TextField } from '~components/Primitives/TextField'
import { ToolButton } from '~components/Primitives/ToolButton'
import { useContainer, useTldrawApp } from '~hooks'
import { styled } from '~styles'
import { TDSnapshot } from '~types'
import GenerateDirectionGroup, {
  DEFAULT_IMAGE_DIRECTION,
  ImageDirection,
} from './GenerateDirectionGroup'
import GenerateSizeGroup from './GenerateSizeGroup'

const isDiffusionParamsOpenSelector = (s: TDSnapshot) => s.appState.isDiffusionParamsOpen

export function ParamsMenu() {
  const app = useTldrawApp()
  const isDiffusionParamsOpen = app.useStore(isDiffusionParamsOpenSelector)

  return (
    <div>
      <ToolButton
        variant="text"
        onClick={() => {
          app.setDiffusionParamsOpen(true)
        }}
      >
        <GearIcon />
      </ToolButton>
      <ParamsDialog
        isOpen={isDiffusionParamsOpen}
        onClose={() => app.setDiffusionParamsOpen(false)}
      />
    </div>
  )
}

interface ParamsDialogProps {
  isOpen: boolean
  onClose: () => void
}

const currentPageParamsSelector = (s: TDSnapshot) =>
  s.document.pageDiffusionParams[s.appState.currentPageId]

const ParamsDialog = ({ isOpen, onClose }: ParamsDialogProps) => {
  const app = useTldrawApp()
  const container = useContainer()

  const diffusionParams = app.useStore(currentPageParamsSelector)
  const [imageDirection, setImageDirection] = React.useState(DEFAULT_IMAGE_DIRECTION)

  function stopPropagation(e: React.KeyboardEvent<HTMLDivElement>) {
    e.stopPropagation()
  }

  const handleStepsChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value.trimStart()
    app.setSteps(value)
  }, [])

  const handleGuidanceChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value.trimStart()
    app.setGuidanceScale(value)
  }, [])

  // const handleNegativePromptChange
  const handleNegativePromptChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value.trimStart()
      app.setNegativePrompt(value)
    },
    []
  )

  const handleRatioChange = React.useCallback((width: number, height: number) => {
    app.setGenerateWidthHeight(width, height)
  }, [])

  const handleDirectionChange = React.useCallback((direction: ImageDirection) => {
    app.swapGenerateWidthHeight()
    setImageDirection(direction)
  }, [])

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal container={container.current}>
        <StyledDialogOverlay onPointerDown={onClose} />
        <StyledDialogContent dir="ltr" onKeyDown={stopPropagation} onKeyUp={stopPropagation}>
          <StyledParams>
            <FieldWrapper style={{ flexDirection: 'column', alignItems: 'start' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <StyledFieldLabel style={{ width: 'unset' }}>Generate Size</StyledFieldLabel>
                <GenerateDirectionGroup
                  value={imageDirection}
                  onValueChange={handleDirectionChange}
                />
              </div>
              <GenerateSizeGroup
                value={`${diffusionParams.width}x${diffusionParams.height}`}
                direction={imageDirection}
                onRatioChange={handleRatioChange}
              />
            </FieldWrapper>
            <FieldWrapper>
              <StyledFieldLabel>Steps</StyledFieldLabel>
              <Input
                value={diffusionParams.steps.toString()}
                placeholder="Steps"
                onChange={handleStepsChange}
              />
            </FieldWrapper>
            <FieldWrapper>
              <StyledFieldLabel>Guidance</StyledFieldLabel>
              <Input
                value={diffusionParams.guidanceScale.toString()}
                placeholder=""
                onChange={handleGuidanceChange}
              />
            </FieldWrapper>
            <FieldWrapper style={{ flexDirection: 'column', alignItems: 'start' }}>
              <div>Negative Prompt</div>
              <InputArea
                value={diffusionParams.negativePrompt}
                placeholder="Describe what you don't want in your image like color, objects, or a scenery."
                onChange={handleNegativePromptChange}
              />
            </FieldWrapper>
          </StyledParams>
          <ActionWrapper>
            <Dialog.Action asChild>
              <Button css={{ backgroundColor: '#2F80ED', color: 'White' }} onClick={onClose}>
                <FormattedMessage id="Close" />
              </Button>
            </Dialog.Action>
          </ActionWrapper>
        </StyledDialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const StyledFieldLabel = styled('div', {
  width: 120,
})

const FieldWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: 8,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',

  '& > div': {
    fontSize: '14px',
  },
})

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

const ActionWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'flex-end',
  marginTop: 10,
})

export const Input = styled(TextField, {
  background: '$hover',
})

export const InputArea = styled(TextAreaField, {
  backgroundColor: '$hover',
})

const StyledParams = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  justifyContent: 'start',
  marginTop: 10,
})
