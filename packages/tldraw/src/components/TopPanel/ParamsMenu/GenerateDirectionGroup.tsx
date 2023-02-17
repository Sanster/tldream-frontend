import { ContainerIcon, SectionIcon } from '@radix-ui/react-icons'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import React from 'react'
import { styled } from '~styles'

export enum ImageDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export const DEFAULT_IMAGE_DIRECTION = ImageDirection.VERTICAL

interface Props {
  value: ImageDirection
  onValueChange: (value: ImageDirection) => void
}

const GenerateDirectionGroup = (props: Props) => {
  const { value, onValueChange } = props

  return (
    <ToggleGroupRoot
      type="single"
      defaultValue={value}
      aria-label="Text alignment"
      onValueChange={onValueChange}
    >
      <ToggleGroupItem value={ImageDirection.VERTICAL} aria-label="vertical">
        <ContainerIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value={ImageDirection.HORIZONTAL} aria-label="horizontal">
        <SectionIcon />
      </ToggleGroupItem>
    </ToggleGroupRoot>
  )
}

const ToggleGroupRoot = styled(ToggleGroup.Root, {
  display: 'inline-flex',
  borderRadius: 4,
})

const ToggleGroupItem = styled(ToggleGroup.Item, {
  all: 'unset',
  color: '$text',
  fontSize: '$1',
  background: 'none',
  margin: '0',
  height: 20,
  display: 'flex',
  lineHeight: 1,
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  marginLeft: 1,
  border: '1px solid #ececec',
  '-webkit-tap-highlight-color': 'transparent',
  'tap-highlight-color': 'transparent',
  paddingRight: 6,
  paddingLeft: 6,
  '&:first-child': { marginLeft: 0, borderTopLeftRadius: '$2', borderBottomLeftRadius: '$2' },
  '&:last-child': { borderTopRightRadius: '$2', borderBottomRightRadius: '$2' },
  '&[data-state=on]': {
    backgroundColor: '$selected',
    color: 'White',
    border: '1px solid $selected',
  },
  '&:hover:not([data-state=on])': { backgroundColor: '$hover' },
})

export default GenerateDirectionGroup
