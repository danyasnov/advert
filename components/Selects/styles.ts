/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getDefaultStyles = (isInvalid) => ({
  control: (provided, state) => ({
    ...provided,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    boxShadow: 'none',
    borderColor: isInvalid ? '#CC3237' : 'transparent',
    '&:hover': {
      borderColor: isInvalid ? '#CC3237' : 'transparent',
    },
    ...(state.isFocused
      ? {
          borderColor: isInvalid ? '#CC3237' : '#7210FF',
          backgroundColor: 'rgba(114, 16, 255, 0.08)',
          '&:hover': {
            borderColor: isInvalid ? '#CC3237' : '#7210FF',
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
      ...(state.isFocused ? {backgroundColor: '#fff', color: '#7210FF'} : {}),
      backgroundColor: state.isFocused ? '#fff' : '#FFFFFF',
      '&:hover ': {
        backgroundColor: '#fff',
        color: '#7210FF',
      },
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
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
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#7210FF',
    borderRadius: '8px',
    margin: '0',
    marginRight: '4px',
    marginBottom: '4px',
    color: '#fff',
    overflow: 'hidden',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#fff',
    fontSize: '16px',
    lineHeight: '22px',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    '&:hover': {
      color: '#fff',
      backgroundColor: 'inherit',
      borderColor: 'inherit',
    },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: '16px',
    borderRadius: 16,
    padding: '5px 10px 5px',
    border: 'none',
    boxShadow: '0px 4px 60px rgba(4, 6, 15, 0.08)',
    overflow: 'hidden',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '16px',
    lineHeight: '22px',
    color: '#9E9E9E',
  }),
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: '20px',
    paddingTop: '16px',
    paddingBottom: '16px',
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
    padding: '0px',
    height: '24px',
    display: 'flex',
    justifyContent: 'flex-start',
  }),
  menu: (provided) => ({
    ...provided,
    width: '120px',
    borderRadius: '16px',
    padding: '5px',
    right: '0',
    border: 'none',
    boxShadow: '0px 20px 100px rgba(4, 6, 15, 0.08)',
    overflow: 'hidden',
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
    marginTop: '0',
    marginBottom: '0',
    paddingTop: '0',
    paddingRight: '0',
    paddingLeft: '20px',
    height: '24px',
  }),
  placeholder: (provided) => ({
    ...provided,
    margin: '0',
    fontSize: '12px',
    lineHeight: '12px',
    color: '#9E9E9E',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#fff',
    fontSize: '12px',
    lineHeight: '14px',
  }),
  menu: (provided, state) => {
    const {menuWidth} = state.selectProps
    const width = menuWidth > 75 ? `${menuWidth + 85}px` : provided.width
    return {
      ...provided,
      width,
      padding: '10px 20px',
      borderRadius: '16px',
      border: 'none',
      boxShadow: '0px 20px 100px rgba(4, 6, 15, 0.08)',
      overflow: 'hidden',
    }
  },
  option: (provided, state) => {
    const isDisabled = !!state.data.disabled
    return {
      ...provided,
      fontSize: '12px',
      lineHeight: '14px',
      height: '100%',
      padding: 0,
      paddingTop: '0',
      paddingBottom: '0',
      color: '#212121',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      ...(state.isFocused ? {backgroundColor: '#fff', color: '#7210FF'} : {}),
      backgroundColor: state.isFocused ? '#fff' : '#FFFFFF',
      '&:hover ': {
        backgroundColor: '#fff',
        color: '#7210FF',
      },
      ...(isDisabled
        ? {'&:hover': {}, color: 'hsl(0, 0%, 80%)', backgroundColor: '#FFFFFF'}
        : {}),
    }
  },
  control: (provided) => ({
    ...provided,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    boxShadow: 'none',
    borderColor: 'transparent',
    '&:hover': {
      borderColor: 'transparent',
    },
  }),
}
