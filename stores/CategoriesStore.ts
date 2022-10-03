import {makeAutoObservable} from 'mobx'
import {CACategoryDataModel, CACategoryModel} from 'front-api'
import {CACategoryDataFieldModel} from 'front-api/src/models/index'
import {RootStore} from './RootStore'
import {getFieldsDictByParam} from '../helpers'

export interface ICategoriesHydration {
  categories: Array<CACategoryModel>
  categoryData: CACategoryDataModel
}

export interface ICategoriesStore {
  root: RootStore
  categories: Array<CACategoryModel>
  categoryData: CACategoryDataModel
  hydrate(data: ICategoriesHydration): void
  byId: Record<string, CACategoryModel>
  ids: number[]
  categoryDataFieldsById: Record<string, CACategoryDataFieldModel> | null
  categoriesById: Record<string, CACategoryModel>
  categoryDataFieldsBySlug: Record<string, CACategoryDataFieldModel> | null
  categoryDataFields: CACategoryDataFieldModel[]
  readonly categoriesWithoutAll: Array<CACategoryModel>
}

export class CategoriesStore implements ICategoriesStore {
  root

  categoryData

  categories = []

  get byId(): Record<string, CACategoryModel> {
    return this.categories.reduce(
      (acc, val) => ({
        ...acc,
        [val.id]: val,
      }),
      {},
    )
  }

  get ids(): number[] {
    return this.categories.map((c) => c.id)
  }

  get categoryDataFieldsBySlug(): Record<
    string,
    CACategoryDataFieldModel
  > | null {
    return Array.isArray(this.categoryData?.fields)
      ? this.categoryData.fields.reduce(
          (acc, val) => ({
            ...acc,
            [val.slug]: val,
          }),
          {},
        )
      : null
  }

  get categoryDataFieldsById(): Record<
    string,
    CACategoryDataFieldModel
  > | null {
    return getFieldsDictByParam(this.categoryData?.fields, 'id')
  }

  get categoryDataFields(): CACategoryDataFieldModel[] | null {
    return Array.isArray(this.categoryData?.fields)
      ? this.categoryData?.fields
      : null
  }

  get categoriesWithoutAll(): Array<CACategoryModel> {
    return this.categories.filter((c) => c.slug !== 'all')
  }

  get categoriesById(): Record<string, CACategoryModel> {
    return this.categories.reduce((acc, val) => {
      acc[val.id] = val
      return acc
    }, {})
  }

  constructor(root: RootStore) {
    makeAutoObservable(this)
    this.root = root
  }

  hydrate(data?: ICategoriesHydration): void {
    this.categories = data?.categories ?? []
    this.categoryData = data?.categoryData ?? null
  }
}
