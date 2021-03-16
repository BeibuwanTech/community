<template>
  <div class="container">
    /*IFTRUE_default*/
    <main class="cont-left">
      <index-filter
        :show-sort="siteOpenSortStatus"
        @onChangeFilter="onChangeFilter"
        @onChangeType="onChangeType"
        @onChangeSort="onChangeSort"
      />
      <div v-if="threadsStickyData.length > 0">
        <div
          v-for="(item, index) in threadsStickyData"
          :key="index"
          class="list-top-item"
        >
          <div class="top-label">{{ $t("home.sticky") }}</div>
          <p
            :to="`/thread/${item._jv && item._jv.id}`"
            target="_blank"
            class="top-title"
            @click="handleThreadsStickyClick(item)"
          >
            <template v-if="item.type === 1">
              {{ item.title }}
            </template>
            <span
              v-else
              v-html="
                $xss(formatRichText(item.firstPost && item.firstPost.summary))
              "
            />
          </p>
        </div>
      </div>
      <div v-if="total > 0" class="new-post">
        <div class="new-post-cont">
          {{ $t("home.hasNewContent", { total }) }}
          <span class="refresh" @click="reloadThreadsList">{{
            $t("home.clickRefresh")
          }}</span>
        </div>
      </div>
      <!-- ssr 不支持虚拟列表 -->
      <template v-if="isSpider">
        <template v-for="(item, index) in threadsData">
          <post-item
            v-if="item.type === 4"
            :ref="`audio${ item && item.threadAudio
              && item.threadAudio._jv && item.threadAudio._jv.id}`"
            :key="index"
            :item="item"
            @audioPlay="audioPlay"
          />
          <post-item v-else :key="index" :item="item" />
        </template>
      </template>
      <!-- 长列表优化 -->
      <dynamic-scroller v-else :items="threadsData" :min-item-size="120" page-mode>
        <template v-slot="{ item, index, active }">
          <dynamic-scroller-item
            :item="item"
            :active="active"
            :data-index="index"
          >
            <post-item
              v-if="item.type === 4"
              :ref="
                `audio${item &&
                  item.threadAudio &&
                  item.threadAudio._jv &&
                  item.threadAudio._jv.id}`
              "
              :key="index"
              :item="item"
              :lazy="false"
              @audioPlay="audioPlay"
            />
            <post-item
              v-else
              :key="index"
              :item="item"
              :lazy="false"
              @showVideoFn="showVideoFn"
            />
          </dynamic-scroller-item>
        </template>
        <template #after>
          <list-load-more
            :loading="loading"
            :has-more="hasMore"
            :page-num="pageNum"
            :length="threadsData.length"
            @loadMore="loadMore"
          />
        </template>
      </dynamic-scroller>
    </main>
    <aside class="cont-right">
      <div class="category background-color">
        <!-- <category :list="categoryData" @onChange="onChangeCategory" /> -->
        <category-pay :list="categoryData" @onChange="onChangeCategory" />
      </div>
      <div class="background-color">
        <advertising />
      </div>
      <div class="background-color">
        <recommend-user :list="recommendUserData" />
      </div>
      <copyright :forums="forums" />
    </aside>
    /*FITRUE_default*/
    /*IFTRUE_pay*/
    <main class="cont-center">
      <div class="cont-center-head">
        <index-filter
          :show-sort="siteOpenSortStatus"
          @onChangeFilter="onChangeFilter"
          @onChangeType="onChangeType"
          @onChangeSort="onChangeSort"
        />
        <div v-if="threadsStickyData.length > 0">
          <div
            v-for="(item, index) in threadsStickyData"
            :key="index"
            class="list-top-item"
          >
            <div class="top-label">{{ $t('home.sticky') }}</div>
            <nuxt-link
              :to="`/thread/${item._jv && item._jv.id}`"
              target="_blank"
              class="top-title"
            >
              <template v-if="item.type === 1">
                {{ item.title }}
              </template>
              <span
                v-else
                v-html="
                  $xss(formatRichText(item.firstPost && item.firstPost.summary))
                "
              />
            </nuxt-link>
          </div>
        </div>
        <div v-if="total > 0" class="new-post">
          <div class="new-post-cont">
            <div class="new-post-left">
              {{ $t('home.hasNewContent', { total }) }}
            </div>
            <div class="refresh" @click="reloadThreadsList">
              <svg-icon type="refresh" class="refresh-icon" />
              <span class="refresh-text">{{ $t('home.clickRefresh') }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- ssr 不支持虚拟列表 -->
      <template v-if="isSpider">
        <template v-for="(item, index) in threadsData">
          <post-item
            v-if="item.type === 4"
            :ref="`audio${ item && item.threadAudio
              && item.threadAudio._jv && item.threadAudio._jv.id}`"
            :key="index"
            :item="item"
            @audioPlay="audioPlay"
          />
          <post-item v-else :key="index" :item="item" />
        </template>
      </template>
      <!-- 长列表优化 -->
      <dynamic-scroller
        v-else
        :items="threadsData"
        :min-item-size="120"
        page-mode
      >
        <template v-slot="{ item, index, active }">
          <dynamic-scroller-item
            :item="item"
            :active="active"
            :data-index="index"
          >
            <post-item-pay
              v-if="item.type === 4"
              :ref="
                `audio${item
                  && item.threadAudio
                  && item.threadAudio._jv
                  && item.threadAudio._jv.id}`
              "
              :key="index"
              :item="item"
              :lazy="false"
              @audioPlay="audioPlay"
            />
            <post-item-pay
              v-else
              :key="index"
              :item="item"
              :lazy="false"
              @showVideoFn="showVideoFn"
            />
          </dynamic-scroller-item>
        </template>
        <template #after>
          <list-load-more
            :loading="loading"
            :has-more="hasMore"
            :page-num="pageNum"
            :length="threadsData.length"
            @loadMore="loadMore"
          />
        </template>
      </dynamic-scroller>
    </main>
    <aside class="cont-left">
      <div class="category background-color">
        <category-pay :list="categoryData" @onChange="onChangeCategory" />
      </div>
    </aside>
    <div class="cont-right">
      <div class="background-color">
        <advertising />
      </div>
      <div v-show="recommendContentData.legnth !== 0" class="background-color">
        <recommend-content :list="recommendContentData" />
      </div>
      <copyright :forums="forums" />
    </div>
    /*FITRUE_pay*/
    <!-- 视频播放弹窗 -->
    <video-pop
      v-if="showVideoPop"
      :cover-url="threadVideo.cover_url"
      :url="threadVideo.media_url"
      @remove="showVideoPop = false"
    />
  </div>
</template>

<script>
import s9e from '@/utils/s9e';
import handleError from '@/mixin/handleError';
import handleThreadList from '@/mixin/handleThreadList';
import loginAbout from '@/mixin/loginAbout';
import env from '@/utils/env';
const threadInclude = 'user,user.groups,firstPost,firstPost.images,firstPost.attachments,category,'
  + 'threadVideo,question,question.beUser,question.beUser.groups,firstPost.postGoods,threadAudio';
export default {
  layout: 'custom_layout',
  name: 'Index',
  mixins: [handleError, handleThreadList, loginAbout],
  // 异步数据用法
  async asyncData({ store, query }, callback) {
    if (!env.isSpider) {
      callback(null, {});
    }
    const threadsStickyParams = {
      'filter[isSticky]': 'yes',
      'filter[isApproved]': 1,
      'filter[isDeleted]': 'no',
      'page[number]': 1,
      include: 'firstPost'
    };
    const threadsParams = {
      include: threadInclude,
      'filter[isSticky]': 'no',
      'filter[isApproved]': 1,
      'filter[isDeleted]': 'no',
      'filter[isDisplay]': 'yes',
      'filter[isSort]': store.getters['site/getSortStatus'],
      'page[number]': 1,
      'page[limit]': 10
    };
    const userParams = {
      include: 'groups',
      limit: 4
    };
    try {
      const resData = {};
      const siteInfo = await store.dispatch('site/getSiteInfo');
      const threadsStickyData = await store.dispatch('jv/get', [
        'threads', { params: threadsStickyParams }
      ]);
      const threadsData = await store.dispatch('jv/get', [
        'threads', { params: threadsParams }
      ]);
      const categoryData = await store.dispatch('jv/get', ['categories', {}]);
      const recommendUser = await store.dispatch('jv/get', [
        'users/recommended',
        { params: userParams }
      ]);
      const recommendContent = await store.dispatch('jv/get', [
        'threads/recommend', {}
      ]);
      // 1 head信息
      if (siteInfo && siteInfo.attributes && siteInfo.attributes.set_site) {
        resData.headTitle
          = siteInfo.attributes.set_site.site_title
          || siteInfo.attributes.set_site.site_name
          || 'Discuz! Q';
        resData.headKeywords = siteInfo.attributes.set_site.site_keywords;
        resData.headDesc = siteInfo.attributes.set_site.site_introduction;
      }
      // 2 处理置顶数据
      if (Array.isArray(threadsStickyData)) {
        resData.threadsStickyData = threadsStickyData;
      } else if (
        threadsStickyData
        && threadsStickyData._jv
        && threadsStickyData._jv.json
      ) {
        const _threadsStickyData = threadsStickyData._jv.json.data || [];
        _threadsStickyData.forEach((item, index) => {
          _threadsStickyData[index] = {
            ...item,
            ...item.attributes,
            firstPost: item.relationships.firstPost.data,
            jv: { id: item.id }
          };
        });
        resData.threadsStickyData = _threadsStickyData;
      }
      // 3 处理主题数据
      if (Array.isArray(threadsData)) {
        threadsData.forEach(item => {
          item.id = item._jv && item._jv.id;
        });
        resData.threadsData = threadsData;
      } else if (threadsData && threadsData._jv && threadsData._jv.json) {
        const _threadsData = threadsData._jv.json.data || [];
        _threadsData.forEach((item, index) => {
          _threadsData[index] = {
            ...item,
            ...item.attributes,
            firstPost: item.relationships.firstPost.data,
            user: item.relationships.user.data,
            _jv: { id: item.id }
          };
        });
        resData.threadsData = _threadsData;
      }
      // 4 处理分类数据
      if (Array.isArray(categoryData)) {
        resData.categoryData = categoryData;
      } else if (categoryData && categoryData._jv && categoryData._jv.json) {
        const _categoryData = categoryData._jv.json.data || [];
        _categoryData.forEach((item, index) => {
          _categoryData[index] = {
            ...item,
            ...item.attributes,
            _jv: { id: item.id }
          };
        });
        resData.categoryData = _categoryData;
      }
      // 5 处理推荐内容
      if (Array.isArray(recommendContent)) {
        resData.recommendContentData = recommendContent;
      } else if (
        recommendContent
        && recommendContent._jv
        && recommendContent._jv.json
      ) {
        const _recommendUser = recommendContent._jv.json.data || [];
        _recommendUser.forEach((item, index) => {
          _recommendUser[index] = { ...item, ...item.attributes };
        });
        resData.recommendContentData = _recommendUser;
      }
      // 6 处理推荐用户
      if (Array.isArray(recommendUser)) {
        resData.recommendUserData = recommendUser;
      } else if (recommendUser && recommendUser._jv && recommendUser._jv.json) {
        const _recommendUser = recommendUser._jv.json.data || [];
        _recommendUser.forEach((item, index) => {
          _recommendUser[index] = { ...item, ...item.attributes };
        });
        resData.recommendUserData = _recommendUser;
      }

      callback(null, resData);
    } catch (error) {
      callback(null, {
        _error__abc: {
          error_keys: Object.keys(error),
          error: String(error),
          errno: error.errno,
          code: error.code,
          syscall: error.syscall,
          address: error.address,
          port: error.port,
          config: error.config,
          request_domain: (error.request || {}).domain,
          request_keys: Object.keys(error.request || {}),
          response_keys: Object.keys(error.response || {})
        }
      });
    }
  },
  data() {
    return {
      isSpider: env.isSpider,
      loading: false,
      threadsStickyData: [], // 置顶主题列表
      threadsData: [], // 主题列表
      categoryData: [], // 分类列表
      recommendUserData: [], // 推荐用户列表
      recommendContentData: [], // 推荐内容列表
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页多少条数据
      threadType: '', // 主题类型 0普通 1长文 2视频 3图片（'' 不筛选）
      sort: '', // 排序
      threadEssence: '', // 是否精华帖
      siteOpenSortStatus: false, // 智能排序开关状态
      threadSort: 0, // 是否添加排序请求 0-不添加 1-添加
      fromUserId: '', // 关注人id
      hasMore: false,
      timer: null, // 轮询获取新主题 定时器
      threadCount: 0, // 主题总数
      total: 0, // 新的主题数，通过轮询获取
      headTitle: '\u200E',
      headKeywords: '',
      headDesc: '',
      currentAudioId: '',
      showVideoPop: false, // 显示视频弹窗
      threadVideo: {}, // 当前显示的视频信息
      threadIdSet: new Set() // 新建一个集合，存放当前主题id，用来去除重复项
    };
  },
  computed: {
    userId() {
      return this.$store.getters['session/get']('userId');
    },
    forums() {
      return this.$store.state.site.info.attributes || {};
    }
  },
  watch: {
    forums: {
      handler(val) {
        if (val && val.set_site) {
          this.headTitle
            = val.set_site.site_title || val.set_site.site_name || 'Discuz! Q';
          this.headKeywords = val.set_site.site_keywords;
          this.headDesc = val.set_site.site_introduction;
        }
      },
      deep: true
    }
  },
  mounted() {
    /* IFTRUE_test */
    console.log(333333);
    /* FITRUE_test */
    if (this.forums && this.forums.set_site) {
      this.headTitle
        = this.forums.set_site.site_title
        || this.forums.set_site.site_name
        || 'Discuz! Q';
      this.headKeywords = this.forums.set_site.site_keywords;
      this.headDesc = this.forums.set_site.site_introduction;
    }
    if (this.threadsStickyData.length === 0) {
      this.getThreadsSticky();
    }
    // if (this.threadsData.length === 0) {
    //   this.getThreadsList('first');
    // } else {
    //   if (this.threadsData.length === this.pageSize) {
    //     this.hasMore = true;
    //   }
    // }
    this.initThread();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    // 置顶主题
    getThreadsSticky() {
      this.threadsStickyData = [];
      const params = {
        'filter[isSticky]': 'yes',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        include: ['firstPost']
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        this.threadsStickyData = [...data];
      });
    },
    initThread() {
      this.$store.dispatch('site/getSiteInfo').then(res => {
        // 获取智能排序开启状态
        this.threadSort = res.attributes.set_site.site_open_sort;
        this.siteOpenSortStatus = this.threadSort === 1;

        if (this.threadsData.length === 0) {
          this.getThreadsList();
        } else {
          if (this.threadsData.length === this.pageSize) {
            this.hasMore = true;
          }
          if (this.timer) {
            clearInterval(this.timer);
          }
          this.timer = setInterval(() => {
            this.autoLoadThreads();
          }, 30000);
        }
      });
    },
    // 这里的逻辑拷贝自 loginAbout
    handleThreadsStickyClick(item) {

      // 先判断是否游客可以访问
      if (!item.canViewPosts) {

        // 登录态可以访问
        if (!this.$store.getters['session/get']('isLogin')) {
          if (process.client) {
            this.$message.warning(this.$t('core.not_authenticated'));
            window.setTimeout(() => {
              this.headerTologin();
            }, 1000);
          }
        } else {
          this.$message.warning(this.$t('home.noPostingTopic'));
        }
        return false;

      } else {

        // 游客可以访问
        // 需要跳转到的路由，如果有权限
        const jumpUrl = `/thread/${item._jv && item._jv.id}`;
        window.open(jumpUrl, '_black');
      }
    },
    // 非置顶主题
    getThreadsList(type) {
      this.loading = true;
      const params = {
        include: threadInclude,
        'filter[isSticky]': 'no',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[isDisplay]': 'yes',
        'filter[type]': this.threadType,
        'filter[isSort]': this.threadSort,
        'filter[isEssence]': this.threadEssence,
        'filter[fromUserId]': this.fromUserId,
        sort: this.sort,
        'page[number]': this.pageNum,
        'page[limit]': this.pageSize
      };
      if (this.threadType !== null) {
        params['filter[type]'] = this.threadType;
      }
      this.$store
        .dispatch('jv/get', ['threads', { params }])
        .then(
          data => {
            this.handleThreadList(data, 'threadsData');
            this.$nextTick(() => {
              if (type && type === 'first') {
                if (this.timer) {
                  clearInterval(this.timer);
                }
                this.timer = setInterval(() => {
                  this.autoLoadThreads();
                }, 50000);
              }
            });
          },
          e => {
            this.handleError(e);
          }
        )
        .finally(() => {
          this.loading = false;
        });
    },
    // onLoading({ done, pushItems }) {
    //   pushItems(this.threadsData);
    //   const { pageNum } = this;
    //   console.log('this.hasMore', this.hasMore);
    //   done(pageNum >= 3);
    // },
    // 点击加载更多
    loadMore() {
      // 在这里加1的话，遇到加载不成功的会不断加页码
      //  this.pageNum++
      this.getThreadsList();
    },
    // 轮询查看是否有新主题
    autoLoadThreads() {
      const params = {
        'filter[isSticky]': 'no',
        'filter[isApproved]': 1,
        'filter[isDeleted]': 'no',
        'filter[isDisplay]': 'yes',
        'filter[type]': this.threadType,
        'filter[isSort]': this.threadSort,
        'filter[isEssence]': this.threadEssence,
        'filter[fromUserId]': this.fromUserId,
        'page[limit]': 1
      };
      this.$store.dispatch('jv/get', ['threads', { params }]).then(data => {
        if (data && data._jv) {
          const _threadCount
            = (data._jv.json
              && data._jv.json.meta
              && data._jv.json.meta.threadCount)
            || 0;
          if (this.threadCount > 0) {
            this.total
              = _threadCount - this.threadCount > 0
                ? _threadCount - this.threadCount
                : 0;
          }
        }
      });
    },
    // 重新加载列表
    reloadThreadsList() {
      this.pageNum = 1;
      this.total = 0;
      this.threadsData = [];
      this.getThreadsList();
    },
    // 点击分类
    onChangeCategory(ids) {
      if (ids.id !== 0) {
        this.$router.push({
          path: `/category/${ids.id}`,
          query: { search_ids: ids.search_ids }
        });
      } else {
        this.$router.push('/');
      }
    },
    // 筛选
    onChangeFilter(val) {
      this.threadSort = 0;
      this.threadEssence = '';
      this.fromUserId = '';
      if (val === 'isSort') this.threadSort = 1;
      if (val === 'isEssence') this.threadEssence = 'yes';
      if (val === 'followed') this.fromUserId = this.userId;
      this.reloadThreadsList();
    },
    // 类型
    onChangeType(val) {
      this.threadType = val;
      this.reloadThreadsList();
    },
    // 排序
    onChangeSort(val) {
      this.sort = val;
      this.reloadThreadsList();
    },
    // 处理富文本里的图片宽度自适应
    // 1.去掉img标签里的style、width、height属性
    // 2.img标签添加style属性：max-width:100%;height:auto
    // 3.修改所有style里的width属性为max-width:100%
    // 4.去掉<br/>标签			 * @param html			 * @returns {void|string|*}
    formatRichText(html) {
      // eslint-disable-next-line no-param-reassign
      return s9e.parse(html);
    },
    // 语音互斥播放
    audioPlay(id) {
      if (this.currentAudioId && this.currentAudioId !== id) {
        this.$refs[`audio${this.currentAudioId}`] && this.$refs[`audio${this.currentAudioId}`].pause();
      }
      this.currentAudioId = id;
    },
    // 视频播放弹窗
    showVideoFn(video) {
      this.threadVideo = video;
      this.showVideoPop = true;
    }
  },
  head() {
    return {
      title: this.headTitle,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.headKeywords },
        { hid: 'description', name: 'description', content: this.headDesc }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variable/color.scss";
@mixin background() {
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.03);
}
/*IFTRUE_default*/
.app-cont {
  box-shadow: none;
}
.container{
  display:flex;
  background: #F4F5F6;
  width: 100%;
  .cont-left {
    flex: auto;
    @include background();
    .hide {
      position: relative;
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
    .list-top-item {
      border-bottom: 1px solid $line-color-base;
      padding: 10.5px 22px;
      display: flex;
      align-items: center;
      .top-label {
        color: $font-color-grey;
        margin-right: 20px;
      }
      .top-title {
        color: #000;
        cursor: pointer;
        flex: 1;
        max-width: 425px;
        overflow: hidden;
        // text-overflow:ellipsis;
        // white-space: nowrap;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        font-size: 14px !important;
        max-height: 21px;
        ::v-deep p {
          font-size: 14px !important;
        }

        ::v-deep img {
          height: 19px;
        }
        @media screen and (max-width: 1005px) {
          ::v-deep img {
            height: 18px;
          }
        }
      }
      &:hover {
        .top-title {
          color: $color-blue-base;
        }
      }
    }
    .new-post {
      padding: 10px 20px 0;
      .new-post-cont {
        background: #fdf6ec;
        border-radius: 5px;
        text-align: center;
        line-height: 19px;
        color: #e6a23c;
        padding: 8px 0;
        .refresh {
          color: $color-blue-base;
          cursor: pointer;
        }
      }
    }
  }
  .cont-right {
    margin-left: 15px;
    width: 300px;
    flex: 0 0 300px;
    @media screen and (max-width: 1005px) {
      width: 220px;
      flex: 0 0 220px;
    }
    .background-color {
      @include background();
      margin-bottom: 3px;
    }
    .category {
      margin-bottom: 0;
    }
  }
}
.empty-icon {
  margin-right: 6px;
}
/*FITRUE_default*/
/*IFTRUE_pay*/
@import "@/assets/css/variable/color_pay.scss";
@import "@/assets/css/pay_scss/pages_index.scss";
/*FITRUE_pay*/
</style>
