import React, { useRef } from 'react'
import Child from './child'
import styles from './index.less'

interface HomeProps {}
const Home: React.FC<HomeProps> = (props) => {
  const childRef: any = useRef()
  return (
    <div className={styles['wrt-index']}>
      weclome Home
      <Child ref={childRef} />
      <span
        onClick={() => {
          childRef.current._onclick(1)
        }}
      >
        click
      </span>
    </div>
  )
}

export default Home
