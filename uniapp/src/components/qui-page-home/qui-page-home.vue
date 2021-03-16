<template>
  <view class="home">
    <!-- #ifdef MP-WEIXIN -->
    <uni-nav-bar
      class="status-bar"
      :style="'transform:' + navBarTransform"
      :title="forums.set_site ? forums.set_site.site_name : ''"
      fixed="true"
      :color="navTheme === $u.light() ? '#000000' : '#ffffff'"
      :background-color="navTheme === $u.light() ? '#ffffff' : '#2e2f30'"
      status-bar
    ></uni-nav-bar>
    <!-- #endif -->
    <!-- <scroll-view
      scroll-y="true"
      scroll-with-animation="true"
      show-scrollbar="false"
      class="scroll-y"
      @scroll="scroll"
      @scrolltolower="pullDown"
      @scrolltoupper="toUpper"
    > -->
    <qui-header
      :head-img="forums.set_site ? forums.set_site.site_header_logo : ''"
      :background-head-full-img="forums.set_site ? forums.set_site.site_background_image : ''"
      :theme="theme"
      :theme-num="forums.set_site ? forums.other.count_users : ''"
      :post-num="forums.set_site ? forums.other.count_threads : ''"
      :share-btn="shareBtn"
      :share-show="shareShow"
      color="#1878F3"
      :is-show-more="false"
      :is-show-back="false"
      :is-show-home="false"
      @click="open"
      @closeShare="closeShare"
    ></qui-header>
    <view
      class="nav"
      id="navId"
      :style="headerShow ? '' : 'width:100%;position:fixed;z-index:9;top:' + navbarHeight + 'px;'"
    >
      <!-- #ifndef H5-PLAY || MP-WEIXIN-PLAY -->
      <view class="nav__box">
        <qui-icon
          class="nav__box__icon"
          name="icon-screen"
          size="32"
          :color="show ? '#1878F3' : '#777'"
          @tap="showFilter"
        ></qui-icon>
      </view>
      <u-tabs
        class="scroll-tab"
        :list="categories"
        :current="categoryIndex"
        @change="toggleTab"
        is-scroll="isScroll"
        active-color="#1878F3"
        @handleclickopenlist="handleClickOpenList"
      ></u-tabs>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN-PLAY -->
      <view class="nav__box">
        <image
          class="nav__box__img"
          src="./../../static/h5-play/classification@2x.png"
          @tap="showFilter"
        ></image>
      </view>
      <u-tabs
        class="scroll-tab"
        :list="categories"
        :current="categoryIndex"
        @change="toggleTab"
        is-scroll="isScroll"
        active-color="#EA3D5A"
        @handleclickopenlist="handleClickOpenList"
      ></u-tabs>
      <!-- #endif -->
    </view>
    <view
      class="sticky"
      :style="headerShow ? 'margin-top:20rpx' : 'margin-top:130rpx'"
      v-if="sticky.length > 0"
    >
      <view class="sticky__box">
        <view
          class="sticky__isSticky"
          v-for="(item, index) in sticky"
          :key="index"
          @click="stickyClick(item._jv.id)"
        >
          <view class="sticky__isSticky__box">{{ i18n.t('home.sticky') }}</view>
          <view class="sticky__isSticky__count" v-if="item.type == 1 && item.title">
            {{ item.title }}
          </view>
          <view class="sticky__isSticky__count" v-else>
            <qui-uparse
              class="sticky__isSticky__text"
              :content="item.firstPost.summary"
            ></qui-uparse>
          </view>
        </view>
      </view>
    </view>
    <!-- </view> -->
    <view class="main" id="main">
      <!-- #ifndef MP-WEIXIN-PLAY -->
      <qui-content
        class="ivideo"
        v-for="(item, index) in threads"
        :ref="'myVideo' + index"
        :key="index"
        :currentindex="index"
        :pay-status="(item.price > 0 && item.paid) || item.price == 0"
        :user-name="item.user.username"
        :is-real="item.user.isReal"
        :theme-image="item.user.avatarUrl"
        :answer-image="item.question && item.question.beUser && item.question.beUser.avatarUrl"
        :theme-btn="item.canHide || ''"
        :theme-reply-btn="item.canReply || ''"
        :them-pay-btn="item.price > 0 || item.attachmentPrice > 0"
        :user-groups="handleGroup(item.user && item.user.groups)"
        :user-answer-groups="
          handleGroup(item.question && item.question.beUser && item.question.beUser.groups)
        "
        :theme-time="item.createdAt"
        :theme-time-answer="item.question && item.question.answered_at"
        :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
        :thread-type="item.type"
        :media-url="item.threadVideo && item.threadVideo.media_url"
        :is-great="item.firstPost.isLiked"
        :theme-like="item.firstPost.likeCount"
        :theme-comment="item.postCount - 1"
        :tags="[item.category]"
        :images-list="item.firstPost.images"
        :post-goods="item.firstPost.postGoods ? item.firstPost.postGoods : ''"
        :theme-essence="item.isEssence"
        :video-width="item.threadVideo && item.threadVideo.width"
        :video-height="item.threadVideo && item.threadVideo.height"
        :video-id="item.threadVideo && item.threadVideo._jv.id"
        :cover-image="item.threadVideo && item.threadVideo.cover_url"
        :duration="item.threadVideo && item.threadVideo.duration"
        :is-deleted="item.isDeleted"
        :scroll-top="scrollTop"
        :questions-name="item.user.username"
        :be-ask-name="item.question && item.question.beUser && item.question.beUser.username"
        :question-content="item.question && item.question.content"
        :add-ask="item.question && item.question.is_answer"
        :onlooker-number="item.question && item.question.onlooker_number"
        :free-ask="item.question && item.question.price == 0"
        :ask-price="item.question && item.question.price"
        :ask-content="item.question && item.question.content"
        :onlooker-unit-price="item.question && item.question.onlooker_unit_price"
        :on-looker="item.question && item.question.onlooker_unit_price == 0"
        :thread-position="
          item.location ? [item.location, item.address, item.longitude, item.latitude] : []
        "
        :thread-audio="item.threadAudio"
        @click="handleClickShare(item._jv.id)"
        @handleIsGreat="
          handleIsGreat(
            item.firstPost._jv.id,
            item.firstPost.canLike,
            item.firstPost.isLiked,
            item.firstPost.likeCount,
          )
        "
        @commentClick="commentClick(item._jv.id)"
        @contentClick="contentClick(item)"
        @answeClick="answeClick(item.user._jv.id)"
        @beAskClick="beAskClick(item.question.beUser.id)"
        @backgroundClick="contentClick(item)"
        @headClick="headClick(item.user._jv.id)"
        @headAnswerClick="headAnswerClick(item.question.be_user_id)"
        @videoPlay="handleVideoPlay"
        @scrollheight="scrpllsip"
        @fullscreenchange="screenplayback"
        @scrollsetup="scrollsetups"
      ></qui-content>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN-PLAY -->
      <qui-content
        class="ivideo"
        v-for="(item, index) in threads"
        :item="item"
        :ref="'myVideo' + index"
        :key="index"
        :currentindex="index"
        :pay-status="(item.price > 0 && item.paid) || item.price == 0"
        :user-name="item.user.username"
        :is-real="item.user.isReal"
        :theme-image="item.user.avatarUrl"
        :answer-image="item.question && item.question.beUser && item.question.beUser.avatarUrl"
        :theme-btn="item.canHide || ''"
        :theme-reply-btn="item.canReply || ''"
        :them-pay-btn="item.price > 0 || item.attachmentPrice > 0"
        :user-groups="handleGroup(item.user && item.user.groups)"
        :user-answer-groups="
          handleGroup(item.question && item.question.beUser && item.question.beUser.groups)
        "
        :theme-time="item.createdAt"
        :theme-time-answer="item.question && item.question.answered_at"
        :theme-content="item.type == 1 ? item.title : item.firstPost.summary"
        :thread-type="item.type"
        :media-url="item.threadVideo && item.threadVideo.media_url"
        :is-great="item.firstPost.isLiked"
        :theme-like="item.firstPost.likeCount"
        :theme-comment="item.postCount - 1"
        :tags="[item.category]"
        :images-list="item.firstPost.images"
        :post-goods="item.firstPost.postGoods ? item.firstPost.postGoods : ''"
        :theme-essence="item.isEssence"
        :video-width="item.threadVideo && item.threadVideo.width"
        :video-height="item.threadVideo && item.threadVideo.height"
        :video-id="item.threadVideo && item.threadVideo._jv.id"
        :cover-image="item.threadVideo && item.threadVideo.cover_url"
        :duration="item.threadVideo && item.threadVideo.duration"
        :is-deleted="item.isDeleted"
        :scroll-top="scrollTop"
        :questions-name="item.user.username"
        :be-ask-name="item.question && item.question.beUser && item.question.beUser.username"
        :question-content="item.question && item.question.content"
        :add-ask="item.question && item.question.is_answer"
        :onlooker-number="item.question && item.question.onlooker_number"
        :free-ask="item.question && item.question.price == 0"
        :ask-price="item.question && item.question.price"
        :ask-content="item.question && item.question.content"
        :onlooker-unit-price="item.question && item.question.onlooker_unit_price"
        :on-looker="item.question && item.question.onlooker_unit_price == 0"
        :thread-position="
          item.location ? [item.location, item.address, item.longitude, item.latitude] : []
        "
        :thread-audio="item.threadAudio"
        @click="handleClickShare(item._jv.id)"
        @handleIsGreat="
          handleIsGreat(
            item.firstPost._jv.id,
            item.firstPost.canLike,
            item.firstPost.isLiked,
            item.firstPost.likeCount,
          )
        "
        @commentClick="commentClick(item._jv.id)"
        @contentClick="contentClick(item)"
        @answeClick="answeClick(item.user._jv.id)"
        @beAskClick="beAskClick(item.question.beUser.id)"
        @backgroundClick="contentClick(item)"
        @headClick="headClick(item.user._jv.id)"
        @headAnswerClick="headAnswerClick(item.question.be_user_id)"
        @videoPlay="handleVideoPlay"
        @scrollheight="scrpllsip"
        @fullscreenchange="screenplayback"
        @scrollsetup="scrollsetups"
      ></qui-content>
      <!-- #endif -->
      <qui-load-more :status="loadingType"></qui-load-more>
    </view>
    <!-- #ifdef H5-->
    <view
      class="record"
      v-if="forums.set_site ? forums.set_site.site_record || forums.set_site.site_record_code : ''"
    >
      <!-- <text>{{ i18n.t('home.record') }}</text> -->
      <view class="record__box">
        <a class="record__box-url" href="https://beian.miit.gov.cn" target="_blank">
          {{ forums.set_site ? forums.set_site.site_record : '' }}
        </a>
      </view>
      <view
        v-if="forums.set_site ? forums.set_site.site_record_code : ''"
        :class="forums.set_site.site_record ? 'record__box1' : 'record__box2'"
      >
        <a class="record__box-url" :href="surl" target="_blank">
          {{ forums.set_site ? forums.set_site.site_record_code : '' }}
        </a>
      </view>
    </view>
    <view
      class="copyright"
      :class="
        forums.set_site
          ? forums.set_site.site_record || forums.set_site.site_record_code
            ? ''
            : 'copyright_margin'
          : ''
      "
    >
      <text>{{ i18n.t('home.copyright') }}</text>
    </view>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN-->
    <view class="wxcopyright">
      <text>{{ i18n.t('home.copyright') }}</text>
    </view>
    <!-- #endif -->
    <!-- </scroll-view> -->
    <!-- #ifndef H5-PLAY || MP-WEIXIN-PLAY -->
    <qui-filter-modal
      v-model="show"
      @confirm="confirm"
      @changeSelected="changeSelected"
      @change="changeType"
      :confirm-text="i18n.t('home.confirmText')"
      :if-need-confirm="ifNeedConfirm"
      :filter-list="filterList"
      :show-search="showSearch"
      @searchClick="searchClick"
      :content-top="filterTop"
      :categories-data="categories"
      ref="filter"
    ></qui-filter-modal>
    <!-- #endif -->
    <!-- #ifdef H5-PLAY || MP-WEIXIN-PLAY -->
    <!-- 筛选弹框 -->
    <FilterModalPlay
      v-model="show"
      @confirm="confirm"
      @changeSelected="changeSelected"
      @change="changeType"
      :confirm-text="i18n.t('home.confirmText')"
      :if-need-confirm="ifNeedConfirm"
      :filter-list="filterList"
      :show-search="showSearch"
      @searchClick="searchClick"
      :content-top="filterTop"
      :categories-data="categories"
      ref="filter"
    ></FilterModalPlay>
    <!-- #endif -->
    <!-- 二级下拉菜单 -->
    <UniPopupCopy ref="clickOpenList" type="top">
      <scroll-view class="openOfList" scroll-y="true">
        <view
          :class="
            isActives == itme.search_ids ? 'openOfListItmeActive openOfListItme' : 'openOfListItme'
          "
          v-for="(itme, index) in listItmeChildren"
          :key="index"
          @click="handleClickSearch(itme.search_ids)"
        >
          <view class="openOfListItmeText">{{ itme.name }}</view>
          <!-- #ifdef H5-PLAY || MP-WEIXIN-PLAY -->
          <qui-icon
            class="arrow"
            name="icon-folding-r"
            size="26"
            :color="isActives == index ? '#ea3d5a' : '#ddd'"
          ></qui-icon>
          <!-- #endif -->
          <!-- #ifndef H5-PLAY || MP-WEIXIN-PLAY -->
          <qui-icon
            class="arrow"
            name="icon-folding-r"
            size="26"
            :color="isActives == index ? '#1878F3' : '#ddd'"
          ></qui-icon>
          <!-- #endif -->
        </view>
      </scroll-view>
    </UniPopupCopy>
    <uni-popup ref="popupHead" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share" plain="true" id="top"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareHead(index)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="46"
                  color="#777777"
                ></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <uni-popup ref="popupContent" type="bottom">
      <view class="popup-share">
        <view class="popup-share-content">
          <button class="popup-share-button" open-type="share" plain="true"></button>
          <view v-for="(item, index) in bottomData" :key="index" class="popup-share-content-box">
            <view class="popup-share-content-image">
              <view class="popup-share-box" @click="shareContent(index)">
                <qui-icon
                  class="content-image"
                  :name="item.icon"
                  size="46"
                  color="#777777"
                ></qui-icon>
              </view>
              <!-- <image :src="item.icon" class="content-image" mode="widthFix" /> -->
            </view>
            <text class="popup-share-content-text">{{ item.text }}</text>
          </view>
        </view>
        <view class="popup-share-content-space"></view>
        <text class="popup-share-btn" @click="cancel('share')">{{ i18n.t('home.cancel') }}</text>
      </view>
    </uni-popup>
    <qui-toast ref="toast"></qui-toast>
  </view>
