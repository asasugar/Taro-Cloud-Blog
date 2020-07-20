import Taro, { FC, useState, useEffect, useScope } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import TaroParser from 'taro-parse';
import { AtButton, AtFab } from 'taro-ui';
import { isLogin } from '@/utils';
import filters from '@/utils/filters';

import './index.scss';

import { dbAdd, dbGet, dbDelete } from '@/utils/CRUD';

interface ArticleDetail {
	_id: string;
	title: string;
	desc: string;
	content: string;
	sortType: number;
	sortTypeName?: string;
	fileID: string;
	creatTime: Date;
	updateTime: Date;
}

const BlogDetail: FC = () => {
	const scope = useScope();
	const [ detail, setDetail ] = useState<ArticleDetail>();

	const [ isAlreadyCollect, setIsAlreadyCollect ] = useState<boolean>(false);

	useEffect(
		() => {
			(async function() {
				if (scope) {
					console.log(scope.options._id);
					const data = await dbGet({
						collection: 'article',
						skip: 0,
						where: {
							_id: scope.options._id
						}
					});
					setDetail(data[0]);
				}
			})();
		},
		[ scope ]
	);

	useEffect(
		() => {
			getIsAlreadyCollect();
		},
		[ detail ]
	);

	const getIsAlreadyCollect = async () => {
		try {
			const userInfo = await Taro.getStorageSync('userInfo');
			if (detail && userInfo) {
				const list =
					(await dbGet({
						collection: 'collect_records',
						skip: 0,
						where: { _openid: userInfo.openId, articleId: detail._id }
					})) || [];
				setIsAlreadyCollect(Boolean(list.length));
			}
		} catch (error) {}
	};
	const collect = async () => {
		let bool = await isLogin();
		if (bool && detail && detail._id) {
			// 收藏博客前判断是否已经收藏过了
			if (!isAlreadyCollect) {
				dbAdd({
					collection: 'collect_records',
					data: { articleId: detail._id }
				});
				setIsAlreadyCollect(true);
				Taro.showToast({
					title: '收藏成功',
					icon: 'success'
				});
			} else {
				const userInfo = await Taro.getStorageSync('userInfo');

				dbDelete({
					collection: 'collect_records',
					where: { _openid: userInfo.openId, articleId: detail._id }
				});
				Taro.showToast({
					title: '取消成功',
					icon: 'success'
				});
				setIsAlreadyCollect(false);
			}
		} else {
			Taro.navigateTo({ url: `/pages/login/index` });
		}
	};
	if (!detail) return null;
	return (
		<View className='at-article'>
			<View className='at-article__h1'>{detail.title}</View>
			<View className='at-article__info'>
				{`${filters.formateDate(detail.updateTime, '-')}`}
				<Text className='at-article__name'>{`        🐔哥`}</Text>
			</View>

			<AtFab className='sava-btn' onClick={collect}>
				<Text className='at-fab__icon  sava-btn__text'>{isAlreadyCollect ? '取消收藏' : '收藏'}</Text>
			</AtFab>
			<View className='at-article__content'>
				<Image className='at-article__img' src={detail.fileID} mode='widthFix' />

				<View className='at-article__section'>
					<View className='at-article__p'>
						<TaroParser type='markdown' theme='light' content={detail.content} />
					</View>
				</View>
			</View>
		</View>
	);
};

BlogDetail.config = {
	navigationBarTitleText: '文章详情'
};

export default BlogDetail;
