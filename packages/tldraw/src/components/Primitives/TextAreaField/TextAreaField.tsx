import * as React from 'react'
import { styled } from '~styles'

export interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  icon?: React.ReactElement
}

export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ icon, ...rest }, ref) => {
    return (
      <StyledInputWrapper>
        <StyledTextArea {...rest} ref={ref} />
      </StyledInputWrapper>
    )
  }
)

const StyledInputWrapper = styled('div', {
  position: 'relative',
  width: '100%',
  height: 'min-content',
})

const StyledTextArea = styled('textarea', {
  color: '$text',
  border: 'none',
  textAlign: 'left',
  width: '100%',
  height: 96,
  paddingLeft: '$3',
  paddingRight: '$6',
  paddingTop: '$3',
  paddingBottom: '$3',
  backgroundColor: '$background',

  outline: 'none',
  fontFamily: '$ui',
  fontSize: '$1',
  '&:focus': {
    backgroundColor: '$hover',
  },
  borderRadius: '$2',
})
