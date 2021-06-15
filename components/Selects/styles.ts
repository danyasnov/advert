/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default {
  control: (provided, state) => ({
    ...provided,
    borderRadius: 8,
    boxShadow: 'none',
    height: '40px',
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
