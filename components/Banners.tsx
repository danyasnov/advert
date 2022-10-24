import {FC, useEffect, useState} from 'react'
import {makeRequest} from '../api'

const Banners: FC = () => {
  const [banners, setBanners] = useState([
    {
      id: '29364830-08c2-11ed-861d-0242ac120002',
      image:
        'https://cache.venera.city/adverts/01/ha/01havr6t6edgpdtexfn0gy5f.jpg',
      key: 'three',
      title: 'three',
      description: 'fly',
      specific: 'test',
      theme: 'dark',
      action: 'vdvd',
    },
    {
      id: '4bb04fc0-4c62-440c-9a39-7e04ae29218b',
      image:
        'https://leonardo.osnova.io/f98f106c-86d7-54fc-b07d-5c98d57824cb/-/preview/300/-/format/webp/',
      key: 'test',
      title: 'Banner 1',
      description: 'Some description',
      specific: 'specifi',
      theme: 'light',
      action: "{type: 'ADVERT', hash: '123'}",
    },
    {
      id: '53ee45c6-0423-11ed-b939-0242ac120002',
      image:
        'https://cache.venera.city/adverts/01/sg/01sgts5weppqg7a6c2k3b3u1.jpg',
      key: 'Test1',
      title: 'Banner2',
      description: 'Desc',
      specific: 'specif',
      theme: 'dark',
      action: 'action',
    },
    {
      id: '65533e64-08c1-11ed-861d-0242ac120002',
      image:
        'https://cache.venera.city/adverts/01/mc/01mc25u9evxgaub49ixeftng.jpg',
      key: 'Test3',
      title: 'New',
      description: 'Options',
      specific: '30',
      theme: 'light',
      action: 'test',
    },
    {
      id: '7003f516-08c0-11ed-861d-0242ac120002',
      image:
        'https://cache.venera.city/adverts/01/o9/01o92m2c9h49rq8m0agr6dju.jpg',
      key: 'test2',
      title: 'Bannerr3',
      description: 'VooXee',
      specific: '##',
      theme: 'dark',
      action: 'action',
    },
    {
      id: 'c1a15386-08c1-11ed-861d-0242ac120002',
      image:
        'https://cache.venera.city/adverts/01/vg/01vgpvln9vloo3au3m8iwzz5.jpg',
      key: 'Test4 ',
      title: 'Old',
      description: 'safe',
      specific: '!!',
      theme: 'dark',
      action: 'ddd',
    },
  ])
  useEffect(() => {
    const init = async () => {
      const bannersData = await makeRequest({
        url: '/api/banners',
        method: 'get',
      })
      setBanners(bannersData.data)
    }
    // init()
  }, [])
  console.log('banners', banners)
  return null
}

export default Banners
