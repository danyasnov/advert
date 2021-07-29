/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const defaultStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: 8,
    boxShadow: 'none',
    borderColor: 'rgba(12, 13, 13, 0,1)',
    ...(state.isFocused
      ? {
          borderColor: '#1E4592',
          '&:hover': {
            borderColor: '#1E4592',
          },
        }
      : {}),
  }),
  option: (provided, state) => {
    const isDisabled = !!state.data.disabled
    return {
      ...provided,
      fontSize: '14px',
      lineHeight: '16px',
      color: '#3D3F43',
      backgroundColor: state.isFocused ? '#FFEEDD' : '#FFFFFF',
      '&:hover': {
        backgroundColor: '#FFEEDD',
      },
      display: 'flex',
      ...(isDisabled
        ? {'&:hover': {}, color: 'hsl(0, 0%, 80%)', backgroundColor: '#FFFFFF'}
        : {}),
    }
  },
  singleValue: (provided) => ({
    ...provided,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#3D3F43',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#7C7E83',
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: '12px',
  }),
}

export const LinkStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    minHeight: '0px',
  }),
  indicatorsContainer: () => ({
    display: 'none',
  }),
  singleValue: (provided) => ({
    ...provided,
    display: 'flex',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
    height: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  }),
}
