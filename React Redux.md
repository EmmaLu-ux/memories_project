## Connect: 使用`mapStateToProps`导出数据

作为`connect`函数的第一个参数，`mapStateToProps`被用于从`store`中选择UI组件所需要的数据部分。它通常简称为`mapState`。

- 每次`store`内的状态更改时都会调用它。
- 它接收整个`store`内的状态数据，并应返回该组件所需的数据对象。

### `mapStateToProps`的定义

`mapStateToProps`被定义为一个函数：

```javascript
function mapStateToProps(state[, ownProps])
```

该函数返回一个有着UI组件所需数据的一般对象。

如果你不想订阅`store`，请传递`null`或`undefined`来替代`mapStateToProps`。

> `mapStateToProps`函数是使用`function`关键字 (```function mapState(state) { } ```) 还是作为箭头函数 (```const mapState = (state) => { }``` ) 编写的并不重要。无论哪种方式，它的工作方式都是一样的。

#### state参数

`state`参数与`store.getState()`所返回的内容是一样的，都是`store内的整个状态数据`。正因如此，`mapStateToProps`的第一个参数在传统上称为`state`。当然你可以为参数指定任何你想要的名称，但不能称它为`store`，因为它表示的是“状态值(state value)”，而不是“`store`实例(store instance)”。

因此，`mapStateToProps`函数至少有一个传入参数：

```javascript
function mapStateToProps(state){
  const { todos } = state
  return { todoIds: todos.ids}
}
export default connect(mapStateToProps)(TodoListUI)
```

#### ownProps参数

如果你的组件需要的数据是通过使用来自其自身的`props`数据来从`store`中检索数据，则可以使用第二个参数`ownProps`。此参数将包含`connect`生成的包装器组件的所有的`props`。

你不需要再从 `mapStateToProps` 返回的对象中包含来自 `ownProps` 的值。 `connect` 会自动将这些不同的 `prop` 源合并到一组最终的 `props` 中。

#### 返回值

`mapStateToProps`函数应该返回一个包含UI组件所需数据的一般对象：

- 该一般对象中的每个字段都将成为`UI`组件的`props`
- 字段中的值将用于确定`UI`组件是否需要重新渲染

```javascript
function mapStateToProps(state) {
  return {
    a: 42,
    todos: state.todos,
    filter: state.visibilityFilter,
  }
}
```

`UI`组件将会接收到的数据：`props.a`、`props.todos`、`props.filter`

>在需要对渲染性能进行更多控制的高级场景中，**`mapStateToProps`能够返回一个函数。**在这种情况下，该函数将用作`UI`组件实例的最终`mapStateToProps`。这关乎到`Redux`更高级的使用。

### 使用建议

**1、让`mapStateToProps`重塑`Store`中的数据**

`mapStateToprops`函数可以并且应该做的不仅仅是`return state.someSlice`。他们有责任根据`UI`组件的需要来“重塑”`store`数据。这可能包括返回一个值作为特定的`prop`名称，将来自状态树的不同部分的数据组合在一起，并以不同的方式转换`store`数据。

**2、使用选择器函数提取和转换数据**

官方强烈鼓励使用“选择器(`selector`)”函数来帮助封装从状态树中的特定位置提取值的过程。记忆选择器(`memoized selector`)函数在提高应用程序性能方面也发挥着关键作用（请参阅本页的以下部分和高级用法：计算派生数据页面，了解有关为什么以及如何使用选择器的更多详细信息。）

**3、`mapStateToProps` 函数应该很快**



## Connect：使用`mapDispatchToProps`调度`Actions`

作为`connect`的第二个参数，`mapDispatchToProps`用于将`action`分派给`store`。

`dispatch`是`store`的一个函数。调用`store.dispatch`来`dispatch`一个`action`。这是触发状态更改的唯一方法。

使用`React Redux`，你的组件永远不会直接访问`store`，`connect`会为你完成。`React Redux`为你提供了两种让组件分派(`dispatch`)`action`的方法：

- 默认情况下，UI组件接收`props.dispatch`并且可以自己分派动作。
- `connect`可以接受一个名为`mapDispatchToProps`的参数，它允许你创建在调用时分派的函数，并将这些函数作为`props`传递给你的`UI`组件。

