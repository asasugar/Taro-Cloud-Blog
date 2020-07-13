/*
 * @Description: 云开发数据库操作封装
 * @Author: Xiongjie.Xue(xiongjie.xue@luckincoffee.com)
 * @Date: 2020-07-08 17:45:28
 * @LastEditors: Xiongjie.Xue(xiongjie.xue@luckincoffee.com)
 * @LastEditTime: 2020-07-13 14:36:31
 */

import Taro from "@tarojs/taro";

// 连接数据库
const db = Taro.cloud.database();

interface Collection {
  readonly collection: string;
}
interface AddConfig extends Collection {
  data: object // 增：插入内容；
}
interface DelConfig extends Collection {
  _id: string // 删：根据_id删除记录
}
interface UpdateConfig extends Collection {
  data: object // 改：局部更新内容
  _id: string // 改：根据_id
}
interface GetConfig extends Collection {
  skip: number; // 查：起始位置
  limit: number; // 查：限制条数
}


// 增
export async function dbAdd (config: AddConfig) {
  const configCollection = db.collection(config.collection);
  try {
    const res = await configCollection
      .add({ data: config.data })
    console.log(`${config.collection}数据add : `, res)

  } catch (error) {
    Taro.showToast({
      title: '新增数据出错',
      icon: 'none',
      duration: 2000
    })
    console.error(error)
  }
}
// 删（单条记录）
export async function dbDelete (config: DelConfig) {
  const configCollection = db.collection(config.collection);
  try {
    // 删除一条数据
    const res = await configCollection
      .doc(config._id).remove({});

    console.log(`${config.collection}数据delete : `, res)

  } catch (error) {
    Taro.showToast({
      title: '数据删除出错',
      icon: 'none',
      duration: 2000
    })
    console.error(error)
  }
}
// 改（单条记录）
export async function dbUpdate (config: UpdateConfig) {
  const configCollection = db.collection(config.collection);
  try {
    const res = await configCollection
      .doc(config._id).update({ data: config.data });

    console.log(`${config.collection}数据update : `, res)

  } catch (error) {
    Taro.showToast({
      title: '数据更新出错',
      icon: 'none',
      duration: 2000
    })
    console.error(error)
  }
}
// 查
export async function dbGet (config: GetConfig) {
  const configCollection = db.collection(config.collection);
  try {
    const { data } = await configCollection
      .skip(config.skip)
      .limit(config.limit)
      .get();
    console.log(`${config.collection}数据get : `, data)


    return data
  } catch (error) {
    Taro.showToast({
      title: '数据查询出错',
      icon: 'none',
      duration: 2000
    })
    console.error(error)
  }
} 