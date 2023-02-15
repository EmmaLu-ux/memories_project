## 深入浅出`Mongoose`

`Mongoose`是在`Node.js`异步环境下对`MongoDB`进行便捷操作的对象模型工具。它支持`Node.js`和`Deno(alpha)`。

### Installation

在下载`mongoose`之前，我们首先要确保已经安装了`MongoDB`和`Node.js`。

接下来使用`npm`在命令行安装`mongoose`：

> npm install mongoose --save

### 连接数据库

```javascript
import mongoose from 'mongoose'

const CONNECTION_URL = 'mongodb://<username>:<password>@ac-g6dhzl1-shard-00-00.yrjg9md.mongodb.net:27017,ac-g6dhzl1-shard-00-01.yrjg9md.mongodb.net:27017,ac-g6dhzl1-shard-00-02.yrjg9md.mongodb.net:27017/?ssl=true&replicaSet=atlas-vvxzs5-shard-0&authSource=admin&retryWrites=true&w=majority'
const PORT = 5000
mongoose.connect(CONNECTION_URL)
	.then(() => {})
	.catch(() => {})
```

### Schema

`Mongoose`中的所有内容都始于`Schema`。每个`Schema`映射到`MongoDB`集合（`collection`），并定义该集合中文档的形式。 

```javascript
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String, // 标题
    message: String, // 文本内容
    creator: String, // 创建者
    tags: [String], // 标签
    selectedFile: String, // 选中的文件（将图片通过Base64编码为字符串）
    likeCount: { // 喜欢该文章的数量
        type: Number,
        default: 0
    },
    createdAt: {  // 该文章创建的日期
        type: Date,
        default: new Date()
    },
})
```

`postSchema`内的每一个`key`都定义了文档中的每一个属性，每个属性都将被转换为其关联的`SchemaType`。例如，属性`title`将会被转换为`String`类型的`Schema`，属性`tags`将会被转换为数组类型的`Schema`，且数组内的数据都是`String`类型的。

如果一个属性只要求一个类型，则它可以用简写形式来表达。即如`title`、`message`、`creator`等属性都是写法都是简写形式，而`likeCount`、`createdAt`则是非简写形式。

允许的`Schema`类型有以下这些：

- `String`
- `Number`
- `Date`
- `Buffer`
- `Boolean`
- `Mixed`
- `ObjectId`
- `Array`
- `Decimal128`
- `Map`

`Schemas`不仅定义了**文档和属性的结构**，还定义了**文档实例方法**、**静态模型方法**、**复合索引**和文档被称为中间件的**生命周期钩子**。

### Model

#### 创建一个Model

要使用我们前面的模式定义的话，我们需要将`postSchema`转换为我们可以使用的模型。为此，我们将其传递给`mongoose.model(modelName，schema)`：

```javascript
// 将postSchema转成我们可以用的模型，该模型命名为 PostMessage
const PostMessage = mongoose.model('PostMessage', postSchema)
export default PostMessage
```

默认情况下，`Mongoose`会向模式中添加一个`_id`属性。

<img src="https://raw.githubusercontent.com/EmmaLu-ux/mark_typoro/master/uPic/%E6%88%AA%E5%B1%8F2023-02-08%2010.32.34.png" style="zoom:50%;" />

当我们使用自动添加的`_id`属性创建新文档时，`Mongoose`会为我们的文档创建一个`ObjectId`类型的新`_id`。

```javascript
const Model = mongoose.model('Test', schema);

const doc = new Model();
doc._id instanceof mongoose.Types.ObjectId; // true
```

我们也可以用自己的`id`覆盖`Mongoose`的默认`id`。**请注意：`Mongoose`将拒绝保存没有`_id`的文档，因此如果定义了自己的_`id`路径，则需要负责设置`_id`。**

```javascript
const schema = new Schema({ _id: Number });
const Model = mongoose.model('Test', schema);

const doc = new Model();
await doc.save(); // Throws "document must have an _id before saving"

doc._id = 1;
await doc.save(); // works
```

#### 文档实例方法

模型（`model`）的实例是文档（`document`）。文档有许多自己的**内置实例方法**。我们还可以定义自己的**自定义文档实例方法**。

```javascript
// 定义一个Schema
const animalSchema = new Schema({ name: String, type: String },
{
  // 通过采用这种方法，无需创建单独的 TS 类型来定义实例函数的类型。
  methods: {
    findSimilarTypes(cb) {
      return mongoose.model('Animal').find({ type: this.type }, cb);
    }
  }
});

// 或者，为animalSchema的“methods”对象指定一个函数
animalSchema.methods.findSimilarTypes = function(cb) {
  return mongoose.model('Animal').find({ type: this.type }, cb);
};
```

==注意==：

- 覆盖默认的`monoose`文档方法可能会导致不可预测的结果。
- 上面的示例直接使用`Schema.methods`对象来保存实例方法。我们还可以使用`Schema.method()`帮助器。
- **不要**使用`ES6`箭头函数（=>）声明方法。箭头函数显式地阻止绑定`this`，因此我们的方法将无法访问文档，并且上面的示例将不起作用。

### 静态模型方法

我们还可以向模型添加静态函数。添加静态有3种等效的方法：

- 向模式构造函数（`schema-constructor`）的第二个参数添加函数属性（`statics`）
- 向`schema.statics`添加函数属性
- 调用`Schema#static()`函数

```javascript
// 定义一个Schema
const animalSchema = new Schema({ name: String, type: String },
{ 
  statics: {
    findByName(name) {
      return this.find({ name: new RegExp(name, 'i') });
    }
  }
});

// 或者，为animalSchema的“statics”对象指定一个函数
animalSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};
// 或者，也可以调用animalSchema.static()
animalSchema.static('findByBreed', function(breed) { return this.find({ breed }); });

const Animal = mongoose.model('Animal', animalSchema);
let animals = await Animal.findByName('fido');
animals = animals.concat(await Animal.findByBreed('Poodle'));
```

不要使用`ES6`箭头函数 (=>) 声明静态变量。箭头函数明确地阻止绑定`this`，因此上面的示例将因为`this`的值而无法工作。

### 查询帮助器





### 符合索引





### 生命周期钩子









### 方法---Model

`Model.find()`方法

```javascript
// find all documents
await MyModel.find({});

// find all documents named john and at least 18
await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();

// executes, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});

// executes, name LIKE john and only selecting the "name" and "friends" fields
await MyModel.find({ name: /john/i }, 'name friends').exec();

// passing options
await MyModel.find({ name: /john/i }, null, { skip: 10 }).exec();

```