### `mapDispatchToProps`使用方法

#### 1、connect函数默认不传

如果你不指定`connect()`的第二个参数，你的`UI`组件将默认接收`dispatch`。例如：

```javascript
connect()(MyComponent)
connect(null, null)(MyComponent)
// 或者
connect(mapStateToProps /** 没有第二个参数 */)(MyComponent)
```

一旦你以这种方式连接了`UI`组件，你的`UI`组件就会收到`props.dispatch`。你可以使用它向`store`发送`actions`。

```javascript
function Counter({ count, dispatch }) {
  return (
    <div>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>reset</button>
    </div>
  )
}
```

#### 2、提供一个`mapDispatchToProps`参数

提供一个`mapDispatchToProps`参数将允许你指定`UI`组件可能需要`dispatch`的`actions`。它允许你提供动作调度函数作为`props`。因此，您可以直接调用`props.increment()`而不是调用 `props.dispatch(() => increment())`。您可能想要这样做的原因有以下几个：

- **更具声明性**

首先，将分派逻辑封装到函数中使实现更具声明性。分派一个操作并让`Redux store`处理数据流是如何实现行为，而不是它做什么。也就是说，让容器组件来做跟`Redux`的交互，然后将数据通过`props`的方式传递给`UI`组件。这样更加的分工明确，清晰明了。

- **将动作调度逻辑传递给（未连接的）子组件**

此外，你还可以将动作调度函数传递给子（可能未连接）组件。这允许更多组件分派操作，同时它们并“不知道”Redux。

这就是`React Redux`的`connect`所做的 ------ 它封装了与`Redux store`对话的逻辑，让你不用担心。这就是你应该在实现中充分利用的内容。

### 两种形式的`mapDispatchToProps`

`mapDispatchToProps`参数可以有两种形式。**函数形式**允许更多自定义，而**对象形式**易于使用。

- 函数形式：允许更多的自定义，获得对`dispatch`和可选的`ownProps`的访问权限
- 对象速记形式：更具声明性且更易于使用

> 注意：官方建议使用`mapDispatchToProps`的对象形式，除非你特别需要以某种方式自定义调度行为。

#### 将`mapDispatchToprops`定义为函数

将`mapDispatchToProps`定义为一个函数可以让你最灵活地自定义组件接收的函数以及它们如何分派操作。你可以访问`dispatch`和`ownProps`。你可以利用这个机会编写自定义函数以供连接的组件调用。

##### `dispatch`参数

将以`dispatch`作为第一个参数调用`mapDispatchToProps`函数。通常情况下，你可以返回一个一般对象，在该对象内部，你可以定义许多函数，而在这些函数内部，你可以自行选择调用`dispatch()`及其`action creators`，或者直接传递一个普通的操作对象，或者传递一个操作创建者的结果。

```javascript
const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' }),
  }
}
```

##### `ownProps`参数（可选）

如果`mapDispatchToProps`函数声明为使用两个参数，则将以`dispatch`作为第一个参数调用该函数，并将传递给连接的组件的`props`作为第二个参数，并且将在连接组件接收到新`props`时重新调用该函数。

这意味着，你可以在组件的`props`更改时这样做，而不是在组件重新渲染时将新`props`重新绑定到动作调度程序。

##### 返回值

`mapDispatchToProps`函数应该返回一个一般对象：

- 对象中的每个字段都将成为连接的组件的一个单独的`props`，并且该值通常应该是一个在调用时分派操作的函数。
- 如果你在`dispatch`中使用`action creator`（与普通对象操作相反），通常将该字段的名称简单地命名为与`action creator`相同的名称。如下示例所示：

```javascript
const increment = () => ({ type: 'INCREMENT' })
const decrement = () => ({ type: 'DECREMENT' })
const reset = () => ({ type: 'RESET' })

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching actions returned by action creators
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    reset: () => dispatch(reset()),
  }
}
```

`mapDispatchToProps`函数的返回值将作为`props`合并到你连接的组件中。你可以直接调用它们来派发它的动作。

```javascript
function Counter({ count, increment, decrement, reset }) {
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}
```

##### 使用`bindActionCreators`定义`mapDispatchToProps`函数



















