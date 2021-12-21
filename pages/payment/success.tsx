import {GetServerSideProps} from 'next'

export default function () {
  return <div>SUCCESS</div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}
