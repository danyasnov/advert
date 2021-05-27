import {FC} from 'react'
import RS from 'react-select'

interface Props {
  options: Array<SelectItem>
  placeholder: string
  onChange: (value: SelectItem) => void
  value: SelectItem
  isSearchable?: boolean
  isDisabled?: boolean
}

interface SelectItem {
  value: string | number
  label: string
}

const styles = {
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
  option: (provided) => ({
    ...provided,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#3D3F43',
    backgroundColor: '#FFFFFF',
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

const Select: FC<Props> = ({
  options,
  placeholder,
  onChange,
  value,
  isSearchable,
  isDisabled,
}) => {
  return (
    <RS
      value={value}
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      onChange={onChange}
      styles={styles}
    />
  )
}

export default Select
