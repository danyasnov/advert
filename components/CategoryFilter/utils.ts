import {isEmpty} from 'lodash'

export const getChipTitle = (value, name) => {
  if (isEmpty(value)) {
    return name
  }
  let title = value[0].label
  const {length} = value
  if (length > 1) {
    title = `${title}, +${length - 1}`
  }
  return title
}

export const getPriceChipTitle = (value, t) => {
  if (!value[0] && !value[1]) {
    return t('PRICE')
  }

  const title = `${value[0] ? value[0] : 0} - ${value[1] ? value[1] : t('MAX')}`

  return title
}
