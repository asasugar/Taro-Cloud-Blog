/*
 * @Description: 辅助函数
 * @Author: Xiongjie.Xue(xiongjie.xue@luckincoffee.com)
 * @Date: 2020-07-08 16:21:57
 * @LastEditors: Xiongjie.Xue(xiongjie.xue@luckincoffee.com)
 * @LastEditTime: 2020-07-16 15:48:39
 */

import Taro from "@tarojs/taro";


export async function isLogin (): Promise<boolean> {
  const userInfo = await Taro.getStorageSync('userInfo');
  if (userInfo && userInfo.avatarUrl) return true
  return false
}
