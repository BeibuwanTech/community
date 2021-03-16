<template>
  <div class="global">
    <div class="normal-type">
      <div class="block">
        <div class="text">{{ $t('post.isPay') }}:</div>
        <el-select
          size="medium"
          :value="payment.paidType"
          placeholder="请选择"
          :popper-append-to-body="false"
          popper-class="selectinfo"
          @change="value => $emit('paymentChange', { key: 'paidType', value })"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="block">
        <div v-show="payment.paidType === 'paid'">
          <div class="text">{{ $t('post.paymentAmount') }}:</div>
          <el-input
            v-model="price"
            size="medium"
            placeholder="0"
            maxlength="7"
            @change="$emit('paymentChange', { key: 'price', value: parseFloat(price) })"
            @input="onPriceInput"
          >
            <span slot="prefix" class="prefix">￥</span>
          </el-input>
        </div>
        <div v-show="payment.paidType === 'attachmentPaid' && type === 1">
          <div class="text">{{ $t('post.paymentAmount') }}:</div>
          <el-input
            v-model="attachmentPrice"
            size="medium"
            placeholder="0"
            maxlength="7"
            @change="
              $emit('paymentChange', {
                key: 'attachmentPrice',
                value: parseFloat(attachmentPrice)
              })
            "
            @input="onAttachmentPriceInput"
          >
            <span slot="prefix" class="prefix">￥</span>
          </el-input>
        </div>
      </div>
      <div class="block">
        <div v-show="payment.paidType === 'paid' && type === 1">
          <div class="text">{{ $t('post.freeWord') }}:</div>
          <el-select
            size="medium"
            :value="freeWords"
            :popper-append-to-body="false"
            popper-class="selectinfo"
            @change="value => $emit('paymentChange', { key: 'freeWords', value: value })"
          >
            <el-option
              v-for="item in freeWordsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <!-- 红包 -->
    <div v-show="canCreateLongRedPacket && payment.paidType === 'free'" class="word-pay">
      <div class="open-box-btn">
        <div class="open-title">发布红包：</div>
        <div class="open-btn" @click="toSelectRedPacket">
          {{ redpacket.is_red_packet === 0 ? '+ 添加红包' : ' 修改红包' }}
        </div>
      </div>
      <!-- 红包描述信息 -->
      <div v-show="redpacket.is_red_packet === 1" class="red-desc">
        <span class="desc-title">发放规则：</span>
        <span class="desc-value">
          {{ redpacket.rule === 0 ? '定额' : '随机' }}
        </span>
        <span class="desc-title">红包总金额：</span>
        <span v-if="redpacket.rule === 0" class="desc-value">
          {{ (redpacket.money*redpacket.number).toFixed(2) }}元
        </span>
        <span v-else class="desc-value">
          {{ redpacket.money }}元
        </span>
        <span class="desc-title">红包个数：</span>
        <span class="desc-value">
          {{ redpacket.number }}个
        </span>
        <span class="desc-title">获得条件：</span>
        <span class="desc-value">
          {{ redpacket.condition === 0 ? `回复领取` : `集赞${ redpacket.likenum }个领取` }}
        </span>
      </div>
      <!-- 红包弹框 -->
      <div v-show="showRedPacketBox" class="redpacket-box">
        <div class="redpacket-content">
          <div class="redpacket-head">
            {{ redpacket.is_red_packet === 0 ? '添加红包' : ' 修改红包' }}
          </div>
          <div class="word-pay-item">
            <div class="word-pay-title">发放模式：</div>
            <el-radio
              v-model="redpacket.rule"
              :label="1"
              @change="val => $emit('changeRedRule', val)"
            >随机</el-radio>
            <el-radio
              v-model="redpacket.rule"
              :label="0"
              @change="val => $emit('changeRedRule', val)"
            >定额</el-radio>
          </div>
          <div class="word-pay-item">
            <div class="word-pay-title">
              {{ redpacket.rule === 1 ? "红包金额：" : "单个红包金额：" }}
            </div>
            <el-input
              v-model="redpacket.money"
              type="number"
              max="7"
              placeholder="请输入红包金额"
              @change="handleRedMoney"
            />
          </div>
          <div class="word-pay-item">
            <div class="word-pay-title">红包个数：</div>
            <el-input
              v-model="redpacket.number"
              type="number"
              placeholder="请输入红包个数"
              @change="handleRedNumber"
            />
          </div>
          <div class="word-pay-item">
            <div class="word-pay-title">获得条件：</div>
            <el-radio
              v-model="redpacket.condition"
              :label="0"
              @change="val => $emit('changeRedCondition', val)"
            >回复帖子</el-radio>
            <el-radio
              v-model="redpacket.condition"
              :label="1"
              @change="val => $emit('changeRedCondition', val)"
            >点赞数</el-radio>
            <el-input
              v-show="redpacket.condition === 1"
              v-model="redpacket.likenum"
              type="number"
              class="input_likenum"
              placeholder="集赞数"
              @change="handleRedlikenum"
            />
          </div>
          <div class="btn-container">
            <el-button round @click="selectRedPacket">确定</el-button>
            <el-button round @click="cancelRedPacket">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formatAmount from '@/utils/formatAmount';
