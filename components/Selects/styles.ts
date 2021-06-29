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
  option: (provided, state) => ({
    ...provided,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#3D3F43',
    backgroundColor: state.isFocused ? '#FFEEDD' : '#FFFFFF',
    '&:hover': {
      backgroundColor: '#FFEEDD',
    },
    display: 'flex',
  }),
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
  }),
  indicatorsContainer: () => ({
    display: 'none',
  }),
  singleValue: (provided) => ({
    ...provided,
    display: 'flex',
  }),
}
