import {FC, useEffect, useRef} from 'react'
import {Field, Form, FormikProvider, useFormik} from 'formik'
import {ChatStore, globalChatsStore} from 'chats'
import {useTranslation} from 'next-i18next'
import {OwnerModel} from 'front-api/src/models'
import {object, string} from 'yup'
import {toJS} from 'mobx'
import ChatHeader from './ChatHeader'
import Message from './Message'
import {FormikText} from '../FormikComponents'
import SecondaryButton from '../Buttons/SecondaryButton'

interface Props {
  chatStore: ChatStore
  onBack: () => void
  user: OwnerModel
}
const Messenger: FC<Props> = ({chatStore, onBack, user}) => {
  const {t} = useTranslation()
  const messagesRef = useRef()

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
    console.log('chatStore.messages', toJS(chatStore.messages))
  }, [chatStore.messages])
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
      <div className='flex flex-col overflow-y-auto h-full' ref={messagesRef}>
        {chatStore.messages
          .slice()
          .reverse()
          .map((message) => (
            <Message message={message} user={user} />
          ))}
      </div>
      <FormikProvider value={formik}>
        <Form>
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
