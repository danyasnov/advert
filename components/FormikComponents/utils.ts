export const getSelectOptions = (multiselects = {}) => {
  return [
    // @ts-ignore
    ...multiselects.top,
    // @ts-ignore
    ...(multiselects.other
      ? // @ts-ignore
        multiselects.other
      : []),
  ]
    .filter((o) => !o.isOther)
    .map((o) => ({
      value: o.id,
      label: o.value,
      icon: o.icon,
      disabled: o.itemType === 'title',
      count: o.count,
    }))
}

export const getCreateSelectOptions = (multiselects = {}) => {
  return [
    // @ts-ignore
    ...multiselects.top,
    // @ts-ignore
    ...(multiselects.other
      ? // @ts-ignore
        multiselects.other
      : []),
  ].reduce(
    (acc, val) => {
      const item = {
        value: val.id,
        label: val.value,
        isVisible: val.isVisible,
        disabled: val.itemType === 'title',
        icon: val.icon,
      }
      if (val.isVisible) {
        acc.visible.push(item)
      } else {
        acc.other.push(item)
      }
      return acc
    },
    {visible: [], other: []},
  )
}
