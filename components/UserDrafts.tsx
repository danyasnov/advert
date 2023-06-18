import React, {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {Delete, Edit} from 'react-iconly'
import {useRouter} from 'next/router'
import {DraftModel} from 'front-api'
import {useUserStore} from '../providers/RootStoreProvider'
import UserTabWrapper from './UserTabWrapper'
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
