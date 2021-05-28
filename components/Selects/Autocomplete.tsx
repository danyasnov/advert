import {FC, useRef, useState} from 'react'
import AsyncSelect from 'react-select/async'
import {components} from 'react-select'
import styles from './styles'

interface Props {
  placeholder: string
  onChange: (item: SelectItem) => void
  isSearchable?: boolean
  isDisabled?: boolean
  isClearable?: boolean
  loadOptions: (inputValue: string) => Promise<SelectItem>
}
interface SelectItem {
  value: string | number
  label: string
}
// eslint-disable-next-line react/jsx-props-no-spreading
const Input = (props) => <components.Input {...props} isHidden={false} />

const Autocomplete: FC<Props> = ({
  placeholder,
  onChange,
  isDisabled,
  isClearable,
  loadOptions,
}) => {
  const [value, setValue] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const selectRef = useRef()

  const onInputChange = (input, {action}) => {
    if (action === 'input-blur') {
      setInputValue(value ? value.label : '')
    } else if (action === 'input-change') {
      setInputValue(input)
    }
  }

  const innerOnChange = (option) => {
    setInputValue(option ? option.label : '')
    setValue(option)
    onChange(option)
  }
  const onFocus = () => {
    if (value) {
      // @ts-ignore
      selectRef.current.select.inputRef?.select()
    }
  }

  return (
    <AsyncSelect
      ref={selectRef}
      inputValue={inputValue}
      placeholder={placeholder}
      onChange={innerOnChange}
      onInputChange={onInputChange}
      cacheOptions
      allowCreateWhileLoading={false}
      styles={styles}
      defaultOptions
      isClearable={isClearable}
      isDisabled={isDisabled}
      loadOptions={loadOptions}
      onFocus={onFocus}
      controlShouldRenderValue={false}
      components={{
        Input,
      }}
    />
  )
}

export default Autocomplete
