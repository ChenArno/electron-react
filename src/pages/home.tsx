import React, { useRef } from 'react'
import Child from './child'
import { Button } from 'antd';
import styles from './index.less'

interface HomeProps { }
const Home: React.FC<HomeProps> = (props) => {
  const childRef: any = useRef()
  return (
    <div className={styles['wrt-index']}>
      weclome Home
      <Button type="primary">Primary Button</Button>
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