import WordRedPacket from './WordRedPacket.vue';

export default {
  name: 'EditorPaymentPay',
  mixins: [WordRedPacket],
  props: {
    payment: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: 0
    },
    canUploadAttachments: {
      type: Boolean,
      default: false
    },
    // 红包权限
    canCreateLongRedPacket: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      freeWords: 0,
      price: 0,
      attachmentPrice: 0,
      options: [
        {
          value: 'free',
          label: this.$t('post.freeWatch')
        },
        {
          value: 'paid',
          label: this.$t('post.paidWatch')
        }
      ],
      freeWordsOptions: [
        { value: 0, label: '0%' },
        { value: 0.1, label: '10%' },
        { value: 0.3, label: '30%' },
        { value: 0.5, label: '50%' },
        { value: 0.7, label: '70%' },
        { value: 1, label: '100%' }
      ]
    };
  },
  watch: {
    payment: {
      handler(val) {
        this.freeWords = val.freeWords || 0;
        this.price = val.price || 0;
        this.attachmentPrice = val.attachmentPrice || 0;
        if (val.paidType !== 'free') {
          this.$emit('changeRedType', 0);
        }
      },
      immediate: true,
      deep: true
    },
    type: {
      handler(val) {
        this.canUploadAttachments
          ? this.options.push(
            {
              value: 'attachmentPaid',
              label: this.$t('post.postFreeAttachmentPaid')
            }
          )
          : '';
      },
      immediate: true
    }
  },
  methods: {
    onPriceInput(value) {
      this.price = formatAmount(value);
    },
    onAttachmentPriceInput(value) {
      this.attachmentPrice = formatAmount(value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variable/color_pay.scss';
@import '@/assets/css/variable/mixin.scss';
@include custom-el-input-style();
/*IFTRUE_default*/
::v-deep .el-input .el-input__inner:focus {
  border-color: #409EFF;
}
/*FITRUE_default*/
/*IFTRUE_pay*/
@include custom-el-radio-style();
@include custom-el-select-style();
/*FITRUE_pay*/
$font-color: #6D6D6D;
$height: 35px;

.global {
  width: 100%;
  margin-top: 20px;
}

// 普通类型
.normal-type{
  display: flex;
  padding-bottom: 10px;
  .block {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 30px;
    font-size: 14px;

    &:first-child {
      margin-left: 0;
    }

    .prefix {
      line-height: 38px;
      font-size: 16px;
      color: $font-color
    }

    .text {
      font-weight: bold;
      color: $font-color;
      margin-bottom: 10px;
    }
  }
}

.word-pay{
  margin-bottom: 50px;
  .open-box-btn{
    display:flex;
    align-items:center;
    height:70px;
    /*IFTRUE_default*/
    font-weight: bold;
    color: #6d6d6d;
    .open-btn{
      font-weight: normal;
      color: #1878F3;
      cursor: pointer;
    }
    /*FITRUE_default*/
    /*IFTRUE_pay*/
    font-size: 16px;
    .open-title{
      width: 120px;
    }
    .open-btn{
      padding: 12px 20px;
      font-size: 14px;
      color: $color-red-pay;
      border: 1px solid $color-background-hover-red1;
      cursor: pointer;
    }
    /*FITRUE_pay*/
  }
  // 描述信息
  .red-desc{
    display: flex;
    align-items: center;
    height: 50px;
    font-size: 16px;
    margin-bottom: 20px;
    .desc-title{
      color: #999;
    }
    .desc-value{
      color: $color-333;
      padding-right: 20px;
      border-right: 1px solid #ddd;
      margin-right: 20px;
      &:last-child{
        border-right: none;
      }
    }
  }
  // 弹框
  .redpacket-box{
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
    z-index: 99;
    .redpacket-content{
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 600px;
      height: 500px;
      font-size: 18px;
      color: $color-333;
      border-radius: 10px;
      background:#fff;
      overflow: hidden;
      .redpacket-head{
        width: 100%;
        height: 90px;
        font-size: 30px;
        color: #fff;
        letter-spacing: 2px;
        text-align: center;
        line-height: 90px;
        background: #1878F3;
        /*IFTRUE_pay*/
        background: $color-red-pay;
        /*FITRUE_pay*/
        border-bottom-right-radius: 50% 25px;
        border-bottom-left-radius: 50% 25px;
      }
      .word-pay-item{
        display:flex;
        align-items:center;
        height:70px;
        .word-pay-title{
          flex:0 0 120px;
          margin-left: 100px;
          font-size:16px;
        }
        .el-input{
          width:280px;
        }
        .input_likenum{
          width: 60px;
          margin-right: 0;
        }
      }
      .btn-container{
        margin-top: 40px;
        text-align: center;
        .el-button{
          width: 110px;
          height: 40px;
          color: $color-333 !important;
          background: #eeeeee;
          border-color: transparent !important;
          &:hover{
            color: #fff !important;
            background: #1878F3;
            /*IFTRUE_pay*/
            background: $color-red-pay;
            /*FITRUE_pay*/
          }
        }
      }
    }
  }
}
</style>
