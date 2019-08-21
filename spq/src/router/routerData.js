
import Tabber from '@/components/Tabber'
import BillHall from '@/components/BillHall'
import TicketHolder from '@/components/TicketHolder'
import Order from '@/components/Order'
import SelfInfo from '@/components/SelfInfo'
import Register from '@/components/Register'
import Login from '@/components/Login'
import RealName from '@/components/RealName'
import SafeSetting from '@/components/SafeSetting'
import Caculate from '@/components/Caculate'
import ChangePassword from '@/components/ChangePassword'
import Fbpj from '@/components/Fbpj'
import BaseInfo from '@/components/BaseInfo'
import PreviewPdf from '@/components/PreviewPdf'
import RealNameChange from '@/components/RealNameChange'
import MatchBank from '@/components/MatchBank'
import AddBankCard from '@/components/AddBankCard'
import BankDetailInfo from '@/components/BankDetailInfo'
import ChangeAccount from '@/components/ChangeAccount'
import ForgetPassword from '@/components/ForgetPassword'
import OdPage from '@/components/OdPage'
import Rate from '@/components/Rate'
import ForgetUserName from '@/components/ForgetUserName'
import ChangePhone from '@/components/ChangePhone'
import ChangePhoneNext from '@/components/ChangePhoneNext'
import AddBankCardCommon from '@/components/AddBankCardCommon'
import Wallet from '@/components/Wallet.vue';
import CashIn from '@/components/CashIn'
import CashOut from '@/components/CashOut';
import MatchUp from '@/components/MatchUp';
import CheckMoney from '@/components/CheckMoney';
import CheckMoneyCommon from '@/components/CheckMoneyCommon';
import OrderNewDetail from '@/components/OrderNewDetail';
import PriceAgain from '@/components/PriceAgain';
import CashDetail from '@/components/CashDetail';
import PromisePre from '@/components/PromisePre';
import WhiteName from '@/components/WhiteName';
import ChoseCompany from '@/components/ChoseCompany';

import BindWechat from '@/components/BindWechat';
import BindWechatPushPage from '@/components/BindWechatPushPage';

import PushPage from '@/components/PushPage';

let routerData = {
  routes: [
  {
    path: '/pushPage',
    name: 'PushPage',
    meta:{
        isLogin: false,
        isNChecked: false,
    },
    component: PushPage
  },
  {
    path: '/choseCompany',
    name: 'ChoseCompany',
    meta:{
        isLogin: false,
        isNChecked: false,
    },
    component: ChoseCompany
  },
  {
    path: '/home',
    name: 'Tabber',
    redirect: '/home/billHall',
    component: Tabber,
    meta:{
      isLogin: false,//是否需要登录权限
      isNChecked: false,//是否需要认证权限
    },
    children: [
    {
      path: '/home/billHall',
      name: 'BillHall',
      meta:{
        isLogin: true,//是否需要登录权限
        isNChecked: false,//是否需要认证权限
      },
      component: BillHall
    },
    {
      path: '/home/odPage',
      name: 'OdPage',
      meta:{
        isLogin: true,//是否需要登录权限
        isNChecked: true,//是否需要认证权限
        keepAlive: true,
      },
      component: OdPage
    },
    {
      path: '/home/ticketHolder',
      name: 'TicketHolder',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: TicketHolder
    },
    {
      path: '/home/order',
      name: 'Order',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: Order
    },
    {
      path: '/home/selfInfo',
      name: 'SelfInfo',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: SelfInfo
    },
    {
      path: '/home/realName',
      name: 'RealName',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: RealName
    },
    {
      path: '/home/selfInfo/safeSetting',
      name: 'SafeSetting',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: SafeSetting
    },
    {
      path: '/home/selfInfo/caculate',
      name: 'Caculate',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: Caculate
    },
    {
      path: '/home/selfInfo/changePassword',
      name: 'ChangePassword',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: ChangePassword
    },
    {
      path: '/home/ticketHolder/fbpj',
      name: 'Fbpj',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: Fbpj
    },
    {
      path: '/home/selfInfo/baseInfo',
      name: 'BaseInfo',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: BaseInfo
    },
    {
      path: '/home/selfInfo/realNameChange',
      name: 'RealNameChange',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: RealNameChange
    },
    {
      path: '/home/selfInfo/matchBank',
      name: 'MatchBank',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: MatchBank
    },
    {
      path: '/home/selfInfo/addBankCard',
      name: 'AddBankCard',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: AddBankCard
    },
    {
      path: '/home/selfInfo/checkMoney',
      name: 'CheckMoney',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: CheckMoney
    },
    {
      path: '/home/selfInfo/checkMoneyCommon',
      name: 'CheckMoneyCommon',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: CheckMoneyCommon
    },
    {
      path: '/home/selfInfo/bankDetailInfo',
      name: 'BankDetailInfo',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: BankDetailInfo
    },
    {
      path: '/home/selfInfo/changeAccount',
      name: 'ChangeAccount',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: ChangeAccount
    },
    {
      path: '/home/selfInfo/changePhone',
      name: 'ChangePhone',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: ChangePhone
    },
    {
      path: '/home/selfInfo/changePhoneNext',
      name: 'ChangePhoneNext',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: ChangePhoneNext
    },
    {
      path: '/home/selfInfo/addBankCardCommon',
      name: 'AddBankCardCommon',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: AddBankCardCommon
    },
    {
      path: '/home/rate',
      name: 'Rate',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: Rate
    }

    ]
  },
  {
      path: '/wallet',
      name: 'Wallet',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: Wallet
  },
  {
      path: '/cashIn',
      name: 'CashIn',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: CashIn
  },
  {
      path: '/cashOut',
      name: 'CashOut',
      meta:{
        isLogin: true,
        isNChecked: true,
      },
      component: CashOut
  },
  {
    path: '/cashDetail',
    name: 'CashDetail',
    meta:{
      isLogin: true,
      isNChecked: true,
    },
    component: CashDetail
  },
  {
    path: '/whiteName',
    name: 'WhiteName',
    meta:{
      isLogin: true,
      isNChecked: true,
    },
    component: WhiteName
  },
  {
      path: '/matchUp',
      name: 'MatchUp',
      meta:{
        isLogin: true,
        isNChecked: false,
      },
      component: MatchUp
  },
  {
    path: '/promisePre',
    name: 'PromisePre',
    meta: {
      isLogin: true,
      isNChecked: false,
    },
    component: PromisePre
  },
  {
      path: '/orderNewDetail',
      name: 'OrderNewDetail',
      meta: {
        isLogin: true,
        isNChecked: true,
      },
      component: OrderNewDetail,
  },
  {
    path: '/register',
    name: 'Register',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: Login
  },
  {
    path: '/previewPdf',
    name: 'PreviewPdf',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: PreviewPdf
  },
  {
    path: '/forgetPassword',
    name: 'ForgetPassword',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: ForgetPassword
  },
  {
    path: '/forgetUserName',
    name: 'ForgetUserName',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: ForgetUserName
  },

  {
    path: '/bindWechat',
    name: 'BindWechat',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: BindWechat
  },
  {
    path: '/bindWechatPushPage',
    name: 'BindWechatPushPage',
    meta:{
      isLogin: false,
      isNChecked: false,
    },
    component: BindWechatPushPage
  },

  ]
}


export default routerData;
