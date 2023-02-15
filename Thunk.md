## `Thunk`

### 什么是`thunk`？

“`thunk`”这个词是一个编程术语，意思是“**一段执行某些延迟工作的代码**”。我们可以编写一个函数体或代码以供以后执行工作，而不是现在立马就执行一些逻辑。

特别是对于`Redux`，<u>“`thunks`”是一种编写函数的模式，其中包含可以与`Redux store`的`dispatch`和`getState`方法交互的逻辑。</u>

使用`thunk`需要将`redux-thunk`中间件作为其配置的一部分添加到`redux store`中。

`Thunks`是在`Redux`应用程序中**编写异步逻辑**的标准方法，**通常用于数据获取**。但是，它们可以用于各种任务，并且可以包含同步和异步逻辑。

### 编写Thunk

`thunk`函数是一个接受两个参数的函数：`Redux store`的`dispatch`方法和`Redux store`的`getState`方法。`Thunk`函数不会被应用程序代码直接调用。相反，它们被传递到store.dispatch()：

```javascript
const thunkFunc = (dispatch, getState) => {
  // dispatch actions 或读取state的逻辑
}
store.dispatch(thunkFunc)
```

`thunk`函数可以包含任意逻辑、同步或异步，并且可以随时调用`dispatch`或`getState`。

正如`Redux`代码通常使用动作创建器生成用于调度的动作对象，而不是手动编写动作对象一样，我们通常使用`thunk`动作创建器来生成被调度的`thunk`函数。`thunk`操作创建者是一个可能有一些参数的函数，并返回一个新的`thunk`函数。`thunk`通常关闭传递给动作创建者的任何参数，因此它们可以用于逻辑：

```javascript
// action.js
// 异步获取server端的数据，需要发送请求来获取
export function createPost(){
  return async function createPostThunk(dispatch, getState){
    const { data } = await api.createPost() 
    dispatch({ type: 'CREATE', playload: data})
  }
}

// api.js
export const createPost = () => axios.get(url)
```

`Thunk`函数和动作创建者可以使用函数关键字或箭头函数来编写，这里没有什么有意义的区别。同样的`fetchPostData`，`thunk`也可以使用箭头函数编写，如下所示：

```javascript
// action.js
export const createPost = (post) => async (dispatch, getState){
  const { data } = await api.createPost(post) 
  dispatch({ type: 'CREATE', playload: data})
}
```

在这两种情况下，`thunk`都是通过调用动作创建者来调度的，与我们调度任何其他`Redux`动作的方式相同：

```react
// App.js----App组件
//此处使用的是MUI组件库，为了简单表现，样式被我去除了
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { TextField, Button, Typography, Paper } from '@material-ui/core'
import FileBase from 'react-file-base64'

import { createPost } from './action.js'

const App = () => {
  const [postData, setPostData] = useState({
    creator: '', message: '', selectedFile: '', tags: '', title: ''
  })
  const dispatch = useDispatch()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createPost(postData))
  }
  return (
  	<Paper className={classes.paper}>
      <form autoComplete='off' noValidate onSubmit={handleSubmit}>
        <TextField name='creator' variant='outlined' label='Creator' fullWidth value={postData.creator} onChange={e => setPostData({ ...postData, creator: e.target.value })} />
        <TextField name='title' variant='outlined' label='Title' fullWidth value={postData.title} onChange={e => setPostData({ ...postData, title: e.target.value })} />
        <TextField name='message' variant='outlined' label='Message' fullWidth value={postData.message} onChange={e => setPostData({ ...postData, message: e.target.value })} />
        <TextField name='tags' variant='outlined' label='Tags' fullWidth value={postData.tags} onChange={e => setPostData({ ...postData, tags: e.target.value })} />
        <div>
          <FileBase type='file' multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} />
        </div>
        <Button variant='contained' color='primary' size='large' type='submit' fullWidth>提交</Button>
        <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>清除</Button>
      </form>
    </Paper>
  )
}

export default App
```

### 使用Thunk的理由

`Thunks`允许我们编写独立于`UI`层的额外`Redux`相关逻辑。该逻辑可能包括副作用，例如**异步请求**或**生成随机值**，以及需要**调度多个操作**或**访问`Redux store`状态**的逻辑。

`Redux reducers`必须不包含副作用，但实际应用需要具有副作用的逻辑。其中一些可能位于组件内部，但有些可能需要位于`UI`层之外。`Thunks`（和其他`Redux`中间件）为我们提供了一个地方来解决这些副作用。

通常在组件中直接使用逻辑，例如在单击处理程序或`useEffect`钩子中发出异步请求，然后处理结果。然而，通常需要将尽可能多的逻辑移动到`UI`层之外。这样做可以提高逻辑的可测试性，保持`UI`层尽可能薄和“表象的”，或者提高代码重用和共享。

在某种意义上，`thunk`是一个漏洞，**您可以提前编写任何需要与`Redux store`交互的代码，而无需知道将使用哪个`Redux store`。**这可以防止逻辑绑定到任何特定的`Redux store`实例，并保持其可重用性。

### Thunk的应用场景

由于`thunk`是一种通用工具，可以包含任意逻辑，因此它们可以用于多种用途。最常见的用例是：

- 将复杂逻辑移出组件
- 发出异步请求或其他异步逻辑
- 编写需要在一行或一段时间内调度多个操作的逻辑
- 编写需要访问`getState`才能做出决策或在操作中包含其他状态值的逻辑

`Thunks`是“一次性”函数，没有生命周期感。他们也看不到其他调度动作。因此，它们通常不应用于初始化持久连接（如`websocket`），并且不能用于响应其他操作。

**`Thunks`最适合用于复杂的同步逻辑，以及简单到适度的异步逻辑，例如发出标准AJAX请求并根据请求结果调度操作。**

## Redux Thunk中间件



### 添加中间件





### 中间件是如何工作的？





