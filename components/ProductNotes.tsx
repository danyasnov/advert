import {FC, useEffect, useState} from 'react'
import {AdvertiseNote} from 'front-api/src/models/index'
import * as localforage from 'localforage'
import {useTranslation} from 'next-i18next'
import {useLockBodyScroll} from 'react-use'
import IcClear from 'icons/material/Clear.svg'
import ReactModal from 'react-modal'
import {useFormik, Field, FormikProvider} from 'formik'
import {noop} from 'lodash'
import {parseCookies} from 'nookies'
import IcCreate from 'icons/material/Create.svg'
import SecondaryButton from './Buttons/SecondaryButton'
import Button from './Buttons/Button'
import PrimaryButton from './Buttons/PrimaryButton'
import {FormikText} from './FormikComponents'
import {SerializedCookiesState} from '../types'

interface Props {
  hash: string
}
const getNote = async (
  advHash: string,
  userHash: string,
): Promise<AdvertiseNote | null> => {
  const value: string | null = await localforage.getItem(
    `note-${userHash}-${advHash}`,
  )
  return value ? JSON.parse(value) : value
}
const saveNote = async (
  advHash: string,
  userHash: string,
  note: string,
): Promise<AdvertiseNote> => {
  const date = Date.now()
  const payload = {date, note}
  await localforage.setItem(
    `note-${userHash}-${advHash}`,
    JSON.stringify(payload),
  )
  return payload
}
const removeNote = async (advHash: string, userHash: string): Promise<void> => {
  await localforage.removeItem(`note-${userHash}-${advHash}`)
}
const ProductNotes: FC<Props> = ({hash}) => {
  const {t} = useTranslation()
  const [note, setNote] = useState<AdvertiseNote | null>(null)
  const [userHash, setUserHash] = useState('')
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    const init = async () => {
      const state: SerializedCookiesState = parseCookies()
      const value = await getNote(hash, state.hash)
      setUserHash(state.hash)
      setNote(value ?? null)
    }
    init()
  }, [hash])
  return (
    <div className='w-full'>
      {note ? (
        <div className='flex w-full items-center '>
          <span className='text-black-b w-full text-body-1 rounded-lg bg-brand-a2 py-2.5 px-4 whitespace-nowrap s:max-w-sm m:max-w-xs l:max-w-md truncate block'>
            {note?.note}
          </span>
          <Button className='ml-2' onClick={() => setShowModal(true)}>
            <IcCreate className='fill-current text-black-c h-6 w-6 ' />
          </Button>
        </div>
      ) : (
        <div>
          <SecondaryButton onClick={() => setShowModal(true)}>
            {t('ADD_NOTE')}
          </SecondaryButton>
        </div>
      )}
      {showModal && (
        <NoteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={async (value) => {
            if (!value) {
              setNote(null)
              removeNote(hash, userHash)
            } else {
              const result = await saveNote(hash, userHash, value)
              setNote(result)
            }
            setShowModal(false)
          }}
          note={note?.note}
        />
      )}
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (value?: string) => void
  note: string
}

const NoteModal: FC<ModalProps> = ({isOpen, onClose, onSave, note}) => {
  const {t} = useTranslation()
  useLockBodyScroll()
  const formik = useFormik({
    initialValues: {
      note: note ?? '',
    },
    onSubmit: (values) => {
      onSave(values.note)
    },
  })
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute rounded-6 overflow-hidden w-320px bg-white-a inset-x-0 mx-auto top-24 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <div className='flex flex-col w-full'>
        <div className='px-3 mt-6 pb-4 flex justify-between border-b border-shadow-b'>
          <span className='text-h-2 text-black-b font-bold'>
            {t('ADD_NOTE')}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <div className='px-3 py-4'>
          <form onSubmit={formik.handleSubmit}>
            <FormikProvider value={formik}>
              <Field
                name='note'
                component={FormikText}
                isTextarea
                rows={5}
                placeholder={t('YOUR_NOTE_WITHOUT_DATE')}
              />
            </FormikProvider>
            <div className='mt-2 flex space-x-2'>
              {note && (
                <SecondaryButton
                  className='w-full'
                  onClick={() => {
                    onSave()
                  }}>
                  {t('DELETE')}
                </SecondaryButton>
              )}
              <PrimaryButton className='w-full' type='submit' onClick={noop}>
                {t('SAVE')}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  )
}

export default ProductNotes
