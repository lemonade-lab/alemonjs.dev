const defaultCode = `import { format, Text } from 'alemonjs';

const App = () => {
    return format(
        Text("Hello Word!")
    )
}
export default App;`

const tipCode = `import { format, Text } from 'alemonjs';

const App = () => {
    return format(
        Text("Hello Word!")
    )
}
export default App;`

const textCode = `import { format, Text } from 'alemonjs';

const App = () => {
    return format(
        Text('这个'),
        Text('标题', { style: 'bold' }),
        Text('被加粗了')
    )
}
export default App;`

const mentionCode = `import { format, Text, Mention } from 'alemonjs';

const App = () => {
    return format(
        Text('Hello '),
        Mention('柠檬冲水'),
        Text(', How are things going?')
    )
}
export default App;`

const buttonCode = `import { format, BT } from 'alemonjs';

const App = () => {
    const { group, row } = BT
    return format(
        group(
            row(
                BT('开始', '/开始游戏'),
                BT('结束', '/结束游戏')
            )
        )
    )
}
export default App;`

const mdCode = `import { format, MD } from 'alemonjs';

const App = () => {
    const {
        text,
        title,
        bold,
        italicStar,
        strikethrough,
        link,
        image,
        blockquote,
        divider,
        subtitle,
        italic,
        newline
    } = MD

    return format(
        MD(
            // 标题
            title('标题！！'),
            // 副标题
            subtitle('子标题'),
            text('普通文本'),
            // 加粗
            bold('加粗'),
            // 斜体
            italic('斜体'),
            // 星号斜体
            italicStar('星号斜体'),
            // 删除线
            strikethrough('删除线'),
            // 链接
            link('链接', 'https://www.baidu.com'),
            // 图片
            image('https://www.baidu.com/img/bd_logo1.png', {
                width: 200,
                height: 100
            }),
            // 块引用
            blockquote('块引用'),
            // 水平分割线
            divider(),
            // 换行
            newline(),
            // 换多行
            newline(true)
        )
    )
}
export default App;`

export const CodeMap = {
  default: defaultCode,
  tip: tipCode,
  text: textCode,
  mention: mentionCode,
  button: buttonCode,
  md: mdCode
}
