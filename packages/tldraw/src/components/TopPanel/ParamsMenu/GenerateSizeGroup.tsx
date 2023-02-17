import * as ToggleGroup from '@radix-ui/react-toggle-group'
import React from 'react'
import { styled } from '~styles'
import { ImageDirection } from './GenerateDirectionGroup'

export enum ImageRatio {
  RATIO_512x512 = '512x512',
  RATIO_512_576 = '512x576',
  RATIO_512_640 = '512x640',
  RATIO_512_704 = '512x704',
  RATIO_512_768 = '512x768',
}

function parseRatio(ratio: string): number[] {
  const [width, height] = ratio.split('x')
  return [Number(width), Number(height)]
}

function swapRatio(ratio: string): ImageRatio {
  const [width, height] = parseRatio(ratio)
  return `${height}x${width}` as ImageRatio
}

interface Props {
  value: string
  direction: ImageDirection
  onRatioChange: (width: number, height: number) => void
}

const GenerateSizeGroup = (props: Props) => {
  const { value, direction, onRatioChange } = props

  const handleChange = (value: string) => {
    const [width, height] = parseRatio(value)
    onRatioChange(width, height)
  }

  return (
    <ToggleGroupRoot
      type="single"
      value={value}
      aria-label="Image Ratio"
      onValueChange={handleChange}
    >
      {Object.values(ImageRatio).map((ratio) => {
        let swapedRatio = ratio
        if (direction === ImageDirection.HORIZONTAL) {
          swapedRatio = swapRatio(ratio)
        }
        return (
          <ToggleGroupItem value={swapedRatio} aria-label={swapedRatio}>
            {swapedRatio}
          </ToggleGroupItem>
        )
      })}
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
  height: 26,
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

export default GenerateSizeGroup
