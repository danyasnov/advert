import {GetServerSideProps} from 'next'

export default function () {
  return <div>FAILURE</div>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}
