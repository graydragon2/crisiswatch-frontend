// pages/index.jsx

export function getServerSideProps() {
  return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  }
}

export default function Home() {
  return null
}
