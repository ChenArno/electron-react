import React, { forwardRef, useImperativeHandle } from 'react'

interface ChildProps {}
const Child: React.FC<ChildProps> = (props, refs) => {
  useImperativeHandle(refs, () => {
    return {
      _onclick(val: number) {
        console.log(val)
      },
    }
  })
  return <div>child</div>
}

export default forwardRef(Child)
