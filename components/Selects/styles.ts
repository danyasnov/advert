/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getDefaultStyles = (isInvalid) => ({
  control: (provided, state) => ({
    ...provided,
    borderRadius: 12,
    border: 0,
    backgroundColor: '#FAFAFA',
    boxShadow: 'none',
    borderColor: isInvalid ? '#CC3237' : '#CCDBEB',
    '&:hover': {
      borderColor: isInvalid ? '#CC3237' : '#CCDBEB',
    },
    ...(state.isFocused
      ? {
          borderColor: isInvalid ? '#CC3237' : '#CCDBEB',
          '&:hover': {
            borderColor: isInvalid ? '#CC3237' : '#CCDBEB',
          },
        }
      : {}),
  }),
  input: (provided) => ({
    ...provided,
    lineHeight: '22px',
    margin: 0,
    padding: 0,
  }),
  option: (provided, state) => {
    const isDisabled = !!state.data.disabled
    return {
      ...provided,
      fontSize: '14px',
      lineHeight: '20px',
      paddingTop: '16px',
      paddingBottom: '16px',
      color: '#212121',
      ...(state.isFocused
        ? {backgroundColor: '#fff', fontWeight: 'bold', color: '#7210FF'}
        : {}),
      backgroundColor: state.isFocused ? '#fff' : '#FFFFFF',
      '&:hover ': {
        backgroundColor: '#fff',
        fontWeight: 'bold',
        color: '#7210FF',
      },
      display: 'flex',
      alignItems: 'center',
      ...(isDisabled
        ? {'&:hover': {}, color: 'hsl(0, 0%, 80%)', backgroundColor: '#FFFFFF'}
        : {}),
    }
  },
  singleValue: (provided) => ({
    ...provided,
    fontSize: '16px',
    lineHeight: '22px',
    color: '#3D3F43',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 16,
    overflow: 'hidden',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#7C7E83',
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: '20px',
    paddingTop: '16px',
    paddingBottom: '16px',
    height: '56px',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    width: 0,
  }),
})

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
    justifyContent: 'flex-start',
  }),
}

export const FilterStyles = {
  singleValue: (provided) => ({
    ...provided,
    fontSize: '12px',
    lineHeight: '14px',
    color: '#3D3F43',
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: '20px',
    paddingTop: '13px',
    paddingBottom: '13px',
    height: '40px',
  }),
}
