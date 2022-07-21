import {FC, useEffect, useRef, useState} from 'react'
import {Field, Form, FormikProvider, useFormik} from 'formik'
import {ChatStore} from 'chats'
import {useTranslation} from 'next-i18next'
import {OwnerModel} from 'front-api/src/models'
import {object, string} from 'yup'
import {toJS} from 'mobx'
import {groupBy} from 'lodash'
import ChatHeader from './ChatHeader'
import Message from './Message'
import {FormikText} from '../FormikComponents'
import {unixMlToDate, unixToDate} from '../../utils'

interface Props {
  chatStore: ChatStore
  onBack: () => void
  user: OwnerModel
}
const Messenger: FC<Props> = ({chatStore, onBack, user}) => {
  const {t} = useTranslation()
  const messagesRef = useRef<HTMLDivElement>()
  console.log(messagesRef)
  const [messagesByDay, setMessagesByDay] = useState([])

  useEffect(() => {
    const messagesByDate = chatStore.messages
      .slice()
      .reverse()
      .map((m) => {
        return {
          ...m,
          day: unixMlToDate(m.date),
        }
      })
    setMessagesByDay(Object.entries(groupBy(messagesByDate, 'day')))
  }, [chatStore.messages])
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messagesByDay])
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: '',
    },
    validate: (values) => {
      const errors = {}
      const schema = object().shape({
        message: string()
          .required(t('TOO_SHORT_NAME_OR_SURNAME'))
          .max(90, t('TOO_SHORT_NAME_OR_SURNAME')),
      })

      try {
        schema.validateSync(values, {
          abortEarly: false,
        })
      } catch (e) {
        e.inner.forEach(({path, message}) => {
          errors[path] = message
        })
      }
      // console.log('errors', errors)

      return errors
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, actions) => {
      await chatStore.sendMessage(values.message)
      // if (!response) {
      //   const error = await globalChatsStore.startConnection()
      //   await chatStore.sendMessage(values.message)
      // }
      // console.log('response', response)
      actions.resetForm()
    },
  })
  return (
    <div className='flex flex-col w-full pt-5'>
      <ChatHeader chat={chatStore.chat} onBack={onBack} />
      <div className='flex flex-col overflow-y-auto' ref={messagesRef}>
        {messagesByDay.map((messagesGroup) => {
          const [title, messages] = messagesGroup
          const today = unixMlToDate(+new Date())
          return (
            <>
              <div className='flex items-center mb-5'>
                <div className='w-full h-px bg-gray-200' />
                <span className='px-2 text-body-2 text-gray-500'>
                  {title === today ? t('TODAY') : title}
                </span>
                <div className='w-full h-px bg-gray-200' />
              </div>
              {messages.map((message) => (
                <Message message={message} user={user} />
              ))}
            </>
          )
        })}
      </div>
      <FormikProvider value={formik}>
        <Form>
          <div>123</div>
          <Field
            name='message'
            component={FormikText}
            isTextarea
            submitOnEnter
            rows={3}
            placeholder={t('SEND_A_MESSAGE')}
          />
        </Form>
      </FormikProvider>
      {/* <SecondaryButton */}
      {/*  onClick={() => { */}
      {/*    // chatStore.sendLocationMessage({ */}
      {/*    //   latitude: 0, */}
      {/*    //   longitude: 0, */}
      {/*    // }) */}
      {/*  }}> */}
      {/*  send location */}
      {/* </SecondaryButton> */}
    </div>
  )
}
export default Messenger