</template>

<script>
import { status } from '@/library/jsonapi-vuex/index';
import forums from '@/mixin/forums';
import user from '@/mixin/user';
import loginModule from '@/mixin/loginModule';
// #ifdef H5
import wxshare from '@/mixin/wxshare-h5';
import appCommonH from '@/utils/commonHelper';
// #endif
import { mapMutations, mapState } from 'vuex';
import { throttle } from 'lodash';

import UniPopupCopy from '@/components/uni-popup/uni-popup-copy';
// #ifdef H5-PLAY || MP-WEIXIN-PLAY
import FilterModalPlay from '@/components/qui-filter-modal/qui-filter-modal-play';
// #endif
const sysInfo = uni.getSystemInfoSync();

let navbarHeight;
// #ifdef H5
navbarHeight = sysInfo.statusBarHeight; /* uni-nav-bar的高度 */
// #endif
// #ifdef MP-WEIXIN
navbarHeight = sysInfo.statusBarHeight + 44; /* uni-nav-bar的高度 */
// #endif
const navBarTransform = `translateY(-${navbarHeight}px)`;

export default {
  components: {
    UniPopupCopy,
    // #ifdef H5-PLAY || MP-WEIXIN-PLAY
    FilterModalPlay,
    // #endif
  },
  mixins: [
    forums,
    user,
    loginModule,
    // #ifdef H5
    wxshare,
    appCommonH,
    // #endif
  ],
  props: {
    navTheme: {
      type: String,
      default: '',
    },
    homeCategoryId: {
      type: String,
      default: '',
    },
    homeSearchIds: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      searchIds: '',
      listItmeChildren: [],
      positionTop: '',
      currentdataInfoId: -2, // 记录是否重复点击同一个类型
      currentClassification: -1, // 当前一级分类
      isActives: -1, // 二级分类是否激活
      navBarTransform,
      // suspended: false, // 是否吸顶状态
      checkoutTheme: false, // 切换主题  搭配是否吸顶使用
      threadType: '', // 主题类型 0普通 1长文 2视频 3图片（'' 不筛选）
      threadEssence: '', // 筛选精华 '' 不筛选 yes 精华 no 非精华
      threadFollow: 0, // 关注的主题 传当前用户 ID
      show: false,
      ifNeedConfirm: true,
      top: 500,
      filterSelected: { label: this.i18n.t('topic.whole'), value: '' }, // 筛选类型
      loadingType: 'more', // 上拉加载状态
      hasMore: false, // 是否有更多
      pageSize: 20, // 每页10条数据
      pageNum: 1, // 当前页数
      isLiked: false, // 主题点赞状态
      showSearch: true, // 筛选显示搜索
      navbarHeight, // 顶部导航栏的高度
      headerShow: true, // 是否显示标题图(背景+logo)，不显示标题图时，分类切换栏需要固定顶部
      navTop: 128, // 切换分类导航的top
      navHeight: 0, // 切换分类导航的高度
      nowThreadId: '', // 当前点击主题ID
      filterTop: '', // 筛选弹窗的位置
      shareShow: false, // h5内分享提示信息
      shareTitle: '', // h5内分享复制链接
      isWeixin: '', // 是否是微信浏览器内
      filterList: [
        {
          title: this.i18n.t('home.filterPlate'),
          data: [],
        },
        {
          title: this.i18n.t('home.filterType'),
          data: [
            { label: this.i18n.t('home.all'), value: '', selected: true },
            { label: this.i18n.t('home.text'), value: '0', selected: false },
            { label: this.i18n.t('home.invitation'), value: '1', selected: false },
            { label: this.i18n.t('home.video'), value: '2', selected: false },
            { label: this.i18n.t('home.picture'), value: '3', selected: false },
            { label: this.i18n.t('home.audio'), value: '4', selected: false },
            { label: this.i18n.t('home.questions'), value: '5', selected: false },
            { label: this.i18n.t('home.goods'), value: '6', selected: false },
          ],
        },
        {
          title: this.i18n.t('home.confirmText'),
          data: [
            { label: this.i18n.t('home.all'), value: '', selected: true },
            { label: this.i18n.t('home.essence'), value: '1', selected: false },
            { label: this.i18n.t('home.followed'), value: '2', selected: false },
          ],
        },
      ],
      threads: [],
      location: {},
      sticky: [], // 置顶帖子内容
      shareBtn: 'icon-share1',
      tabIndex: 0, // 选中标签栏的序列,默认显示第一个
      isResetList: false, // 是否重置列表
      bottomData: [
        {
          text: this.i18n.t('home.generatePoster'),
          icon: 'icon-poster',
          name: 'wx',
          id: 1,
        },
        {
          text: this.i18n.t('home.wxShare'),
          icon: 'icon-wx-friends',
          name: 'wx',
          id: 2,
        },
      ],
      threadsStatusId: 0,
      categories: [],
      playIndex: null,
      scrollTop: 0,
      surl: '', // 公安网备案信息地址
      observer: null,
      scrollnumber: '',
      scrollindex: '',
      switchscroll: false,
      rollingHeight: 0,
      follow: true,
    };
  },
  computed: {
    ...mapState({
      categoryId: state => state.session.categoryId,
      categoryIndex: state => state.session.categoryIndex,
      footerIndex: state =>
        state.footerTab.footerIndex ? parseInt(state.footerTab.footerIndex, 10) : 0,
    }),
    setIndex: {
      get() {
        const index = this.$store.state.footerTab.footerIndex;
        return index;
      },
      set(index) {
        if (index === 1 || index === 2) {
          this.headerShow = true;
        }
      },
    },
    userId() {
      return this.$store.getters['session/get']('userId');
    },
  },
  created() {
    if (!this.searchIds) {
      this.searchIds = 0;
    }
    // #ifdef  H5
    this.isWeixin = appCommonH.isWeixin().isWeixin;
    this.isPhone = appCommonH.isWeixin().isPhone;
    if (this.forums.set_site) {
      const recordNumber = this.forums.set_site.site_record_code.replace(/[^\d]/g, '');
      this.surl = `http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${recordNumber}`;
    }
    // #endif
    // 详情页删除帖子和新增帖子
    this.$u.event.$on('refreshHome', () => {
      this.threads = [];
      this.isResetList = true;
      this.pageNum = 1;
      this.loadThreadsSticky();
      this.loadThreads();
    });
    // 详情页删除帖子后在首页删除
    this.$u.event.$on('deleteThread', () => {
      this.threads = [];
      this.isResetList = true;
      this.pageNum = 1;
      this.loadThreadsSticky();
      this.loadThreads();
    });
    // 编辑删除图片后首页删除图片
    this.$u.event.$on('deletedImg', res => {
      this.threads.forEach(item => {
        if (item._jv.id === res.threadId) {
          item.firstPost.images.splice(res.index, 1);
        }
      });
    });
    // 置顶列表添加数据当详情页置顶时
    this.$u.event.$on('stickyThread', data => {
      this.sticky.unshift(data);
      this.threads.forEach((item, index) => {
        if (item._jv.id === data._jv.id) {
          this.threads.splice(index, 1);
        }
      });
    });
    // 详情页编辑增加图片时首页增加图片
    this.$u.event.$on('refreshImg', res => {
      // eslint-disable-next-line no-restricted-syntax
      for (const index in this.threads) {
        if (this.threads[index]._jv.id === res.threadId) {
          const images = [];
          if (res.images.data) {
            res.images.data.forEach(image => {
              images.push(this.$store.getters['jv/get'](`attachments/${image.id}`));
            });
          }
          this.threads[index].firstPost.images = images;
          this.$forceUpdate();
          break;
        }
      }
    });

    // 详情页编辑增加图片时首页增加图片
    // 这是接收的商品
    this.$u.event.$on('refreshGoods', res => {
      // eslint-disable-next-line no-restricted-syntax
      for (const index in this.threads) {
        if (this.threads[index]._jv.id === res.threadId) {
          this.threads[index].firstPost.postGoods = res.goods;
          this.$forceUpdate();
          break;
        }
      }
    });

    // 详情页编辑定位
    this.$u.event.$on('updateLocation', (id, res) => {
      this.threads.forEach((item, index) => {
        if (item._jv.id === id) {
          this.threads[index].latitude = res.latitude || '';
          this.threads[index].location = res.location || '';
          this.threads[index].longitude = res.longitude || '';
          this.threads[index].address = res.address || '';
        }
      });
    });
    // h5微信分享
    // #ifdef H5
    this.wxShare({
      title: this.forums.set_site ? this.forums.set_site.site_name : '',
      desc: this.forums.set_site ? this.forums.set_site.site_introduction : '',
      logo:
        this.forums.set_site && this.forums.set_site.site_logo
          ? this.forums.set_site.site_logo
          : '',
    });
    // #endif
    this.ontrueGetList();
    uni.$on('logind', () => {
      this.ontrueGetList();
    });
  },
  destroyed() {
    uni.$off('logind');
    // #ifdef H5
    uni.$off('updateIndex');
    uni.$off('updateNoticePage');
    uni.$off('updateMy');
    // #endif
  },
  mounted() {
    this.$u.event.$on('tagClick', (tagId, tagIdc, searchIds) => {
      this.searchIds = searchIds;
      this.isResetList = true;
      this.loadCategories();
      this.setCategoryId(tagId);
      this.handleClickSearch(tagIdc);
      this.setCategoryIndex(this.getCategorieIndex(tagId));
      // 首页主题置顶列表
      this.loadThreadsSticky();
      // 首页主题内容列表
      this.loadThreads();
    });

    if (this.footerIndex === 0) {
      this.$uGetRect('#navId').then(rect => {
        this.navTop = rect.top;
        this.navHeight = rect.height;
      });
    }

    if (this.forums.set_site && this.forums.set_site.site_title) {
      uni.setNavigationBarTitle({
        title: `${this.forums.set_site.site_title}`,
      });
    } else if (this.forums.set_site) {
      uni.setNavigationBarTitle({
        title: `${this.forums.set_site.site_name}`,
      });
    }

    // #ifdef H5
    uni.$on('updateIndex', () => {
      this.headerShow = true;
      this.ontrueGetList();
    });
    uni.$on('updateNoticePage', () => {
      this.headerShow = true;
      this.ontrueGetList();
    });
    uni.$on('updateMy', () => {
      this.headerShow = true;
      this.ontrueGetList();
    });

    // #endif
    // uni.$on('onpullDownRefresh', () => {
    //   this.navBarTransform = 'none';
    // })
  },
  methods: {
    handleClickSearch(searchId) {
      this.isActives = searchId;
      this.listItmeChildren.forEach(itme => {
        if (itme.search_ids === searchId) {
          // itme.checked = 0;
          this.$refs.clickOpenList.close();
        } else {
          // itme.checked = 1;
        }
      });
      // 获取二级分类帖子
      const params = {
        'filter[isSticky]': 'no',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[categoryId]': searchId,
        'filter[type]': this.threadType,
        'filter[isEssence]': this.threadEssence,
        'filter[isDisplay]': 'yes',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'firstPost.postGoods',
          'category',
          'threadVideo',
          'question',
          'question.beUser',
          'question.beUser.groups',
          'threadAudio',
        ],
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(res => {
        this.threads = [];
        this.threads = res;
        // this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        // delete res._jv;
        // const newRes = res.map(item => {
        //   const newItem = item;
        //   newItem.id = item._jv.id;
        // 因为使用了虚拟滚动，导致parse组件中，对于content内容每次渲染都需要执行，浪费性能
        // 改为数据获取时马上处理数据
        //   newItem._contentParse =
        //     item.type !== 1
        //       ? html2JsonHeler(this, item.type === 1 ? item.title : item.firstPost.summary)
        //       : null;
        //   return newItem;
        // });
        // if (this.isResetList) {
        //   this.threads = newRes;
        //   this.$nextTick(() => {
        //     this.setScrollerTop(0);
        //   });
        // } else {
        //   this.threads = [...this.threads, ...newRes];
        // }

        // this.isResetList = false;
        // loadThreading = false;
        // if (loadThreadingTimer) {
        //   clearTimeout(loadThreadingTimer);
        //   loadThreadingTimer = null;
        // }
      });
      // .then(data => {
      //   console.log(data);
      //   this.threads = data;
      // });
    },
    handleClickOpenList(dataInfo) {
      wx.createSelectorQuery()
        .in(this)
        .select('#navId')
        .boundingClientRect(rect => {
          this.positionTop = `${rect.bottom * 2}rpx`;
        })
        .exec();
      const listItmeId = parseInt(dataInfo.id, 10);
      this.isActives = -1;
      if (listItmeId !== 0) {
        this.categories.forEach(itme => {
          if (parseInt(itme._jv.id, 10) === listItmeId) {
            this.listItmeChildren = itme.children || [];
            if (this.listItmeChildren.length === 0) {
              this.$refs.clickOpenList.close();
            } else {
              this.$refs.clickOpenList.open();
            }
          }
        });
      } else {
        this.$refs.clickOpenList.close();
      }
    },
    ...mapMutations({
      setCategoryId: 'session/SET_CATEGORYID',
      setCategoryIndex: 'session/SET_CATEGORYINDEX',
    }),
    topMargin() {
      return ';';
    },
    handleGroup(data) {
      let groups = [];
      if (data && data.length > 0) {
        groups = data.filter(item => item.isDisplay);
      }
      if (groups.length > 0) {
        return [groups[0]];
      }
      return [];
    },
    scrpllsip(e, index) {
      this.scrollnumber = e;
      this.scrollindex = index;
      this.switchscroll = true;
      this.scrollTop = this.rollingHeight;
    },
    scroll(event) {
      // if (this.footerIndex === 0) {
      if (this.follow) {
        this.rollingHeight = event.scrollTop;
      }
      if (this.switchscroll && event.scrollTop !== 0) {
        if (this.scrollTop > this.num || this.scrollTop < this.num) {
          this.$refs[`myVideo${this.scrollindex}`][0].pauseVideo();
          this.switchscroll = false;
        }
      }
      // #ifdef MP-WEIXIN
      if (!this.navbarHeight) {
        return;
      }
      if (event.scrollTop + this.navbarHeight + 20 >= this.navTop) {
        this.headerShow = false;
        this.navBarTransform = 'none';
      } else {
        this.headerShow = true;
        this.navBarTransform = `translate3d(0, -${this.navbarHeight}px, 0)`;
      }
      // #endif

      // #ifdef H5
      if (event.scrollTop >= this.navTop) {
        this.headerShow = false;
        this.navBarTransform = 'none';
      } else {
        this.headerShow = true;
        this.navBarTransform = `translate3d(0, -${this.navbarHeight}px, 0)`;
      }
      // #endif
      // }
    },
    scrollsetups() {
      const _this = this;
      this.scrollTop = this.rollingHeight;
      uni.setStorage({
        key: 'scroll_top',
        data: _this.scrollTop,
      });
    },
    screenplayback(fullScree) {
      const _this = this;
      let num = 0;
      this.follow = fullScree;
      // this.scrollsetups();
      uni.getStorage({
        key: 'scroll_top',
        success(resData) {
          num = resData.data;
          _this.num = resData.data;
        },
      });
      const timer = setTimeout(() => {
        uni.pageScrollTo({
          duration: 0, // 过渡时间必须为0，uniapp bug，否则运行到手机会报错
          scrollTop: num, // 滚动到目标位置
          success() {
            _this.follow = true;
          },
        });
        clearTimeout(timer);
      }, 100);
    },
    // 滑动到顶部
    toUpper() {
      this.headerShow = true;
    },
    // 初始化选中的选项卡
    getCategorieIndex(tagId) {
      for (let i = 0, len = this.categories.length; i < len; i += 1) {
        if (+this.categories[i]._jv.id === +tagId) {
          return i;
        }
      }
    },

    // 切换选项卡
    async toggleTab(dataInfo) {
      this.searchIds = dataInfo.item.search_ids;
      // 重置列表
      this.isResetList = true;
      this.pageNum = 1;
      this.checkoutTheme = true;
      this.threadEssence = '';
      this.threadFollow = 0;
      this.setCategoryId(dataInfo.id);
      this.setCategoryIndex(dataInfo.index);
      // 切换筛选框选中分类
      // eslint-disable-next-line
      this.filterList[0].data.map(item => {
        // eslint-disable-next-line
        item.selected = false;
      });
      // 判断是否带有默认按钮
      if (this.forums.set_site.site_open_sort === 1) {
        if (dataInfo.index === 0) {
          this.filterList[0].data[dataInfo.index].selected = true;
        } else {
          this.filterList[0].data[dataInfo.index - 1].selected = true;
        }
      } else {
        this.filterList[0].data[dataInfo.index].selected = true;
      }
      this.loadThreadsSticky();
      this.threads = [];
      await this.loadThreads();
      this.checkoutTheme = false;
      if (dataInfo.id !== 0) {
        uni.setNavigationBarTitle({
          title: `${dataInfo.name} - ${this.forums.set_site.site_name}`,
        });
      } else if (this.forums.set_site && this.forums.set_site.site_title) {
        uni.setNavigationBarTitle({
          title: `${this.forums.set_site.site_title}`,
        });
      } else {
        uni.setNavigationBarTitle({
          title: `${this.forums.set_site.site_name}`,
        });
      }
    },
    // 筛选分类里的搜索
    searchClick() {
      uni.navigateTo({
        url: '/pages/site/search',
      });
      this.show = false;
    },
    // 点击置顶跳转到详情页
    // eslint-disable-next-line
    stickyClick: throttle(function(id) {
      uni.navigateTo({
        url: `/topic/index?id=${id}`,
      });
    }, 1000),
    // 内容部分点击评论跳到详情页
    // eslint-disable-next-line
    commentClick: throttle(function(id) {
      uni.navigateTo({
        url: `/topic/index?id=${id}`,
      });
    }, 1000),
    // 内容部分点击跳转到详情页
    // eslint-disable-next-line
    contentClick: throttle(function(thread) {
      if (thread.canViewPosts) {
        uni.navigateTo({
          url: `/topic/index?id=${thread._jv.id}`,
        });
      } else {
        this.$refs.toast.show({ message: this.i18n.t('home.noPostingTopic') });
      }
    }, 1000),
    // 点击头像调转到个人主页
    headClick(id) {
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 点击用户名跳转个人主页
    answeClick(id) {
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 点击被提问者用户名
    beAskClick(id) {
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 点击已回答用户的头像调转到个人主页
    headAnswerClick(id) {
      if (id <= 0) {
        return;
      }
      uni.navigateTo({
        url: `/pages/profile/index?userId=${id}`,
      });
    },
    // 首页头部分享按钮弹窗
    open() {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      // #ifdef MP-WEIXIN
      this.$refs.popupHead.open();
      // 付费模式下不显示微信分享
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData = [
          {
            text: this.i18n.t('home.generatePoster'),
            icon: 'icon-poster',
            name: 'wx',
            id: 1,
          },
        ];
      }
      // #endif

      // #ifdef H5
      if (this.isWeixin === true) {
        this.shareShow = true;
      } else {
        this.h5Share({
          title: this.forums.set_site ? this.forums.set_site.site_name : '',
          url: 'pages/home/index',
        });
      }
      // #endif
    },
    // #ifdef H5
    closeShare() {
      this.shareShow = false;
    },
    // #endif
    // 头部分享海报
    shareHead(index) {
      if (index === 0) {
        if (!this.$store.getters['session/get']('isLogin')) {
          uni.setStorage({
            key: 'page',
            data: '/pages/home/index',
          });
          // #ifdef MP-WEIXIN
          this.mpLoginMode();
          // #endif
          // #ifdef H5
          this.h5LoginMode();
          // #endif
        }
        uni.navigateTo({
          url: '/pages/share/site',
        });
      }
      this.cancel();
    },
    // 取消按钮
    cancel() {
      this.$refs.popupContent.close();
      this.$refs.popupHead.close();
    },
    // 点赞调取用户信息取消弹框
    close() {
      this.$refs.auth.close();
    },
    // 筛选选中确定按钮
    confirm(e, d) {
      // 重置列表
      this.isResetList = true;
      this.pageNum = 1;
      const filterSelected = { ...e };
      if (d) {
        this.searchIds = d;
      } else {
        this.searchIds = e[0].data.searchIds;
      }
      if (this.forums.set_site.site_open_sort === 1) {
        this.setCategoryIndex(filterSelected[0].data.index + 1);
      } else {
        this.setCategoryIndex(filterSelected[0].data.index);
      }
      this.threadType = filterSelected[1].data.value;

      switch (filterSelected[2].data.value) {
        // 筛选精华帖
        case '1':
          this.threadEssence = 'yes';
          this.threadFollow = 0;
          break;
        // 筛选关注帖
        case '2':
          this.threadEssence = '';
          this.threadFollow = this.user.id; // TODO 当前用户 ID
          break;
        // 不筛选
        default:
          this.threadEssence = '';
          this.threadFollow = 0;
          break;
      }
      this.loadThreadsSticky();
      this.threads = [];
      this.loadThreads();
    },
    // 筛选框
    changeType(e) {
      this.filterList = e;
    },
    // 首页导航栏筛选按钮
    showFilter() {
      // #ifdef MP-WEIXIN
      wx.createSelectorQuery()
        .in(this)
        .select('#navId')
        .boundingClientRect(rect => {
          this.filterTop = `${rect.bottom * 2}rpx`;
        })
        .exec();
      // #endif
      // #ifdef H5
      const obj = document.querySelector('#navId');
      const { bottom } = obj.getBoundingClientRect();
      this.filterTop = `${bottom}px`;
      // #endif
      this.show = !this.show;
      this.$refs.filter.setData();
      // this.navShow = true;
    },
    // 首页内容部分分享按钮弹窗
    handleClickShare(id) {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      // #ifdef MP-WEIXIN
      this.$emit('handleClickShare', id);
      this.nowThreadId = id;
      this.$refs.popupContent.open();
      // 付费模式下不显示微信分享
      if (this.forums.set_site.site_mode === 'pay') {
        this.bottomData = [
          {
            text: this.i18n.t('home.generatePoster'),
            icon: 'icon-poster',
            name: 'wx',
            id: 1,
          },
        ];
      }
      // #endif
      // #ifdef H5
      const shareThread = this.$store.getters['jv/get'](`threads/${id}`);
      if (shareThread.type === 1) {
        this.shareTitle = shareThread.title;
      } else {
        this.shareTitle = shareThread.firstPost.summaryText;
      }
      this.h5Share({
        title: this.shareTitle,
        id,
        url: 'topic/index',
      });
      // #endif
    },
    // 内容部分分享海报,跳到分享海报页面
    shareContent(index) {
      if (index === 0) {
        uni.navigateTo({
          url: `/pages/share/topic?id=${this.nowThreadId}`,
        });
      }
      this.cancel();
    },
    // 首页导航栏分类列表数据
    loadCategories() {
      this.$store.dispatch('jv/get', ['categories', {}]).then(data => {
        const resData = [...data] || [];
        if (this.forums.set_site.site_open_sort === 1) {
          this.categories = [
            {
              _jv: {
                id: 0,
              },
              name: '默认',
              search_ids: 0,
            },
            {
              _jv: {
                id: -1,
              },
              name: this.i18n.t('home.all'),
              search_ids: -1,
            },
            ...resData,
          ];
        } else {
          this.categories = [
            {
              _jv: {
                id: -1,
              },
              name: this.i18n.t('home.all'),
              search_ids: -1,
            },
            ...resData,
          ];
        }
        const categoryFilterList = [
          {
            label: this.i18n.t('home.all'),
            value: 0,
            selected: true,
          },
        ];
        resData.forEach(item => {
          categoryFilterList.push({
            label: item.name,
            value: item._jv.id,
            selected: false,
            searchIds: item.search_ids,
          });
        });
        this.filterList[0].data = categoryFilterList;
        // #ifdef H5
        if (this.homeCategoryId) {
          const datainfo = {};
          if (this.homeCategoryId === '0') {
            datainfo.index = 0;
            datainfo.id = 0;
            datainfo.name = '所有';
          } else {
            this.categories.forEach((item, index) => {
              if (this.homeCategoryId === item._jv.id) {
                datainfo.index = index;
                datainfo.id = item._jv.id;
                datainfo.name = item.name;
              }
            });
          }
          this.toggleTab(datainfo);
        }
        // #endif
      });
    },
    // 首页置顶列表数据
    loadThreadsSticky() {
      let searchIds = '';
      searchIds = this.searchIds === -1 ? 0 : this.searchIds;
      const params = {
        'filter[isSticky]': 'yes',
        'filter[isDisplay]': 'yes',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[categoryId]': searchIds,
        include: ['firstPost'],
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        this.sticky = [...data];
      });
    },
    // 首页内容部分数据请求
    loadThreads() {
      const params = {
        'filter[isSort]': this.searchIds === 0 && this.forums.set_site.site_open_sort === 1 ? 1 : 0,
        'filter[isSticky]': 'no',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[categoryId]': this.searchIds === -1 ? 0 : this.searchIds,
        'filter[type]': this.threadType,
        'filter[isEssence]': this.threadEssence,
        'filter[isDisplay]': 'yes',
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize,
        include: [
          'user',
          'user.groups',
          'firstPost',
          'firstPost.images',
          'firstPost.postGoods',
          'category',
          'threadVideo',
          'question',
          'question.beUser',
          'question.beUser.groups',
          'threadAudio',
        ],
      };
      if (this.threadType !== null) {
        params['filter[type]'] = this.threadType;
      }
      params['filter[fromUserId]'] = this.threadFollow;

      const threadsAction = status.run(() =>
        this.$store.dispatch('jv/get', ['threads', { params }]),
      );

      this.threadsStatusId = threadsAction._statusID;

      return threadsAction.then(res => {
        // #ifdef H5
        if (this.homeCategoryId === this.getQueryString('categoryId') && this.pageNum === 1) {
          this.isResetList = true;
        }
        // #endif
        this.loadingType = res.length === this.pageSize ? 'more' : 'nomore';
        delete res._jv;
        if (this.isResetList) {
          this.threads = res;
        } else {
          this.threads = [...this.threads, ...res];
        }
        this.isResetList = false;
      });
    },
    // 内容部分点赞按钮点击事件
    handleIsGreat(id, canLike, isLiked) {
      if (!this.$store.getters['session/get']('isLogin')) {
        uni.setStorage({
          key: 'page',
          data: '/pages/home/index',
        });
        // #ifdef MP-WEIXIN
        this.mpLoginMode();
        // #endif
        // #ifdef H5
        this.h5LoginMode();
        // #endif
      }
      const params = {
        _jv: {
          type: 'posts',
          id,
        },
        isLiked: isLiked !== true,
      };
      this.$store.dispatch('jv/patch', params);
    },
    // 上拉加载
    pullDown() {
      if (this.footerIndex !== 0) {
        return;
      }
      if (this.loadingType !== 'more') {
        return;
      }
      this.pageNum += 1;
      this.loadThreads();
    },
    // 视频禁止同时播放
    handleVideoPlay(index, e) {
      this.switchscroll = e;
      if (this.playIndex !== index && this.playIndex !== null) {
        this.$refs[`myVideo${this.playIndex}`][0].pauseVideo();
      }
      this.playIndex = index;
    },
    // 组件初始化请求接口
    ontrueGetList() {
      this.headerShow = true;
      this.isResetList = true;
      // 首页导航栏分类列表
      this.loadCategories();
      // 首页主题置顶列表
      this.loadThreadsSticky();
      // 首页主题内容列表
      this.loadThreads();
    },
    getQueryString(name) {
      const reg = new RegExp(`(^|&)${name}([^&]*)(&|$)`);
      const r = window.location.search.substr(1).match(reg);
      if (r != null) return r[2].substring(1);
      return null;
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/base/variable/global.scss';
@import '@/styles/base/theme/fn.scss';
/* #ifdef H5 */
$padding-bottom: 180rpx;
/* #endif */
/* #ifdef MP-WEIXIN */
$padding-bottom: 160rpx;
/* #endif */
.openOfList {
  position: absolute;
  top: 20rpx;
  left: 0;
  width: 100%;
  max-height: calc(100vh - 478rpx);
  overflow-y: auto;
  background: --color(--qui-BG-2);
}
.openOfListItme {
  display: flex;
  width: 100%;
  height: 88rpx;
  padding: 0 77rpx;
  font-size: 30rpx;
  line-height: 88rpx;
  background: --color(--qui-BG-2);
  justify-content: space-between;
}
.openOfListItmeActive {
  color: #1878f3;
  /* #ifdef H5-PLAY || MP-WEIXIN-PLAY */
  color: #ea3d5a;
  /* #endif */
}
.home {
  min-height: 100vh;
  color: --color(--qui-FC-333);
  background-color: --color(--qui-BG-1);
}
.status-bar {
  position: fixed;
  z-index: 2;
  transition: 0.2s;
}
.nav {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden;
  background: --color(--qui-BG-2);
  /* #ifdef H5-PLAY || MP-WEIXIN-PLAY */
  background: var(--qui-BG-1);
  /* #endif */
  /* #ifdef MP-WEIXIN */
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  /* #endif */
  transition: box-shadow 0.2s, -webkit-transform 0.2s;

  &__box {
    position: absolute;
    right: 0;
    z-index: 2;
    display: block;
    float: right;
    width: 80rpx;
    height: 97rpx;
    background: --color(--qui-BG-2);
    /* #ifdef H5-PLAY || MP-WEIXIN-PLAY */
    background: var(--qui-BG-1);
    /* #endif */
    &__icon {
      margin-left: 24rpx;
      line-height: 100rpx;
    }
    /* #ifdef H5-PLAY || MP-WEIXIN-PLAY */
    &__img {
      width: 40rpx;
      height: 27rpx;
      margin: 20rpx;
      margin-top: 34rpx;
    }
    /* #endif */
  }
}

.scrolled .nav {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.filter-modal .filter-modal__content {
  max-height: 500rpx;
}

.sticky {
  // margin: 20rpx auto;
  border-top: 2rpx solid --color(--qui-BOR-ED);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
}
.sticky__box {
  background: --color(--qui-BG-2);
}

.sticky__isSticky {
  display: flex;
  width: 710rpx;
  height: 80rpx;
  margin-left: 30rpx;
  font-size: $fg-f3;
  line-height: 80rpx;
  background: --color(--qui-BG-2);
  border-bottom: 2rpx solid --color(--qui-BOR-ED);
  // border-radius: 6rpx;
  // box-shadow: 0rpx 2rpx 4rpx rgba(0, 0, 0, 0.05);
  &__box {
    // display: block;
    width: 62rpx;
    height: 35rpx;
    margin-top: 27rpx;
    // margin-left: 20rpx;
    font-size: $fg-f1;
    line-height: 35rpx;
    color: --color(--qui-FC-777);
    /* #ifdef H5-PLAY || MP-WEIXIN-PLAY */
    color: #ea3d5a;
    /* #endif */
    text-align: center;
    background: --color(--qui-BG-777);
    /* #ifdef H5-PLAY || MP-WEIXIN-PLAY */
    background: rgba($color: #ea3d5a, $alpha: 0.08);
    /* #endif */
    border-radius: 6rpx;
    transition: $switch-theme-time;
  }
  &__count {
    width: 572rpx;
    height: 100%;
    margin-top: 27rpx;
    margin-left: 21rpx;
    overflow: hidden;
    line-height: 35rpx;
    color: --color(--qui-FC-333);
    text-overflow: ellipsis;
    white-space: nowrap;
    &__text {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
.sticky__isSticky:last-child {
  border-bottom: none;
}
.horizonal-tab .active {
  color: --color(--qui-BG-HIGH-LIGHT);
}
.scroll-tab {
  z-index: 100;
  height: 100rpx;
  // text-align: center;
  white-space: nowrap;
  border-bottom: 2rpx solid --color(--qui-BOR-EEE);
}
.scroll-tab-item {
  z-index: 1;
  display: inline-block;
  margin: 20rpx 30rpx;
  font-size: $fg-f3;
  line-height: 77rpx;
  color: --color(--qui-FC-777);
}
.active .scroll-tab-line {
  color: --color(--qui-BG-HIGH-LIGHT);
  border-bottom: 4rpx solid --color(--qui-BG-HIGH-LIGHT);
}
.uni-tab-bar .active {
  font-size: $fg-f4;
  font-weight: bold;
  color: --color(--qui-BG-HIGH-LIGHT);
}
.main {
  display: flex;
  flex-direction: column;
  padding-bottom: $padding-bottom;
  background: --color(--qui-BG-1);
}

// .scroll-y {
//   // max-height: calc(100vh - 497rpx);
//   // max-height: calc(100vh - 100rpx);
//   height: calc(100vh - 90rpx);
// }

.nav .filter-modal {
  position: absolute;
  z-index: 1000;
  width: 100%;
}
.sticky__isSticky__text {
  display: inline-block;
  width: 100%;
  height: 35rpx;
  overflow: hidden;
  line-height: 35rpx;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}
.record {
  display: flex;
  width: 100%;
  height: 40rpx;
  margin-top: -$padding-bottom;
  font-size: $fg-f3;
  color: --color(--qui-FC-B2);
  text-align: center;
  justify-content: center;
  &__box {
    &-url {
      font-size: $fg-f3;
      color: --color(--qui-BG-HIGH-LIGHT);
    }
  }
  &__box1 {
    margin-left: 20rpx;
    line-height: 40rpx;
    &-url {
      font-size: $fg-f3;
      color: --color(--qui-BG-HIGH-LIGHT);
    }
  }
  &__box2 {
    line-height: 40rpx;
    &-url {
      font-size: $fg-f3;
      color: --color(--qui-BG-HIGH-LIGHT);
    }
  }
  a {
    color: --color(--qui-FC-B2);
    text-decoration: none;
  }
}
.copyright {
  width: 100%;
  height: 40rpx;
  font-size: $fg-f3;
  color: --color(--qui-FC-B2);
  text-align: center;
}
.wxcopyright {
  margin-top: -$padding-bottom;
  font-size: $fg-f3;
  color: --color(--qui-FC-B2);
  text-align: center;
}
.copyright_margin {
  margin-top: -$padding-bottom;
}
</style>
