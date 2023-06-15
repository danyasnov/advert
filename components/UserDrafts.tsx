import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import {TFunction, useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {isNumber, toNumber} from 'lodash'
import {
  ArrowLeftSquare,
  ArrowRight,
  Delete,
  Edit,
  TickSquare,
  TimeCircle,
} from 'react-iconly'
import {useWindowSize} from 'react-use'
import {useRouter} from 'next/router'
import {toast} from 'react-toastify'
import {DraftModel} from 'front-api'

import {
  useGeneralStore,
  useModalsStore,
  useUserStore,
} from '../providers/RootStoreProvider'
import UserTabWrapper from './UserTabWrapper'
import Button from './Buttons/Button'
import Tabs from './Tabs'
import {getQueryValue, robustShallowUpdateQuery} from '../helpers'
import {makeRequest} from '../api'

const UserDrafts: FC = observer(() => {
  const router = useRouter()
  const {drafts, fetchProducts} = useUserStore()
  const getDraftOptions = ({hash}) => {
    const edit = {
      title: 'EDIT_AD',
      icon: <Edit size={16} filled />,
      onClick: () => {
        router.push(`/advert/create/${hash}`)
      },
    }
    const remove = {
      title: 'REMOVE',
      icon: <Delete size={16} filled />,
      onClick: () => {
        makeRequest({
          url: '/api/delete-draft',
          method: 'post',
          data: {
            hash,
          },
        }).then(() => {
          router.reload()
        })
      },
    }

    return [edit, remove]
  }

  const mappedDrafts = ((drafts.items as unknown as DraftModel[]) || []).map(
    (d) => {
      const title =
        d.advertDraft.content[0]?.title || d.advertDraft.categoryName
      return {
        ...d,
        ...d.advertDraft,
        title,
        url: `/advert/create/${d.hash}`,
        images: d.advertDraft.photos
          ? d.advertDraft.photos.map((p) => p.url)
          : [],
      }
    },
  )
  return (
    <div>
      {/* <SectionTitle title={t('DRAFTS')} />
      {tablet && (
        <div className='z-10 relative mt-8 mb-10'>
          <Tabs
            items={isCurrentUser ? draftTab : null}
            onChange={(id) => {
              robustShallowUpdateQuery(router, {
                page: 'drafts',
                activeTab: id,
              })
            }}
            value={1}
          />
        </div>
      )} */}
      <UserTabWrapper
        getOptions={getDraftOptions}
        // @ts-ignore
        products={mappedDrafts}
        page={drafts.page}
        count={drafts.count}
        state={drafts.state}
        enableTwoColumnsForS
        disableVipWidth
        limit={drafts.limit}
        fetchProducts={() => {
          fetchProducts({
            page: drafts.page + 1,
            path: 'drafts',
            limit: 20,
          })
        }}
        tab='drafts'
      />
    </div>
  )
})

export default UserDrafts
